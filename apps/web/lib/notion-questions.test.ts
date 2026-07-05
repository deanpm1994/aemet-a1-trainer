import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { questions as fallbackQuestions } from "./mock-data";
import { routeCards } from "./i18n";
import type { Question } from "./types";
import { loadQuestionsSource, mapNotionQuestionPage } from "./notion-questions";

const validQuestionPage = {
  object: "page",
  properties: {
    question_id: {
      type: "title",
      title: [{ plain_text: "Q-001" }],
    },
    type: {
      type: "rich_text",
      rich_text: [{ plain_text: "multiple_choice" }],
    },
    source_year: {
      type: "rich_text",
      rich_text: [{ plain_text: "2024" }],
    },
    source_exam: {
      type: "rich_text",
      rich_text: [{ plain_text: "AEMET A1 source pack" }],
    },
    source_url: {
      type: "url",
      url: "https://example.com/question-source",
    },
    retrieved_at: {
      type: "date",
      date: { start: "2026-06-22" },
    },
    verification_status: {
      type: "rich_text",
      rich_text: [{ plain_text: "verified" }],
    },
    question_number: {
      type: "rich_text",
      rich_text: [{ plain_text: "7" }],
    },
    statement: {
      type: "rich_text",
      rich_text: [{ plain_text: "Which option is correct?" }],
    },
    option_a: {
      type: "rich_text",
      rich_text: [{ plain_text: "Option A" }],
    },
    option_b: {
      type: "rich_text",
      rich_text: [{ plain_text: "Option B" }],
    },
    option_c: {
      type: "rich_text",
      rich_text: [{ plain_text: "" }],
    },
    option_d: {
      type: "rich_text",
      rich_text: [{ plain_text: "" }],
    },
    correct_answer: {
      type: "rich_text",
      rich_text: [{ plain_text: "Option B" }],
    },
    answer_source_status: {
      type: "rich_text",
      rich_text: [{ plain_text: "official" }],
    },
    topic_ids: {
      type: "rich_text",
      rich_text: [{ plain_text: "MAT-01, MAT-02" }],
    },
    difficulty: {
      type: "rich_text",
      rich_text: [{ plain_text: "3" }],
    },
    explanation: {
      type: "rich_text",
      rich_text: [{ plain_text: "Because B is correct." }],
    },
    attempts_count: {
      type: "rich_text",
      rich_text: [{ plain_text: "2" }],
    },
    last_attempt_at: {
      type: "date",
      date: { start: "2026-06-20" },
    },
    next_review_at: {
      type: "date",
      date: { start: "2026-06-25" },
    },
    mistake_type: {
      type: "rich_text",
      rich_text: [{ plain_text: "concept, reading" }],
    },
    notes: {
      type: "rich_text",
      rich_text: [{ plain_text: "Question note" }],
    },
  },
} as const;

describe("mapNotionQuestionPage", () => {
  it("maps a csv-style Notion row into the internal Question shape", () => {
    expect(mapNotionQuestionPage(validQuestionPage)).toEqual<Question>({
      id: "Q-001",
      name: "Q-001",
      type: "multiple_choice",
      sourceYear: 2024,
      sourceExam: "AEMET A1 source pack",
      sourceUrl: "https://example.com/question-source",
      retrievedAt: "2026-06-22",
      verificationStatus: "verified",
      questionNumber: "7",
      statement: "Which option is correct?",
      options: ["Option A", "Option B"],
      correctAnswer: "Option B",
      answerSourceStatus: "official",
      explanation: "Because B is correct.",
      topicIds: ["MAT-01", "MAT-02"],
      difficulty: 3,
      attemptsCount: 2,
      lastAttemptAt: "2026-06-20",
      nextReviewAt: "2026-06-25",
      mistakeTypes: ["concept", "reading"],
    });
  });
});

describe("loadQuestionsSource", () => {
  it("returns live questions when config and query succeed", async () => {
    const result = await loadQuestionsSource({
      env: {
        NOTION_TOKEN: "secret_test_token",
        NOTION_QUESTIONS_DATA_SOURCE_ID: "12345678-1234-1234-1234-123456789abc",
      },
      fallbackQuestions,
      createClient: () => ({
        dataSources: {
          query: vi.fn().mockResolvedValue({
            results: [validQuestionPage],
          }),
        },
      }),
    });

    expect(result.sourceState).toBe("live");
    expect(result.message).toBe("Sincronización de preguntas con Notion activa.");
    expect(result.questions[0]?.id).toBe("Q-001");
  });

  it("returns fallback_config when question config is missing", async () => {
    const result = await loadQuestionsSource({
      env: {},
      fallbackQuestions,
    });

    expect(result.sourceState).toBe("fallback_config");
    expect(result.questions).toEqual(fallbackQuestions);
  });

  it("skips invalid question rows instead of failing the whole sync", async () => {
    const result = await loadQuestionsSource({
      env: {
        NOTION_TOKEN: "secret_test_token",
        NOTION_QUESTIONS_DATA_SOURCE_ID: "12345678-1234-1234-1234-123456789abc",
      },
      fallbackQuestions,
      createClient: () => ({
        dataSources: {
          query: vi.fn().mockResolvedValue({
            results: [
              {
                ...validQuestionPage,
                properties: {
                  ...validQuestionPage.properties,
                  difficulty: {
                    type: "rich_text",
                    rich_text: [{ plain_text: "9" }],
                  },
                },
              },
            ],
          }),
        },
      }),
    });

    expect(result.sourceState).toBe("live");
    expect(result.questions).toEqual([]);
  });
});

describe("questions route copy", () => {
  it("keeps the questions route card focused on the live-capable question bank", () => {
    expect(routeCards("en").find((card) => card.href === "/questions")?.description).toContain(
      "Live-capable",
    );
  });
});
