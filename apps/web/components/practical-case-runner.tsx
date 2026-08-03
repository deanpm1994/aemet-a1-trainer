"use client";

import { useState, useTransition } from "react";

import { QuestionRichText } from "@/components/question-rich-text";
import type { PracticalSelfAssessment, Question } from "@/lib/types";

type SaveAttempt = (formData: FormData) => Promise<{ ok: boolean; message: string }>;
type PracticalCaseRunnerProps = {
  questions: Question[];
  canPersist: boolean;
  onSaveAttempt: SaveAttempt;
};

export function PracticalCaseRunner({
  questions,
  canPersist,
  onSaveAttempt,
}: PracticalCaseRunnerProps) {
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [skipped, setSkipped] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [selfAssessment, setSelfAssessment] =
    useState<PracticalSelfAssessment>("ungraded");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const question = questions[index];

  if (!question) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold">Supuesto completado</h1>
        <a className="mt-5 inline-flex rounded-full bg-indigo-700 px-4 py-2 text-white" href="/questions">
          Volver al banco
        </a>
      </section>
    );
  }

  function saveAssessment(value: PracticalSelfAssessment) {
    setSelfAssessment(value);
    if (!canPersist) return;
    const formData = new FormData();
    formData.set("questionId", question.id);
    formData.set("attemptedAt", new Date().toISOString());
    formData.set("selectedAnswer", "");
    formData.set("isCorrect", String(value === "correct"));
    formData.set("mistakeTypes", value === "correct" ? "none" : "concept");
    formData.set("confidenceAfter", value === "correct" ? "4" : value === "partial" ? "3" : "2");
    formData.set("notes", skipped ? "Solución revelada tras omitir el borrador." : "");
    formData.set("draftResponse", draft);
    formData.set("selfAssessment", value);
    startTransition(async () => {
      const result = await onSaveAttempt(formData);
      setMessage(result.message);
    });
  }

  function next() {
    setIndex((current) => current + 1);
    setDraft("");
    setSkipped(false);
    setRevealed(false);
    setSelfAssessment("ungraded");
    setMessage("");
  }

  return (
    <section className="w-full max-w-3xl rounded-3xl border border-indigo-200 bg-indigo-50 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-indigo-900">
        <span>
          {question.oepYear ? `OEP ${question.oepYear}` : question.sourceYear}
          {question.caseGroup ? ` · Supuesto ${question.caseGroup}` : ""}
          {` · ${index + 1} de ${questions.length}`}
        </span>
        <a className="underline" href="/questions">Salir</a>
      </div>

      <p className="mt-4 w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-950">
        Enunciado oficial · solución modelo revisada no oficial
      </p>
      <h1 className="mt-4 text-xl font-semibold text-slate-950">{question.name}</h1>
      <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-800">
        <QuestionRichText contentFormat={question.contentFormat} text={question.statement} />
      </div>

      {!revealed ? (
        <div className="mt-6 rounded-2xl bg-white p-4">
          <label className="grid gap-2 text-sm font-medium text-slate-800">
            Tu borrador
            <textarea
              className="min-h-56 rounded-xl border border-slate-300 p-3 font-normal"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Desarrolla el procedimiento, los cálculos y la interpretación."
              value={draft}
            />
          </label>
          <label className="mt-3 flex items-start gap-2 text-sm text-slate-700">
            <input
              checked={skipped}
              onChange={(event) => setSkipped(event.target.checked)}
              type="checkbox"
            />
            Omitir explícitamente el borrador y revelar la solución.
          </label>
          <button
            className="mt-4 rounded-full bg-indigo-700 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
            disabled={!draft.trim() && !skipped}
            onClick={() => setRevealed(true)}
            type="button"
          >
            Revelar solución y rúbrica
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <h2 className="font-semibold text-amber-950">Solución modelo revisada · no oficial</h2>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-amber-950">
              <QuestionRichText contentFormat={question.contentFormat} text={question.modelAnswer ?? ""} />
            </div>
          </section>
          <section className="rounded-2xl bg-white p-4">
            <h2 className="font-semibold text-slate-950">Rúbrica de autoevaluación</h2>
            <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {question.gradingRubric}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["correct", "partial", "incorrect"] as const).map((value) => (
                <button
                  className={`rounded-full border px-4 py-2 text-sm ${selfAssessment === value ? "border-indigo-700 bg-indigo-100" : "border-slate-300"}`}
                  disabled={isPending}
                  key={value}
                  onClick={() => saveAssessment(value)}
                  type="button"
                >
                  {value === "correct" ? "Correcta" : value === "partial" ? "Parcial" : "Incorrecta"}
                </button>
              ))}
            </div>
            {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
          </section>
          {question.answerSupports?.length ? (
            <section className="rounded-2xl bg-white p-4">
              <h2 className="font-semibold text-slate-950">Fuentes de apoyo</h2>
              <ul className="mt-2 space-y-2 text-sm">
                {question.answerSupports.map((support) => (
                  <li key={support.id}>
                    <a className="text-indigo-800 underline" href={support.url} rel="noreferrer" target="_blank">
                      {support.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <button
            className="rounded-full bg-indigo-700 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
            disabled={selfAssessment === "ungraded" || isPending}
            onClick={next}
            type="button"
          >
            {index + 1 === questions.length ? "Finalizar supuesto" : "Siguiente ejercicio"}
          </button>
        </div>
      )}
    </section>
  );
}
