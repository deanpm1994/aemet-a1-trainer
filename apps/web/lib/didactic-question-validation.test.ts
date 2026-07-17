import { describe, expect, it } from "vitest";

import { validateDidacticQuestion, validateDidacticTopicCoverage } from "./didactic-question-validation";
import type { Question } from "./types";

const question: Question = {
  id: "didactic-mathematics-1", name: "Práctica de matemáticas 1", type: "multiple_choice",
  sourceYear: 0, sourceExam: "Material didáctico no oficial", sourceUrl: "https://www.example.org/source",
  retrievedAt: "2026-07-17", verificationStatus: "unverified", questionNumber: "1",
  statement: "¿Qué opción debe seleccionarse?", options: ["A) Uno", "B) Dos", "C) Tres", "D) Cuatro"],
  correctAnswer: "B) Dos", answerSourceStatus: "inferred", origin: "didactic_reviewed",
  editorialStatus: "reviewed", selectionInstruction: "choose_incorrect", explanation: "Explicación editorial con apoyo en la fuente.",
  topicIds: ["mathematics-1"], difficulty: 2, attemptsCount: 0, lastAttemptAt: "", nextReviewAt: "", mistakeTypes: ["none"],
};

describe("validateDidacticQuestion", () => {
  it("accepts a reviewed, source-backed single-answer four-option question", () => {
    expect(validateDidacticQuestion(question)).toEqual([]);
  });

  it("rejects ambiguous options and a missing selection instruction", () => {
    const issues = validateDidacticQuestion({
      ...question,
      options: ["A) Uno", "A) Uno", "C) Tres"],
      selectionInstruction: "as_written",
    });
    expect(issues.map((issue) => issue.field)).toEqual(expect.arrayContaining(["options", "selectionInstruction", "correctAnswer"]));
  });

  it("requires exactly one item for each verified syllabus topic", () => {
    expect(validateDidacticTopicCoverage([question], ["mathematics-1", "mathematics-2"])).toEqual([
      { field: "topicIds", message: "expected exactly one didactic question for mathematics-2" },
    ]);
  });

  it("rejects syllabus-structure prompts instead of subject-matter questions", () => {
    const issues = validateDidacticQuestion({
      ...question,
      statement: "Según el programa oficial, ¿qué contenido pertenece al tema 52 de Meteorología y Climatología?",
    });
    expect(issues).toContainEqual({
      field: "statement",
      message: "questions must test subject knowledge, not syllabus structure or topic numbering",
    });
  });
});
