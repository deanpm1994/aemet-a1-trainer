import { describe, expect, it } from "vitest";

import { questions, routeCards } from "./mock-data";

describe("question fixtures", () => {
  it("exposes a non-empty question bank fixture list", () => {
    expect(questions.length).toBeGreaterThan(0);
  });

  it("includes source and verification metadata for every question", () => {
    expect(questions.every((question) => question.sourceUrl.length > 0)).toBe(true);
    expect(questions.every((question) => question.retrievedAt.length > 0)).toBe(true);
    expect(questions.every((question) => question.verificationStatus.length > 0)).toBe(true);
  });

  it("keeps TODO_VERIFY_OFFICIAL_SOURCE markers in unverified fixtures", () => {
    expect(
      questions.some(
        (question) =>
          question.verificationStatus !== "verified" &&
          question.sourceUrl === "TODO_VERIFY_OFFICIAL_SOURCE",
      ),
    ).toBe(true);
  });

  it("updates the questions route card to describe a real question bank", () => {
    expect(routeCards.find((card) => card.href === "/questions")?.description).toContain(
      "Read-only question bank",
    );
  });
});
