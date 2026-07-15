import { describe, expect, it, vi } from "vitest";

import { getHiddenQuestionIds, hideQuestion } from "./hidden-questions-repository";

describe("hidden questions repository", () => {
  it("reads only the signed-in user's hidden ids", async () => {
    const eq = vi.fn(async () => ({ data: [{ question_id: "q-1" }], error: null }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));
    await expect(getHiddenQuestionIds({ from }, "user-1")).resolves.toEqual(["q-1"]);
    expect(eq).toHaveBeenCalledWith("user_id", "user-1");
  });

  it("upserts a question under its owning user", async () => {
    const upsert = vi.fn(async () => ({ error: null }));
    const from = vi.fn(() => ({ upsert }));
    await hideQuestion({ from }, "user-1", "q-1");
    expect(upsert).toHaveBeenCalledWith(
      { user_id: "user-1", question_id: "q-1" },
      { onConflict: "user_id,question_id" },
    );
  });
});
