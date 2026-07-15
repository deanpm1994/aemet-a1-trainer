"use client";

import { useMemo, useState, useTransition } from "react";

import { evaluateQuizAnswer, getCoverageMessage, selectRandomQuestions, type PracticeSessionSize } from "@/lib/quiz";
import type { Question } from "@/lib/types";

type SaveAttempt = (formData: FormData) => Promise<{ ok: boolean; message: string }>;
type HideQuestion = (formData: FormData) => Promise<{ ok: boolean; message: string }>;

type QuizRunnerProps = {
  questions: Question[];
  sessionSize: PracticeSessionSize;
  canPersist: boolean;
  onSaveAttempt: SaveAttempt;
  onHideQuestion: HideQuestion;
};

export function QuizRunner({ questions, sessionSize, canPersist, onSaveAttempt, onHideQuestion }: QuizRunnerProps) {
  const [sessionQuestions, setSessionQuestions] = useState(questions);
  const [index, setIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const question = sessionQuestions[index];
  const feedback = submitted && selectedAnswer && question ? evaluateQuizAnswer(question, selectedAnswer) : null;
  const coverage = useMemo(() => getCoverageMessage(sessionQuestions.length, sessionSize), [sessionQuestions.length, sessionSize]);

  function submit() {
    if (!selectedAnswer || !question) return;
    setSubmitted(true);
    const result = evaluateQuizAnswer(question, selectedAnswer);
    const nextStreak = result.correct ? streak + 1 : 0;
    setAnswered((value) => value + 1);
    setCorrect((value) => value + (result.correct ? 1 : 0));
    setStreak(nextStreak);
    setBestStreak((value) => Math.max(value, nextStreak));
    if (canPersist) {
      const formData = new FormData();
      formData.set("questionId", question.id);
      formData.set("attemptedAt", new Date().toISOString());
      formData.set("selectedAnswer", selectedAnswer);
      formData.set("isCorrect", String(result.correct));
      formData.set("mistakeTypes", result.correct ? "none" : "concept");
      formData.set("confidenceAfter", "3");
      formData.set("notes", "");
      startTransition(async () => setSaveMessage((await onSaveAttempt(formData)).message));
    }
  }

  function nextQuestion() {
    if (!question) return;
    const hasRequestedCount = sessionSize !== "survival" && answered >= Math.min(sessionSize, sessionQuestions.length);
    const hasFinishedPass = index + 1 >= sessionQuestions.length;
    if (hasRequestedCount || (sessionSize !== "survival" && hasFinishedPass)) {
      setFinished(true);
      return;
    }
    if (sessionSize === "survival" && hasFinishedPass) {
      setSessionQuestions((current) => selectRandomQuestions(current, current.length, Date.now()));
      setIndex(0);
    } else {
      setIndex((current) => current + 1);
    }
    setSelectedAnswer(null);
    setSubmitted(false);
  }

  function hideCurrentQuestion() {
    if (!question || !canPersist) return;
    const formData = new FormData();
    formData.set("questionId", question.id);
    startTransition(async () => setSaveMessage((await onHideQuestion(formData)).message));
  }

  if (!question || finished) {
    const incorrect = answered - correct;
    const accuracy = answered === 0 ? 0 : Math.round((correct / answered) * 100);
    return <section className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6">
      <h2 className="text-xl font-semibold text-slate-950">Resumen de sesión</h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-800 sm:grid-cols-4">
        <div><dt>Respondidas</dt><dd className="text-xl font-semibold">{answered}</dd></div>
        <div><dt>Correctas</dt><dd className="text-xl font-semibold">{correct}</dd></div>
        <div><dt>Incorrectas</dt><dd className="text-xl font-semibold">{incorrect}</dd></div>
        <div><dt>Precisión · mejor racha</dt><dd className="text-xl font-semibold">{accuracy}% · {bestStreak}</dd></div>
      </dl>
    </section>;
  }

  return <section className="rounded-3xl border border-indigo-200 bg-indigo-50 p-4 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-indigo-900">
      <span>{sessionSize === "survival" ? `Supervivencia · ${answered + 1} respondidas` : `Pregunta ${answered + 1} de ${Math.min(sessionSize, sessionQuestions.length)}`}</span>
      <span>{question.origin === "official_historic" ? "Histórica oficial" : "Didáctica revisada · no oficial"}</span>
    </div>
    {coverage ? <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">{coverage}</p> : null}
    <h2 className="mt-4 text-lg font-semibold leading-7 text-slate-950 sm:text-xl">{question.statement}</h2>
    <div className="mt-5 grid gap-3">
      {question.options.map((option) => <button aria-pressed={selectedAnswer === option} className={`min-h-12 rounded-2xl border px-4 py-3 text-left text-sm text-slate-800 ${selectedAnswer === option ? "border-indigo-700 bg-indigo-100" : "border-indigo-200 bg-white"} disabled:cursor-not-allowed disabled:opacity-70`} disabled={submitted} key={option} onClick={() => setSelectedAnswer(option)} type="button">{option}</button>)}
    </div>
    {!submitted ? <button className="mt-5 min-h-12 rounded-full bg-indigo-700 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50" disabled={!selectedAnswer} onClick={submit} type="button">Comprobar respuesta</button> : null}
    {feedback ? <div aria-live="polite" className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-800">
      <p className="font-semibold">{feedback.correct ? "Correcta" : "Incorrecta"}</p>
      <p className="mt-2">Respuesta correcta: {feedback.correctAnswer}</p>
      <p className="mt-2">{feedback.explanation}</p>
      <a className="mt-3 inline-block text-indigo-800 underline" href={question.sourceUrl} rel="noreferrer" target="_blank">{question.origin === "official_historic" ? "Ver fuente oficial del examen" : "Ver referencia pública del temario"}</a>
      <p className="mt-3 text-slate-500">{isPending ? "Guardando…" : saveMessage}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="min-h-11 rounded-full bg-indigo-700 px-4 py-2 font-medium text-white" onClick={nextQuestion} type="button">Siguiente pregunta</button>
        {canPersist ? <button className="min-h-11 rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-800" onClick={hideCurrentQuestion} type="button">Ocultar esta pregunta</button> : null}
        <button className="min-h-11 rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-800" onClick={() => setFinished(true)} type="button">Finalizar sesión</button>
      </div>
    </div> : null}
  </section>;
}
