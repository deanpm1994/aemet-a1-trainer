import { describe, expect, it } from "vitest";

import {
  getCorrectOption,
  getQuestionOptions,
  gradeQuestionAnswer,
} from "./question-options";

describe("question option grading", () => {
  it("grades an official answer letter by option position when stored text is unlabeled", () => {
    const question = {
      options: ["Primera opción", "Segunda opción", "Tercera opción"],
      correctAnswer: "B",
    };

    expect(gradeQuestionAnswer(question, "B")).toBe(true);
    expect(gradeQuestionAnswer(question, "Segunda opción")).toBe(true);
    expect(gradeQuestionAnswer(question, "Primera opción")).toBe(false);
    expect(getCorrectOption(question)).toEqual({
      key: "B",
      text: "Segunda opción",
      value: "Segunda opción",
    });
  });

  it("separates display labels from preserved three- and four-option source text", () => {
    expect(getQuestionOptions({ options: ["A) Uno", "B. Dos", "C: Tres"] })).toEqual([
      { key: "A", text: "Uno", value: "A) Uno" },
      { key: "B", text: "Dos", value: "B. Dos" },
      { key: "C", text: "Tres", value: "C: Tres" },
    ]);
    expect(getQuestionOptions({ options: ["Uno", "Dos", "Tres", "Cuatro"] }).map((option) => option.key))
      .toEqual(["A", "B", "C", "D"]);
  });

  it("does not treat an out-of-range key as a valid answer", () => {
    expect(gradeQuestionAnswer(
      { options: ["Uno", "Dos", "Tres"], correctAnswer: "D" },
      "D",
    )).toBe(false);
  });
});
