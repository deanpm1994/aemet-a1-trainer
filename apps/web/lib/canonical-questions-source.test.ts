import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { loadOfficialPastExamSubset } from "./official-past-exam-subset";
import { loadCanonicalQuestionsSource } from "./canonical-questions-source";

const fallback = loadOfficialPastExamSubset();

if (!fallback.ok) {
  throw new Error("Expected checked-in verified past-exam questions");
}
describe("loadCanonicalQuestionsSource", () => {
  it("returns all 54 verified Supabase questions when canonical query succeeds", async () => {
    const result = await loadCanonicalQuestionsSource({
      createClient: async () => ({}),
      loadQuestions: async () => fallback.questions,
    });

    expect(result.sourceState).toBe("live");
    expect(result.questions).toHaveLength(54);
    expect(result.inventoryQuestions).toHaveLength(54);
    expect(new Set(result.questions.map((question) => question.id)).size).toBe(54);
  });

  it("serves the checked-in verified historical fallback when Supabase fails", async () => {
    const result = await loadCanonicalQuestionsSource({
      createClient: async () => ({}),
      loadQuestions: async () => {
        throw new Error("Supabase unavailable");
      },
    });

    expect(result.sourceState).toBe("fallback_error");
    expect(result.questions).toHaveLength(54);
    expect(result.inventoryQuestions).toHaveLength(54);
    expect(result.questions.map((question) => question.id)).toEqual(
      fallback.questions.map((question) => question.id),
    );
  });

  it("includes a reviewed didactic row while keeping its non-official origin", async () => {
    const didactic = {
      ...fallback.questions[0]!,
      id: "didactic-reviewed-mathematics-1-1",
      origin: "didactic_reviewed" as const,
      editorialStatus: "reviewed" as const,
      sourceYear: 0,
    };

    const result = await loadCanonicalQuestionsSource({
      createClient: async () => ({}),
      loadQuestions: async () => [...fallback.questions, didactic],
    });

    expect(result.questions).toHaveLength(55);
    expect(result.inventoryQuestions).toHaveLength(55);
    expect(result.questions.find((question) => question.id.startsWith("didactic-"))?.origin).toBe("didactic_reviewed");
  });

  it("excludes source text awaiting visual review from learner practice", async () => {
    const needsReview = { ...fallback.questions[0]!, id: "ocr-review-1", verificationStatus: "needs_review" as const };
    const result = await loadCanonicalQuestionsSource({
      createClient: async () => ({}),
      loadQuestions: async () => [...fallback.questions, needsReview],
    });

    expect(result.questions).toHaveLength(54);
    expect(result.inventoryQuestions).toHaveLength(55);
    expect(result.questions.find((question) => question.id === "ocr-review-1")).toBeUndefined();
  });
});
