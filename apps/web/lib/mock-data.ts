import type { DashboardMetric, RouteCard, StudyMission, TopicSummary } from "@/lib/types";

export const routeCards: RouteCard[] = [
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Morning mission, weekly hours, progress, and monitoring status.",
  },
  {
    href: "/topics",
    title: "Topics",
    description: "Official syllabus checklist placeholder with mock unverified items.",
  },
  {
    href: "/questions",
    title: "Questions",
    description: "Practice bank placeholder for past exams and practical cases.",
  },
  {
    href: "/calendar",
    title: "Calendar",
    description: "Study planning around the fixed 12:30–23:00 work schedule.",
  },
  {
    href: "/focus",
    title: "Focus",
    description: "Timeboxed sessions with defined outputs and review decisions.",
  },
  {
    href: "/monitoring",
    title: "Monitoring",
    description: "Manual BOE/AEMET monitoring status until automation exists.",
  },
  {
    href: "/settings",
    title: "Settings",
    description: "Future profile, integrations, verification, and reminders setup.",
  },
];

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "Weekly study target",
    value: "8.5 h",
    detail: "Mock target based on three morning blocks across five weekdays.",
  },
  {
    label: "Topics touched",
    value: "3 / 127",
    detail: "Mock progress only. Exact syllabus wording is TODO_VERIFY_OFFICIAL_SOURCE.",
  },
  {
    label: "Countdown status",
    value: "Pending official verification",
    detail: "No future opening dates are assumed in the current scaffold.",
  },
  {
    label: "Monitoring",
    value: "Manual only",
    detail: "Automation is not implemented yet.",
  },
];

export const studyMission: StudyMission = {
  mainTopic: "07:30–09:00 deep technical topic",
  practiceBlock: "09:10–10:10 questions or practical case",
  reviewBlock: "10:20–11:00 legal, informatics or flashcards",
  output: "Update confidence, log mistakes, and define the next review date.",
};

export const topicSummaries: TopicSummary[] = [
  {
    id: "math-01",
    block: "Mathematics",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortTitle: "Calculus foundations",
    status: "in_progress",
    confidence: 2,
    priority: "high",
    nextReviewAt: "Pending schedule",
    verificationStatus: "unverified",
  },
  {
    id: "met-01",
    block: "Meteorology and Climatology",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortTitle: "Atmospheric thermodynamics",
    status: "not_started",
    confidence: 1,
    priority: "high",
    nextReviewAt: "Pending schedule",
    verificationStatus: "needs_review",
  },
  {
    id: "gen-01",
    block: "General/Common",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortTitle: "Spanish public administration basics",
    status: "first_pass",
    confidence: 3,
    priority: "medium",
    nextReviewAt: "Next weekday review block",
    verificationStatus: "unverified",
  },
];
