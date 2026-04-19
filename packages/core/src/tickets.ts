export type WorkspaceScreen = "dashboard" | "tickets";

export type WorkspacePriority = "Critical" | "High" | "Medium" | "Low";
export type WorkspaceStatus =
  | "New"
  | "In Progress"
  | "Under Review"
  | "Complete"
  | "On Hold";
export type ProjectType = "Distribution" | "Transmission" | "Other";
export type TeamLabel = "Alpha" | "Bravo" | "Charlie";

export type WorkspaceTicket = {
  id: string;
  title: string;
  description: string;
  priority: WorkspacePriority;
  status: WorkspaceStatus;
  legacyStatus: string;
  projectType: ProjectType;
  team: TeamLabel;
  designerId: string;
  designerName: string;
  dueDate: string;
  timeInQueueDays: number;
  tags: string[];
  issueCount: number;
  attachmentCount: number;
  createdAt: string;
  updatedAt: string;
  clientName: string;
  poleCode: string;
  documentFlags: string[];
};

export type DesignerPoolMember = {
  id: string;
  name: string;
  team: TeamLabel;
  availability: "Available" | "Busy" | "Offline";
  workload: number;
};

export type ImportedFolderBatch = {
  id: string;
  folderName: string;
  title: string;
  description: string;
  dueDate: string;
  priority: WorkspaceTicket["priority"];
  projectType: WorkspaceTicket["projectType"];
  team: WorkspaceTicket["team"];
  designerName: string;
  tags: string[];
  files: string[];
  documentFlags: string[];
  missingDocuments: string[];
};

export type DraftTicketInput = {
  title: string;
  description: string;
  dueDate: string;
  projectType: WorkspaceTicket["projectType"];
  team: WorkspaceTicket["team"];
  designerName: string;
  tags: string[];
  cloudLink: string;
  attachmentNames: string[];
};

const REQUIRED_QC_DOCS = ["Material List", "BM"] as const;
export const REQUIRED_QC_DOCUMENTS = [...REQUIRED_QC_DOCS];

export function getPriorityFromDueDate(dueDateInput: string | null | undefined): WorkspacePriority {
  if (!dueDateInput) return "Medium";

  const dueDate = new Date(dueDateInput);
  if (Number.isNaN(dueDate.getTime())) return "Medium";

  const now = new Date();
  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue <= 1) return "Critical";
  if (daysUntilDue <= 3) return "High";
  if (daysUntilDue <= 7) return "Medium";
  return "Low";
}

export function parseDueDateInput(input: string): string | null {
  const trimmed = input.trim();

  if (!trimmed) return null;

  if (trimmed.toLowerCase() === "today") {
    return new Date().toISOString();
  }

  if (trimmed.toLowerCase() === "tomorrow") {
    return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}
