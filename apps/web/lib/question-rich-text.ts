import type { QuestionContentFormat } from "./types";

export type QuestionTextSegment =
  | { kind: "text"; value: string }
  | { kind: "inline_math" | "block_math"; value: string };

/**
 * Splits only reviewer-authored LaTex delimiters. Source text remains plain
 * unless a reviewer explicitly sets content_format to `latex`.
 */
export function splitQuestionRichText(
  text: string,
  contentFormat: QuestionContentFormat | undefined,
): QuestionTextSegment[] {
  if (contentFormat !== "latex") return [{ kind: "text", value: text }];

  const delimiter = /(\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\))/g;
  const segments: QuestionTextSegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(delimiter)) {
    const index = match.index ?? 0;
    if (index > cursor) segments.push({ kind: "text", value: text.slice(cursor, index) });
    const isBlock = match[0].startsWith("\\[");
    segments.push({ kind: isBlock ? "block_math" : "inline_math", value: match[2] ?? match[3] ?? "" });
    cursor = index + match[0].length;
  }

  if (cursor < text.length) segments.push({ kind: "text", value: text.slice(cursor) });
  return segments.length > 0 ? segments : [{ kind: "text", value: text }];
}
