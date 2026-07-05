# Countdown Status Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dashboard countdown/status widget that explicitly shows no verified official AEMET A1 date until source-backed date data exists.

**Architecture:** Add a pure `countdown` domain helper with a typed verified-date input and dashboard display output. Render the output on the dashboard as a compact card. Do not add hardcoded future official dates.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Tailwind CSS.

---

## File Structure

- Create `apps/web/lib/countdown.ts`: countdown date types and pure display transformation.
- Create `apps/web/lib/countdown.test.ts`: TDD coverage for official-date safety and day calculations.
- Modify `apps/web/app/dashboard/page.tsx`: render the countdown status card.
- Modify `docs/PROJECT_MEMORY.md`: record widget status and remaining data blocker.
- Modify `docs/ROADMAP.md`: mark countdown widget shell complete and source-backed dates pending.

## Task 1: Countdown Domain Helper

**Files:**
- Create: `apps/web/lib/countdown.ts`
- Test: `apps/web/lib/countdown.test.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/web/lib/countdown.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { buildCountdownStatus } from "./countdown";

describe("countdown status", () => {
  it("returns an explicit no-date state when no verified official date exists", () => {
    const status = buildCountdownStatus({
      officialDate: null,
      today: "2026-07-05",
    });

    expect(status).toEqual({
      label: "Cuenta atrás oficial",
      value: "Sin fecha verificada",
      detail:
        "La próxima convocatoria o fecha de examen aparecerá aquí solo cuando exista una fuente oficial verificada.",
      sourceNote: "Fuente: TODO_VERIFY_OFFICIAL_SOURCE",
      state: "no_verified_date",
    });
  });

  it("ignores unverified date records", () => {
    const status = buildCountdownStatus({
      officialDate: {
        label: "Convocatoria",
        date: "2026-09-01",
        sourceUrl: "https://www.boe.es/",
        retrievedAt: "2026-07-05",
        verificationStatus: "needs_review",
      },
      today: "2026-07-05",
    });

    expect(status.state).toBe("no_verified_date");
    expect(status.value).toBe("Sin fecha verificada");
  });

  it("shows remaining days for a verified future date", () => {
    const status = buildCountdownStatus({
      officialDate: {
        label: "Convocatoria",
        date: "2026-07-20",
        sourceUrl: "https://www.boe.es/",
        retrievedAt: "2026-07-05",
        verificationStatus: "verified",
      },
      today: "2026-07-05",
    });

    expect(status).toEqual({
      label: "Convocatoria",
      value: "15 días",
      detail: "Fecha oficial verificada: 2026-07-20.",
      sourceNote: "Fuente verificada: https://www.boe.es/ · Recuperado: 2026-07-05",
      state: "future",
    });
  });

  it("shows when a verified date is today", () => {
    const status = buildCountdownStatus({
      officialDate: {
        label: "Examen",
        date: "2026-07-05",
        sourceUrl: "https://www.boe.es/",
        retrievedAt: "2026-07-05",
        verificationStatus: "verified",
      },
      today: "2026-07-05",
    });

    expect(status.value).toBe("Hoy");
    expect(status.state).toBe("today");
  });

  it("does not present past verified dates as upcoming", () => {
    const status = buildCountdownStatus({
      officialDate: {
        label: "Plazo de solicitud",
        date: "2026-07-01",
        sourceUrl: "https://www.boe.es/",
        retrievedAt: "2026-07-05",
        verificationStatus: "verified",
      },
      today: "2026-07-05",
    });

    expect(status.value).toBe("Hace 4 días");
    expect(status.state).toBe("past");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix apps/web test -- countdown`

Expected: fail because `./countdown` does not exist.

- [ ] **Step 3: Write minimal implementation**

Create `apps/web/lib/countdown.ts`:

```ts
import type { VerificationStatus } from "./types";

export type OfficialCountdownDate = {
  label: string;
  date: string;
  sourceUrl: string;
  retrievedAt: string;
  verificationStatus: VerificationStatus;
};

export type CountdownState =
  | "no_verified_date"
  | "future"
  | "today"
  | "past";

export type CountdownStatus = {
  label: string;
  value: string;
  detail: string;
  sourceNote: string;
  state: CountdownState;
};

type CountdownStatusInput = {
  officialDate: OfficialCountdownDate | null;
  today: string;
};

const millisecondsPerDay = 24 * 60 * 60 * 1000;

const noVerifiedDateStatus: CountdownStatus = {
  label: "Cuenta atrás oficial",
  value: "Sin fecha verificada",
  detail:
    "La próxima convocatoria o fecha de examen aparecerá aquí solo cuando exista una fuente oficial verificada.",
  sourceNote: "Fuente: TODO_VERIFY_OFFICIAL_SOURCE",
  state: "no_verified_date",
};

function getDayDelta(date: string, today: string): number {
  return Math.round(
    (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) /
      millisecondsPerDay,
  );
}

export function buildCountdownStatus({
  officialDate,
  today,
}: CountdownStatusInput): CountdownStatus {
  if (!officialDate || officialDate.verificationStatus !== "verified") {
    return noVerifiedDateStatus;
  }

  const dayDelta = getDayDelta(officialDate.date, today);
  const sourceNote = `Fuente verificada: ${officialDate.sourceUrl} · Recuperado: ${officialDate.retrievedAt}`;

  if (dayDelta > 0) {
    return {
      label: officialDate.label,
      value: `${dayDelta} días`,
      detail: `Fecha oficial verificada: ${officialDate.date}.`,
      sourceNote,
      state: "future",
    };
  }

  if (dayDelta === 0) {
    return {
      label: officialDate.label,
      value: "Hoy",
      detail: `Fecha oficial verificada: ${officialDate.date}.`,
      sourceNote,
      state: "today",
    };
  }

  return {
    label: officialDate.label,
    value: `Hace ${Math.abs(dayDelta)} días`,
    detail: `Fecha oficial verificada pasada: ${officialDate.date}.`,
    sourceNote,
    state: "past",
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix apps/web test -- countdown`

Expected: pass for `apps/web/lib/countdown.test.ts`.

## Task 2: Dashboard Widget

**Files:**
- Modify: `apps/web/app/dashboard/page.tsx`

- [ ] **Step 1: Import and build countdown status**

Add:

```ts
import { buildCountdownStatus } from "@/lib/countdown";
```

Inside `DashboardPage`, after `contentReadiness`:

```ts
const countdownStatus = buildCountdownStatus({
  officialDate: null,
  today: new Date().toISOString().slice(0, 10),
});
```

- [ ] **Step 2: Render dashboard card**

Add a section after `<ContentReadinessCard readiness={contentReadiness} />`:

```tsx
<section className="rounded-3xl border border-sky-200 bg-sky-50 p-6">
  <p className="text-sm font-medium text-sky-900">{countdownStatus.label}</p>
  <div className="mt-3 grid gap-2">
    <p className="text-3xl font-semibold tracking-tight text-sky-950">
      {countdownStatus.value}
    </p>
    <p className="text-sm leading-6 text-sky-900">{countdownStatus.detail}</p>
    <p className="text-xs text-sky-800">{countdownStatus.sourceNote}</p>
  </div>
</section>
```

- [ ] **Step 3: Run focused checks**

Run: `npm --prefix apps/web test -- countdown`

Expected: pass.

Run: `npm --prefix apps/web run lint`

Expected: exit 0.

## Task 3: Docs and Final Verification

**Files:**
- Modify: `docs/PROJECT_MEMORY.md`
- Modify: `docs/ROADMAP.md`

- [ ] **Step 1: Update roadmap**

In `docs/ROADMAP.md`, change the Phase 7 countdown bullet to:

```md
- Add countdown/status widget shell (complete; no source-backed official dates loaded)
```

- [ ] **Step 2: Update project memory**

Under Phase 7 status in `docs/PROJECT_MEMORY.md`, add:

```md
- Countdown/status widget shell implemented; it explicitly shows no verified official date until source-backed date records exist
```

Under Study content readiness or next recommended steps, keep the blocker explicit:

```md
- Source-backed official date records remain required before showing a real countdown to any convocatoria, deadline, or exam phase
```

- [ ] **Step 3: Run full verification**

Run: `npm --prefix apps/web test`

Expected: all tests pass.

Run: `npm --prefix apps/web run lint`

Expected: exit 0.

Run: `npm --prefix apps/web run build`

Expected: exit 0.

- [ ] **Step 4: Commit**

Run:

```bash
git add apps/web/lib/countdown.ts apps/web/lib/countdown.test.ts apps/web/app/dashboard/page.tsx docs/PROJECT_MEMORY.md docs/ROADMAP.md
git commit -m "feat(dashboard): add countdown status widget"
```

Expected: commit succeeds with one focused feature commit.

## Self-Review

- Spec coverage: plan covers typed helper, no-date behavior, verified-date future/today/past behavior, dashboard rendering, docs, and verification.
- Placeholder scan: no implementation placeholder remains; `TODO_VERIFY_OFFICIAL_SOURCE` is intentional user-facing unknown official source marker.
- Type consistency: `OfficialCountdownDate`, `CountdownStatus`, `CountdownState`, and `buildCountdownStatus` names match across test and implementation tasks.
