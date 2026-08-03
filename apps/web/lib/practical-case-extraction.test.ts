import { describe, expect, it } from "vitest";

import { extractPracticalExercises } from "./practical-case-extraction";

describe("practical case extraction", () => {
  it("separates A/B exercises and preserves subsection text", () => {
    expect(extractPracticalExercises(`
EJERCICIO A1 (6 puntos)
1.1 Calcule x.
1.2 Razone y.
EJERCICIO B1
Resuelva z.
`)).toEqual([
      {
        caseGroup: "A",
        exerciseNumber: "1",
        rawStatement: "1.1 Calcule x.\n1.2 Razone y.",
      },
      {
        caseGroup: "B",
        exerciseNumber: "1",
        rawStatement: "Resuelva z.",
      },
    ]);
  });

  it("accepts the EJERCIO typo preserved in an official paper", () => {
    expect(extractPracticalExercises("EJERCIO A3\nEnunciado.")).toHaveLength(1);
  });
});
