"use client";

import { useState, useTransition } from "react";

import {
  abandonSession,
  completeSessionReview,
  extendSession,
  moveSessionToReview,
  pauseSessionTimer,
  resetSessionTimer,
  startSessionTimer,
} from "@/lib/focus-planner";
import type { StudySession } from "@/lib/types";

type FocusActionResult = {
  ok: boolean;
  message: string;
};

type FocusSessionPanelProps = {
  initialSession: StudySession | null;
  canPersist: boolean;
  statusMessage: string;
  onSaveSession: (session: StudySession) => Promise<FocusActionResult>;
};

function getDefaultNextReviewDate() {
  const date = new Date();
  date.setDate(date.getDate() + 3);

  return date.toISOString().slice(0, 10);
}

export function FocusSessionPanel({
  initialSession,
  canPersist,
  statusMessage,
  onSaveSession,
}: FocusSessionPanelProps) {
  const [session, setSession] = useState(initialSession);
  const [message, setMessage] = useState(statusMessage);
  const [isPending, startTransition] = useTransition();

  function applySessionUpdate(
    update: (currentSession: StudySession) => StudySession,
    localMessage: string,
  ) {
    if (!session) {
      return;
    }

    const nextSession = update(session);
    setSession(nextSession);

    if (!canPersist) {
      setMessage(localMessage);
      return;
    }

    startTransition(async () => {
      const result = await onSaveSession(nextSession);
      setMessage(result.message);
    });
  }

  if (!session) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          No hay sesión de concentración seleccionada
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          No hay ninguna sesión programada, activa, extendida o lista para revisión.
        </p>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
      </section>
    );
  }

  const checklist = [
    `Notas creadas: ${session.notesCreated ? "sí" : "no"}`,
    `Preguntas resueltas: ${session.questionsSolved}`,
    `Flashcards creadas: ${session.flashcardsCreated}`,
    `Errores registrados: ${session.mistakesLogged}`,
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">{session.sessionType}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          {session.name}
        </h2>
        <p className="mt-2 text-slate-700">{session.objective}</p>
        <p className="mt-4 text-sm text-slate-500">
          Bloque planificado: {session.plannedStartTime}-{session.plannedEndTime} (
          {session.plannedDurationMinutes} min)
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Estado del temporizador: {session.timerStatus}. Estado de sesión: {session.status}.
        </p>
        <p className="mt-2 text-sm text-slate-500">{message}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            onClick={() =>
              applySessionUpdate(
                startSessionTimer,
                "Temporizador iniciado en local. Inicia sesión para guardar cambios.",
              )
            }
            type="button"
          >
            Iniciar
          </button>
          <button
            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            onClick={() =>
              applySessionUpdate(
                pauseSessionTimer,
                "Temporizador pausado en local. Inicia sesión para guardar cambios.",
              )
            }
            type="button"
          >
            Pausar
          </button>
          <button
            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            onClick={() =>
              applySessionUpdate(
                resetSessionTimer,
                "Temporizador reiniciado en local. Inicia sesión para guardar cambios.",
              )
            }
            type="button"
          >
            Reiniciar
          </button>
          <button
            className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            onClick={() =>
              applySessionUpdate(
                moveSessionToReview,
                "Sesión movida a revisión local. Inicia sesión para guardar cambios.",
              )
            }
            type="button"
          >
            Simular fin del temporizador
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-900">Checklist de sesión</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {session.reviewState === "waiting" ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-lg font-semibold text-amber-950">Lista para revisión</h3>
          <p className="mt-2 text-sm text-amber-900">
            Decide si la sesión debe completarse, extenderse o abandonarse.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-full bg-amber-900 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              onClick={() =>
                applySessionUpdate(
                  (currentSession) =>
                    completeSessionReview(currentSession, {
                      notesCreated: true,
                      questionsSolved: currentSession.questionsSolved,
                      flashcardsCreated: currentSession.flashcardsCreated,
                      mistakesLogged: currentSession.mistakesLogged,
                      confidenceAfter: 4,
                      nextReviewAt: getDefaultNextReviewDate(),
                      notes: "Completada después del paso de revisión al terminar el temporizador.",
                    }),
                  "Sesión completada en local. Inicia sesión para guardar cambios.",
                )
              }
              type="button"
            >
              Completar
            </button>
            <button
              className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              onClick={() =>
                applySessionUpdate(
                  (currentSession) => extendSession(currentSession, 15),
                  "Sesión extendida en local. Inicia sesión para guardar cambios.",
                )
              }
              type="button"
            >
              Extender 15 min
            </button>
            <button
              className="rounded-full border border-red-300 px-4 py-2 text-sm text-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              onClick={() =>
                applySessionUpdate(
                  abandonSession,
                  "Sesión abandonada en local. Inicia sesión para guardar cambios.",
                )
              }
              type="button"
            >
              Abandonar
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
