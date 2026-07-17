import { describe, expect, it, vi } from "vitest";

import { getVerifiedCanonicalQuestions } from "./canonical-questions-repository";

describe("canonical questions repository", () => {
  it("reads official historic questions only", async () => {
    const order = vi
      .fn()
      .mockReturnValueOnce({ order: vi.fn(() => ({ data: [], error: null })) });
    const eq = vi.fn(() => ({ order }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));

    await expect(getVerifiedCanonicalQuestions({ from } as never)).resolves.toEqual([]);
    expect(from).toHaveBeenCalledWith("questions");
    expect(eq).toHaveBeenCalledWith("origin", "official_historic");
  });
});
