import { describe, expect, it } from "vitest";

import {
  buildQuestionProgressFromAttempts,
  mapQuestionAttemptInputToRowInput,
  mapRowToQuestionAttempt,
  type QuestionAttemptInput,
  type QuestionAttemptRow,
} from "./question-attempts";

const attemptRow: QuestionAttemptRow = {
  id: "attempt-1",
  user_id: "user-1",
  question_id: "q-met-thermo-01",
  attempted_at: "2026-07-01",
  selected_answer: "B",
  is_correct: false,
  mistake_types: ["concept", "reading"],
  confidence_after: 2,
  notes: "Mixed up stability criteria.",
  created_at: "2026-07-01T08:00:00.000Z",
};

describe("question attempts", () => {
  it("maps Supabase rows to app-level attempts", () => {
    expect(mapRowToQuestionAttempt(attemptRow)).toEqual({
      id: "attempt-1",
      userId: "user-1",
      questionId: "q-met-thermo-01",
      attemptedAt: "2026-07-01",
      selectedAnswer: "B",
      isCorrect: false,
      mistakeTypes: ["concept", "reading"],
      confidenceAfter: 2,
      notes: "Mixed up stability criteria.",
    });
  });

  it("maps attempt form input to a user-scoped row input", () => {
    const input: QuestionAttemptInput = {
      questionId: "q-met-thermo-01",
      attemptedAt: "2026-07-02",
      selectedAnswer: "A",
      isCorrect: true,
      mistakeTypes: ["none"],
      confidenceAfter: 4,
      notes: "Understood after checking hydrostatic balance.",
    };

    expect(mapQuestionAttemptInputToRowInput("user-1", input)).toEqual({
      user_id: "user-1",
      question_id: "q-met-thermo-01",
      attempted_at: "2026-07-02",
      selected_answer: "A",
      is_correct: true,
      mistake_types: ["none"],
      confidence_after: 4,
      notes: "Understood after checking hydrostatic balance.",
    });
  });

  it("derives question progress from attempt history", () => {
    expect(
      buildQuestionProgressFromAttempts("q-met-thermo-01", [
        {
          ...mapRowToQuestionAttempt(attemptRow),
          attemptedAt: "2026-07-01",
        },
        {
          ...mapRowToQuestionAttempt(attemptRow),
          id: "attempt-2",
          attemptedAt: "2026-07-03",
          selectedAnswer: "A",
          isCorrect: true,
          mistakeTypes: ["none"],
          confidenceAfter: 4,
          notes: "",
        },
      ]),
    ).toEqual({
      questionId: "q-met-thermo-01",
      attemptsCount: 2,
      lastAttemptAt: "2026-07-03",
      nextReviewAt: "2026-07-17",
      mistakeTypes: ["none"],
    });
  });

  it("keeps a short review interval after incorrect attempts", () => {
    expect(
      buildQuestionProgressFromAttempts("q-met-thermo-01", [
        mapRowToQuestionAttempt(attemptRow),
      ]),
    ).toEqual({
      questionId: "q-met-thermo-01",
      attemptsCount: 1,
      lastAttemptAt: "2026-07-01",
      nextReviewAt: "2026-07-03",
      mistakeTypes: ["concept", "reading"],
    });
  });
});
