# Phase 3 Focus and Calendar MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local Phase 3 planner and focus workflow with typed study-session data, tested planner and timer helpers, a real `/calendar` route, a real `/focus` route, and updated project status docs that mark Phase 3 active.

**Architecture:** Keep Phase 3 local and deterministic, matching Phases 1 and 2. Add study-session domain types and fixtures under `apps/web/lib`, compute planner summaries and timer/review transitions through pure helper functions, and have `/calendar` and `/focus` consume those helpers without embedding domain logic in route JSX.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Tailwind CSS, git

---

### Task 1: Update project status docs for the Phase 3 handoff

**Files:**
- Modify: `README.md`
- Modify: `docs/ROADMAP.md`

- [ ] **Step 1: Write the failing documentation expectations**

Create `docs/phase-3-status.test.md` locally as a checklist for manual verification:

```md
- `README.md` no longer says `Phase 2 active`.
- `README.md` says `Phase 3 active: focus and calendar MVP.`
- `docs/ROADMAP.md` labels Phase 2 as complete.
- `docs/ROADMAP.md` labels Phase 3 as current.
```

- [ ] **Step 2: Verify the expectations fail against current docs**

Run: `rg -n "Phase 2 active|Phase 2 — Question bank MVP|Phase 3 — Focus and calendar" README.md docs/ROADMAP.md`

Expected:
- `README.md` contains `Phase 2 active: question bank MVP.`
- `docs/ROADMAP.md` shows `Phase 2 — Question bank MVP (current)`
- `docs/ROADMAP.md` shows `Phase 3 — Focus and calendar` without `(current)`

- [ ] **Step 3: Update status messaging**

Update `README.md` current status block to:

```md
## Current status

Phase 1 complete: read-only study checklist MVP.
Phase 2 complete: question bank MVP.
Phase 3 active: focus and calendar MVP.
```

Update `docs/ROADMAP.md` phase headings to:

```md
## Phase 2 — Question bank MVP (complete)
```

```md
## Phase 3 — Focus and calendar (current)
```

- [ ] **Step 4: Re-run the documentation verification**

Run: `rg -n "Phase 2 active|Phase 2 — Question bank MVP \\(complete\\)|Phase 3 — Focus and calendar \\(current\\)|Phase 3 active: focus and calendar MVP." README.md docs/ROADMAP.md`

Expected:
- no `Phase 2 active`
- `README.md` shows `Phase 3 active: focus and calendar MVP.`
- `docs/ROADMAP.md` shows Phase 2 as complete
- `docs/ROADMAP.md` shows Phase 3 as current

- [ ] **Step 5: Commit**

```bash
git add README.md docs/ROADMAP.md
git commit -m "docs(phase3): update project status for focus and calendar"
```

### Task 2: Add study-session types and current-week fixtures

**Files:**
- Modify: `apps/web/lib/types.ts`
- Modify: `apps/web/lib/mock-data.ts`
- Test: `apps/web/lib/focus-planner.test.ts`

- [ ] **Step 1: Write the failing fixture test**

Create `apps/web/lib/focus-planner.test.ts` with:

```ts
import { describe, expect, it } from "vitest";

import { routeCards, studySessions } from "./mock-data";

describe("study session fixtures", () => {
  it("exposes a non-empty current-week session list", () => {
    expect(studySessions.length).toBeGreaterThan(0);
  });

  it("keeps all sessions local and editable for the current week", () => {
    expect(studySessions.every((session) => session.isTemplate === false)).toBe(true);
    expect(studySessions.every((session) => session.isPersisted === false)).toBe(true);
  });

  it("includes at least one session already ready for review", () => {
    expect(studySessions.some((session) => session.status === "ready_for_review")).toBe(true);
  });

  it("updates the calendar and focus route copy to describe real tools", () => {
    expect(routeCards.find((card) => card.href === "/calendar")?.description).toContain(
      "Editable current-week planner",
    );
    expect(routeCards.find((card) => card.href === "/focus")?.description).toContain(
      "Timer-driven focus session",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm --prefix apps/web test -- focus-planner.test.ts`

Expected: FAIL because `studySessions` is not exported yet and the route card descriptions still contain placeholder-level copy.

- [ ] **Step 3: Add study-session types**

Append these types to `apps/web/lib/types.ts` after the `QuestionFilters` type:

```ts
export type SessionType =
  | "deep_topic"
  | "questions"
  | "practical_case"
  | "legal"
  | "informatics"
  | "flashcards"
  | "review";

export type StudySessionStatus =
  | "scheduled"
  | "in_progress"
  | "ready_for_review"
  | "completed"
  | "extended"
  | "abandoned";

export type TimerStatus = "idle" | "running" | "paused" | "finished";

export type ReviewState = "not_needed" | "waiting" | "done";

export type StudySession = {
  id: string;
  name: string;
  sessionType: SessionType;
  objective: string;
  topicIds: string[];
  questionIds: string[];
  plannedDate: string;
  plannedStartTime: string;
  plannedEndTime: string;
  plannedDurationMinutes: number;
  status: StudySessionStatus;
  timerStatus: TimerStatus;
  completed: boolean;
  reviewState: ReviewState;
  notesCreated: boolean;
  questionsSolved: number;
  flashcardsCreated: number;
  mistakesLogged: number;
  confidenceAfter: number | null;
  nextReviewAt: string;
  notes: string;
  isTemplate: boolean;
  isPersisted: boolean;
};

export type PlannerDay = {
  date: string;
  label: string;
  sessions: StudySession[];
};

export type PlannerWeekSummary = {
  totalSessions: number;
  completedSessions: number;
  readyForReviewSessions: number;
  totalPlannedMinutes: number;
  completedMinutes: number;
};
```

- [ ] **Step 4: Add local current-week fixtures and route copy**

Update the `apps/web/lib/mock-data.ts` imports to include `StudySession`:

```ts
import type {
  DashboardMetric,
  Question,
  RouteCard,
  StudyMission,
  StudySession,
  Topic,
} from "./types";
```

Update the route cards for `/calendar` and `/focus` to:

```ts
  {
    href: "/calendar",
    title: "Calendar",
    description: "Editable current-week planner built around the morning study schedule.",
  },
  {
    href: "/focus",
    title: "Focus",
    description: "Timer-driven focus session with review decisions and output tracking.",
  },
```

Append this fixture export near the bottom of `apps/web/lib/mock-data.ts` before `buildDashboardMetrics()`:

```ts
export const studySessions: StudySession[] = [
  {
    id: "session-2026-06-22-deep-topic",
    name: "Thermodynamics deep block",
    sessionType: "deep_topic",
    objective: "Review parcel stability and rebuild the lapse-rate summary notes.",
    topicIds: ["met-01"],
    questionIds: ["q-met-thermo-01"],
    plannedDate: "2026-06-22",
    plannedStartTime: "07:30",
    plannedEndTime: "09:00",
    plannedDurationMinutes: 90,
    status: "completed",
    timerStatus: "finished",
    completed: true,
    reviewState: "done",
    notesCreated: true,
    questionsSolved: 1,
    flashcardsCreated: 2,
    mistakesLogged: 0,
    confidenceAfter: 3,
    nextReviewAt: "2026-06-24",
    notes: "Captured the dry and moist adiabatic comparison in study notes.",
    isTemplate: false,
    isPersisted: false,
  },
  {
    id: "session-2026-06-23-questions",
    name: "Calculus question block",
    sessionType: "questions",
    objective: "Solve derivative and extrema questions without skipping the setup steps.",
    topicIds: ["math-01"],
    questionIds: ["q-math-calc-01"],
    plannedDate: "2026-06-23",
    plannedStartTime: "09:10",
    plannedEndTime: "10:10",
    plannedDurationMinutes: 60,
    status: "ready_for_review",
    timerStatus: "finished",
    completed: false,
    reviewState: "waiting",
    notesCreated: false,
    questionsSolved: 4,
    flashcardsCreated: 0,
    mistakesLogged: 1,
    confidenceAfter: null,
    nextReviewAt: "",
    notes: "",
    isTemplate: false,
    isPersisted: false,
  },
  {
    id: "session-2026-06-24-legal",
    name: "Administration review block",
    sessionType: "legal",
    objective: "Summarize one constitutional principle with clean exam wording.",
    topicIds: ["gen-01"],
    questionIds: ["q-gen-admin-01"],
    plannedDate: "2026-06-24",
    plannedStartTime: "10:20",
    plannedEndTime: "11:00",
    plannedDurationMinutes: 40,
    status: "scheduled",
    timerStatus: "idle",
    completed: false,
    reviewState: "not_needed",
    notesCreated: false,
    questionsSolved: 0,
    flashcardsCreated: 0,
    mistakesLogged: 0,
    confidenceAfter: null,
    nextReviewAt: "",
    notes: "",
    isTemplate: false,
    isPersisted: false,
  },
];
```

- [ ] **Step 5: Re-run the fixture test**

Run: `npm --prefix apps/web test -- focus-planner.test.ts`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/web/lib/types.ts apps/web/lib/mock-data.ts apps/web/lib/focus-planner.test.ts
git commit -m "feat(phase3): add study session fixtures and planner types"
```

### Task 3: Add pure planner and review-state helpers

**Files:**
- Create: `apps/web/lib/focus-planner.ts`
- Modify: `apps/web/lib/focus-planner.test.ts`

- [ ] **Step 1: Extend the test with helper coverage**

Append these imports and tests to `apps/web/lib/focus-planner.test.ts`:

```ts
import {
  buildPlannerWeek,
  buildPlannerWeekSummary,
  completeSessionReview,
  extendSession,
  getTodayMissionSession,
  moveSessionToReview,
} from "./focus-planner";

describe("planner helpers", () => {
  it("groups sessions into planner days", () => {
    const days = buildPlannerWeek(studySessions);

    expect(days.length).toBeGreaterThan(0);
    expect(days[0]?.sessions.length).toBeGreaterThan(0);
  });

  it("builds the weekly summary from session statuses", () => {
    expect(buildPlannerWeekSummary(studySessions)).toEqual({
      totalSessions: 3,
      completedSessions: 1,
      readyForReviewSessions: 1,
      totalPlannedMinutes: 190,
      completedMinutes: 90,
    });
  });

  it("returns the next current-week session as today's mission candidate", () => {
    expect(getTodayMissionSession(studySessions)?.id).toBe("session-2026-06-23-questions");
  });

  it("moves a running session into review instead of completing it", () => {
    const updated = moveSessionToReview({
      ...studySessions[2],
      status: "in_progress",
      timerStatus: "running",
    });

    expect(updated.status).toBe("ready_for_review");
    expect(updated.timerStatus).toBe("finished");
    expect(updated.completed).toBe(false);
    expect(updated.reviewState).toBe("waiting");
  });

  it("marks a reviewed session complete only after explicit confirmation", () => {
    const updated = completeSessionReview(studySessions[1], {
      notesCreated: true,
      questionsSolved: 6,
      flashcardsCreated: 1,
      mistakesLogged: 1,
      confidenceAfter: 4,
      nextReviewAt: "2026-06-26",
      notes: "Finished the full derivative review set.",
    });

    expect(updated.status).toBe("completed");
    expect(updated.completed).toBe(true);
    expect(updated.reviewState).toBe("done");
  });

  it("extends a review-ready session back into progress", () => {
    const updated = extendSession(studySessions[1], 15);

    expect(updated.status).toBe("extended");
    expect(updated.timerStatus).toBe("running");
    expect(updated.plannedDurationMinutes).toBe(75);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm --prefix apps/web test -- focus-planner.test.ts`

Expected: FAIL because `focus-planner.ts` does not exist yet.

- [ ] **Step 3: Add the pure helper module**

Create `apps/web/lib/focus-planner.ts` with:

```ts
import type { PlannerDay, PlannerWeekSummary, StudySession } from "./types";

type SessionReviewInput = Pick<
  StudySession,
  | "notesCreated"
  | "questionsSolved"
  | "flashcardsCreated"
  | "mistakesLogged"
  | "confidenceAfter"
  | "nextReviewAt"
  | "notes"
>;

function sortSessionsByStart(a: StudySession, b: StudySession) {
  return a.plannedStartTime.localeCompare(b.plannedStartTime);
}

export function buildPlannerWeek(sessions: StudySession[]): PlannerDay[] {
  const grouped = new Map<string, StudySession[]>();

  for (const session of sessions) {
    const daySessions = grouped.get(session.plannedDate) ?? [];
    daySessions.push(session);
    grouped.set(session.plannedDate, daySessions);
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, daySessions]) => ({
      date,
      label: new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }),
      sessions: [...daySessions].sort(sortSessionsByStart),
    }));
}

export function buildPlannerWeekSummary(
  sessions: StudySession[],
): PlannerWeekSummary {
  const totalPlannedMinutes = sessions.reduce(
    (sum, session) => sum + session.plannedDurationMinutes,
    0,
  );
  const completedSessions = sessions.filter((session) => session.completed).length;
  const readyForReviewSessions = sessions.filter(
    (session) => session.status === "ready_for_review",
  ).length;
  const completedMinutes = sessions
    .filter((session) => session.completed)
    .reduce((sum, session) => sum + session.plannedDurationMinutes, 0);

  return {
    totalSessions: sessions.length,
    completedSessions,
    readyForReviewSessions,
    totalPlannedMinutes,
    completedMinutes,
  };
}

export function getTodayMissionSession(
  sessions: StudySession[],
): StudySession | undefined {
  return [...sessions]
    .filter((session) =>
      session.status === "scheduled" || session.status === "ready_for_review",
    )
    .sort((left, right) => {
      const dateCompare = left.plannedDate.localeCompare(right.plannedDate);
      return dateCompare !== 0
        ? dateCompare
        : left.plannedStartTime.localeCompare(right.plannedStartTime);
    })[0];
}

export function moveSessionToReview(session: StudySession): StudySession {
  return {
    ...session,
    status: "ready_for_review",
    timerStatus: "finished",
    completed: false,
    reviewState: "waiting",
  };
}

export function completeSessionReview(
  session: StudySession,
  review: SessionReviewInput,
): StudySession {
  return {
    ...session,
    ...review,
    status: "completed",
    timerStatus: "finished",
    completed: true,
    reviewState: "done",
  };
}

export function extendSession(
  session: StudySession,
  extraMinutes: number,
): StudySession {
  return {
    ...session,
    status: "extended",
    timerStatus: "running",
    reviewState: "not_needed",
    plannedDurationMinutes: session.plannedDurationMinutes + extraMinutes,
  };
}
```

- [ ] **Step 4: Re-run the helper test**

Run: `npm --prefix apps/web test -- focus-planner.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web/lib/focus-planner.ts apps/web/lib/focus-planner.test.ts
git commit -m "feat(phase3): add planner and review-state helpers"
```

### Task 4: Build the current-week planner route

**Files:**
- Modify: `apps/web/app/calendar/page.tsx`
- Modify: `apps/web/lib/focus-planner.ts`

- [ ] **Step 1: Add planner editing helpers**

Append these helpers to `apps/web/lib/focus-planner.ts`:

```ts
export function updateSessionPlan(
  sessions: StudySession[],
  sessionId: string,
  updates: Pick<StudySession, "objective" | "plannedStartTime" | "plannedEndTime">,
): StudySession[] {
  return sessions.map((session) =>
    session.id === sessionId ? { ...session, ...updates } : session,
  );
}

export function resetSessionsToRecommendedWeek(
  recommendedSessions: StudySession[],
): StudySession[] {
  return recommendedSessions.map((session) => ({ ...session }));
}
```

- [ ] **Step 2: Replace the calendar placeholder route**

Update `apps/web/app/calendar/page.tsx` to:

```tsx
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
                      type="time"
                      value={session.plannedStartTime}
                      onChange={(event) =>
                        setSessions((current) =>
                          updateSessionPlan(current, session.id, {
                            objective: session.objective,
                            plannedStartTime: event.target.value,
                            plannedEndTime: session.plannedEndTime,
                          }),
                        )
                      }
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm text-slate-500">End</span>
                    <input
                      className="w-full rounded-lg border border-slate-200 px-3 py-2"
                      type="time"
                      value={session.plannedEndTime}
                      onChange={(event) =>
                        setSessions((current) =>
                          updateSessionPlan(current, session.id, {
                            objective: session.objective,
                            plannedStartTime: session.plannedStartTime,
                            plannedEndTime: event.target.value,
                          }),
                        )
                      }
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
```

- [ ] **Step 3: Run focused verification**

Run: `npm --prefix apps/web test -- focus-planner.test.ts`

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/calendar/page.tsx apps/web/lib/focus-planner.ts
git commit -m "feat(phase3): build current-week planner route"
```

### Task 5: Build the focus-session route

**Files:**
- Modify: `apps/web/app/focus/page.tsx`
- Modify: `apps/web/lib/focus-planner.ts`
- Modify: `apps/web/lib/focus-planner.test.ts`

- [ ] **Step 1: Add timer state helpers and tests**

Append these tests to `apps/web/lib/focus-planner.test.ts`:

```ts
import {
  pauseSessionTimer,
  resetSessionTimer,
  startSessionTimer,
} from "./focus-planner";

describe("timer helpers", () => {
  it("starts a scheduled session without completing it", () => {
    const updated = startSessionTimer(studySessions[2]);

    expect(updated.status).toBe("in_progress");
    expect(updated.timerStatus).toBe("running");
    expect(updated.completed).toBe(false);
  });

  it("pauses a running session without changing review state", () => {
    const updated = pauseSessionTimer({
      ...studySessions[2],
      status: "in_progress",
      timerStatus: "running",
    });

    expect(updated.status).toBe("in_progress");
    expect(updated.timerStatus).toBe("paused");
    expect(updated.reviewState).toBe("not_needed");
  });

  it("resets the timer state but preserves checklist outputs", () => {
    const updated = resetSessionTimer({
      ...studySessions[1],
      timerStatus: "paused",
      notesCreated: true,
      questionsSolved: 5,
    });

    expect(updated.timerStatus).toBe("idle");
    expect(updated.questionsSolved).toBe(5);
    expect(updated.notesCreated).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm --prefix apps/web test -- focus-planner.test.ts`

Expected: FAIL because the timer helper exports do not exist yet.

- [ ] **Step 3: Add timer helpers**

Append these exports to `apps/web/lib/focus-planner.ts`:

```ts
export function startSessionTimer(session: StudySession): StudySession {
  return {
    ...session,
    status: "in_progress",
    timerStatus: "running",
    completed: false,
  };
}

export function pauseSessionTimer(session: StudySession): StudySession {
  return {
    ...session,
    timerStatus: "paused",
  };
}

export function resetSessionTimer(session: StudySession): StudySession {
  return {
    ...session,
    timerStatus: "idle",
  };
}
```

- [ ] **Step 4: Replace the focus placeholder route**

Update `apps/web/app/focus/page.tsx` to:

```tsx
"use client";

import { useMemo, useState } from "react";

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

  const checklist = useMemo(
    () => [
      `Notes created: ${session?.notesCreated ? "yes" : "no"}`,
      `Questions solved: ${session?.questionsSolved ?? 0}`,
      `Flashcards created: ${session?.flashcardsCreated ?? 0}`,
      `Mistakes logged: ${session?.mistakesLogged ?? 0}`,
    ],
    [session],
  );

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
          Planned block: {session.plannedStartTime}–{session.plannedEndTime} ({session.plannedDurationMinutes} min)
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
```

- [ ] **Step 5: Run focused verification**

Run: `npm --prefix apps/web test -- focus-planner.test.ts`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/web/app/focus/page.tsx apps/web/lib/focus-planner.ts apps/web/lib/focus-planner.test.ts
git commit -m "feat(phase3): build local focus session workflow"
```

### Task 6: Final verification

**Files:**
- Verify only

- [ ] **Step 1: Run all web tests**

Run: `npm --prefix apps/web test`

Expected: PASS with the existing topic/question tests and the new focus/planner tests.

- [ ] **Step 2: Run lint if available**

Run: `npm --prefix apps/web run lint`

Expected: PASS

- [ ] **Step 3: Review the resulting phase status**

Run: `rg -n "Phase 2 complete|Phase 3 active|Phase 3 — Focus and calendar \\(current\\)" README.md docs/ROADMAP.md`

Expected:
- `README.md` shows `Phase 2 complete` and `Phase 3 active`
- `docs/ROADMAP.md` shows Phase 3 as current

- [ ] **Step 4: Commit any final fixups**

```bash
git add README.md docs/ROADMAP.md apps/web/app/calendar/page.tsx apps/web/app/focus/page.tsx apps/web/lib/types.ts apps/web/lib/mock-data.ts apps/web/lib/focus-planner.ts apps/web/lib/focus-planner.test.ts
git commit -m "test(phase3): verify focus and calendar mvp"
```
