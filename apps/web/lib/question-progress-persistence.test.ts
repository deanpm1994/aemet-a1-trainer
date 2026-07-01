import { describe, expect, it } from "vitest";

import type { Question } from "./types";
import {
  applyQuestionProgress,
  mapQuestionProgressUpdateToRowInput,
  mapRowToQuestionProgressUpdate,
  type QuestionProgressRow,
} from "./question-progress-persistence";

const question: Question = {
  id: "q-met-thermo-01",
  name: "Atmospheric stability basics",
  type: "multiple_choice",
  sourceYear: 2024,
  sourceExam: "TODO_VERIFY_OFFICIAL_SOURCE",
  sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
  retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
  verificationStatus: "needs_review",
  questionNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
  statement: "Which parcel is conditionally unstable?",
  options: ["A", "B"],
  correctAnswer: "TODO_VERIFY_OFFICIAL_SOURCE",
  answerSourceStatus: "unknown",
  explanation: "Pending verified explanation.",
  topicIds: ["met-01"],
  difficulty: 3,
  attemptsCount: 0,
  lastAttemptAt: "",
  nextReviewAt: "",
  mistakeTypes: ["none"],
};

const row: QuestionProgressRow = {
  user_id: "user-1",
  question_id: "q-met-thermo-01",
  attempts_count: 2,
  last_attempt_at: "2026-07-01",
  next_review_at: "2026-07-04",
  mistake_types: ["concept"],
  created_at: "2026-07-01T08:00:00.000Z",
  updated_at: "2026-07-01T08:00:00.000Z",
};

describe("question progress persistence", () => {
  it("maps Supabase rows to app-level question progress updates", () => {
    expect(mapRowToQuestionProgressUpdate(row)).toEqual({
      questionId: "q-met-thermo-01",
      attemptsCount: 2,
      lastAttemptAt: "2026-07-01",
      nextReviewAt: "2026-07-04",
      mistakeTypes: ["concept"],
    });
  });

  it("maps question progress updates to user-scoped row inputs", () => {
    expect(
      mapQuestionProgressUpdateToRowInput("user-1", "q-met-thermo-01", {
        attemptsCount: 3,
        lastAttemptAt: "2026-07-02",
        nextReviewAt: "2026-07-06",
        mistakeTypes: ["formula", "time_management"],
      }),
    ).toEqual({
      user_id: "user-1",
      question_id: "q-met-thermo-01",
      attempts_count: 3,
      last_attempt_at: "2026-07-02",
      next_review_at: "2026-07-06",
      mistake_types: ["formula", "time_management"],
    });
  });

  it("overlays user progress without changing source question metadata", () => {
    expect(
      applyQuestionProgress([question], [
        {
          questionId: "q-met-thermo-01",
          attemptsCount: 4,
          lastAttemptAt: "2026-07-03",
          nextReviewAt: "2026-07-08",
          mistakeTypes: ["concept", "reading"],
        },
      ]),
    ).toEqual([
      {
        ...question,
        attemptsCount: 4,
        lastAttemptAt: "2026-07-03",
        nextReviewAt: "2026-07-08",
        mistakeTypes: ["concept", "reading"],
      },
    ]);
  });

  it("ignores progress rows for questions not present in the source list", () => {
    expect(
      applyQuestionProgress([question], [
        {
          questionId: "unknown-question",
          attemptsCount: 9,
          lastAttemptAt: "2026-07-03",
          nextReviewAt: "2026-07-08",
          mistakeTypes: ["reading"],
        },
      ]),
    ).toEqual([question]);
  });
});
