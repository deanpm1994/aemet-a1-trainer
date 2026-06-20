import type { DashboardMetric, RouteCard, StudyMission, Topic } from "./types";

import { countExamReadyTopics, countTouchedTopics } from "./topic-progress";

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
    description: "Study planning around the fixed 12:30-23:00 work schedule.",
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

export const studyMission: StudyMission = {
  mainTopic: "07:30-09:00 deep technical topic",
  practiceBlock: "09:10-10:10 questions or practical case",
  reviewBlock: "10:20-11:00 legal, informatics or flashcards",
  output: "Update confidence, log mistakes, and define the next review date.",
};

export const topics: Topic[] = [
  {
    id: "math-01",
    block: "Mathematics",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
    normalizedTitle: "Calculus foundations",
    status: "in_progress",
    confidence: 2,
    priority: "high",
    nextReviewAt: "2026-06-21",
    verificationStatus: "unverified",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortDescription: "Limits, derivatives, and integration fundamentals.",
    studyFocus: "Rebuild confidence with core formulas and worked examples.",
    relatedQuestionCount: 0,
    notesStatus: "No notes yet",
  },
  {
    id: "met-01",
    block: "Meteorology and Climatology",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
    normalizedTitle: "Atmospheric thermodynamics",
    status: "not_started",
    confidence: 1,
    priority: "high",
    nextReviewAt: "Pending schedule",
    verificationStatus: "needs_review",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortDescription: "Thermodynamic variables and parcel processes.",
    studyFocus: "Map the chapter before starting question practice.",
    relatedQuestionCount: 0,
    notesStatus: "No notes yet",
  },
  {
    id: "inf-01",
    block: "Informatics and Communications",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
    normalizedTitle: "Computer networks and protocols",
    status: "reviewed",
    confidence: 4,
    priority: "medium",
    nextReviewAt: "2026-06-23",
    verificationStatus: "unverified",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortDescription: "Networking layers, addressing, and communication models.",
    studyFocus: "Keep protocol families and examples fresh.",
    relatedQuestionCount: 0,
    notesStatus: "Flashcards started",
  },
  {
    id: "gen-01",
    block: "General/Common",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
    normalizedTitle: "Spanish public administration basics",
    status: "first_pass",
    confidence: 3,
    priority: "medium",
    nextReviewAt: "Next weekday review block",
    verificationStatus: "unverified",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortDescription: "State structure and public-sector fundamentals.",
    studyFocus: "Link constitutional structure to common exam prompts.",
    relatedQuestionCount: 0,
    notesStatus: "Outline complete",
  },
];

export function buildDashboardMetrics(): DashboardMetric[] {
  return [
    {
      label: "Weekly study target",
      value: "8.5 h",
      detail: "Mock target based on three morning blocks across five weekdays.",
    },
    {
      label: "Topics touched",
      value: `${countTouchedTopics(topics)} / ${topics.length}`,
      detail: "Mock progress only. Exact syllabus wording is TODO_VERIFY_OFFICIAL_SOURCE.",
    },
    {
      label: "Exam-ready topics",
      value: `${countExamReadyTopics(topics)}`,
      detail: "Read-only Phase 1 data derived from the shared topic checklist.",
    },
    {
      label: "Monitoring",
      value: "Manual only",
      detail: "Automation is not implemented yet.",
    },
  ];
}
