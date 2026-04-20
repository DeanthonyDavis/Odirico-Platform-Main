"use client";

import { useMemo, useState } from "react";

import {
  assignmentsDueSoon,
  courseLookup,
  getOdiricoEcosystemSnapshot,
  highestRiskCourses,
  percent,
} from "@odirico/core/ecosystem";

import type { EmberWorkspaceState } from "@/lib/platform/workspaces";
import { normalizeWorkspaceState } from "@/lib/platform/workspaces";
import {
  useSyncedWorkspace,
  type WorkspaceSyncStatus,
} from "@/components/platform/use-synced-workspace";

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
  if (status === "syncing") return "Syncing to account";
  if (status === "error") return "Sync issue";
  return "Saved across devices";
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
      <div className="stats-grid">
        <article className="stat-card">
          <span className="sidebar-label">Due this week</span>
          <strong>{derivedSnapshot.summary.dueThisWeek}</strong>
          <p className="muted">Assignments now stay tied to your account instead of one browser session.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Upcoming exams</span>
          <strong>{derivedSnapshot.summary.upcomingExams}</strong>
          <p className="muted">Exam pressure still shapes the plan, but the live execution state now follows you across devices.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Planned study hours</span>
          <strong>{derivedSnapshot.summary.plannedStudyHours}</strong>
          <p className="muted">Focus blocks recalculate in the route as you complete or reshuffle the week.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Completion rate</span>
          <strong>{percent(derivedSnapshot.summary.completionRate)}</strong>
          <p className="muted">Status changes save back to the backend so Ember stays live beyond the current device.</p>
        </article>
      </div>

      <section className="panel workspace-banner workspace-banner-ember">
        <div>
          <p className="sidebar-label">Student operating system</p>
          <h3>Ember now syncs its live planning state to your account.</h3>
          <p className="muted">
            Add assignments, move work from not-started to submitted, and check off focus blocks
            without leaving the route. Sol still shapes the constraints, and Surge still feeds
            internship pressure into the week.
          </p>
          {syncError ? <p className="muted">{syncError}</p> : null}
        </div>
        <div className="context-row">
          <span className="status-pill">{ember.semester.name}</span>
          <span className="status-pill">
            {ember.semester.creditsCompleted}/{ember.semester.creditsTarget} credits
          </span>
          <span className="status-pill">{syncStatusLabel(syncStatus)}</span>
        </div>
      </section>

      <div className="panel-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Quick capture</p>
              <h3>Add the next assignment before it disappears</h3>
            </div>
          </div>
          <div className="form-grid">
            <label className="field field-span-full">
              <span>Assignment title</span>
              <input
                onChange={(event) =>
                  setDraft((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Lab write-up, problem set, proposal revision..."
                value={draft.title}
              />
            </label>
            <label className="field">
              <span>Course</span>
              <select
                onChange={(event) =>
                  setDraft((current) => ({ ...current, courseId: event.target.value }))
                }
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
                onChange={(event) =>
                  setDraft((current) => ({ ...current, dueDate: event.target.value }))
                }
                type="date"
                value={draft.dueDate}
              />
            </label>
            <label className="field">
              <span>Estimated hours</span>
              <input
                min="1"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    estimatedHours: event.target.value,
                  }))
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

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Next focus block</p>
            {nextBlock ? (
              <article className="signal-card-mini">
                <strong>{nextBlock.title}</strong>
                <p className="muted">
                  {nextBlock.day} {nextBlock.start}-{nextBlock.end}
                  {nextBlock.courseId
                    ? ` / ${courses.get(nextBlock.courseId)?.title ?? "Course"}`
                    : ""}
                </p>
                <button
                  className="ghost-button live-inline-button"
                  onClick={() => toggleStudyBlock(nextBlock.id)}
                  type="button"
                >
                  {nextBlock.completed ? "Mark active" : "Mark completed"}
                </button>
              </article>
            ) : (
              <p className="muted">No focus block is queued yet.</p>
            )}
          </section>

          <section className="panel">
            <p className="sidebar-label">Risk alerts</p>
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
        </aside>
      </div>

      <div className="panel-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Live assignment lane</p>
              <h3>Move work forward without leaving Ember</h3>
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
            <p className="sidebar-label">Upcoming exams</p>
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

          <section className="panel">
            <p className="sidebar-label">Cross-app pressure</p>
            <div className="signal-list">
              {snapshot.overview.crossAppSignals.map((signal) => (
                <article key={signal.id} className="signal-card-mini">
                  <strong>{signal.title}</strong>
                  <p className="muted">{signal.detail}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="sidebar-label">Study plan</p>
            <h3>Check off the live focus blocks shaping the week</h3>
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

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="sidebar-label">Semester progress</p>
            <h3>Academic progress and graduation movement</h3>
          </div>
        </div>
        <div className="semester-grid">
          <article className="semester-progress-card">
            <div className="goal-ring">
              <span>{ember.semester.progress}%</span>
            </div>
            <div>
              <h4>{ember.semester.name}</h4>
              <p className="muted">
                {ember.semester.creditsCompleted} of {ember.semester.creditsTarget} credits completed toward the current milestone.
              </p>
            </div>
          </article>
          <div className="course-grid">
            {ember.courses.map((course) => (
              <article key={course.id} className="course-card">
                <p className="workspace-module-kicker">{course.professor}</p>
                <h4>{course.title}</h4>
                <p className="muted">
                  {course.currentGrade} / {course.difficulty} difficulty
                </p>
                <span className={`risk-pill risk-pill-${course.risk}`}>{course.risk}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
