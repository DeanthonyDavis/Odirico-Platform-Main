"use client";

import { startTransition, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

import type { WorkspaceAppKey } from "@/lib/platform/workspaces";

export type WorkspaceSyncStatus = "idle" | "syncing" | "saved" | "error";

type UseSyncedWorkspaceOptions<TState> = {
  appKey: WorkspaceAppKey;
  storageKey: string;
  initialState: TState;
  hasPersistedState: boolean;
  normalizeState: (value: unknown) => TState;
};

type UseSyncedWorkspaceResult<TState> = {
  state: TState;
  setState: Dispatch<SetStateAction<TState>>;
  syncStatus: WorkspaceSyncStatus;
  syncError: string | null;
};

export function useSyncedWorkspace<TState>(
  options: UseSyncedWorkspaceOptions<TState>,
): UseSyncedWorkspaceResult<TState> {
  const [state, setState] = useState<TState>(options.initialState);
  const [syncStatus, setSyncStatus] = useState<WorkspaceSyncStatus>(
    options.hasPersistedState ? "saved" : "idle",
  );
  const [syncError, setSyncError] = useState<string | null>(null);

  const forceNextSyncRef = useRef(false);
  const hasMountedRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);
  const latestSerializedStateRef = useRef(JSON.stringify(options.initialState));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.localStorage.getItem(options.storageKey);

    if (!raw || options.hasPersistedState) {
      return;
    }

    try {
      const parsed = options.normalizeState(JSON.parse(raw));
      const serialized = JSON.stringify(parsed);

      if (serialized === latestSerializedStateRef.current) {
        return;
      }

      const timer = window.setTimeout(() => {
        forceNextSyncRef.current = true;
        latestSerializedStateRef.current = serialized;
        setSyncStatus("syncing");

        startTransition(() => {
          setState(parsed);
        });
      }, 0);

      return () => {
        window.clearTimeout(timer);
      };
    } catch {
      // Ignore malformed local backup data and continue with server/default state.
    }
  }, [options.hasPersistedState, options.normalizeState, options.storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const serialized = JSON.stringify(state);
    latestSerializedStateRef.current = serialized;
    window.localStorage.setItem(options.storageKey, serialized);

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;

      if (!forceNextSyncRef.current) {
        return;
      }
    }

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    setSyncStatus("syncing");
    setSyncError(null);

    saveTimerRef.current = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/platform/workspaces/${options.appKey}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "Unable to save workspace.");
        }

        setSyncStatus("saved");
        forceNextSyncRef.current = false;
      } catch (error) {
        setSyncStatus("error");
        setSyncError(error instanceof Error ? error.message : "Unable to save workspace.");
      }
    }, 500);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [options.appKey, options.storageKey, state]);

  return {
    state,
    setState,
    syncStatus,
    syncError,
  };
}
