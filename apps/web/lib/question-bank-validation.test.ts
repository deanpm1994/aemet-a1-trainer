import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  validateQuestionForPublication,
  validateSourceManifest,
  type SourceManifest,
} from "./question-bank-validation";
import type { Question } from "./types";

const baseQuestion: Question = {
  id: "official-1",
  name: "Pregunta oficial",
  type: "multiple_choice",
  sourceYear: 2026,
  oepYear: 2025,
  examDate: "2026-05-31",
  examPart: "first_exercise_part_1",
  sourceExam: "AEMET A1",
  sourceUrl: "https://www.aemet.es/source.pdf",
  retrievedAt: "2026-07-20",
  verificationStatus: "verified",
  reviewedAt: "2026-07-20T08:00:00.000Z",
  questionNumber: "1",
  statement: "¿Cuál es la opción correcta?",
  options: ["Uno", "Dos", "Tres"],
  correctAnswer: "B",
  answerSourceStatus: "official",
  explanation: "",
  questionRole: "ordinary",
  reserveDisposition: "not_applicable",
  disposition: "available",
  answerFormat: "single_choice",
  topicIds: [],
  difficulty: 3,
  attemptsCount: 0,
  lastAttemptAt: "",
  nextReviewAt: "",
  mistakeTypes: ["none"],
};

describe("question-bank validation", () => {
  it("accepts the checked-in official source manifest", () => {
    const manifest = JSON.parse(readFileSync(
      resolve(process.cwd(), "../../data/official-question-source-manifest.json"),
      "utf8",
    )) as SourceManifest;
    expect(validateSourceManifest(manifest)).toEqual([]);
  });

  it("rejects annulled learner-visible questions and embedded PDF furniture", () => {
    const issues = validateQuestionForPublication({
      ...baseQuestion,
      disposition: "annulled",
      options: ["Uno", "Dos", "Tribunal Calificador"],
    });
    expect(issues.map((issue) => issue.field)).toEqual(expect.arrayContaining(["disposition", "content"]));
  });

  it("accepts both three- and four-option official questions with letter keys", () => {
    expect(validateQuestionForPublication(baseQuestion)).toEqual([]);
    expect(validateQuestionForPublication({
      ...baseQuestion,
      options: ["Uno", "Dos", "Tres", "Cuatro"],
      correctAnswer: "D",
    })).toEqual([]);
  });

  it("requires non-official model answers, rubrics and support for practical exercises", () => {
    const issues = validateQuestionForPublication({
      ...baseQuestion,
      type: "practical_case",
      options: [],
      correctAnswer: "",
      answerFormat: "developed_response",
      answerSourceStatus: "inferred",
      modelAnswer: "",
      gradingRubric: "",
      answerSupports: [],
    });
    expect(issues.map((issue) => issue.field)).toEqual(
      expect.arrayContaining(["modelAnswer", "gradingRubric", "answerSupports"]),
    );
  });
});
