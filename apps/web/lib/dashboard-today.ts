import { getNextFocusSession } from "./focus-planner";
import { buildMonitoringSummary } from "./monitoring";
import { getOverdueQuestions } from "./question-bank";
import { selectWeakTopics } from "./topic-progress";
import type {
  MonitoringEvent,
  MonitoringSource,
  MonitoringSummary,
  Question,
  StudySession,
  Topic,
  TopicWeakness,
} from "./types";

export type TodayDashboardAction = {
  href: string;
  label: string;
  detail: string;
};

export type TodayDashboard = {
  nextSession: StudySession | undefined;
  weakTopics: TopicWeakness[];
  overdueQuestions: Question[];
  monitoringSummary: MonitoringSummary;
  primaryAction: TodayDashboardAction;
};

type TodayDashboardInput = {
  sessions: StudySession[];
  topics: Topic[];
  questions: Question[];
  monitoringSources: MonitoringSource[];
  monitoringEvents: MonitoringEvent[];
  today: string;
};

function buildPrimaryAction(
  nextSession: StudySession | undefined,
  overdueQuestions: Question[],
): TodayDashboardAction {
  if (nextSession) {
    return {
      href: "/focus",
      label: "Open focus session",
      detail: `${nextSession.plannedStartTime} ${nextSession.name}`,
    };
  }

  if (overdueQuestions.length > 0) {
    return {
      href: "/questions",
      label: "Review overdue questions",
      detail: `${overdueQuestions.length} question${
        overdueQuestions.length === 1 ? "" : "s"
      } due`,
    };
  }

  return {
    href: "/topics",
    label: "Review weak topics",
    detail: "No focus session queued",
  };
}

export function buildTodayDashboard({
  sessions,
  topics,
  questions,
  monitoringSources,
  monitoringEvents,
  today,
}: TodayDashboardInput): TodayDashboard {
  const nextSession = getNextFocusSession(sessions);
  const overdueQuestions = getOverdueQuestions(questions, today);

  return {
    nextSession,
    weakTopics: selectWeakTopics(topics),
    overdueQuestions,
    monitoringSummary: buildMonitoringSummary(monitoringSources, monitoringEvents),
    primaryAction: buildPrimaryAction(nextSession, overdueQuestions),
  };
}
