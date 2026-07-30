"use client";

import { useState, useTransition } from "react";

import { evaluateQuizAnswer, selectRandomQuestions, type PracticeSessionSize } from "@/lib/quiz";
import { getQuestionOptions } from "@/lib/question-options";
import type { Question } from "@/lib/types";
import { QuestionRichText } from "@/components/question-rich-text";
import { QuestionSourceReviewPanel } from "@/components/question-source-review-panel";

type SaveAttempt = (formData: FormData) => Promise<{ ok: boolean; message: string }>;
type QuizRunnerProps = {
  questions: Question[];
  sessionSize: PracticeSessionSize;
  canPersist: boolean;
  onHideQuestion: SaveAttempt;
  onSaveAttempt: SaveAttempt;
};

export function QuizRunner({
  questions,
  sessionSize,
  canPersist,
  onHideQuestion,
  onSaveAttempt,
}: QuizRunnerProps) {
  const [sessionQuestions, setSessionQuestions] = useState(questions);
  const [index, setIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [hideMessage, setHideMessage] = useState<string | null>(null);
  const question = sessionQuestions[index];
  const options = question ? getQuestionOptions(question) : [];
  const feedback = submitted && selectedAnswer && question ? evaluateQuizAnswer(question, selectedAnswer) : null;

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
      startTransition(async () => { await onSaveAttempt(formData); });
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
    setHideMessage(null);
  }

  function hideCurrentQuestion() {
    if (!question || !canPersist) return;
    const formData = new FormData();
    formData.set("questionId", question.id);
    startTransition(async () => {
      const result = await onHideQuestion(formData);
      setHideMessage(result.message);
    });
  }

  if (!question || finished) {
    const incorrect = answered - correct;
    const accuracy = answered === 0 ? 0 : Math.round((correct / answered) * 100);
    return <section className="w-full max-w-xl rounded-3xl border border-indigo-200 bg-indigo-50 p-6">
      <h1 className="text-xl font-semibold text-slate-950">Resumen de sesión</h1>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-800 sm:grid-cols-4">
        <div><dt>Respondidas</dt><dd className="text-xl font-semibold">{answered}</dd></div>
        <div><dt>Correctas</dt><dd className="text-xl font-semibold">{correct}</dd></div>
        <div><dt>Incorrectas</dt><dd className="text-xl font-semibold">{incorrect}</dd></div>
        <div><dt>Precisión · mejor racha</dt><dd className="text-xl font-semibold">{accuracy}% · {bestStreak}</dd></div>
      </dl>
      <a className="mt-6 inline-flex min-h-11 items-center rounded-full bg-indigo-700 px-4 py-2 font-medium text-white" href="/questions">Volver a preguntas</a>
    </section>;
  }

  return <section className="w-full max-w-2xl rounded-3xl border border-indigo-200 bg-indigo-50 p-4 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-indigo-900">
      <span>{sessionSize === "survival" ? `Supervivencia · ${answered + 1} respondidas` : `Pregunta ${answered + 1} de ${Math.min(sessionSize, sessionQuestions.length)}`}</span>
      <a className="rounded-full px-3 py-1 underline" href="/questions">Salir</a>
    </div>
    {question.origin === "didactic_reviewed" ? <p className="mt-4 w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-950">Pregunta creada para practicar · no oficial</p> : null}
    {question.selectionInstruction === "choose_correct" ? <p className="mt-4 text-sm font-semibold text-indigo-950">Selecciona la opción correcta.</p> : null}
    {question.selectionInstruction === "choose_incorrect" ? <p className="mt-4 text-sm font-semibold text-indigo-950">Selecciona la opción incorrecta.</p> : null}
    <h2 className="mt-4 text-lg font-semibold leading-7 text-slate-950 sm:text-xl"><QuestionRichText contentFormat={question.contentFormat} text={question.statement} /></h2>
    <QuestionSourceReviewPanel compact question={question} />
    <div className="mt-5 grid gap-3">
      {options.map((option) => (
        <button
          aria-pressed={selectedAnswer === option.key}
          className={`flex min-h-12 gap-3 rounded-2xl border px-4 py-3 text-left text-sm text-slate-800 ${selectedAnswer === option.key ? "border-indigo-700 bg-indigo-100" : "border-indigo-200 bg-white"} disabled:cursor-not-allowed disabled:opacity-70`}
          disabled={submitted}
          key={option.key}
          onClick={() => setSelectedAnswer(option.key)}
          type="button"
        >
          <span className="font-semibold text-indigo-900">{option.key}</span>
          <span><QuestionRichText contentFormat={question.contentFormat} text={option.text} /></span>
        </button>
      ))}
    </div>
    {!submitted ? <button className="mt-5 min-h-12 rounded-full bg-indigo-700 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50" disabled={!selectedAnswer} onClick={submit} type="button">Comprobar respuesta</button> : null}
    {feedback ? <div aria-live="polite" className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-800">
      <p className="font-semibold">{feedback.correct ? "Correcta" : "Incorrecta"}</p>
      <p className="mt-2">
        Opción correcta: <strong>{feedback.selectedAnswerLabel}</strong>{" "}
        <QuestionRichText contentFormat={question.contentFormat} text={feedback.correctOptionText} />
      </p>
      <p className="mt-2">{feedback.explanation}</p>
      <a className="mt-2 inline-block text-indigo-800 underline" href={feedback.sourceUrl} rel="noreferrer" target="_blank">Ver fuente de apoyo</a>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="min-h-11 rounded-full bg-indigo-700 px-4 py-2 font-medium text-white disabled:opacity-70" disabled={isPending} onClick={nextQuestion} type="button">Siguiente pregunta</button>
        {canPersist ? <button className="min-h-11 rounded-full border border-rose-300 bg-white px-4 py-2 font-medium text-rose-800 disabled:opacity-70" disabled={isPending} onClick={hideCurrentQuestion} type="button">Ocultar de futuras sesiones</button> : null}
      </div>
      {hideMessage ? <p aria-live="polite" className="mt-3 text-sm text-slate-700">{hideMessage}</p> : null}
    </div> : null}
  </section>;
}
