import { describe, expect, it } from "vitest";

import { routeCards } from "./i18n";
import { bibliography, questions } from "./mock-data";
import {
  buildQuestionStats,
  getDefaultQuestionFilters,
  getOverdueQuestions,
  getPracticePainPoints,
  matchesQuestionFilters,
} from "./question-bank";

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
    expect(routeCards("en").find((card) => card.href === "/questions")?.description).toContain(
      "Live-capable question bank",
    );
  });
});

describe("resources fixtures", () => {
  it("exposes a non-empty bibliography fallback list", () => {
    expect(bibliography.length).toBeGreaterThan(0);
  });

  it("allows repeated source urls across bibliography items", () => {
    const sharedUrls = bibliography
      .map((item) => item.sourceUrl)
      .filter((url, index, urls) => urls.indexOf(url) !== index);

    expect(sharedUrls.length).toBeGreaterThan(0);
  });

  it("adds a resources route card", () => {
    expect(routeCards("en").find((card) => card.href === "/resources")?.description).toContain(
      "Study resources",
    );
  });
});

describe("question bank helpers", () => {
  it("returns default filters that keep all questions visible", () => {
    expect(getDefaultQuestionFilters()).toEqual({
      type: "all",
      verificationStatus: "all",
      difficulty: "all",
      mistakeType: "all",
    });
  });

  it("filters by question type", () => {
    expect(
      questions.filter((question) =>
        matchesQuestionFilters(question, {
          type: "formula",
          verificationStatus: "all",
          difficulty: "all",
          mistakeType: "all",
        }),
      ),
    ).toHaveLength(1);
  });

  it("filters by mistake type", () => {
    expect(
      questions.filter((question) =>
        matchesQuestionFilters(question, {
          type: "all",
          verificationStatus: "all",
          difficulty: "all",
          mistakeType: "legal_wording",
        }),
      )[0]?.id,
    ).toBe("q-gen-admin-01");
  });

  it("builds counts by type, verification status, and mistake type", () => {
    expect(buildQuestionStats(questions)).toEqual({
      total: 4,
      byType: {
        multiple_choice: 1,
        practical_case: 0,
        formula: 1,
        flashcard: 1,
        legal_short_answer: 1,
      },
      byVerificationStatus: {
        verified: 0,
        unverified: 3,
        needs_review: 1,
        deprecated: 0,
      },
      byMistakeType: {
        concept: 1,
        formula: 1,
        units: 0,
        reading: 0,
        legal_wording: 1,
        time_management: 1,
        none: 1,
      },
    });
  });

  it("selects overdue review questions before today", () => {
    expect(getOverdueQuestions(questions, "2026-06-22").map((question) => question.id)).toEqual([
      "q-math-calc-01",
      "q-met-thermo-01",
    ]);
  });

  it("does not treat an unscheduled review as overdue", () => {
    const unscheduled = { ...questions[0], id: "q-unscheduled", nextReviewAt: "" };

    expect(getOverdueQuestions([unscheduled], "2026-06-22")).toEqual([]);
  });

  it("ranks practice pain points by repeated attempts and mistake count", () => {
    expect(getPracticePainPoints(questions)).toEqual([
      {
        id: "q-math-calc-01",
        label: "formula: Gradient and extrema review",
        attemptsCount: 5,
        mistakeTypes: ["formula", "time_management"],
      },
      {
        id: "q-met-thermo-01",
        label: "multiple_choice: Atmospheric stability basics",
        attemptsCount: 3,
        mistakeTypes: ["concept"],
      },
      {
        id: "q-gen-admin-01",
        label: "legal_short_answer: Public administration fundamentals",
        attemptsCount: 1,
        mistakeTypes: ["legal_wording"],
      },
    ]);
  });

  it("exposes real question-bank summary counts for the route", () => {
    const stats = buildQuestionStats(questions);

    expect(stats.total).toBe(4);
    expect(getOverdueQuestions(questions, "2026-06-22")).toHaveLength(2);
  });
});
