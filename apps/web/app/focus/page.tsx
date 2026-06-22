"use client";

import { useState } from "react";

import { PageHeader } from "@/components/page-header";
import { studySessions } from "@/lib/mock-data";
import {
  completeSessionReview,
  extendSession,
  moveSessionToReview,
  pauseSessionTimer,
  resetSessionTimer,
  startSessionTimer,
} from "@/lib/focus-planner";

export default function FocusPage() {
  const [session, setSession] = useState(studySessions[1] ?? null);

  if (!session) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Focus"
          title="No focus session selected"
          description="Choose a session from the planner before opening focus mode."
        />
      </div>
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
      <PageHeader
        eyebrow="Focus"
        title="Timer-driven focus session"
        description="This Phase 3 focus flow is local-only. When the timer ends, the session moves to review instead of auto-completing."
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">{session.sessionType}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{session.name}</h2>
        <p className="mt-2 text-slate-700">{session.objective}</p>
        <p className="mt-4 text-sm text-slate-500">
          Planned block: {session.plannedStartTime}-{session.plannedEndTime} (
          {session.plannedDurationMinutes} min)
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Timer status: {session.timerStatus}. Session status: {session.status}.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white"
            onClick={() => setSession(startSessionTimer(session))}
            type="button"
          >
            Start
          </button>
          <button
            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-900"
            onClick={() => setSession(pauseSessionTimer(session))}
            type="button"
          >
            Pause
          </button>
          <button
            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-900"
            onClick={() => setSession(resetSessionTimer(session))}
            type="button"
          >
            Reset
          </button>
          <button
            className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900"
            onClick={() => setSession(moveSessionToReview(session))}
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
              className="rounded-full bg-amber-900 px-4 py-2 text-sm text-white"
              onClick={() =>
                setSession(
                  completeSessionReview(session, {
                    notesCreated: true,
                    questionsSolved: session.questionsSolved,
                    flashcardsCreated: session.flashcardsCreated,
                    mistakesLogged: session.mistakesLogged,
                    confidenceAfter: 4,
                    nextReviewAt: "2026-06-26",
                    notes: "Completed after the timer-end review step.",
                  }),
                )
              }
              type="button"
            >
              Complete
            </button>
            <button
              className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900"
              onClick={() => setSession(extendSession(session, 15))}
              type="button"
            >
              Extend 15 min
            </button>
            <button
              className="rounded-full border border-red-300 px-4 py-2 text-sm text-red-800"
              onClick={() =>
                setSession({
                  ...session,
                  status: "abandoned",
                  completed: false,
                  reviewState: "done",
                })
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
