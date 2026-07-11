"use client";

import { useState } from "react";

import { evaluateQuizAnswer } from "@/lib/quiz";
import type { Question } from "@/lib/types";

type QuizRunnerProps = {
  questions: Question[];
};

export function QuizRunner({ questions }: QuizRunnerProps) {
  const [index, setIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const question = questions[index];

  if (!question) {
    return null;
  }

  const feedback = selectedAnswer
    ? evaluateQuizAnswer(question, selectedAnswer)
    : null;

  function nextQuestion() {
    setIndex((current) => (current + 1) % questions.length);
    setSelectedAnswer(null);
  }

  return (
    <section className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-indigo-900">
        <span>Test {index + 1} de {questions.length}</span>
        <span>{question.verificationStatus === "verified" ? "Fuente verificada" : "Material didáctico no oficial"}</span>
      </div>
      <h2 className="mt-3 text-xl font-semibold text-slate-950">{question.statement}</h2>
      <div className="mt-5 grid gap-3">
        {question.options.map((option) => (
          <button
            className="rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-left text-sm text-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={Boolean(feedback)}
            key={option}
            onClick={() => setSelectedAnswer(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      {feedback ? (
        <div className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-800">
          <p className="font-semibold">{feedback.correct ? "Correcta" : "Incorrecta"}</p>
          <p className="mt-2">Respuesta correcta: {feedback.correctAnswer}</p>
          <p className="mt-2">{feedback.explanation}</p>
          <button className="mt-4 rounded-full bg-indigo-700 px-4 py-2 font-medium text-white" onClick={nextQuestion} type="button">
            Siguiente pregunta
          </button>
        </div>
      ) : null}
    </section>
  );
}
