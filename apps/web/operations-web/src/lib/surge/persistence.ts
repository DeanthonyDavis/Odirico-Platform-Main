import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "@odirico/core/database";
import type { CareerVaultDocument, CareerVaultWorkspace } from "@/lib/surge/career-vault";

type SurgeSupabase = SupabaseClient<Database>;
type SurgeCompanyRow = Database["public"]["Tables"]["surge_companies"]["Row"];
type SurgeCompanyInsert = Database["public"]["Tables"]["surge_companies"]["Insert"];
type SurgeCompanyUpdate = Database["public"]["Tables"]["surge_companies"]["Update"];
type SurgeRoleRow = Database["public"]["Tables"]["surge_roles"]["Row"];
type SurgeRoleInsert = Database["public"]["Tables"]["surge_roles"]["Insert"];
type SurgeApplicationRow = Database["public"]["Tables"]["surge_applications"]["Row"];
type SurgeApplicationInsert = Database["public"]["Tables"]["surge_applications"]["Insert"];
type SurgeApplicationUpdate = Database["public"]["Tables"]["surge_applications"]["Update"];
type SurgeDocumentRow = Database["public"]["Tables"]["surge_documents"]["Row"];
type SurgeDocumentInsert = Database["public"]["Tables"]["surge_documents"]["Insert"];

type PersistedTailoring =
  | {
      status: "ready";
      provider: string;
      model: string;
      generatedAt: string;
      resumeFileName: string;
      coverLetterFileName: string | null;
      atsKeywords: string[];
      notes: string[];
    }
  | {
      status: "skipped" | "failed";
      reason?: string;
      error?: string;
      generatedAt: string;
    };

export type SurgeIngestPayload = {
  url: string;
  title: string;
  body: string;
  source?: string;
  mode?: string;
  status?: string;
  channel?: string;
  capturedAt?: string;
  companyName?: string;
  roleTitle?: string;
  location?: string;
  category?: string;
  priority?: string;
  appliedAt?: string;
  nextStep?: string;
  nextStepAt?: string;
  compensation?: string;
  notes?: string;
};

type PersistIngestInput = {
  supabase: SurgeSupabase;
  ownerId: string;
  payload: SurgeIngestPayload;
  workspace: CareerVaultWorkspace | null;
  tailoring: PersistedTailoring | null;
};

function nowIso() {
  return new Date().toISOString();
}

function hashPositiveInt(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 2147483647;
  }

  return Math.max(1, hash);
}

export function buildSurgeWorkspaceKey(input: {
  sourceUrl: string;
  companyName: string;
  roleTitle: string;
}) {
  return hashPositiveInt(`${input.sourceUrl}::${input.companyName}::${input.roleTitle}`);
}

function stableNumericId(seed: string, used: Set<number>) {
  let candidate = hashPositiveInt(seed);

  while (used.has(candidate)) {
    candidate = candidate >= 2147483646 ? 1 : candidate + 1;
  }

  used.add(candidate);
  return candidate;
}

function normalizeText(value: string) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function compactWhitespace(value: string) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function slug(value: string, fallback: string) {
  const normalized = String(value || "")
    .normalize("NFKD")
    .replace(/[^\w\s-]+/g, " ")
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || fallback;
}

function brandFromUrl(value: string) {
  try {
    const host = new URL(value).hostname.replace(/^www\./, "");
    const parts = host.split(".");
    return parts.length < 2 ? parts[0] : parts[parts.length - 2].replace(/-/g, " ");
  } catch {
    return "";
  }
}

function normalizedName(value: string, fallback: string) {
  const normalized = normalizeText(value);
  return normalized || normalizeText(fallback) || fallback.toLowerCase();
}

function inferRoleType(title: string) {
  const normalized = normalizeText(title);
  if (/\b(co op|coop)\b/.test(normalized)) return "co-op";
  if (/\b(intern|internship|apprentice|apprenticeship|fellow|fellowship)\b/.test(normalized)) return "internship";
  if (/\b(entry|graduate|rotational|new grad)\b/.test(normalized)) return "entry";
  if (/\b(part time|temporary|temp)\b/.test(normalized)) return "part-time";
  if (/\b(contract|freelance)\b/.test(normalized)) return "contract";
  return "ft";
}

function sourceValue(value: string) {
  return ["linkedin", "indeed", "direct", "email", "browser", "imported", "other"].includes(value)
    ? (value as Database["public"]["Tables"]["surge_applications"]["Row"]["source"])
    : "other";
}

function statusValue(value: string) {
  return ["lead", "applied", "confirmed", "review", "recruiter", "interview", "offer", "rejected", "withdrawn"].includes(value)
    ? (value as Database["public"]["Tables"]["surge_applications"]["Row"]["status"])
    : "lead";
}

function runtimeRoleType(value: string) {
  return ["internship", "co-op", "entry", "part-time", "contract", "ft"].includes(value) ? value : "ft";
}

function notesMerge(...parts: string[]) {
  return Array.from(new Set(parts.map((part) => compactWhitespace(part)).filter(Boolean))).join("\n\n");
}

async function ensureCompany(input: {
  supabase: SurgeSupabase;
  ownerId: string;
  name: string;
  category: string;
  location: string;
  website: string;
  priority: "high" | "med" | "low";
  notes: string;
}) {
  const companiesTable = input.supabase.from("surge_companies") as any;
  const normalized = normalizedName(input.name, "company");
  const existingResult = (await companiesTable
    .select("*")
    .eq("owner_id", input.ownerId)
    .eq("normalized_name", normalized)
    .maybeSingle()) as { data: SurgeCompanyRow | null; error: { message: string } | null };

  if (existingResult.error) {
    throw new Error(existingResult.error.message);
  }

  if (existingResult.data) {
    const company = existingResult.data;
    const update: SurgeCompanyUpdate = {
      category: input.category || company.category,
      location: input.location || company.location,
      website: input.website || company.website,
      priority: input.priority || company.priority,
      notes: notesMerge(company.notes, input.notes),
    };
    const result = (await companiesTable
      .update(update)
      .eq("id", company.id)
      .select("*")
      .single()) as { data: SurgeCompanyRow; error: { message: string } | null };

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data;
  }

  const result = (await companiesTable
    .insert({
      owner_id: input.ownerId,
      name: input.name,
      normalized_name: normalized,
      category: input.category || "Other",
      location: input.location || "",
      website: input.website || "",
      priority: input.priority,
      notes: input.notes || "",
    } satisfies SurgeCompanyInsert)
    .select("*")
    .single()) as { data: SurgeCompanyRow; error: { message: string } | null };

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

async function ensureRole(input: {
  supabase: SurgeSupabase;
  ownerId: string;
  companyId: string;
  title: string;
  location: string;
  notes: string;
}) {
  const rolesTable = input.supabase.from("surge_roles") as any;
  const normalized = normalizedName(input.title, "role");
  const existingResult = (await rolesTable
    .select("*")
    .eq("owner_id", input.ownerId)
    .eq("company_id", input.companyId)
    .eq("normalized_title", normalized)
    .maybeSingle()) as { data: SurgeRoleRow | null; error: { message: string } | null };

  if (existingResult.error) {
    throw new Error(existingResult.error.message);
  }

  if (existingResult.data) {
    const role = existingResult.data;
    const result = (await rolesTable
      .update({
        location: input.location || role.location,
        notes: notesMerge(role.notes, input.notes),
      })
      .eq("id", role.id)
      .select("*")
      .single()) as { data: SurgeRoleRow; error: { message: string } | null };

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data;
  }

  const result = (await rolesTable
    .insert({
      owner_id: input.ownerId,
      company_id: input.companyId,
      title: input.title,
      normalized_title: normalized,
      role_type: inferRoleType(input.title),
      location: input.location || "",
      notes: input.notes || "",
    } satisfies SurgeRoleInsert)
    .select("*")
    .single()) as { data: SurgeRoleRow; error: { message: string } | null };

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

async function ensureApplication(input: {
  supabase: SurgeSupabase;
  ownerId: string;
  companyId: string;
  roleId: string;
  source: Database["public"]["Tables"]["surge_applications"]["Row"]["source"];
  status: Database["public"]["Tables"]["surge_applications"]["Row"]["status"];
  appliedAt: string | null;
  sourceUrl: string;
  location: string;
  compensation: string;
  nextStep: string;
  nextStepAt: string | null;
  notes: string;
  jobDescription: string;
  workspace: CareerVaultWorkspace | null;
  tailoring: PersistedTailoring | null;
  capturedAt: string;
}) {
  const applicationsTable = input.supabase.from("surge_applications") as any;
  const baseQuery = applicationsTable
    .select("*")
    .eq("owner_id", input.ownerId)
    .eq("role_id", input.roleId);

  const existingResult = input.sourceUrl
    ? await baseQuery.eq("source_url", input.sourceUrl).limit(1).maybeSingle()
    : await baseQuery.eq("source", input.source).order("updated_at", { ascending: false }).limit(1).maybeSingle();
  const typedExistingResult = existingResult as { data: SurgeApplicationRow | null; error: { message: string } | null };

  if (typedExistingResult.error) {
    throw new Error(typedExistingResult.error.message);
  }

  const workspaceJson = (input.workspace || {}) as Json;
  const tailoringJson = (input.tailoring || {}) as Json;

  if (typedExistingResult.data) {
    const application = typedExistingResult.data;
    const result = (await applicationsTable
      .update({
        status: input.status || application.status,
        applied_at: input.appliedAt ?? application.applied_at,
        source_url: input.sourceUrl || application.source_url,
        location: input.location || application.location,
        compensation: input.compensation || application.compensation,
        next_step: input.nextStep || application.next_step,
        next_step_at: input.nextStepAt ?? application.next_step_at,
        notes: notesMerge(application.notes, input.notes),
        job_description: input.jobDescription || application.job_description,
        last_signal_at: input.capturedAt,
        workspace: input.workspace ? workspaceJson : application.workspace,
        tailoring: input.tailoring ? tailoringJson : application.tailoring,
      })
      .eq("id", application.id)
      .select("*")
      .single()) as { data: SurgeApplicationRow; error: { message: string } | null };

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data;
  }

  const result = (await applicationsTable
    .insert({
      owner_id: input.ownerId,
      company_id: input.companyId,
      role_id: input.roleId,
      source: input.source,
      status: input.status,
      applied_at: input.appliedAt,
      source_url: input.sourceUrl,
      location: input.location || "",
      compensation: input.compensation || "",
      next_step: input.nextStep || "",
      next_step_at: input.nextStepAt,
      notes: input.notes || "",
      job_description: input.jobDescription || "",
      last_signal_at: input.capturedAt,
      workspace: workspaceJson,
      tailoring: tailoringJson,
    } satisfies SurgeApplicationInsert)
    .select("*")
    .single()) as { data: SurgeApplicationRow; error: { message: string } | null };

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

async function replaceDocuments(input: {
  supabase: SurgeSupabase;
  ownerId: string;
  applicationId: string;
  documents: CareerVaultDocument[];
}) {
  const documentsTable = input.supabase.from("surge_documents") as any;
  const deleteResult = await documentsTable
    .delete()
    .eq("owner_id", input.ownerId)
    .eq("application_id", input.applicationId);

  if (deleteResult.error) {
    throw new Error(deleteResult.error.message);
  }

  if (!input.documents.length) {
    return [];
  }

  const insertResult = await documentsTable
    .insert(
      input.documents.map((document) => ({
        owner_id: input.ownerId,
        application_id: input.applicationId,
        document_type: document.type,
        stage: document.stage,
        file_name: document.fileName,
        absolute_path: document.absolutePath,
        relative_path: document.relativePath,
        extension: document.extension,
        tags: document.tags as Json,
        source_template: document.sourceTemplate || "",
        created_at: document.createdAt,
        updated_at: document.updatedAt,
      })) satisfies SurgeDocumentInsert[],
    )
    .select("*");

  if (insertResult.error) {
    throw new Error(insertResult.error.message);
  }

  return insertResult.data ?? [];
}

export async function persistSurgeIngest(input: PersistIngestInput) {
  const companyName = compactWhitespace(input.payload.companyName || brandFromUrl(input.payload.url) || "Unknown company");
  const roleTitle = compactWhitespace(input.payload.roleTitle || input.payload.title || "Unknown role");
  const sourceUrl = String(input.payload.url || "").trim();
  const location = compactWhitespace(input.payload.location || "");
  const category = compactWhitespace(input.payload.category || "Other");
  const priority = ["high", "med", "low"].includes(String(input.payload.priority || "").trim())
    ? (String(input.payload.priority).trim() as "high" | "med" | "low")
    : "med";
  const website = (() => {
    try {
      const url = new URL(sourceUrl);
      return `${url.protocol}//${url.hostname}`;
    } catch {
      return "";
    }
  })();
  const capturedAt = input.payload.capturedAt || nowIso();
  const appliedAt = String(input.payload.appliedAt || "").trim() || null;
  const nextStep = compactWhitespace(input.payload.nextStep || "");
  const nextStepAt = String(input.payload.nextStepAt || "").trim() || null;
  const compensation = compactWhitespace(input.payload.compensation || "");

  const company = await ensureCompany({
    supabase: input.supabase,
    ownerId: input.ownerId,
    name: companyName,
    category,
    location,
    website,
    priority,
    notes: "",
  });

  const role = await ensureRole({
    supabase: input.supabase,
    ownerId: input.ownerId,
    companyId: company.id,
    title: roleTitle,
    location,
    notes: "",
  });

  const application = await ensureApplication({
    supabase: input.supabase,
    ownerId: input.ownerId,
    companyId: company.id,
    roleId: role.id,
    source: sourceValue(input.payload.source || "browser"),
    status: statusValue(input.payload.status || input.payload.mode || "lead"),
    appliedAt,
    sourceUrl,
    location,
    compensation,
    nextStep,
    nextStepAt,
    notes: compactWhitespace(input.payload.notes || ""),
    jobDescription: compactWhitespace(input.payload.body || ""),
    workspace: input.workspace,
    tailoring: input.tailoring,
    capturedAt,
  });

  const documents = await replaceDocuments({
    supabase: input.supabase,
    ownerId: input.ownerId,
    applicationId: application.id,
    documents: input.workspace?.documents || [],
  });

  return {
    company,
    role,
    application,
    documents,
  };
}

export async function persistSurgeArtifacts(input: {
  supabase: SurgeSupabase;
  ownerId: string;
  applicationId: string;
  workspace?: CareerVaultWorkspace | null;
  tailoring?: PersistedTailoring | null;
}) {
  const applicationsTable = input.supabase.from("surge_applications") as any;
  const update: SurgeApplicationUpdate = {};

  if (input.workspace) {
    update.workspace = input.workspace as Json;
  }

  if (input.tailoring) {
    update.tailoring = input.tailoring as Json;
  }

  const result = (await applicationsTable
    .update({
      ...update,
      updated_at: nowIso(),
    })
    .eq("owner_id", input.ownerId)
    .eq("id", input.applicationId)
    .select("*")
    .single()) as { data: SurgeApplicationRow; error: { message: string } | null };

  if (result.error) {
    throw new Error(result.error.message);
  }

  const documents = input.workspace
    ? await replaceDocuments({
        supabase: input.supabase,
        ownerId: input.ownerId,
        applicationId: input.applicationId,
        documents: input.workspace.documents || [],
      })
    : [];

  return {
    application: result.data,
    documents,
  };
}

export async function getSurgeSnapshot(supabase: SurgeSupabase, ownerId: string) {
  const companiesTable = supabase.from("surge_companies") as any;
  const rolesTable = supabase.from("surge_roles") as any;
  const applicationsTable = supabase.from("surge_applications") as any;
  const documentsTable = supabase.from("surge_documents") as any;

  const [companiesResult, rolesResult, applicationsResult, documentsResult] = await Promise.all([
    companiesTable.select("*").eq("owner_id", ownerId).order("updated_at", { ascending: false }),
    rolesTable.select("*").eq("owner_id", ownerId).order("updated_at", { ascending: false }),
    applicationsTable.select("*").eq("owner_id", ownerId).order("updated_at", { ascending: false }),
    documentsTable.select("*").eq("owner_id", ownerId).order("updated_at", { ascending: false }),
  ]);

  const error =
    companiesResult.error || rolesResult.error || applicationsResult.error || documentsResult.error;

  if (error) {
    throw new Error(error.message);
  }

  return {
    companies: companiesResult.data ?? [],
    roles: rolesResult.data ?? [],
    applications: applicationsResult.data ?? [],
    documents: documentsResult.data ?? [],
    generatedAt: nowIso(),
  };
}

export async function getSurgeRuntimeSnapshot(supabase: SurgeSupabase, ownerId: string) {
  const snapshot = await getSurgeSnapshot(supabase, ownerId);
  const companyIds = new Map<string, number>();
  const roleIds = new Map<string, number>();
  const applicationIds = new Map<string, number>();
  const usedCompanyIds = new Set<number>();
  const usedRoleIds = new Set<number>();
  const usedApplicationIds = new Set<number>();
  const usedDocumentIds = new Set<number>();

  snapshot.companies.forEach((company: SurgeCompanyRow) => {
    companyIds.set(company.id, stableNumericId(`company:${company.id}`, usedCompanyIds));
  });

  snapshot.roles
    .filter((role: SurgeRoleRow) => companyIds.has(role.company_id))
    .forEach((role: SurgeRoleRow) => {
      roleIds.set(role.id, stableNumericId(`role:${role.id}`, usedRoleIds));
    });

  snapshot.applications
    .filter(
      (application: SurgeApplicationRow) =>
        companyIds.has(application.company_id) && roleIds.has(application.role_id),
    )
    .forEach((application: SurgeApplicationRow) => {
      applicationIds.set(application.id, stableNumericId(`application:${application.id}`, usedApplicationIds));
    });

  return {
    companies: snapshot.companies.map((company: SurgeCompanyRow) => ({
      id: companyIds.get(company.id) ?? stableNumericId(`company:fallback:${company.id}`, usedCompanyIds),
      remoteId: company.id,
      name: company.name,
      category: company.category,
      location: company.location,
      website: company.website,
      priority: company.priority,
      notes: company.notes,
      createdAt: company.created_at,
      updatedAt: company.updated_at,
    })),
    roles: snapshot.roles
      .filter((role: SurgeRoleRow) => companyIds.has(role.company_id))
      .map((role: SurgeRoleRow) => ({
        id: roleIds.get(role.id) ?? stableNumericId(`role:fallback:${role.id}`, usedRoleIds),
        remoteId: role.id,
        companyId: companyIds.get(role.company_id),
        remoteCompanyId: role.company_id,
        title: role.title,
        type: runtimeRoleType(role.role_type),
        location: role.location,
        notes: role.notes,
        createdAt: role.created_at,
        updatedAt: role.updated_at,
      })),
    applications: snapshot.applications
      .filter(
        (application: SurgeApplicationRow) =>
          companyIds.has(application.company_id) && roleIds.has(application.role_id),
      )
      .map((application: SurgeApplicationRow) => ({
        id:
          applicationIds.get(application.id) ??
          stableNumericId(`application:fallback:${application.id}`, usedApplicationIds),
        remoteId: application.id,
        workspaceKey: buildSurgeWorkspaceKey({
          sourceUrl: application.source_url,
          companyName:
            snapshot.companies.find((company: SurgeCompanyRow) => company.id === application.company_id)?.name ||
            "Unknown company",
          roleTitle:
            snapshot.roles.find((role: SurgeRoleRow) => role.id === application.role_id)?.title || "Unknown role",
        }),
        companyId: companyIds.get(application.company_id),
        remoteCompanyId: application.company_id,
        roleId: roleIds.get(application.role_id),
        remoteRoleId: application.role_id,
        source: application.source,
        status: application.status,
        appliedAt: application.applied_at,
        sourceUrl: application.source_url,
        location: application.location,
        compensation: application.compensation,
        nextStep: application.next_step,
        nextStepAt: application.next_step_at,
        notes: application.notes,
        jobDescription: application.job_description,
        lastSignalAt: application.last_signal_at,
        workspace: application.workspace,
        tailoring: application.tailoring,
        createdAt: application.created_at,
        updatedAt: application.updated_at,
      })),
    documents: snapshot.documents
      .filter((document: SurgeDocumentRow) => applicationIds.has(document.application_id))
      .map((document: SurgeDocumentRow) => ({
        id: stableNumericId(`document:${document.id}`, usedDocumentIds),
        remoteId: document.id,
        applicationId: applicationIds.get(document.application_id),
        remoteApplicationId: document.application_id,
        type: document.document_type,
        stage: document.stage,
        fileName: document.file_name,
        absolutePath: document.absolute_path,
        relativePath: document.relative_path,
        extension: document.extension,
        tags: Array.isArray(document.tags) ? document.tags.map(String).filter(Boolean) : [],
        sourceTemplate: document.source_template,
        createdAt: document.created_at,
        updatedAt: document.updated_at,
      })),
    generatedAt: snapshot.generatedAt,
  };
}
