import { describe, expect, it, vi } from "vitest";

import { getVerifiedCanonicalQuestions } from "./canonical-questions-repository";

describe("canonical questions repository", () => {
  it("reads official and reviewed didactic questions for the shared practice bank", async () => {
    const secondOrder = vi.fn(() => ({ data: [], error: null }));
    const firstOrder = vi.fn(() => ({ order: secondOrder }));
    const select = vi.fn(() => ({ order: firstOrder }));
    const from = vi.fn(() => ({ select }));

    await expect(getVerifiedCanonicalQuestions({ from } as never)).resolves.toEqual([]);
    expect(from).toHaveBeenCalledWith("questions");
    expect(firstOrder).toHaveBeenCalledWith("source_year", { ascending: false });
    expect(secondOrder).toHaveBeenCalledWith("question_number", { ascending: true });
  });
});
