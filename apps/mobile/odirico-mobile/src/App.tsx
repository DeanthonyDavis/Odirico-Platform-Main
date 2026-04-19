import React, { useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  assignmentsDueSoon,
  budgetUtilization,
  courseLookup,
  currency,
  getOdiricoEcosystemSnapshot,
  goalCompletion,
  highestRiskCourses,
  percent,
} from "../../../../packages/core/src/ecosystem";

import { mobileTheme } from "./theme/tokens";

type ModuleKey = "overview" | "ember" | "sol" | "surge";

const snapshot = getOdiricoEcosystemSnapshot();
const courseMap = courseLookup(snapshot.ember);

const moduleMeta: Record<
  ModuleKey,
  { label: string; accent: string; subtitle: string }
> = {
  overview: {
    label: "Overview",
    accent: mobileTheme.colors.ink,
    subtitle: "One student operating system across school, money, and career.",
  },
  ember: {
    label: "Ember",
    accent: mobileTheme.colors.blue,
    subtitle: "Academic execution, study planning, and burnout-aware scheduling.",
  },
  sol: {
    label: "Sol",
    accent: mobileTheme.colors.gold,
    subtitle: "Financial direction, bills, and energy-aware life planning.",
  },
  surge: {
    label: "Surge",
    accent: mobileTheme.colors.accent,
    subtitle: "Applications, follow-ups, and recruiter memory that stays clean.",
  },
};

function ModuleChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.moduleChip, active ? styles.moduleChipActive : null]}
    >
      <Text style={[styles.moduleChipText, active ? styles.moduleChipTextActive : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

function SectionCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionStack}>{children}</View>
    </View>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricDetail}>{detail}</Text>
    </View>
  );
}

function ProgressBar({
  label,
  detail,
  fill,
}: {
  label: string;
  detail: string;
  fill: number;
}) {
  return (
    <View style={styles.progressRow}>
      <View style={styles.progressRowHead}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressDetail}>{detail}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, fill))}%` }]} />
      </View>
    </View>
  );
}

function renderOverview() {
  return (
    <>
      <View style={styles.metricGrid}>
        <MetricCard
          label="Momentum"
          value={String(snapshot.overview.momentumScore)}
          detail="Shared operating pulse"
        />
        <MetricCard
          label="Savings"
          value={percent(snapshot.sol.summary.savingsRate)}
          detail="Monthly buffer rate"
        />
        <MetricCard
          label="Due this week"
          value={String(snapshot.ember.summary.dueThisWeek)}
          detail="Academic deliverables"
        />
        <MetricCard
          label="Active applications"
          value={String(snapshot.surge.summary.activeApplications)}
          detail="Opportunity pipeline"
        />
      </View>

      <SectionCard eyebrow="Cross-app queue" title="What the system wants you to act on next">
        {snapshot.overview.crossAppSignals.map((signal) => (
          <View key={signal.id} style={styles.listCard}>
            <Text style={styles.listTitle}>{signal.title}</Text>
            <Text style={styles.listDetail}>{signal.detail}</Text>
            {signal.dueLabel ? <Text style={styles.listMeta}>{signal.dueLabel}</Text> : null}
          </View>
        ))}
      </SectionCard>

      <SectionCard eyebrow="Connector health" title="The connected systems behind the schedule">
        {snapshot.connectors.map((connector) => (
          <View key={connector.key} style={styles.listCard}>
            <Text style={styles.listTitle}>{connector.label}</Text>
            <Text style={styles.listDetail}>{connector.detail}</Text>
            <Text style={styles.listMeta}>{connector.status}</Text>
          </View>
        ))}
      </SectionCard>
    </>
  );
}

function renderEmber() {
  const dueSoon = assignmentsDueSoon(snapshot.ember);
  const risks = highestRiskCourses(snapshot.ember);

  return (
    <>
      <View style={styles.metricGrid}>
        <MetricCard
          label="Due this week"
          value={String(snapshot.ember.summary.dueThisWeek)}
          detail="Assignments and labs"
        />
        <MetricCard
          label="Upcoming exams"
          value={String(snapshot.ember.summary.upcomingExams)}
          detail="Prep windows active"
        />
        <MetricCard
          label="Study hours"
          value={String(snapshot.ember.summary.plannedStudyHours)}
          detail="Planned this week"
        />
        <MetricCard
          label="Completion"
          value={percent(snapshot.ember.summary.completionRate)}
          detail="Focus execution"
        />
      </View>

      <SectionCard eyebrow="Assignments" title="Academic workload sorted by time pressure">
        {dueSoon.map((assignment) => (
          <View key={assignment.id} style={styles.listCard}>
            <Text style={styles.listTitle}>{assignment.title}</Text>
            <Text style={styles.listDetail}>
              {courseMap.get(assignment.courseId)?.title || "Course"} - {assignment.estimatedHours}h - due {assignment.dueDate}
            </Text>
            <Text style={styles.listMeta}>
              {assignment.status.replace("-", " ")} - {assignment.weight}% weight
            </Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard eyebrow="Risk alerts" title="Where Ember sees academic danger">
        {risks.map((course) => (
          <View key={course.id} style={styles.listCard}>
            <Text style={styles.listTitle}>{course.title}</Text>
            <Text style={styles.listDetail}>{course.professor} - {course.currentGrade}</Text>
            <Text style={styles.listMeta}>{course.risk}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard eyebrow="Study planner" title="Placed blocks for the current week">
        {snapshot.ember.studyPlan.map((block) => (
          <View key={block.id} style={styles.listCard}>
            <Text style={styles.listTitle}>{block.title}</Text>
            <Text style={styles.listDetail}>
              {block.day} - {block.start}-{block.end}
            </Text>
            <Text style={styles.listMeta}>{block.focus}</Text>
          </View>
        ))}
      </SectionCard>
    </>
  );
}

function renderSol() {
  return (
    <>
      <View style={styles.metricGrid}>
        <MetricCard
          label="Net worth"
          value={currency(snapshot.sol.summary.netWorth)}
          detail="Current total position"
        />
        <MetricCard
          label="Income"
          value={currency(snapshot.sol.summary.monthlyIncome)}
          detail="Monthly inflow"
        />
        <MetricCard
          label="Savings rate"
          value={percent(snapshot.sol.summary.savingsRate)}
          detail="Month-to-date"
        />
        <MetricCard
          label="Credit utilization"
          value={percent(snapshot.sol.summary.creditUtilization)}
          detail="Credit health"
        />
      </View>

      <SectionCard eyebrow="Budget" title="Spend against plan">
        {snapshot.sol.budgets.map((category) => (
          <ProgressBar
            key={category.id}
            label={category.label}
            detail={`${currency(category.spent)} of ${currency(category.budget)}`}
            fill={budgetUtilization(category) * 100}
          />
        ))}
      </SectionCard>

      <SectionCard eyebrow="Goals" title="Long-range targets with visible pressure">
        {snapshot.sol.goals.map((goal) => (
          <View key={goal.id} style={styles.listCard}>
            <Text style={styles.listTitle}>{goal.title}</Text>
            <Text style={styles.listDetail}>
              {goal.unit === "$" ? currency(goal.current) : `${goal.current}${goal.unit}`} /{" "}
              {goal.unit === "$" ? currency(goal.target) : `${goal.target}${goal.unit}`}
            </Text>
            <Text style={styles.listMeta}>{Math.round(goalCompletion(goal) * 100)}% - {goal.deadline}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard eyebrow="Energy" title="Windows Ember can safely schedule against">
        {snapshot.sol.energyProfile.map((slot) => (
          <View key={`${slot.day}-${slot.block}`} style={styles.listCard}>
            <Text style={styles.listTitle}>{slot.day} - {slot.block}</Text>
            <Text style={styles.listDetail}>{slot.level} energy</Text>
          </View>
        ))}
      </SectionCard>
    </>
  );
}

function renderSurge() {
  return (
    <>
      <View style={styles.metricGrid}>
        <MetricCard
          label="Saved leads"
          value={String(snapshot.surge.summary.savedLeads)}
          detail="Open opportunity memory"
        />
        <MetricCard
          label="Active"
          value={String(snapshot.surge.summary.activeApplications)}
          detail="Current application loops"
        />
        <MetricCard
          label="Interviews"
          value={String(snapshot.surge.summary.interviews)}
          detail="Live interview flow"
        />
        <MetricCard
          label="Response rate"
          value={percent(snapshot.surge.analytics.responseRate)}
          detail="Current cycle"
        />
      </View>

      <SectionCard eyebrow="Pipeline" title="Applications that still need motion">
        {snapshot.surge.applications.map((application) => (
          <View key={application.id} style={styles.listCard}>
            <Text style={styles.listTitle}>{application.company} - {application.role}</Text>
            <Text style={styles.listDetail}>{application.location} - {application.source}</Text>
            <Text style={styles.listMeta}>
              {application.status} - {application.nextAction} - {application.nextActionDate}
            </Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard eyebrow="Analytics" title="Career momentum, not just record keeping">
        <ProgressBar
          label="Interview rate"
          detail={`${snapshot.surge.analytics.interviewRate}% of applications`}
          fill={snapshot.surge.analytics.interviewRate}
        />
        <ProgressBar
          label="Response rate"
          detail={`${snapshot.surge.analytics.responseRate}% received replies`}
          fill={snapshot.surge.analytics.responseRate}
        />
        <ProgressBar
          label="Applications this month"
          detail={`${snapshot.surge.analytics.applicationsThisMonth} total`}
          fill={(snapshot.surge.analytics.applicationsThisMonth / 20) * 100}
        />
      </SectionCard>
    </>
  );
}

export function App() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("overview");
  const meta = moduleMeta[activeModule];
  const heroValue =
    activeModule === "overview"
      ? `${snapshot.overview.momentumScore}`
      : activeModule === "ember"
        ? `${snapshot.ember.summary.dueThisWeek}`
        : activeModule === "sol"
          ? currency(snapshot.sol.summary.netWorth)
          : `${snapshot.surge.summary.activeApplications}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.appShell}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.heroCard, { borderColor: meta.accent }]}>
            <Text style={styles.eyebrow}>Odirico Mobile</Text>
            <Text style={styles.heroTitle}>{meta.label}</Text>
            <Text style={styles.heroValue}>{heroValue}</Text>
            <Text style={styles.heroBody}>{meta.subtitle}</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moduleRow}
          >
            {(
              [
                ["overview", "Overview"],
                ["ember", "Ember"],
                ["sol", "Sol"],
                ["surge", "Surge"],
              ] satisfies ReadonlyArray<[ModuleKey, string]>
            ).map(([key, label]) => (
              <ModuleChip
                key={key}
                active={activeModule === key}
                label={label}
                onPress={() => setActiveModule(key)}
              />
            ))}
          </ScrollView>

          {activeModule === "overview" ? renderOverview() : null}
          {activeModule === "ember" ? renderEmber() : null}
          {activeModule === "sol" ? renderSol() : null}
          {activeModule === "surge" ? renderSurge() : null}
        </ScrollView>

        <View style={styles.bottomBar}>
          {(
            [
              ["overview", "Home"],
              ["ember", "Study"],
              ["sol", "Money"],
              ["surge", "Career"],
            ] satisfies ReadonlyArray<[ModuleKey, string]>
          ).map(([key, label]) => (
            <Pressable
              key={key}
              onPress={() => setActiveModule(key)}
              style={styles.bottomTab}
            >
              <Text style={[styles.bottomTabText, activeModule === key ? styles.bottomTabTextActive : null]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: mobileTheme.colors.bg,
  },
  appShell: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: Platform.select({ ios: 10, android: 8, default: 10 }),
    paddingBottom: 120,
    gap: 16,
  },
  heroCard: {
    borderRadius: mobileTheme.radius.lg,
    padding: 22,
    backgroundColor: mobileTheme.colors.surfaceStrong,
    borderWidth: 1.5,
    shadowColor: "#161311",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: mobileTheme.colors.muted,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "700",
    color: mobileTheme.colors.ink,
  },
  heroValue: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "700",
    color: mobileTheme.colors.accentStrong,
  },
  heroBody: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: mobileTheme.colors.inkSoft,
  },
  moduleRow: {
    gap: 10,
    paddingVertical: 4,
  },
  moduleChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: mobileTheme.colors.line,
  },
  moduleChipActive: {
    backgroundColor: mobileTheme.colors.ink,
    borderColor: mobileTheme.colors.ink,
  },
  moduleChipText: {
    color: mobileTheme.colors.inkSoft,
    fontSize: 14,
    fontWeight: "700",
  },
  moduleChipTextActive: {
    color: mobileTheme.colors.white,
  },
  metricGrid: {
    gap: 12,
  },
  metricCard: {
    borderRadius: mobileTheme.radius.md,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.84)",
    borderWidth: 1,
    borderColor: mobileTheme.colors.line,
  },
  metricLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: mobileTheme.colors.muted,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700",
    color: mobileTheme.colors.ink,
    marginBottom: 6,
  },
  metricDetail: {
    fontSize: 14,
    lineHeight: 20,
    color: mobileTheme.colors.inkSoft,
  },
  sectionCard: {
    borderRadius: mobileTheme.radius.md,
    padding: 18,
    backgroundColor: mobileTheme.colors.surfaceStrong,
    borderWidth: 1,
    borderColor: mobileTheme.colors.line,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
    color: mobileTheme.colors.ink,
  },
  sectionStack: {
    gap: 10,
  },
  listCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.74)",
    borderWidth: 1,
    borderColor: mobileTheme.colors.line,
    gap: 6,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: mobileTheme.colors.ink,
  },
  listDetail: {
    fontSize: 14,
    lineHeight: 20,
    color: mobileTheme.colors.inkSoft,
  },
  listMeta: {
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: mobileTheme.colors.mutedStrong,
  },
  progressRow: {
    gap: 8,
  },
  progressRowHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: mobileTheme.colors.ink,
  },
  progressDetail: {
    fontSize: 13,
    color: mobileTheme.colors.muted,
  },
  progressTrack: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(22,19,17,0.08)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: mobileTheme.colors.accent,
  },
  bottomBar: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: Platform.select({ ios: 18, android: 14, default: 18 }),
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    padding: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,250,244,0.96)",
    borderWidth: 1,
    borderColor: mobileTheme.colors.line,
    shadowColor: "#161311",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  bottomTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  bottomTabText: {
    color: mobileTheme.colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  bottomTabTextActive: {
    color: mobileTheme.colors.ink,
  },
});
