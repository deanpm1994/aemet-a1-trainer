"use client";

import { useState, useTransition } from "react";

import type { MistakeType, Question } from "@/lib/types";

type QuestionProgressActionResult = {
  ok: boolean;
  message: string;
};

type QuestionProgressFormProps = {
  question: Question;
  canPersist: boolean;
  onSave: (formData: FormData) => Promise<QuestionProgressActionResult>;
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

export function QuestionProgressForm({
  question,
  canPersist,
  onSave,
}: QuestionProgressFormProps) {
  const [message, setMessage] = useState(
    canPersist
      ? "Guarda el progreso de práctica en Supabase."
      : "Inicia sesión para guardar progreso de preguntas.",
  );
  const [isPending, startTransition] = useTransition();

  function submitProgress(formData: FormData) {
    if (!canPersist) {
      setMessage("Inicia sesión para guardar progreso de preguntas.");
      return;
    }

    startTransition(async () => {
      const result = await onSave(formData);
      setMessage(result.message);
    });
  }

  return (
    <form
      action={submitProgress}
      className="mt-5 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm"
    >
      <input name="questionId" type="hidden" value={question.id} />
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1">
          <span className="font-medium text-slate-700">Intentos</span>
          <input
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            defaultValue={question.attemptsCount}
            min={0}
            name="attemptsCount"
            type="number"
          />
        </label>
        <label className="grid gap-1">
          <span className="font-medium text-slate-700">Último intento</span>
          <input
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            defaultValue={question.lastAttemptAt}
            name="lastAttemptAt"
            type="text"
          />
        </label>
        <label className="grid gap-1">
          <span className="font-medium text-slate-700">Próxima revisión</span>
          <input
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
            defaultValue={question.nextReviewAt}
            name="nextReviewAt"
            type="text"
          />
        </label>
      </div>

      <fieldset className="grid gap-2">
        <legend className="font-medium text-slate-700">Tipos de error</legend>
        <div className="flex flex-wrap gap-2">
          {mistakeTypes.map((mistakeType) => (
            <label
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2"
              key={mistakeType.value}
            >
              <input
                defaultChecked={question.mistakeTypes.includes(mistakeType.value)}
                name="mistakeTypes"
                type="checkbox"
                value={mistakeType.value}
              />
              <span>{mistakeType.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="text-slate-600">{message}</p>

      <button
        className="w-fit rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending || !canPersist}
        type="submit"
      >
        Guardar progreso de práctica
      </button>
    </form>
  );
}
