"use client";

import { useMemo, useState } from "react";

import {
  assignmentsDueSoon,
  courseLookup,
  getOdiricoEcosystemSnapshot,
  highestRiskCourses,
  percent,
} from "@odirico/core/ecosystem";

import {
  useSyncedWorkspace,
  type WorkspaceSyncStatus,
} from "@/components/platform/use-synced-workspace";
import type { EmberWorkspaceState } from "@/lib/platform/workspaces";
import { normalizeWorkspaceState } from "@/lib/platform/workspaces";

const STORAGE_KEY = "odirico-ember-live-v1";

type DraftAssignment = {
  title: string;
  courseId: string;
  dueDate: string;
  estimatedHours: string;
};

type EmberWorkspaceProps = {
  initialState: EmberWorkspaceState;
  hasPersistedState: boolean;
};

const snapshot = getOdiricoEcosystemSnapshot();
const ember = snapshot.ember;

const initialDraft: DraftAssignment = {
  title: "",
  courseId: ember.courses[0]?.id ?? "",
  dueDate: "",
  estimatedHours: "2",
};

const normalizeEmberClientState = (value: unknown) => normalizeWorkspaceState("ember", value);

function toMinutes(value: string) {
  const [hours, minutes] = value.split(":").map((part) => Number(part));
  return hours * 60 + minutes;
}

function blockHours(block: EmberWorkspaceState["studyPlan"][number]) {
  return Math.max(0, toMinutes(block.end) - toMinutes(block.start)) / 60;
}

function syncStatusLabel(status: WorkspaceSyncStatus) {
  if (status === "syncing") return "Syncing";
  if (status === "error") return "Needs attention";
  return "Saved";
}

export function EmberWorkspace({ initialState, hasPersistedState }: EmberWorkspaceProps) {
  const [draft, setDraft] = useState<DraftAssignment>(initialDraft);
  const {
    state,
    setState,
    syncStatus,
    syncError,
  } = useSyncedWorkspace({
    appKey: "ember",
    storageKey: STORAGE_KEY,
    initialState,
    hasPersistedState,
    normalizeState: normalizeEmberClientState,
  });

  const assignments = state.assignments;
  const studyPlan = state.studyPlan;

  const derivedSnapshot = useMemo(
    () => ({
      ...ember,
      assignments,
      studyPlan,
      summary: {
        dueThisWeek: assignments.length,
        upcomingExams: ember.exams.length,
        plannedStudyHours: Math.round(
          studyPlan.reduce((total, block) => total + blockHours(block), 0) * 10,
        ) / 10,
        completedFocusBlocks: studyPlan.filter((block) => block.completed).length,
        completionRate:
          assignments.length > 0
            ? Math.round(
                (assignments.filter((assignment) => assignment.status === "submitted").length /
                  assignments.length) *
                  100,
              )
            : 0,
      },
    }),
    [assignments, studyPlan],
  );

  const courses = useMemo(() => courseLookup(derivedSnapshot), [derivedSnapshot]);
  const dueSoon = useMemo(() => assignmentsDueSoon(derivedSnapshot), [derivedSnapshot]);
  const risks = useMemo(() => highestRiskCourses(derivedSnapshot), [derivedSnapshot]);
  const nextBlock = studyPlan.find((block) => !block.completed) ?? studyPlan[0] ?? null;
  const submittedCount = assignments.filter((assignment) => assignment.status === "submitted").length;
  const inProgressCount = assignments.filter((assignment) => assignment.status === "in-progress").length;

  function cycleAssignmentStatus(assignmentId: string) {
    setState((current) => ({
      ...current,
      assignments: current.assignments.map((assignment) => {
        if (assignment.id !== assignmentId) {
          return assignment;
        }

        if (assignment.status === "not-started") {
          return { ...assignment, status: "in-progress" };
        }

        if (assignment.status === "in-progress") {
          return { ...assignment, status: "submitted" };
        }

        return { ...assignment, status: "not-started" };
      }),
    }));
  }

  function toggleStudyBlock(blockId: string) {
    setState((current) => ({
      ...current,
      studyPlan: current.studyPlan.map((block) =>
        block.id === blockId ? { ...block, completed: !block.completed } : block,
      ),
    }));
  }

  function addAssignment() {
    if (!draft.title.trim() || !draft.courseId || !draft.dueDate) {
      return;
    }

    const estimatedHours = Math.max(1, Number(draft.estimatedHours) || 1);

    setState((current) => ({
      ...current,
      assignments: [
        ...current.assignments,
        {
          id: `ember-user-${Date.now()}`,
          courseId: draft.courseId,
          title: draft.title.trim(),
          dueDate: draft.dueDate,
          weight: 5,
          estimatedHours,
          status: "not-started",
        },
      ],
    }));

    setDraft(initialDraft);
  }

  return (
    <div className="workspace-stack">
      <section className="panel app-home-hero app-home-hero-ember" id="today">
        <div className="app-home-copy">
          <p className="sidebar-label">Today</p>
          <h3>Stay ahead of the academic load before the week turns into recovery mode.</h3>
          <p className="muted">
            Ember should make the next move obvious: what is due, what is slipping, and what to study next.
          </p>
          {syncError ? <p className="muted">{syncError}</p> : null}
        </div>

        <div className="app-home-meta">
          <span className="status-pill">{ember.semester.name}</span>
          <span className="status-pill">{syncStatusLabel(syncStatus)}</span>
          <span className="status-pill">{percent(derivedSnapshot.summary.completionRate)} complete</span>
        </div>

        <div className="app-home-grid">
          <article className="app-home-priority-card">
            <p className="workspace-module-kicker">Next up</p>
            <h4>{dueSoon[0]?.title ?? "No active assignment"}</h4>
            <p className="muted">
              {dueSoon[0]
                ? `${courses.get(dueSoon[0].courseId)?.title ?? "Course"} due ${dueSoon[0].dueDate}`
                : "The queue is clear right now."}
            </p>
          </article>

          <article className="app-home-priority-card">
            <p className="workspace-module-kicker">Focus block</p>
            <h4>{nextBlock?.title ?? "No study block queued"}</h4>
            <p className="muted">
              {nextBlock
                ? `${nextBlock.day} ${nextBlock.start}-${nextBlock.end}`
                : "Create or restore the next study block."}
            </p>
          </article>

          <article className="app-home-priority-card">
            <p className="workspace-module-kicker">Academic risk</p>
            <h4>{risks[0]?.title ?? "No urgent course"}</h4>
            <p className="muted">
              {risks[0] ? `${risks[0].currentGrade} / ${risks[0].risk}` : "No urgent course risk right now."}
            </p>
          </article>
        </div>
      </section>

      <div className="stats-grid">
        <article className="stat-card">
          <span className="sidebar-label">Due this week</span>
          <strong>{derivedSnapshot.summary.dueThisWeek}</strong>
          <p className="muted">Assignments visible and sortable before they become backlog.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">In progress</span>
          <strong>{inProgressCount}</strong>
          <p className="muted">Current academic work already moving through the week.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Submitted</span>
          <strong>{submittedCount}</strong>
          <p className="muted">Completed work this week across the active course load.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Study hours</span>
          <strong>{derivedSnapshot.summary.plannedStudyHours}</strong>
          <p className="muted">Planned deep-work capacity currently on the calendar.</p>
        </article>
      </div>

      <div className="panel-grid" id="assignments">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Assignment queue</p>
              <h3>Move the week forward without losing sequence</h3>
            </div>
          </div>
          <div className="task-list-grid">
            {dueSoon.map((assignment) => {
              const course = courses.get(assignment.courseId);

              return (
                <article key={assignment.id} className="task-card">
                  <div className="task-card-top">
                    <div>
                      <strong>{assignment.title}</strong>
                      <p className="muted">
                        {course?.title || "Course"} / due {assignment.dueDate}
                      </p>
                    </div>
                    <span className={`module-pill task-status-pill task-status-${assignment.status}`}>
                      {assignment.status.replace("-", " ")}
                    </span>
                  </div>
                  <div className="context-row">
                    <span className="status-pill">Weight {assignment.weight}%</span>
                    <span className="status-pill">{assignment.estimatedHours}h estimate</span>
                  </div>
                  <div className="live-action-row">
                    <button
                      className="ghost-button live-inline-button"
                      onClick={() => cycleAssignmentStatus(assignment.id)}
                      type="button"
                    >
                      {assignment.status === "not-started"
                        ? "Start work"
                        : assignment.status === "in-progress"
                          ? "Mark submitted"
                          : "Reset status"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Quick capture</p>
            <div className="form-grid">
              <label className="field field-span-full">
                <span>Assignment title</span>
                <input
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Lab write-up, worksheet, exam prep..."
                  value={draft.title}
                />
              </label>
              <label className="field">
                <span>Course</span>
                <select
                  onChange={(event) => setDraft((current) => ({ ...current, courseId: event.target.value }))}
                  value={draft.courseId}
                >
                  {ember.courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Due date</span>
                <input
                  onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))}
                  type="date"
                  value={draft.dueDate}
                />
              </label>
              <label className="field">
                <span>Hours</span>
                <input
                  min="1"
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, estimatedHours: event.target.value }))
                  }
                  type="number"
                  value={draft.estimatedHours}
                />
              </label>
              <div className="live-action-row">
                <button className="primary-button" onClick={addAssignment} type="button">
                  Add assignment
                </button>
              </div>
            </div>
          </section>

          <section className="panel" id="exams">
            <p className="sidebar-label">Exam readiness</p>
            <div className="signal-list">
              {ember.exams.map((exam) => (
                <article key={exam.id} className="signal-card-mini">
                  <strong>{exam.title}</strong>
                  <p className="muted">
                    {courses.get(exam.courseId)?.title || "Course"} / {exam.date}
                  </p>
                  <span className={`risk-pill risk-pill-${exam.readiness}`}>
                    {exam.readiness} readiness
                  </span>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <div className="panel-grid" id="study-plan">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Study plan</p>
              <h3>Protect the next good work block instead of reacting late</h3>
            </div>
          </div>
          <div className="study-grid">
            {studyPlan.map((block) => (
              <article key={block.id} className={`study-card study-card-${block.source}`}>
                <p className="workspace-module-kicker">{block.day}</p>
                <h4>{block.title}</h4>
                <p className="muted">
                  {block.start}-{block.end}
                  {block.courseId ? ` / ${courses.get(block.courseId)?.title || "Course"}` : ""}
                </p>
                <span className="mini-meta">{block.focus}</span>
                <button
                  className="ghost-button live-inline-button"
                  onClick={() => toggleStudyBlock(block.id)}
                  type="button"
                >
                  {block.completed ? "Completed" : "Mark complete"}
                </button>
              </article>
            ))}
          </div>
        </section>

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Course health</p>
            <div className="signal-list">
              {risks.map((course) => (
                <article key={course.id} className="signal-card-mini">
                  <div className="signal-card-head">
                    <strong>{course.title}</strong>
                    <span className={`risk-pill risk-pill-${course.risk}`}>{course.risk}</span>
                  </div>
                  <p className="muted">
                    {course.professor} / {course.currentGrade}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel" id="routine">
            <p className="sidebar-label">Routine and recovery</p>
            <article className="signal-card-mini">
              <strong>{ember.semester.name}</strong>
              <p className="muted">
                {ember.semester.creditsCompleted} of {ember.semester.creditsTarget} credits completed.
              </p>
              <span className="mini-meta">{ember.semester.progress}% through the term</span>
            </article>
            <div className="signal-list">
              {snapshot.overview.crossAppSignals
                .filter((signal) => signal.source !== "surge")
                .map((signal) => (
                  <article key={signal.id} className="signal-card-mini">
                    <strong>{signal.title}</strong>
                    <p className="muted">{signal.detail}</p>
                  </article>
                ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
