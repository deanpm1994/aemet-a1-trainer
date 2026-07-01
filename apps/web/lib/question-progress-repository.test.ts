import { describe, expect, it, vi } from "vitest";

import {
  getQuestionProgress,
  saveQuestionProgress,
} from "./question-progress-repository";

describe("question progress repository", () => {
  it("loads progress rows for the current user", async () => {
    const order = vi.fn().mockResolvedValue({
      data: [
        {
          user_id: "user-1",
          question_id: "q-met-thermo-01",
          attempts_count: 2,
          last_attempt_at: "2026-07-01",
          next_review_at: "2026-07-04",
          mistake_types: ["concept"],
          created_at: "2026-07-01T08:00:00.000Z",
          updated_at: "2026-07-01T08:00:00.000Z",
        },
      ],
      error: null,
    });
    const eq = vi.fn(() => ({ order }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));

    await expect(getQuestionProgress({ from } as never, "user-1")).resolves.toEqual([
      {
        questionId: "q-met-thermo-01",
        attemptsCount: 2,
        lastAttemptAt: "2026-07-01",
        nextReviewAt: "2026-07-04",
        mistakeTypes: ["concept"],
      },
    ]);

    expect(from).toHaveBeenCalledWith("question_progress");
    expect(eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(order).toHaveBeenCalledWith("question_id", { ascending: true });
  });

  it("upserts one question progress record for the current user", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn(() => ({ upsert }));

    await saveQuestionProgress({ from } as never, "user-1", "q-met-thermo-01", {
      attemptsCount: 3,
      lastAttemptAt: "2026-07-02",
      nextReviewAt: "2026-07-06",
      mistakeTypes: ["concept", "reading"],
    });

    expect(upsert).toHaveBeenCalledWith(
      {
        user_id: "user-1",
        question_id: "q-met-thermo-01",
        attempts_count: 3,
        last_attempt_at: "2026-07-02",
        next_review_at: "2026-07-06",
        mistake_types: ["concept", "reading"],
      },
      { onConflict: "user_id,question_id" },
    );
  });

  it("throws Supabase errors instead of swallowing them", async () => {
    const error = new Error("database unavailable");
    const order = vi.fn().mockResolvedValue({ data: null, error });
    const eq = vi.fn(() => ({ order }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));

    await expect(getQuestionProgress({ from } as never, "user-1")).rejects.toThrow(
      "database unavailable",
    );
  });
});
