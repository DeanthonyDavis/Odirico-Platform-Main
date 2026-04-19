import { promises as fs } from "node:fs";
import path from "node:path";

const TEMPLATE_DIRECTORIES = {
  Resume: "Resumes",
  CV: "CVs",
  "Cover Letter": "Cover_Letters",
  Other: "Other",
} as const;

const WORKSPACE_MANIFEST_FILE = ".surge-workspace.json";

const DOCUMENT_TYPES = [
  "Resume",
  "CV",
  "Cover Letter",
  "Portfolio",
  "Writing Sample",
  "Transcript",
  "Certifications",
  "References",
  "Job Posting",
  "Notes",
  "Other",
] as const;

const DRAFT_EXTENSIONS = new Set([".doc", ".docx", ".rtf", ".pages", ".odt", ".txt", ".md"]);
const FINAL_EXTENSIONS = new Set([".pdf"]);
const DEFAULT_CAREER_VAULT_OWNER = "DeAnthonyDavis";

export type CareerVaultDocumentType = (typeof DOCUMENT_TYPES)[number];

export type CareerVaultActor = {
  email?: string | null;
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
};

export type CareerVaultTemplate = {
  type: CareerVaultDocumentType;
  fileName: string;
  absolutePath: string;
  relativePath: string;
};

export type CareerVaultDocument = {
  type: CareerVaultDocumentType;
  stage: "working" | "final" | "extras";
  fileName: string;
  absolutePath: string;
  relativePath: string;
  extension: string;
  tags: string[];
  sourceTemplate: string;
  createdAt: string;
  updatedAt: string;
};

export type CareerVaultWorkspace = {
  name: string;
  rootPath: string;
  relativePath: string;
  companyDir: string;
  workspaceDir: string;
  createdAt: string;
  syncedAt: string;
  copiedTemplates: Array<{
    type: CareerVaultDocumentType;
    fileName: string;
    relativePath: string;
  }>;
  missingTemplateTypes: CareerVaultDocumentType[];
  documents: CareerVaultDocument[];
};

export type CareerVaultStatus = {
  rootPath: string;
  templateRoot: string;
  applicationRoot: string;
  archiveRoot: string;
  exportsRoot: string;
  templates: CareerVaultTemplate[];
  counts: {
    totalTemplates: number;
    byType: Record<string, number>;
  };
  generatedAt: string;
};

export type EnsureApplicationWorkspaceInput = {
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
};

type WorkspaceManifest = {
  applicationId: number;
  companyName: string;
  roleTitle: string;
  jobType: string;
  field: string;
  createdAt: string;
  updatedAt: string;
};

type TemplateSelectionContext = {
  companyName: string;
  roleTitle: string;
  jobType: string;
  field: string;
};

function nowIso() {
  return new Date().toISOString();
}

function normalizeText(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function sanitizeCareerVaultSegment(value: string, fallback: string) {
  const cleaned = String(value || "")
    .normalize("NFKD")
    .replace(/[^\w\s-]+/g, " ")
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return cleaned || fallback;
}

function joinRelative(...segments: string[]) {
  return path.join(...segments).split(path.sep).join("/");
}

function resolveCareerVaultRoot() {
  const configured = process.env.SURGE_CAREER_VAULT_ROOT?.trim();

  if (configured) {
    return path.resolve(configured);
  }

  if (process.platform === "win32") {
    return path.join(path.parse(process.cwd()).root, "Career Vault");
  }

  return path.join(process.cwd(), "Career Vault");
}

function inferActorName(actor: CareerVaultActor) {
  const configured = process.env.SURGE_CAREER_VAULT_OWNER?.trim();
  const preferred = configured || DEFAULT_CAREER_VAULT_OWNER;
  const token = sanitizeCareerVaultSegment(preferred, DEFAULT_CAREER_VAULT_OWNER).replaceAll("_", "");
  return token || DEFAULT_CAREER_VAULT_OWNER;
}

function inferJobYear(appliedAt?: string) {
  if (appliedAt) {
    const parsed = new Date(appliedAt.length === 10 ? `${appliedAt}T00:00:00` : appliedAt);
    if (!Number.isNaN(parsed.getTime())) {
      return String(parsed.getFullYear());
    }
  }

  return String(new Date().getFullYear());
}

function inferDocumentType(fileName: string, parentDirectory: string) {
  const normalizedName = normalizeText(fileName);
  const normalizedDirectory = normalizeText(parentDirectory);

  if (normalizedDirectory.includes("resumes") || normalizedName.includes("resume")) return "Resume";
  if (normalizedDirectory.includes("cvs") || /\bcv\b/.test(normalizedName)) return "CV";
  if (normalizedDirectory.includes("cover letters") || normalizedName.includes("coverletter") || normalizedName.includes("cover letter")) return "Cover Letter";
  if (normalizedName.includes("portfolio")) return "Portfolio";
  if (normalizedName.includes("writing sample")) return "Writing Sample";
  if (normalizedName.includes("transcript")) return "Transcript";
  if (normalizedName.includes("certification") || normalizedName.includes("certificate")) return "Certifications";
  if (normalizedName.includes("reference")) return "References";
  if (normalizedName.includes("jobposting") || normalizedName.includes("job posting") || normalizedName.includes("posting")) return "Job Posting";
  if (normalizedName.includes("note")) return "Notes";

  return "Other";
}

function inferDocumentStage(fileName: string): CareerVaultDocument["stage"] {
  const extension = path.extname(fileName).toLowerCase();

  if (FINAL_EXTENSIONS.has(extension)) return "final";
  if (DRAFT_EXTENSIONS.has(extension)) return "working";
  return "extras";
}

function documentTypeToken(type: CareerVaultDocumentType) {
  return (
    {
      Resume: "Resume",
      CV: "CV",
      "Cover Letter": "CoverLetter",
      Portfolio: "Portfolio",
      "Writing Sample": "WritingSample",
      Transcript: "Transcript",
      Certifications: "Certifications",
      References: "References",
      "Job Posting": "JobPosting",
      Notes: "Notes",
      Other: "Document",
    } as const
  )[type];
}

function normalizeJobType(jobType?: string) {
  const normalized = normalizeText(jobType || "");

  if (normalized === "ft" || normalized === "full time") return "Full-Time";
  if (normalized === "entry") return "Entry-level";
  if (normalized === "co op") return "Co-op";
  if (normalized === "internship") return "Internship";

  return jobType?.trim() || "General";
}

function wantsCv(context: TemplateSelectionContext) {
  const search = normalizeText(`${context.roleTitle} ${context.field} ${context.jobType}`);
  return /\b(cv|research|academic|graduate|fellowship|phd|lab)\b/.test(search);
}

function wantsPortfolio(context: TemplateSelectionContext) {
  const search = normalizeText(`${context.roleTitle} ${context.field}`);
  return /\b(ux|ui|design|designer|portfolio|creative|writing|content)\b/.test(search);
}

function wantsCoverLetter(context: TemplateSelectionContext, requested?: boolean) {
  if (typeof requested === "boolean") return requested;

  const normalized = normalizeText(context.jobType);
  return !/\b(part time|temporary|volunteer)\b/.test(normalized);
}

function tokenizeForMatching(value: string) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length >= 4);
}

function scoreTemplate(template: CareerVaultTemplate, type: CareerVaultDocumentType, context: TemplateSelectionContext) {
  if (template.type !== type) {
    return Number.NEGATIVE_INFINITY;
  }

  const normalizedName = normalizeText(template.fileName);
  const normalizedJobType = normalizeText(context.jobType);
  let score = 100;

  if (normalizedName.includes("default") || normalizedName.includes("standard") || normalizedName.includes("base")) {
    score += 5;
  }

  if (normalizedName.includes("general") && /\b(part time|contract|freelance|temporary|volunteer|general)\b/.test(normalizedJobType)) {
    score += 30;
  }

  if (normalizedName.includes("general") && !/\b(internship|co op|full time|entry level|experienced)\b/.test(normalizedJobType)) {
    score += 12;
  }

  if (/\bintern|co op\b/.test(normalizedName) && /\b(internship|co op|apprenticeship|graduate program|fellowship)\b/.test(normalizedJobType)) {
    score += 30;
  }

  if (/\bexperienced|full time|fulltime\b/.test(normalizedName) && /\b(full time|entry level)\b/.test(normalizedJobType)) {
    score += 30;
  }

  if (type === "CV" && /\bacademic|research\b/.test(normalizedName)) {
    score += 15;
  }

  if (type === "Portfolio" && normalizedName.includes("portfolio")) {
    score += 10;
  }

  for (const token of tokenizeForMatching(context.field)) {
    if (normalizedName.includes(token)) score += 6;
  }

  for (const token of tokenizeForMatching(context.roleTitle).slice(0, 4)) {
    if (normalizedName.includes(token)) score += 4;
  }

  return score;
}

export function buildCareerVaultFileName(input: {
  actorName: string;
  type: CareerVaultDocumentType;
  roleTitle: string;
  companyName: string;
  version: number;
  extension: string;
}) {
  const roleToken = sanitizeCareerVaultSegment(input.roleTitle, "Role");
  const companyToken = sanitizeCareerVaultSegment(input.companyName, "Company");
  const versionToken = `v${input.version}`;
  const extension = input.extension.startsWith(".") ? input.extension : `.${input.extension}`;

  return `${input.actorName}_${documentTypeToken(input.type)}_${roleToken}_${companyToken}_${versionToken}${extension}`;
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDirectory(targetPath: string) {
  await fs.mkdir(targetPath, { recursive: true });
}

async function readJsonFile<T>(filePath: string) {
  try {
    const contents = await fs.readFile(filePath, "utf8");
    return JSON.parse(contents) as T;
  } catch {
    return null;
  }
}

async function walkFiles(directoryPath: string): Promise<string[]> {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true }).catch(() => []);
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkFiles(absolutePath)));
      continue;
    }

    files.push(absolutePath);
  }

  return files;
}

function vaultRoots(rootPath: string) {
  return {
    rootPath,
    templateRoot: path.join(rootPath, "Templates"),
    applicationRoot: path.join(rootPath, "Applications"),
    archiveRoot: path.join(rootPath, "Archive"),
    exportsRoot: path.join(rootPath, "Exports"),
  };
}

export async function ensureCareerVaultScaffold() {
  const roots = vaultRoots(resolveCareerVaultRoot());

  await ensureDirectory(roots.rootPath);
  await ensureDirectory(roots.templateRoot);
  await ensureDirectory(path.join(roots.templateRoot, TEMPLATE_DIRECTORIES.Resume));
  await ensureDirectory(path.join(roots.templateRoot, TEMPLATE_DIRECTORIES.CV));
  await ensureDirectory(path.join(roots.templateRoot, TEMPLATE_DIRECTORIES["Cover Letter"]));
  await ensureDirectory(path.join(roots.templateRoot, TEMPLATE_DIRECTORIES.Other));
  await ensureDirectory(roots.applicationRoot);
  await ensureDirectory(path.join(roots.applicationRoot, inferJobYear()));
  await ensureDirectory(roots.archiveRoot);
  await ensureDirectory(roots.exportsRoot);

  return roots;
}

export async function listCareerVaultTemplates() {
  const roots = await ensureCareerVaultScaffold();
  const templates: CareerVaultTemplate[] = [];

  for (const [type, directoryName] of Object.entries(TEMPLATE_DIRECTORIES)) {
    const directoryPath = path.join(roots.templateRoot, directoryName);
    const files = await walkFiles(directoryPath);

    for (const absolutePath of files) {
      const fileName = path.basename(absolutePath);
      if (fileName.startsWith(".")) continue;

      templates.push({
        type: type as CareerVaultDocumentType,
        fileName,
        absolutePath,
        relativePath: joinRelative(path.relative(roots.rootPath, absolutePath)),
      });
    }
  }

  return templates.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

export async function getCareerVaultStatus() {
  const roots = await ensureCareerVaultScaffold();
  const templates = await listCareerVaultTemplates();
  const counts: Record<string, number> = {};

  for (const template of templates) {
    counts[template.type] = (counts[template.type] || 0) + 1;
  }

  return {
    rootPath: roots.rootPath,
    templateRoot: roots.templateRoot,
    applicationRoot: roots.applicationRoot,
    archiveRoot: roots.archiveRoot,
    exportsRoot: roots.exportsRoot,
    templates,
    counts: {
      totalTemplates: templates.length,
      byType: counts,
    },
    generatedAt: nowIso(),
  } satisfies CareerVaultStatus;
}

async function resolveWorkspaceDirectory(
  companyDirectoryPath: string,
  roleDirectoryName: string,
  applicationId: number,
) {
  const entries = await fs.readdir(companyDirectoryPath, { withFileTypes: true }).catch(() => []);

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const candidatePath = path.join(companyDirectoryPath, entry.name);
    const manifest = await readJsonFile<WorkspaceManifest>(path.join(candidatePath, WORKSPACE_MANIFEST_FILE));

    if (manifest?.applicationId === applicationId) {
      return candidatePath;
    }
  }

  const primaryPath = path.join(companyDirectoryPath, roleDirectoryName);
  if (!(await pathExists(primaryPath))) {
    return primaryPath;
  }

  const primaryManifest = await readJsonFile<WorkspaceManifest>(path.join(primaryPath, WORKSPACE_MANIFEST_FILE));
  if (primaryManifest?.applicationId === applicationId) {
    return primaryPath;
  }

  const suffixedPath = path.join(companyDirectoryPath, `${roleDirectoryName}__A${applicationId}`);
  if (!(await pathExists(suffixedPath))) {
    return suffixedPath;
  }

  const suffixedManifest = await readJsonFile<WorkspaceManifest>(path.join(suffixedPath, WORKSPACE_MANIFEST_FILE));
  if (suffixedManifest?.applicationId === applicationId) {
    return suffixedPath;
  }

  return suffixedPath;
}

function chooseTemplate(
  templates: CareerVaultTemplate[],
  type: CareerVaultDocumentType,
  context: TemplateSelectionContext,
) {
  return templates
    .map((template) => ({
      template,
      score: scoreTemplate(template, type, context),
    }))
    .filter((candidate) => Number.isFinite(candidate.score))
    .sort((left, right) => right.score - left.score || left.template.fileName.localeCompare(right.template.fileName))[0]?.template ?? null;
}

async function writeWorkspaceManifest(workspacePath: string, manifest: WorkspaceManifest) {
  await fs.writeFile(
    path.join(workspacePath, WORKSPACE_MANIFEST_FILE),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );
}

async function listWorkspaceDocuments(input: {
  rootPath: string;
  workspacePath: string;
}) {
  const documents: CareerVaultDocument[] = [];
  const entries = await fs.readdir(input.workspacePath, { withFileTypes: true }).catch(() => []);

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (entry.name === WORKSPACE_MANIFEST_FILE) continue;

    const absolutePath = path.join(input.workspacePath, entry.name);
    const stat = await fs.stat(absolutePath);
    const type = inferDocumentType(entry.name, path.basename(input.workspacePath));
    const stage = inferDocumentStage(entry.name);
    const tags = uniqueStrings([
      stage === "working" ? "draft" : "",
      stage === "final" ? "final" : "",
      type === "Resume" || type === "Cover Letter" || type === "CV" ? "tailored" : "",
      type === "Job Posting" ? "supporting" : "",
    ]);

    documents.push({
      type,
      stage,
      fileName: entry.name,
      absolutePath,
      relativePath: joinRelative(path.relative(input.rootPath, absolutePath)),
      extension: path.extname(entry.name).toLowerCase(),
      tags,
      sourceTemplate: "",
      createdAt: stat.birthtime.toISOString(),
      updatedAt: stat.mtime.toISOString(),
    });
  }

  return documents.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

export async function ensureApplicationWorkspace(input: EnsureApplicationWorkspaceInput) {
  const roots = await ensureCareerVaultScaffold();
  const templates = await listCareerVaultTemplates();
  const context = {
    companyName: input.companyName,
    roleTitle: input.roleTitle,
    jobType: normalizeJobType(input.jobType),
    field: input.field?.trim() || "General",
  } satisfies TemplateSelectionContext;

  const yearRoot = path.join(roots.applicationRoot, inferJobYear(input.appliedAt));
  const companyDirectoryName = sanitizeCareerVaultSegment(input.companyName, "Company");
  const roleDirectoryName = sanitizeCareerVaultSegment(input.roleTitle, "Role");
  const companyDirectoryPath = path.join(yearRoot, companyDirectoryName);

  await ensureDirectory(yearRoot);
  await ensureDirectory(companyDirectoryPath);

  const workspacePath = await resolveWorkspaceDirectory(companyDirectoryPath, roleDirectoryName, input.applicationId);
  await ensureDirectory(workspacePath);

  const createdAt = nowIso();
  const previousManifest = await readJsonFile<WorkspaceManifest>(path.join(workspacePath, WORKSPACE_MANIFEST_FILE));
  const manifest = {
    applicationId: input.applicationId,
    companyName: input.companyName,
    roleTitle: input.roleTitle,
    jobType: context.jobType,
    field: context.field,
    createdAt: previousManifest?.createdAt || createdAt,
    updatedAt: createdAt,
  } satisfies WorkspaceManifest;

  await writeWorkspaceManifest(workspacePath, manifest);

  const requestedTypes: CareerVaultDocumentType[] = ["Resume"];
  if (wantsCoverLetter(context, input.includeCoverLetter)) requestedTypes.push("Cover Letter");
  if ((typeof input.includeCv === "boolean" ? input.includeCv : wantsCv(context))) requestedTypes.push("CV");
  if ((typeof input.includePortfolio === "boolean" ? input.includePortfolio : wantsPortfolio(context))) requestedTypes.push("Portfolio");

  const actorName = inferActorName(input.actor);
  const copiedTemplates: CareerVaultWorkspace["copiedTemplates"] = [];
  const missingTemplateTypes: CareerVaultDocumentType[] = [];

  for (const type of uniqueStrings(requestedTypes) as CareerVaultDocumentType[]) {
    const template = chooseTemplate(templates, type, context);

    if (!template) {
      missingTemplateTypes.push(type);
      continue;
    }

    const extension = path.extname(template.fileName) || ".docx";
    const destinationName = buildCareerVaultFileName({
      actorName,
      type,
      roleTitle: input.roleTitle,
      companyName: input.companyName,
      version: 1,
      extension,
    });
    const destinationPath = path.join(workspacePath, destinationName);

    if (!(await pathExists(destinationPath))) {
      await fs.copyFile(template.absolutePath, destinationPath);
    }

    copiedTemplates.push({
      type,
      fileName: destinationName,
      relativePath: joinRelative(path.relative(roots.rootPath, destinationPath)),
    });
  }

  const documents = await listWorkspaceDocuments({
    rootPath: roots.rootPath,
    workspacePath,
  });

  return {
    name: path.basename(workspacePath),
    rootPath: roots.rootPath,
    relativePath: joinRelative(path.relative(roots.rootPath, workspacePath)),
    companyDir: companyDirectoryPath,
    workspaceDir: workspacePath,
    createdAt: manifest.createdAt,
    syncedAt: nowIso(),
    copiedTemplates,
    missingTemplateTypes: uniqueStrings(missingTemplateTypes) as CareerVaultDocumentType[],
    documents,
  } satisfies CareerVaultWorkspace;
}
