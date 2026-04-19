import { promises as fs } from "node:fs";
import path from "node:path";

import {
  AlignmentType,
  Document,
  HeadingLevel,
  type IParagraphOptions,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import mammoth from "mammoth";

import {
  buildCareerVaultFileName,
  ensureApplicationWorkspace,
  sanitizeCareerVaultSegment,
  type CareerVaultActor,
  type CareerVaultDocument,
  type CareerVaultWorkspace,
} from "@/lib/surge/career-vault";

const DRAFT_TEXT_EXTENSIONS = new Set([".txt", ".md", ".rtf", ".html", ".htm"]);
const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

type TailorApplicationInput = {
  actor: CareerVaultActor;
  applicationId: number;
  companyName: string;
  roleTitle: string;
  jobType?: string;
  field?: string;
  sourceUrl?: string;
  notes?: string;
  appliedAt?: string;
  includeCoverLetter?: boolean;
  includeCv?: boolean;
  includePortfolio?: boolean;
  jobDescription: string;
};

type TailoredEntry = {
  title: string;
  subtitle: string;
  meta: string;
  bullets: string[];
};

type TailoredSection = {
  heading: string;
  entries: TailoredEntry[];
};

type TailoredCoverLetter = {
  recipient: string;
  opening: string;
  paragraphs: string[];
  closing: string;
  signature: string;
};

type TailoredDocumentsPayload = {
  candidate_name: string;
  contact_line: string;
  target_role: string;
  summary: string;
  skills: string[];
  sections: TailoredSection[];
  cover_letter: TailoredCoverLetter;
  ats_keywords: string[];
  notes: string[];
};

export type TailoringStatus = {
  status: "ready";
  provider: "anthropic";
  model: string;
  generatedAt: string;
  resumeFileName: string;
  coverLetterFileName: string | null;
  atsKeywords: string[];
  notes: string[];
};

export type TailorApplicationResult = {
  workspace: CareerVaultWorkspace;
  tailoring: TailoringStatus;
};

function nowIso() {
  return new Date().toISOString();
}

function normalizeWhitespace(value: string) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function stripHtml(value: string) {
  return String(value || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]{2,}/g, " ");
}

function versionFromFileName(fileName: string) {
  return Number(fileName.match(/_v(\d+)(?:\.[^.]+)?$/i)?.[1] || 0);
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readDocumentText(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return normalizeWhitespace(result.value);
  }

  if (DRAFT_TEXT_EXTENSIONS.has(extension)) {
    const contents = await fs.readFile(filePath, "utf8");
    return normalizeWhitespace(extension === ".html" || extension === ".htm" ? stripHtml(contents) : contents);
  }

  return "";
}

async function readLatestSourceDocument(
  workspace: CareerVaultWorkspace,
  type: CareerVaultDocument["type"],
) {
  const candidates = workspace.documents
    .filter((document) => document.type === type)
    .slice()
    .sort((left, right) => versionFromFileName(right.fileName) - versionFromFileName(left.fileName));

  for (const candidate of candidates) {
    const text = await readDocumentText(candidate.absolutePath).catch(() => "");
    if (text) {
      return {
        fileName: candidate.fileName,
        text,
      };
    }
  }

  return null;
}

async function nextVersionNumber(input: {
  workspaceDir: string;
  actorName: string;
  type: CareerVaultDocument["type"];
  roleTitle: string;
  companyName: string;
  extension: string;
}) {
  let version = 1;

  while (
    await pathExists(
      path.join(
        input.workspaceDir,
        buildCareerVaultFileName({
          actorName: input.actorName,
          type: input.type,
          roleTitle: input.roleTitle,
          companyName: input.companyName,
          version,
          extension: input.extension,
        }),
      ),
    )
  ) {
    version += 1;
  }

  return version;
}

function actorNameFromPrompt(actor: CareerVaultActor) {
  const explicit = process.env.SURGE_CAREER_VAULT_OWNER?.trim();
  if (explicit) {
    return explicit.replace(/_/g, " ").trim();
  }

  const emailLocalPart = String(actor.email || "")
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .trim();

  return emailLocalPart || "DeAnthony Davis";
}

function buildTailoringPrompt(input: {
  actorName: string;
  companyName: string;
  roleTitle: string;
  jobType: string;
  field: string;
  sourceUrl: string;
  jobDescription: string;
  resumeText: string;
  coverLetterText: string;
}) {
  const lines = [
    `Candidate name: ${input.actorName}`,
    `Target company: ${input.companyName}`,
    `Target role: ${input.roleTitle}`,
    `Job type: ${input.jobType || "General"}`,
    `Field: ${input.field || "General"}`,
    input.sourceUrl ? `Source URL: ${input.sourceUrl}` : "",
    "",
    "Base resume:",
    input.resumeText,
    "",
    input.coverLetterText ? "Base cover letter:" : "",
    input.coverLetterText || "",
    "",
    "Job description:",
    input.jobDescription,
  ].filter(Boolean);

  return lines.join("\n");
}

async function callAnthropicTailor(input: {
  actorName: string;
  companyName: string;
  roleTitle: string;
  jobType: string;
  field: string;
  sourceUrl: string;
  jobDescription: string;
  resumeText: string;
  coverLetterText: string;
}) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Set ANTHROPIC_API_KEY before running automatic tailoring.");
  }

  const model = process.env.SURGE_ANTHROPIC_MODEL?.trim() || DEFAULT_ANTHROPIC_MODEL;
  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system:
        "You tailor truthful, ATS-friendly job application documents. Use only facts contained in the provided base resume and cover letter. Never invent employers, dates, degrees, tools, certifications, metrics, or achievements. Reorder and rewrite bullets to fit the job, keep language clean and concise, and return content using the provided tool schema.",
      tools: [
        {
          name: "emit_tailored_documents",
          description: "Return a tailored resume and cover letter for the provided job.",
          input_schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              candidate_name: { type: "string" },
              contact_line: { type: "string" },
              target_role: { type: "string" },
              summary: { type: "string" },
              skills: {
                type: "array",
                items: { type: "string" },
              },
              sections: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    heading: { type: "string" },
                    entries: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                          title: { type: "string" },
                          subtitle: { type: "string" },
                          meta: { type: "string" },
                          bullets: {
                            type: "array",
                            items: { type: "string" },
                          },
                        },
                        required: ["title", "subtitle", "meta", "bullets"],
                      },
                    },
                  },
                  required: ["heading", "entries"],
                },
              },
              cover_letter: {
                type: "object",
                additionalProperties: false,
                properties: {
                  recipient: { type: "string" },
                  opening: { type: "string" },
                  paragraphs: {
                    type: "array",
                    items: { type: "string" },
                  },
                  closing: { type: "string" },
                  signature: { type: "string" },
                },
                required: ["recipient", "opening", "paragraphs", "closing", "signature"],
              },
              ats_keywords: {
                type: "array",
                items: { type: "string" },
              },
              notes: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: [
              "candidate_name",
              "contact_line",
              "target_role",
              "summary",
              "skills",
              "sections",
              "cover_letter",
              "ats_keywords",
              "notes",
            ],
          },
        },
      ],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: buildTailoringPrompt(input),
            },
          ],
        },
      ],
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        error?: { message?: string };
        content?: Array<{
          type?: string;
          name?: string;
          input?: TailoredDocumentsPayload;
        }>;
      }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message || `Anthropic request failed (${response.status}).`);
  }

  const toolBlock = payload?.content?.find(
    (block) => block?.type === "tool_use" && block?.name === "emit_tailored_documents",
  );

  if (!toolBlock?.input) {
    throw new Error("Claude did not return a structured tailoring payload.");
  }

  return {
    model,
    documents: toolBlock.input,
  };
}

function paragraph(text: string, options?: IParagraphOptions) {
  return new Paragraph({
    ...(options || {}),
    children:
      options?.children ||
      (text
        ? [
            new TextRun({
              text,
            }),
          ]
        : []),
  });
}

function buildResumeDocument(payload: TailoredDocumentsPayload) {
  const children: Paragraph[] = [];

  children.push(
    paragraph("", {
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: payload.candidate_name || "Candidate",
          bold: true,
          size: 30,
        }),
      ],
      spacing: { after: 120 },
    }),
  );

  if (payload.contact_line) {
    children.push(
      paragraph(payload.contact_line, {
        alignment: AlignmentType.CENTER,
        spacing: { after: 180 },
      }),
    );
  }

  if (payload.target_role) {
    children.push(
      paragraph(payload.target_role, {
        alignment: AlignmentType.CENTER,
        spacing: { after: 220 },
      }),
    );
  }

  if (payload.summary) {
    children.push(paragraph("Professional Summary", { heading: HeadingLevel.HEADING_1 }));
    children.push(paragraph(payload.summary, { spacing: { after: 180 } }));
  }

  if (payload.skills.length) {
    children.push(paragraph("Core Skills", { heading: HeadingLevel.HEADING_1 }));
    children.push(
      paragraph("", {
        spacing: { after: 180 },
        children: payload.skills.flatMap((skill, index) => [
          new TextRun({ text: skill }),
          new TextRun({ text: index < payload.skills.length - 1 ? " | " : "" }),
        ]),
      }),
    );
  }

  for (const section of payload.sections) {
    if (!section.heading) continue;
    children.push(paragraph(section.heading, { heading: HeadingLevel.HEADING_1 }));

    for (const entry of section.entries || []) {
      const lineParts = [entry.title, entry.subtitle].filter(Boolean).join(" | ");
      const meta = entry.meta ? ` | ${entry.meta}` : "";

      if (lineParts || meta) {
        children.push(
          paragraph("", {
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: lineParts || entry.title || entry.subtitle || "",
                bold: true,
              }),
              new TextRun({
                text: meta,
              }),
            ],
          }),
        );
      }

      for (const bullet of entry.bullets || []) {
        if (!bullet) continue;
        children.push(
          paragraph(bullet, {
            bullet: { level: 0 },
            spacing: { after: 40 },
          }),
        );
      }
    }
  }

  return new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });
}

function buildCoverLetterDocument(payload: TailoredDocumentsPayload) {
  const children: Paragraph[] = [];

  children.push(
    paragraph("", {
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: payload.candidate_name || "Candidate",
          bold: true,
          size: 30,
        }),
      ],
      spacing: { after: 120 },
    }),
  );

  if (payload.contact_line) {
    children.push(
      paragraph(payload.contact_line, {
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
      }),
    );
  }

  if (payload.cover_letter.recipient) {
    children.push(paragraph(payload.cover_letter.recipient, { spacing: { after: 180 } }));
  }

  if (payload.cover_letter.opening) {
    children.push(paragraph(payload.cover_letter.opening, { spacing: { after: 180 } }));
  }

  for (const bodyParagraph of payload.cover_letter.paragraphs || []) {
    if (!bodyParagraph) continue;
    children.push(paragraph(bodyParagraph, { spacing: { after: 180 } }));
  }

  if (payload.cover_letter.closing) {
    children.push(paragraph(payload.cover_letter.closing, { spacing: { after: 80 } }));
  }

  if (payload.cover_letter.signature) {
    children.push(paragraph(payload.cover_letter.signature));
  }

  return new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });
}

async function writeDocx(targetPath: string, document: Document) {
  const buffer = await Packer.toBuffer(document);
  await fs.writeFile(targetPath, buffer);
}

export async function tailorApplicationDocuments(
  input: TailorApplicationInput,
): Promise<TailorApplicationResult> {
  const trimmedDescription = normalizeWhitespace(input.jobDescription);
  if (!trimmedDescription) {
    throw new Error("A full job description is required before tailoring can run.");
  }

  const baseWorkspace = await ensureApplicationWorkspace({
    actor: input.actor,
    applicationId: input.applicationId,
    companyName: input.companyName,
    roleTitle: input.roleTitle,
    jobType: input.jobType,
    field: input.field,
    sourceUrl: input.sourceUrl,
    notes: input.notes,
    appliedAt: input.appliedAt,
    includeCoverLetter: input.includeCoverLetter,
    includeCv: input.includeCv,
    includePortfolio: input.includePortfolio,
  });

  const resumeSource = await readLatestSourceDocument(baseWorkspace, "Resume");
  if (!resumeSource?.text) {
    throw new Error("Surge could not read a base resume from the workspace. Add a readable .docx, .md, or .txt resume template first.");
  }

  const coverLetterSource = await readLatestSourceDocument(baseWorkspace, "Cover Letter");
  const actorName = sanitizeCareerVaultSegment(
    (process.env.SURGE_CAREER_VAULT_OWNER?.trim() || "DeAnthonyDavis").replace(/\s+/g, ""),
    "DeAnthonyDavis",
  ).replaceAll("_", "");
  const response = await callAnthropicTailor({
    actorName: actorNameFromPrompt(input.actor),
    companyName: input.companyName,
    roleTitle: input.roleTitle,
    jobType: input.jobType?.trim() || "General",
    field: input.field?.trim() || "General",
    sourceUrl: input.sourceUrl?.trim() || "",
    jobDescription: trimmedDescription,
    resumeText: resumeSource.text,
    coverLetterText: coverLetterSource?.text || "",
  });

  const resumeVersion = await nextVersionNumber({
    workspaceDir: baseWorkspace.workspaceDir,
    actorName,
    type: "Resume",
    roleTitle: input.roleTitle,
    companyName: input.companyName,
    extension: ".docx",
  });
  const resumeFileName = buildCareerVaultFileName({
    actorName,
    type: "Resume",
    roleTitle: input.roleTitle,
    companyName: input.companyName,
    version: resumeVersion,
    extension: ".docx",
  });

  await writeDocx(
    path.join(baseWorkspace.workspaceDir, resumeFileName),
    buildResumeDocument(response.documents),
  );

  let coverLetterFileName: string | null = null;
  if (input.includeCoverLetter !== false) {
    const coverLetterVersion = await nextVersionNumber({
      workspaceDir: baseWorkspace.workspaceDir,
      actorName,
      type: "Cover Letter",
      roleTitle: input.roleTitle,
      companyName: input.companyName,
      extension: ".docx",
    });
    coverLetterFileName = buildCareerVaultFileName({
      actorName,
      type: "Cover Letter",
      roleTitle: input.roleTitle,
      companyName: input.companyName,
      version: coverLetterVersion,
      extension: ".docx",
    });
    await writeDocx(
      path.join(baseWorkspace.workspaceDir, coverLetterFileName),
      buildCoverLetterDocument(response.documents),
    );
  }

  const workspace = await ensureApplicationWorkspace({
    actor: input.actor,
    applicationId: input.applicationId,
    companyName: input.companyName,
    roleTitle: input.roleTitle,
    jobType: input.jobType,
    field: input.field,
    sourceUrl: input.sourceUrl,
    notes: input.notes,
    appliedAt: input.appliedAt,
    includeCoverLetter: input.includeCoverLetter,
    includeCv: input.includeCv,
    includePortfolio: input.includePortfolio,
  });

  return {
    workspace,
    tailoring: {
      status: "ready",
      provider: "anthropic",
      model: response.model,
      generatedAt: nowIso(),
      resumeFileName,
      coverLetterFileName,
      atsKeywords: response.documents.ats_keywords || [],
      notes: response.documents.notes || [],
    },
  };
}
