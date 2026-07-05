import { describe, expect, it } from "vitest";

import { buildFocusProgressUpdates } from "./focus-progress";
import type { Question, StudySession, Topic } from "./types";

const completedSession: StudySession = {
  id: "session-1",
  name: "Thermodynamics practice",
  sessionType: "questions",
  objective: "Solve stability questions",
  topicIds: ["met-01"],
  questionIds: ["q-met-thermo-01"],
  plannedDate: "2026-07-01",
  plannedStartTime: "09:10",
  plannedEndTime: "10:10",
  plannedDurationMinutes: 60,
  status: "completed",
  timerStatus: "finished",
  completed: true,
  reviewState: "done",
  notesCreated: true,
  questionsSolved: 1,
  flashcardsCreated: 0,
  mistakesLogged: 1,
  confidenceAfter: 4,
  nextReviewAt: "2026-07-08",
  notes: "Finished the stability set.",
  isTemplate: false,
  isPersisted: true,
};

const sourceTopic: Topic = {
  id: "met-01",
  block: "Meteorology",
  officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
  officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
  normalizedTitle: "Atmospheric thermodynamics",
  status: "in_progress",
  confidence: 2,
  priority: "high",
  nextReviewAt: "2026-07-01",
  verificationStatus: "needs_review",
  sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
  retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
  notesStatus: "Outline drafted",
};

const sourceQuestion: Question = {
  id: "q-met-thermo-01",
  name: "Atmospheric stability basics",
  type: "multiple_choice",
  sourceYear: 2024,
  sourceExam: "Mock AEMET A1 set",
  sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
  retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
  verificationStatus: "unverified",
  questionNumber: "1",
  statement: "Which process increases relative humidity?",
  options: ["A", "B"],
  correctAnswer: "B",
  answerSourceStatus: "inferred",
  explanation: "Cooling raises RH if vapor content is fixed.",
  topicIds: ["met-01"],
  difficulty: 2,
  attemptsCount: 2,
  lastAttemptAt: "2026-06-28",
  nextReviewAt: "2026-07-01",
  mistakeTypes: ["concept"],
};

describe("focus progress", () => {
  it("does not build progress updates for incomplete sessions", () => {
    expect(
      buildFocusProgressUpdates(
        {
          ...completedSession,
          status: "ready_for_review",
          completed: false,
        },
        {
          topics: [sourceTopic],
          questions: [sourceQuestion],
          topicProgress: [],
          questionProgress: [],
        },
      ),
    ).toEqual({
      topicUpdates: [],
      questionUpdates: [],
    });
  });

  it("builds topic and question progress updates from a completed focus session", () => {
    expect(
      buildFocusProgressUpdates(completedSession, {
        topics: [sourceTopic],
        questions: [sourceQuestion],
        topicProgress: [],
        questionProgress: [],
      }),
    ).toEqual({
      topicUpdates: [
        {
          topicId: "met-01",
          status: "reviewed",
          confidence: 4,
          priority: "high",
          nextReviewAt: "2026-07-08",
          notesStatus: "Notas de sesión creadas",
        },
      ],
      questionUpdates: [
        {
          questionId: "q-met-thermo-01",
          attemptsCount: 3,
          lastAttemptAt: "2026-07-01",
          nextReviewAt: "2026-07-08",
          mistakeTypes: ["concept", "time_management"],
        },
      ],
    });
  });

  it("preserves exam-ready topic status and existing priority", () => {
    expect(
      buildFocusProgressUpdates(completedSession, {
        topics: [sourceTopic],
        questions: [sourceQuestion],
        topicProgress: [
          {
            topicId: "met-01",
            status: "exam_ready",
            confidence: 5,
            priority: "medium",
            nextReviewAt: "2026-07-20",
            notesStatus: "Complete",
          },
        ],
        questionProgress: [],
      }).topicUpdates,
    ).toEqual([
      {
        topicId: "met-01",
        status: "exam_ready",
        confidence: 4,
        priority: "medium",
        nextReviewAt: "2026-07-08",
        notesStatus: "Notas de sesión creadas",
      },
    ]);
  });
});
