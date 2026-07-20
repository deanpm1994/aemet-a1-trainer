"use client";

import { useState, useTransition } from "react";

import type { MistakeType, Question } from "@/lib/types";
import { getQuestionOptions } from "@/lib/question-options";

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
  { value: "none", label: "Ninguno" },
  { value: "concept", label: "Concepto" },
  { value: "formula", label: "Fórmula" },
  { value: "units", label: "Unidades" },
  { value: "reading", label: "Lectura" },
  { value: "legal_wording", label: "Redacción legal" },
  { value: "time_management", label: "Gestión del tiempo" },
];

export function QuestionAttemptForm({
  question,
  canPersist,
  onSave,
}: QuestionAttemptFormProps) {
  const [message, setMessage] = useState(
    canPersist
      ? "Registra un intento de práctica para actualizar la revisión."
      : "Inicia sesión para guardar intentos de preguntas.",
  );
  const [isPending, startTransition] = useTransition();
  const today = new Date().toISOString().slice(0, 10);
  const options = getQuestionOptions(question);

  function submitAttempt(formData: FormData) {
    if (!canPersist) {
      setMessage("Inicia sesión para guardar intentos de preguntas.");
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
          <span className="font-medium text-slate-700">Respuesta seleccionada</span>
          {question.options.length > 0 ? (
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2"
              name="selectedAnswer"
            >
              {options.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.key}) {option.text}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="rounded-xl border border-slate-200 bg-white px-3 py-2"
              name="selectedAnswer"
              placeholder="Resumen de respuesta corta"
              type="text"
            />
          )}
        </label>

        <label className="grid gap-1">
          <span className="font-medium text-slate-700">Fecha del intento</span>
          <input
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            defaultValue={today}
            name="attemptedAt"
            type="date"
          />
        </label>

        <label className="grid gap-1">
          <span className="font-medium text-slate-700">Confianza</span>
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
        <span>Marcar este intento como correcto</span>
      </label>

      <fieldset className="grid gap-2">
        <legend className="font-medium text-slate-700">Tipos de error</legend>
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
        <span className="font-medium text-slate-700">Notas del intento</span>
        <textarea
          className="min-h-20 rounded-xl border border-slate-200 bg-white px-3 py-2"
          name="notes"
          placeholder="¿Qué causó el error o qué debe revisarse después?"
        />
      </label>

      <p className="text-slate-600">{message}</p>

      <button
        className="w-fit rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending || !canPersist}
        type="submit"
      >
        Registrar intento
      </button>
    </form>
  );
}
