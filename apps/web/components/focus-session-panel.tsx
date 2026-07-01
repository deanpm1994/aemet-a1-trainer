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
          No focus session selected
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          No scheduled, active, extended, or review-ready session is available.
        </p>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
      </section>
    );
  }

  const checklist = [
    `Notes created: ${session.notesCreated ? "yes" : "no"}`,
    `Questions solved: ${session.questionsSolved}`,
    `Flashcards created: ${session.flashcardsCreated}`,
    `Mistakes logged: ${session.mistakesLogged}`,
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
          Planned block: {session.plannedStartTime}-{session.plannedEndTime} (
          {session.plannedDurationMinutes} min)
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Timer status: {session.timerStatus}. Session status: {session.status}.
        </p>
        <p className="mt-2 text-sm text-slate-500">{message}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            onClick={() =>
              applySessionUpdate(
                startSessionTimer,
                "Timer started locally. Sign in to persist focus changes.",
              )
            }
            type="button"
          >
            Start
          </button>
          <button
            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            onClick={() =>
              applySessionUpdate(
                pauseSessionTimer,
                "Timer paused locally. Sign in to persist focus changes.",
              )
            }
            type="button"
          >
            Pause
          </button>
          <button
            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            onClick={() =>
              applySessionUpdate(
                resetSessionTimer,
                "Timer reset locally. Sign in to persist focus changes.",
              )
            }
            type="button"
          >
            Reset
          </button>
          <button
            className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            onClick={() =>
              applySessionUpdate(
                moveSessionToReview,
                "Session moved to local review. Sign in to persist focus changes.",
              )
            }
            type="button"
          >
            Simulate timer end
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-900">Session checklist</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {session.reviewState === "waiting" ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-lg font-semibold text-amber-950">Ready for review</h3>
          <p className="mt-2 text-sm text-amber-900">
            Decide whether the session should be completed, extended, or abandoned.
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
                      notes: "Completed after the timer-end review step.",
                    }),
                  "Session completed locally. Sign in to persist focus changes.",
                )
              }
              type="button"
            >
              Complete
            </button>
            <button
              className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              onClick={() =>
                applySessionUpdate(
                  (currentSession) => extendSession(currentSession, 15),
                  "Session extended locally. Sign in to persist focus changes.",
                )
              }
              type="button"
            >
              Extend 15 min
            </button>
            <button
              className="rounded-full border border-red-300 px-4 py-2 text-sm text-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              onClick={() =>
                applySessionUpdate(
                  abandonSession,
                  "Session abandoned locally. Sign in to persist focus changes.",
                )
              }
              type="button"
            >
              Abandon
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
