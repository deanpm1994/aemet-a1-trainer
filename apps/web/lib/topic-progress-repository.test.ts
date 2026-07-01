import { describe, expect, it, vi } from "vitest";

import {
  getTopicProgress,
  saveTopicProgress,
} from "./topic-progress-repository";

describe("topic progress repository", () => {
  it("loads progress rows for the current user", async () => {
    const order = vi.fn().mockResolvedValue({
      data: [
        {
          user_id: "user-1",
          topic_id: "met-01",
          status: "in_progress",
          confidence: 3,
          priority: "high",
          next_review_at: "2026-07-05",
          notes_status: "Outline drafted",
          created_at: "2026-07-01T08:00:00.000Z",
          updated_at: "2026-07-01T08:00:00.000Z",
        },
      ],
      error: null,
    });
    const eq = vi.fn(() => ({ order }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));

    await expect(getTopicProgress({ from } as never, "user-1")).resolves.toEqual([
      {
        topicId: "met-01",
        status: "in_progress",
        confidence: 3,
        priority: "high",
        nextReviewAt: "2026-07-05",
        notesStatus: "Outline drafted",
      },
    ]);

    expect(from).toHaveBeenCalledWith("topic_progress");
    expect(eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(order).toHaveBeenCalledWith("topic_id", { ascending: true });
  });

  it("upserts one topic progress record for the current user", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn(() => ({ upsert }));

    await saveTopicProgress({ from } as never, "user-1", "met-01", {
      status: "reviewed",
      confidence: 4,
      priority: "medium",
      nextReviewAt: "2026-07-10",
      notesStatus: "Needs formula drill",
    });

    expect(upsert).toHaveBeenCalledWith(
      {
        user_id: "user-1",
        topic_id: "met-01",
        status: "reviewed",
        confidence: 4,
        priority: "medium",
        next_review_at: "2026-07-10",
        notes_status: "Needs formula drill",
      },
      { onConflict: "user_id,topic_id" },
    );
  });

  it("throws Supabase errors instead of swallowing them", async () => {
    const error = new Error("database unavailable");
    const order = vi.fn().mockResolvedValue({ data: null, error });
    const eq = vi.fn(() => ({ order }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));

    await expect(getTopicProgress({ from } as never, "user-1")).rejects.toThrow(
      "database unavailable",
    );
  });
});
