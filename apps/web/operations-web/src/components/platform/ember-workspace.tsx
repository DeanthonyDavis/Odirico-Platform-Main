import {
  assignmentsDueSoon,
  courseLookup,
  getOdiricoEcosystemSnapshot,
  highestRiskCourses,
  percent,
} from "@odirico/core/ecosystem";

export function EmberWorkspace() {
  const snapshot = getOdiricoEcosystemSnapshot();
  const { ember, overview } = snapshot;
  const courses = courseLookup(ember);
  const dueSoon = assignmentsDueSoon(ember);
  const risks = highestRiskCourses(ember);

  return (
    <div className="workspace-stack">
      <div className="stats-grid">
        <article className="stat-card">
          <span className="sidebar-label">Due this week</span>
          <strong>{ember.summary.dueThisWeek}</strong>
          <p className="muted">Assignments and deliverables Ember is actively shaping into a survivable week.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Upcoming exams</span>
          <strong>{ember.summary.upcomingExams}</strong>
          <p className="muted">Exams already weighted into the scheduler so prep ramps before panic shows up.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Planned study hours</span>
          <strong>{ember.summary.plannedStudyHours}</strong>
          <p className="muted">AI-generated blocks balanced against energy, class load, and follow-up obligations.</p>
        </article>
        <article className="stat-card">
          <span className="sidebar-label">Completion rate</span>
          <strong>{percent(ember.summary.completionRate)}</strong>
          <p className="muted">Execution is ahead of baseline, but the risk load is concentrated in calculus and circuits.</p>
        </article>
      </div>

      <section className="panel workspace-banner workspace-banner-ember">
        <div>
          <p className="sidebar-label">Student operating system</p>
          <h3>Ember is built for academic life, not generic tasks.</h3>
          <p className="muted">
            Classes, assignments, exams, study blocks, and burnout prevention are the real objects here.
            Sol shapes the constraints, Surge contributes internship deadlines, and Ember turns it all into a week you can actually execute.
          </p>
        </div>
        <div className="context-row">
          <span className="status-pill">{ember.semester.name}</span>
          <span className="status-pill">{ember.semester.creditsCompleted}/{ember.semester.creditsTarget} credits</span>
          <span className="status-pill">Focus blocks {ember.summary.completedFocusBlocks}</span>
        </div>
      </section>

      <div className="panel-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">Due this week</p>
              <h3>Assignments mapped to academic weight</h3>
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
                      <p className="muted">{course?.title || "Course"} · due {assignment.dueDate}</p>
                    </div>
                    <span className={`module-pill task-status-pill task-status-${assignment.status}`}>{assignment.status.replace("-", " ")}</span>
                  </div>
                  <div className="context-row">
                    <span className="status-pill">Weight {assignment.weight}%</span>
                    <span className="status-pill">{assignment.estimatedHours}h estimate</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="sidebar-panels">
          <section className="panel">
            <p className="sidebar-label">Risk alerts</p>
            <div className="signal-list">
              {risks.map((course) => (
                <article key={course.id} className="signal-card-mini">
                  <div className="signal-card-head">
                    <strong>{course.title}</strong>
                    <span className={`risk-pill risk-pill-${course.risk}`}>{course.risk}</span>
                  </div>
                  <p className="muted">{course.professor} · {course.currentGrade}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <p className="sidebar-label">Upcoming exams</p>
            <div className="signal-list">
              {ember.exams.map((exam) => (
                <article key={exam.id} className="signal-card-mini">
                  <strong>{exam.title}</strong>
                  <p className="muted">{courses.get(exam.courseId)?.title || "Course"} · {exam.date}</p>
                  <span className={`risk-pill risk-pill-${exam.readiness}`}>{exam.readiness} readiness</span>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <div className="detail-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="sidebar-label">AI study planner</p>
              <h3>Placed study and life blocks for the current week</h3>
            </div>
          </div>
          <div className="study-grid">
            {ember.studyPlan.map((block) => (
              <article key={block.id} className={`study-card study-card-${block.source}`}>
                <p className="workspace-module-kicker">{block.day}</p>
                <h4>{block.title}</h4>
                <p className="muted">
                  {block.start}–{block.end}
                  {block.courseId ? ` · ${courses.get(block.courseId)?.title || "Course"}` : ""}
                </p>
                <span className="mini-meta">{block.focus}</span>
              </article>
            ))}
          </div>
        </section>

        <aside className="panel">
          <p className="sidebar-label">Cross-app pressure</p>
          <div className="signal-list">
            {overview.crossAppSignals.map((signal) => (
              <article key={signal.id} className="signal-card-mini">
                <strong>{signal.title}</strong>
                <p className="muted">{signal.detail}</p>
              </article>
            ))}
          </div>
        </aside>
      </div>

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
                <p className="muted">{course.currentGrade} · {course.difficulty} difficulty</p>
                <span className={`risk-pill risk-pill-${course.risk}`}>{course.risk}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
