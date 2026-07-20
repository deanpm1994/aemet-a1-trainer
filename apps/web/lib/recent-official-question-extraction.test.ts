import { describe, expect, it } from "vitest";

import {
  extractDefinitiveKey,
  extractRecentMultipleChoice,
} from "./recent-official-question-extraction";

describe("recent official question extraction", () => {
  it("preserves raw multiline content while separating three options", () => {
    expect(extractRecentMultipleChoice(`
1. Enunciado con
continuación.
A) Primera
línea.
B) Segunda.
C) Tercera.
2. Siguiente pregunta:
a. Uno.
b. Dos.
c. Tres.
`)).toEqual([
      {
        questionNumber: "1",
        rawStatement: "Enunciado con\ncontinuación.",
        rawOptions: ["Primera\nlínea.", "Segunda.", "Tercera."],
      },
      {
        questionNumber: "2",
        rawStatement: "Siguiente pregunta:",
        rawOptions: ["Uno.", "Dos.", "Tres."],
      },
    ]);
  });

  it("uses the definitive table including reserves and annulments", () => {
    expect(extractDefinitiveKey(
      "1 A    41 ANULADA   Reserva 121 C\n2 B 42 C Reserva 122 A",
    )).toEqual([
      { questionNumber: "1", answer: "A" },
      { questionNumber: "41", answer: "ANULADA" },
      { questionNumber: "121", answer: "C" },
      { questionNumber: "2", answer: "B" },
      { questionNumber: "42", answer: "C" },
      { questionNumber: "122", answer: "A" },
    ]);
  });
});
