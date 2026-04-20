import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import type {
  OdiricoAssignment,
  OdiricoBudgetCategory,
  OdiricoGoal,
  OdiricoStudyBlock,
} from "@odirico/core/ecosystem";
import { getOdiricoEcosystemSnapshot } from "@odirico/core/ecosystem";
import type { Database, Json } from "@odirico/core/database";

type PlatformSupabase = SupabaseClient<Database>;
type EcosystemWorkspaceRow = Database["public"]["Tables"]["ecosystem_workspaces"]["Row"];

export type WorkspaceAppKey = "ember" | "sol";

export type EmberWorkspaceStudyBlock = OdiricoStudyBlock & {
  completed?: boolean;
};

export type SolWorkspaceBillReminder = {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  paid?: boolean;
};

export type EmberWorkspaceState = {
  assignments: OdiricoAssignment[];
  studyPlan: EmberWorkspaceStudyBlock[];
};

export type SolWorkspaceState = {
  budgets: OdiricoBudgetCategory[];
  goals: OdiricoGoal[];
  bills: SolWorkspaceBillReminder[];
  netWorth: number;
  monthlyIncome: number;
  creditUtilization: number;
};

export type WorkspaceStateMap = {
  ember: EmberWorkspaceState;
  sol: SolWorkspaceState;
};

export type WorkspaceLoadResult<TKey extends WorkspaceAppKey = WorkspaceAppKey> = {
  appKey: TKey;
  state: WorkspaceStateMap[TKey];
  hasPersistedState: boolean;
  updatedAt: string | null;
};

const snapshot = getOdiricoEcosystemSnapshot();

const assignmentSchema = z.object({
  id: z.string().min(1),
  courseId: z.string().min(1),
  title: z.string().min(1),
  dueDate: z.string().min(1),
  weight: z.number(),
  estimatedHours: z.number(),
  status: z.enum(["not-started", "in-progress", "submitted"]),
});

const studyBlockSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  courseId: z.string().optional(),
  day: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
  source: z.enum(["ember", "sol", "surge"]),
  focus: z.string().min(1),
  completed: z.boolean().optional().default(false),
});

const emberWorkspaceStateSchema = z.object({
  assignments: z.array(assignmentSchema),
  studyPlan: z.array(studyBlockSchema),
});

const budgetSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  spent: z.number(),
  budget: z.number(),
  trend: z.enum(["up", "flat", "down"]),
});

const goalSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.enum(["savings", "health", "learning", "career"]),
  current: z.number(),
  target: z.number(),
  unit: z.string().min(1),
  deadline: z.string().min(1),
});

const solBillReminderSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  dueDate: z.string().min(1),
  amount: z.number(),
  paid: z.boolean().optional().default(false),
});

const solWorkspaceStateSchema = z.object({
  budgets: z.array(budgetSchema),
  goals: z.array(goalSchema),
  bills: z.array(solBillReminderSchema),
  netWorth: z.number(),
  monthlyIncome: z.number(),
  creditUtilization: z.number(),
});

export function isWorkspaceAppKey(value: string): value is WorkspaceAppKey {
  return value === "ember" || value === "sol";
}

export function createDefaultWorkspaceState<TKey extends WorkspaceAppKey>(
  appKey: TKey,
): WorkspaceStateMap[TKey] {
  if (appKey === "ember") {
    return {
      assignments: snapshot.ember.assignments.slice(),
      studyPlan: snapshot.ember.studyPlan.map((block) => ({
        ...block,
        completed: false,
      })),
    } as WorkspaceStateMap[TKey];
  }

  return {
    budgets: snapshot.sol.budgets.slice(),
    goals: snapshot.sol.goals.slice(),
    bills: snapshot.sol.billReminders.map((bill) => ({
      ...bill,
      paid: false,
    })),
    netWorth: snapshot.sol.summary.netWorth,
    monthlyIncome: snapshot.sol.summary.monthlyIncome,
    creditUtilization: snapshot.sol.summary.creditUtilization,
  } as WorkspaceStateMap[TKey];
}

export function parseWorkspaceState<TKey extends WorkspaceAppKey>(
  appKey: TKey,
  value: unknown,
): WorkspaceStateMap[TKey] | null {
  const result =
    appKey === "ember"
      ? emberWorkspaceStateSchema.safeParse(value)
      : solWorkspaceStateSchema.safeParse(value);

  return result.success ? (result.data as WorkspaceStateMap[TKey]) : null;
}

export function normalizeWorkspaceState<TKey extends WorkspaceAppKey>(
  appKey: TKey,
  value: unknown,
): WorkspaceStateMap[TKey] {
  return parseWorkspaceState(appKey, value) ?? createDefaultWorkspaceState(appKey);
}

export async function loadWorkspaceState<TKey extends WorkspaceAppKey>(
  supabase: PlatformSupabase,
  userId: string,
  appKey: TKey,
): Promise<WorkspaceLoadResult<TKey>> {
  const workspacesTable = supabase.from("ecosystem_workspaces") as any;
  const result = (await workspacesTable
    .select("*")
    .eq("user_id", userId)
    .eq("app_key", appKey)
    .maybeSingle()) as {
    data: EcosystemWorkspaceRow | null;
    error: { message: string } | null;
  };

  if (result.error) {
    throw new Error(result.error.message);
  }

  if (!result.data) {
    return {
      appKey,
      state: createDefaultWorkspaceState(appKey),
      hasPersistedState: false,
      updatedAt: null,
    };
  }

  return {
    appKey,
    state: normalizeWorkspaceState(appKey, result.data.state),
    hasPersistedState: true,
    updatedAt: result.data.updated_at,
  };
}

export async function saveWorkspaceState<TKey extends WorkspaceAppKey>(
  supabase: PlatformSupabase,
  userId: string,
  appKey: TKey,
  state: WorkspaceStateMap[TKey],
): Promise<WorkspaceLoadResult<TKey>> {
  const workspacesTable = supabase.from("ecosystem_workspaces") as any;
  const result = (await workspacesTable
    .upsert(
      {
        user_id: userId,
        app_key: appKey,
        state: state as Json,
      },
      {
        onConflict: "user_id,app_key",
      },
    )
    .select("*")
    .single()) as {
    data: EcosystemWorkspaceRow;
    error: { message: string } | null;
  };

  if (result.error) {
    throw new Error(result.error.message);
  }

  return workspaceRowToLoadResult(result.data, appKey);
}

function workspaceRowToLoadResult<TKey extends WorkspaceAppKey>(
  row: EcosystemWorkspaceRow,
  appKey: TKey,
): WorkspaceLoadResult<TKey> {
  return {
    appKey,
    state: normalizeWorkspaceState(appKey, row.state),
    hasPersistedState: true,
    updatedAt: row.updated_at,
  };
}
