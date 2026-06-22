"use client";

import { useState } from "react";

import { PageHeader } from "@/components/page-header";
import { studySessions } from "@/lib/mock-data";
import {
  buildPlannerWeek,
  buildPlannerWeekSummary,
  getTodayMissionSession,
  resetSessionsToRecommendedWeek,
  updateSessionPlan,
} from "@/lib/focus-planner";

export default function CalendarPage() {
  const [sessions, setSessions] = useState(studySessions);

  const plannerDays = buildPlannerWeek(sessions);
  const summary = buildPlannerWeekSummary(sessions);
  const nextSession = getTodayMissionSession(sessions);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Calendar"
        title="Editable current-week planner"
        description="This Phase 3 planner is local-only. It starts from the morning-first study template and lets you adjust the current week when work hours or availability change."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Planned this week</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {(summary.totalPlannedMinutes / 60).toFixed(1)} h
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Completed sessions</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.completedSessions} / {summary.totalSessions}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Needs review</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.readyForReviewSessions}
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-900">Today&apos;s mission</p>
        <p className="mt-1 text-base text-amber-950">
          {nextSession
            ? `${nextSession.plannedStartTime} ${nextSession.name}: ${nextSession.objective}`
            : "No focus session queued for the current week."}
        </p>
        <button
          className="mt-3 rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-900"
          onClick={() => setSessions(resetSessionsToRecommendedWeek(studySessions))}
          type="button"
        >
          Reset to recommended week
        </button>
      </section>

      <section className="space-y-4">
        {plannerDays.map((day) => (
          <article key={day.date} className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-900">{day.label}</h2>
            <div className="mt-4 space-y-3">
              {day.sessions.map((session) => (
                <div
                  key={session.id}
                  className="grid gap-3 rounded-xl border border-slate-100 p-3 md:grid-cols-[1fr,140px,140px]"
                >
                  <label className="space-y-1">
                    <span className="text-sm text-slate-500">Objective</span>
                    <input
                      className="w-full rounded-lg border border-slate-200 px-3 py-2"
                      value={session.objective}
                      onChange={(event) =>
                        setSessions((current) =>
                          updateSessionPlan(current, session.id, {
                            objective: event.target.value,
                            plannedStartTime: session.plannedStartTime,
                            plannedEndTime: session.plannedEndTime,
                          }),
                        )
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm text-slate-500">Start</span>
                    <input
                      className="w-full rounded-lg border border-slate-200 px-3 py-2"
                      onChange={(event) =>
                        setSessions((current) =>
                          updateSessionPlan(current, session.id, {
                            objective: session.objective,
                            plannedStartTime: event.target.value,
                            plannedEndTime: session.plannedEndTime,
                          }),
                        )
                      }
                      type="time"
                      value={session.plannedStartTime}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm text-slate-500">End</span>
                    <input
                      className="w-full rounded-lg border border-slate-200 px-3 py-2"
                      onChange={(event) =>
                        setSessions((current) =>
                          updateSessionPlan(current, session.id, {
                            objective: session.objective,
                            plannedStartTime: session.plannedStartTime,
                            plannedEndTime: event.target.value,
                          }),
                        )
                      }
                      type="time"
                      value={session.plannedEndTime}
                    />
                  </label>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
