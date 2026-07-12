import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { loadOfficialPastExamSubset } from "./official-past-exam-subset";
import { loadCanonicalQuestionsSource } from "./canonical-questions-source";

const fallback = loadOfficialPastExamSubset();

if (!fallback.ok) {
  throw new Error("Expected checked-in verified past-exam questions");
}

describe("loadCanonicalQuestionsSource", () => {
  it("returns all 42 verified Supabase questions when canonical query succeeds", async () => {
    const result = await loadCanonicalQuestionsSource({
      createClient: async () => ({}),
      loadQuestions: async () => fallback.questions,
    });

    expect(result.sourceState).toBe("live");
    expect(result.questions).toHaveLength(42);
    expect(new Set(result.questions.map((question) => question.id)).size).toBe(42);
  });

  it("returns the same 42 checked-in verified questions when canonical query fails", async () => {
    const result = await loadCanonicalQuestionsSource({
      createClient: async () => ({}),
      loadQuestions: async () => {
        throw new Error("Supabase unavailable");
      },
    });

    expect(result.sourceState).toBe("fallback_error");
    expect(result.questions).toHaveLength(42);
    expect(result.questions.map((question) => question.id)).toEqual(
      fallback.questions.map((question) => question.id),
    );
  });
});
