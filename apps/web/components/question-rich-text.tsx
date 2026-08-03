"use client";

import { BlockMath, InlineMath } from "react-katex";

import { splitQuestionRichText } from "@/lib/question-rich-text";
import type { QuestionContentFormat } from "@/lib/types";

type QuestionRichTextProps = {
  text: string;
  contentFormat?: QuestionContentFormat;
  className?: string;
};

export function QuestionRichText({ text, contentFormat, className }: QuestionRichTextProps) {
  const segments = splitQuestionRichText(text, contentFormat);

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.kind === "text") return <span key={`${segment.kind}-${index}`}>{segment.value}</span>;
        if (segment.kind === "block_math") {
          return <span className="my-3 block overflow-x-auto" key={`${segment.kind}-${index}`}><BlockMath math={segment.value} renderError={(error) => <span className="text-rose-700">Notación pendiente de revisión: {error.message}</span>} /></span>;
        }
        return <InlineMath key={`${segment.kind}-${index}`} math={segment.value} renderError={(error) => <span className="text-rose-700">{error.message}</span>} />;
      })}
    </span>
  );
}
