import { describe, expect, it, vi } from "vitest";

import { getVerifiedCanonicalQuestions } from "./canonical-questions-repository";

describe("canonical questions repository", () => {
  it("reads official historic and reviewed didactic questions", async () => {
    const order = vi
      .fn()
      .mockReturnValueOnce({ order: vi.fn(() => ({ data: [], error: null })) });
    const inFilter = vi.fn(() => ({ order }));
    const select = vi.fn(() => ({ in: inFilter }));
    const from = vi.fn(() => ({ select }));

    await expect(getVerifiedCanonicalQuestions({ from } as never)).resolves.toEqual([]);
    expect(from).toHaveBeenCalledWith("questions");
    expect(inFilter).toHaveBeenCalledWith("origin", ["official_historic", "didactic_reviewed"]);
  });
});
