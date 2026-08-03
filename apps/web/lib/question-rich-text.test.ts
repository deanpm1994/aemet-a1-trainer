import { describe, expect, it } from "vitest";

import { splitQuestionRichText } from "./question-rich-text";

describe("splitQuestionRichText", () => {
  it("leaves original source text untouched unless a reviewer enables LaTex", () => {
    expect(splitQuestionRichText("La ganancia es \\(G\\)", "plain_text")).toEqual([
      { kind: "text", value: "La ganancia es \\(G\\)" },
    ]);
  });

  it("separates reviewed inline and block LaTex without interpreting surrounding text", () => {
    expect(splitQuestionRichText("Sea \\(x^2\\).\n\\[E=mc^2\\]", "latex")).toEqual([
      { kind: "text", value: "Sea " },
      { kind: "inline_math", value: "x^2" },
      { kind: "text", value: ".\n" },
      { kind: "block_math", value: "E=mc^2" },
    ]);
  });
});
