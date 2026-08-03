import { describe, expect, it, vi } from "vitest";

import { getQuestionAttempts, saveQuestionAttempt } from "./question-attempts-repository";

describe("question attempts repository", () => {
  it("loads attempts for one user and question", async () => {
    const order = vi.fn().mockResolvedValue({
      data: [
        {
          id: "attempt-1",
          user_id: "user-1",
          question_id: "q-met-thermo-01",
          attempted_at: "2026-07-01",
          selected_answer: "B",
          is_correct: false,
          mistake_types: ["concept"],
          confidence_after: 2,
          notes: "Needs review.",
          created_at: "2026-07-01T08:00:00.000Z",
        },
      ],
      error: null,
    });
    const eqQuestion = vi.fn(() => ({ order }));
    const eqUser = vi.fn(() => ({ eq: eqQuestion }));
    const select = vi.fn(() => ({ eq: eqUser }));
    const from = vi.fn(() => ({ select }));

    await expect(
      getQuestionAttempts({ from } as never, "user-1", "q-met-thermo-01"),
    ).resolves.toEqual([
      {
        id: "attempt-1",
        userId: "user-1",
        questionId: "q-met-thermo-01",
        attemptedAt: "2026-07-01",
        selectedAnswer: "B",
        isCorrect: false,
        mistakeTypes: ["concept"],
        confidenceAfter: 2,
        notes: "Needs review.",
        draftResponse: "",
        selfAssessment: "ungraded",
      },
    ]);

    expect(from).toHaveBeenCalledWith("question_attempts");
    expect(eqUser).toHaveBeenCalledWith("user_id", "user-1");
    expect(eqQuestion).toHaveBeenCalledWith("question_id", "q-met-thermo-01");
    expect(order).toHaveBeenCalledWith("attempted_at", { ascending: true });
  });

  it("inserts an attempt for the current user", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn(() => ({ insert }));

    await saveQuestionAttempt({ from } as never, "user-1", {
      questionId: "q-met-thermo-01",
      attemptedAt: "2026-07-02",
      selectedAnswer: "A",
      isCorrect: true,
      mistakeTypes: ["none"],
      confidenceAfter: 4,
      notes: "",
      draftResponse: "",
      selfAssessment: "ungraded",
    });

    expect(insert).toHaveBeenCalledWith({
      user_id: "user-1",
      question_id: "q-met-thermo-01",
      attempted_at: "2026-07-02",
      selected_answer: "A",
      is_correct: true,
      mistake_types: ["none"],
      confidence_after: 4,
      notes: "",
      draft_response: "",
      self_assessment: "ungraded",
    });
  });

  it("throws Supabase errors instead of swallowing them", async () => {
    const error = new Error("database unavailable");
    const order = vi.fn().mockResolvedValue({ data: null, error });
    const eqQuestion = vi.fn(() => ({ order }));
    const eqUser = vi.fn(() => ({ eq: eqQuestion }));
    const select = vi.fn(() => ({ eq: eqUser }));
    const from = vi.fn(() => ({ select }));

    await expect(
      getQuestionAttempts({ from } as never, "user-1", "q-met-thermo-01"),
    ).rejects.toThrow("database unavailable");
  });
});
