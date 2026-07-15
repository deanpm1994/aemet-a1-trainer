import { describe, expect, it } from "vitest";

import {
  evaluateQuizAnswer,
  getCoverageMessage,
  getSessionQuestions,
  selectRandomQuestions,
  selectTopicQuestions,
} from "./quiz";
import type { Question } from "./types";

const questions: Question[] = [
  {
    id: "one", name: "Uno", type: "multiple_choice", sourceYear: 0,
    sourceExam: "Material didáctico no oficial", sourceUrl: "https://example.test",
    retrievedAt: "2026-07-11", verificationStatus: "unverified", questionNumber: "1",
    statement: "Uno", options: ["A", "B"], correctAnswer: "A",
    answerSourceStatus: "inferred", explanation: "Explicación uno.", topicIds: ["mathematics-1"],
    difficulty: 1, attemptsCount: 0, lastAttemptAt: "", nextReviewAt: "", mistakeTypes: ["none"],
  },
  {
    id: "two", name: "Dos", type: "multiple_choice", sourceYear: 0,
    sourceExam: "Material didáctico no oficial", sourceUrl: "https://example.test",
    retrievedAt: "2026-07-11", verificationStatus: "unverified", questionNumber: "2",
    statement: "Dos", options: ["A", "B"], correctAnswer: "B",
    answerSourceStatus: "inferred", explanation: "Explicación dos.", topicIds: ["physics-1"],
    difficulty: 1, attemptsCount: 0, lastAttemptAt: "", nextReviewAt: "", mistakeTypes: ["none"],
  },
];

describe("quiz", () => {
  it("selects only questions linked to selected topic", () => {
    expect(selectTopicQuestions(questions, "mathematics-1").map((question) => question.id)).toEqual(["one"]);
  });

  it("returns deterministic unique random questions", () => {
    expect(selectRandomQuestions(questions, 2, 42).map((question) => question.id)).toEqual(
      selectRandomQuestions(questions, 2, 42).map((question) => question.id),
    );
  });

  it("reveals correct answer and explanation after selection", () => {
    expect(evaluateQuizAnswer(questions[0]!, "B")).toEqual({
      correct: false,
      correctAnswer: "A",
      explanation: "Explicación uno.",
    });
  });

  it("limits short sessions without repeating their eligible pool", () => {
    expect(getSessionQuestions(questions, 50, 42)).toHaveLength(2);
    expect(getCoverageMessage(2, 50)).toContain("Cobertura limitada");
  });
});
