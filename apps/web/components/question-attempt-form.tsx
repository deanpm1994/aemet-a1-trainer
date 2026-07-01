"use client";

import { useState, useTransition } from "react";

import type { MistakeType, Question } from "@/lib/types";

type QuestionAttemptActionResult = {
  ok: boolean;
  message: string;
};

type QuestionAttemptFormProps = {
  question: Question;
  canPersist: boolean;
  onSave: (formData: FormData) => Promise<QuestionAttemptActionResult>;
};

const mistakeTypes: Array<{ value: MistakeType; label: string }> = [
  { value: "none", label: "None" },
  { value: "concept", label: "Concept" },
  { value: "formula", label: "Formula" },
  { value: "units", label: "Units" },
  { value: "reading", label: "Reading" },
  { value: "legal_wording", label: "Legal wording" },
  { value: "time_management", label: "Time management" },
];

export function QuestionAttemptForm({
  question,
  canPersist,
  onSave,
}: QuestionAttemptFormProps) {
  const [message, setMessage] = useState(
    canPersist
      ? "Record a practice attempt to update review progress."
      : "Sign in to persist question attempts.",
  );
  const [isPending, startTransition] = useTransition();
  const today = new Date().toISOString().slice(0, 10);

  function submitAttempt(formData: FormData) {
    if (!canPersist) {
      setMessage("Sign in to persist question attempts.");
      return;
    }

    startTransition(async () => {
      const result = await onSave(formData);
      setMessage(result.message);
    });
  }

  return (
    <form
      action={submitAttempt}
      className="mt-5 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm"
    >
      <input name="questionId" type="hidden" value={question.id} />

      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
        <label className="grid gap-1">
          <span className="font-medium text-slate-700">Selected answer</span>
          {question.options.length > 0 ? (
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2"
              name="selectedAnswer"
            >
              {question.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="rounded-xl border border-slate-200 bg-white px-3 py-2"
              name="selectedAnswer"
              placeholder="Short answer summary"
              type="text"
            />
          )}
        </label>

        <label className="grid gap-1">
          <span className="font-medium text-slate-700">Attempt date</span>
          <input
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            defaultValue={today}
            name="attemptedAt"
            type="date"
          />
        </label>

        <label className="grid gap-1">
          <span className="font-medium text-slate-700">Confidence</span>
          <input
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            defaultValue={3}
            max={5}
            min={1}
            name="confidenceAfter"
            type="number"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-slate-700">
        <input name="isCorrect" type="checkbox" value="true" />
        <span>Mark this attempt as correct</span>
      </label>

      <fieldset className="grid gap-2">
        <legend className="font-medium text-slate-700">Mistake types</legend>
        <div className="flex flex-wrap gap-2">
          {mistakeTypes.map((mistakeType) => (
            <label
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2"
              key={mistakeType.value}
            >
              <input
                defaultChecked={mistakeType.value === "none"}
                name="mistakeTypes"
                type="checkbox"
                value={mistakeType.value}
              />
              <span>{mistakeType.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-1">
        <span className="font-medium text-slate-700">Attempt notes</span>
        <textarea
          className="min-h-20 rounded-xl border border-slate-200 bg-white px-3 py-2"
          name="notes"
          placeholder="What caused the mistake or what should be reviewed next?"
        />
      </label>

      <p className="text-slate-600">{message}</p>

      <button
        className="w-fit rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending || !canPersist}
        type="submit"
      >
        Record attempt
      </button>
    </form>
  );
}
