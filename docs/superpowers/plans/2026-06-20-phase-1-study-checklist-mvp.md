# Phase 1 Study Checklist MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a read-only Phase 1 study checklist with shared topic data, tested progress helpers, a real topic detail route, and dashboard metrics derived from topic state.

**Architecture:** Keep Phase 1 local and deterministic. Expand the topic domain model in `apps/web/lib`, add pure helper functions for all progress calculations, and have the `/topics`, `/topics/[id]`, and `/dashboard` routes consume those helpers rather than duplicating logic in JSX.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Vitest

---

## File Structure

**Create:**
- `apps/web/lib/topic-progress.ts`
- `apps/web/lib/topic-progress.test.ts`
- `apps/web/app/topics/[id]/page.tsx`
- `apps/web/app/topics/[id]/not-found.tsx`

**Modify:**
- `apps/web/package.json`
- `apps/web/lib/types.ts`
- `apps/web/lib/mock-data.ts`
- `apps/web/app/topics/page.tsx`
- `apps/web/app/dashboard/page.tsx`
- `README.md`

## Task 1: Add Test Tooling And Expand The Topic Domain Model

**Files:**
- Modify: `apps/web/package.json`
- Modify: `apps/web/lib/types.ts`
- Test: `apps/web/lib/topic-progress.test.ts`

- [ ] **Step 1: Write the failing test for topic progress helpers**

Create `apps/web/lib/topic-progress.test.ts` with:

```ts
import { describe, expect, it } from "vitest";

import type { Topic } from "./types";
import {
  buildBlockSummaries,
  countExamReadyTopics,
  countTouchedTopics,
  selectWeakTopics,
} from "./topic-progress";

const topics: Topic[] = [
  {
    id: "math-01",
    block: "Mathematics",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
    normalizedTitle: "Calculus foundations",
    status: "in_progress",
    confidence: 2,
    priority: "high",
    nextReviewAt: "2026-06-21",
    verificationStatus: "unverified",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortDescription: "Limits, derivatives, and integration fundamentals.",
    studyFocus: "Rebuild confidence with core formulas and worked examples.",
    relatedQuestionCount: 0,
    notesStatus: "No notes yet",
  },
  {
    id: "met-01",
    block: "Meteorology and Climatology",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
    normalizedTitle: "Atmospheric thermodynamics",
    status: "not_started",
    confidence: 1,
    priority: "high",
    nextReviewAt: "Pending schedule",
    verificationStatus: "needs_review",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortDescription: "Thermodynamic variables and parcel processes.",
    studyFocus: "Map the chapter before starting question practice.",
    relatedQuestionCount: 0,
    notesStatus: "No notes yet",
  },
  {
    id: "gen-01",
    block: "General/Common",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
    normalizedTitle: "Spanish public administration basics",
    status: "exam_ready",
    confidence: 5,
    priority: "medium",
    nextReviewAt: "2026-06-24",
    verificationStatus: "unverified",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortDescription: "State structure and public-sector fundamentals.",
    studyFocus: "Keep this ready with light spaced review.",
    relatedQuestionCount: 0,
    notesStatus: "Outline complete",
  },
];

describe("topic progress helpers", () => {
  it("counts touched topics as every topic not in not_started", () => {
    expect(countTouchedTopics(topics)).toBe(2);
  });

  it("counts exam ready topics from the shared topic list", () => {
    expect(countExamReadyTopics(topics)).toBe(1);
  });

  it("selects weak topics by low confidence and excludes exam ready topics", () => {
    expect(selectWeakTopics(topics)).toEqual([
      {
        id: "math-01",
        label: "Mathematics: Calculus foundations",
        confidence: 2,
        status: "in_progress",
        verificationStatus: "unverified",
      },
      {
        id: "met-01",
        label: "Meteorology and Climatology: Atmospheric thermodynamics",
        confidence: 1,
        status: "not_started",
        verificationStatus: "needs_review",
      },
    ]);
  });

  it("builds block summaries from topic counts", () => {
    expect(buildBlockSummaries(topics)).toEqual([
      {
        block: "General/Common",
        totalTopics: 1,
        touchedTopics: 1,
        examReadyTopics: 1,
      },
      {
        block: "Mathematics",
        totalTopics: 1,
        touchedTopics: 1,
        examReadyTopics: 0,
      },
      {
        block: "Meteorology and Climatology",
        totalTopics: 1,
        touchedTopics: 0,
        examReadyTopics: 0,
      },
    ]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test --workspace web -- apps/web/lib/topic-progress.test.ts
```

Expected: FAIL because the `test` script and `apps/web/lib/topic-progress.ts` do not exist yet.

- [ ] **Step 3: Add Vitest and the test script**

Update `apps/web/package.json` to:

```json
{
  "name": "web",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack",
    "start": "next start",
    "lint": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "autoprefixer": "latest",
    "postcss": "latest",
    "tailwindcss": "^3.4.17",
    "typescript": "latest",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 4: Expand the topic types to support detail pages and helper outputs**

Replace `apps/web/lib/types.ts` with:

```ts
export type VerificationStatus =
  | "verified"
  | "unverified"
  | "needs_review"
  | "deprecated";

export type TopicStatus =
  | "not_started"
  | "in_progress"
  | "first_pass"
  | "reviewed"
  | "exam_ready";

export type TopicPriority = "high" | "medium" | "low";

export type Topic = {
  id: string;
  block: string;
  officialNumber: string;
  officialTitle: string;
  normalizedTitle: string;
  status: TopicStatus;
  confidence: number;
  priority: TopicPriority;
  nextReviewAt: string;
  verificationStatus: VerificationStatus;
  sourceUrl: string;
  retrievedAt: string;
  shortDescription?: string;
  studyFocus?: string;
  relatedQuestionCount?: number;
  notesStatus?: string;
};

export type TopicWeakness = {
  id: string;
  label: string;
  confidence: number;
  status: TopicStatus;
  verificationStatus: VerificationStatus;
};

export type TopicBlockSummary = {
  block: string;
  totalTopics: number;
  touchedTopics: number;
  examReadyTopics: number;
};

export type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
};

export type StudyMission = {
  mainTopic: string;
  practiceBlock: string;
  reviewBlock: string;
  output: string;
};

export type RouteCard = {
  href: string;
  title: string;
  description: string;
};
```

- [ ] **Step 5: Run the test again to verify it still fails for the right reason**

Run:

```bash
npm run test --workspace web -- apps/web/lib/topic-progress.test.ts
```

Expected: FAIL because `./topic-progress` does not exist yet, proving the test target is still missing.

- [ ] **Step 6: Commit the tooling and type contract**

Run:

```bash
git add apps/web/package.json apps/web/lib/types.ts apps/web/lib/topic-progress.test.ts package-lock.json
git commit -m "test(web): add topic progress test scaffold"
```

## Task 2: Implement Mock Topic Data And Pure Progress Helpers

**Files:**
- Create: `apps/web/lib/topic-progress.ts`
- Modify: `apps/web/lib/mock-data.ts`
- Test: `apps/web/lib/topic-progress.test.ts`

- [ ] **Step 1: Write the minimal implementation for the tested helper functions**

Create `apps/web/lib/topic-progress.ts` with:

```ts
import type { Topic, TopicBlockSummary, TopicWeakness } from "./types";

export function countTouchedTopics(topics: Topic[]): number {
  return topics.filter((topic) => topic.status !== "not_started").length;
}

export function countExamReadyTopics(topics: Topic[]): number {
  return topics.filter((topic) => topic.status === "exam_ready").length;
}

export function selectWeakTopics(topics: Topic[]): TopicWeakness[] {
  return topics
    .filter((topic) => topic.status !== "exam_ready")
    .sort((left, right) => left.confidence - right.confidence)
    .slice(0, 3)
    .map((topic) => ({
      id: topic.id,
      label: `${topic.block}: ${topic.normalizedTitle}`,
      confidence: topic.confidence,
      status: topic.status,
      verificationStatus: topic.verificationStatus,
    }));
}

export function buildBlockSummaries(topics: Topic[]): TopicBlockSummary[] {
  const grouped = new Map<string, Topic[]>();

  for (const topic of topics) {
    const existing = grouped.get(topic.block) ?? [];
    existing.push(topic);
    grouped.set(topic.block, existing);
  }

  return [...grouped.entries()]
    .map(([block, blockTopics]) => ({
      block,
      totalTopics: blockTopics.length,
      touchedTopics: countTouchedTopics(blockTopics),
      examReadyTopics: countExamReadyTopics(blockTopics),
    }))
    .sort((left, right) => left.block.localeCompare(right.block));
}
```

- [ ] **Step 2: Run the helper tests to verify they pass**

Run:

```bash
npm run test --workspace web -- apps/web/lib/topic-progress.test.ts
```

Expected: PASS with 4 tests passing.

- [ ] **Step 3: Replace the summary-only mock topic list with full topic records**

Update `apps/web/lib/mock-data.ts` to:

```ts
import type { DashboardMetric, RouteCard, StudyMission, Topic } from "@/lib/types";

import { countExamReadyTopics, countTouchedTopics } from "@/lib/topic-progress";

export const routeCards: RouteCard[] = [
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Morning mission, weekly hours, progress, and monitoring status.",
  },
  {
    href: "/topics",
    title: "Topics",
    description: "Official syllabus checklist placeholder with mock unverified items.",
  },
  {
    href: "/questions",
    title: "Questions",
    description: "Practice bank placeholder for past exams and practical cases.",
  },
  {
    href: "/calendar",
    title: "Calendar",
    description: "Study planning around the fixed 12:30–23:00 work schedule.",
  },
  {
    href: "/focus",
    title: "Focus",
    description: "Timeboxed sessions with defined outputs and review decisions.",
  },
  {
    href: "/monitoring",
    title: "Monitoring",
    description: "Manual BOE/AEMET monitoring status until automation exists.",
  },
  {
    href: "/settings",
    title: "Settings",
    description: "Future profile, integrations, verification, and reminders setup.",
  },
];

export const studyMission: StudyMission = {
  mainTopic: "07:30–09:00 deep technical topic",
  practiceBlock: "09:10–10:10 questions or practical case",
  reviewBlock: "10:20–11:00 legal, informatics or flashcards",
  output: "Update confidence, log mistakes, and define the next review date.",
};

export const topics: Topic[] = [
  {
    id: "math-01",
    block: "Mathematics",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
    normalizedTitle: "Calculus foundations",
    status: "in_progress",
    confidence: 2,
    priority: "high",
    nextReviewAt: "2026-06-21",
    verificationStatus: "unverified",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortDescription: "Limits, derivatives, and integration fundamentals.",
    studyFocus: "Rebuild confidence with core formulas and worked examples.",
    relatedQuestionCount: 0,
    notesStatus: "No notes yet",
  },
  {
    id: "met-01",
    block: "Meteorology and Climatology",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
    normalizedTitle: "Atmospheric thermodynamics",
    status: "not_started",
    confidence: 1,
    priority: "high",
    nextReviewAt: "Pending schedule",
    verificationStatus: "needs_review",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortDescription: "Thermodynamic variables and parcel processes.",
    studyFocus: "Map the chapter before starting question practice.",
    relatedQuestionCount: 0,
    notesStatus: "No notes yet",
  },
  {
    id: "inf-01",
    block: "Informatics and Communications",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
    normalizedTitle: "Computer networks and protocols",
    status: "reviewed",
    confidence: 4,
    priority: "medium",
    nextReviewAt: "2026-06-23",
    verificationStatus: "unverified",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortDescription: "Networking layers, addressing, and communication models.",
    studyFocus: "Keep protocol families and examples fresh.",
    relatedQuestionCount: 0,
    notesStatus: "Flashcards started",
  },
  {
    id: "gen-01",
    block: "General/Common",
    officialNumber: "TODO_VERIFY_OFFICIAL_SOURCE",
    officialTitle: "TODO_VERIFY_OFFICIAL_SOURCE",
    normalizedTitle: "Spanish public administration basics",
    status: "first_pass",
    confidence: 3,
    priority: "medium",
    nextReviewAt: "Next weekday review block",
    verificationStatus: "unverified",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    shortDescription: "State structure and public-sector fundamentals.",
    studyFocus: "Link constitutional structure to common exam prompts.",
    relatedQuestionCount: 0,
    notesStatus: "Outline complete",
  },
];

export function buildDashboardMetrics(): DashboardMetric[] {
  return [
    {
      label: "Weekly study target",
      value: "8.5 h",
      detail: "Mock target based on three morning blocks across five weekdays.",
    },
    {
      label: "Topics touched",
      value: `${countTouchedTopics(topics)} / ${topics.length}`,
      detail: "Mock progress only. Exact syllabus wording is TODO_VERIFY_OFFICIAL_SOURCE.",
    },
    {
      label: "Exam-ready topics",
      value: `${countExamReadyTopics(topics)}`,
      detail: "Read-only Phase 1 data derived from the shared topic checklist.",
    },
    {
      label: "Monitoring",
      value: "Manual only",
      detail: "Automation is not implemented yet.",
    },
  ];
}
```

- [ ] **Step 4: Extend the test file with an unverified-metadata assertion**

Add this test to `apps/web/lib/topic-progress.test.ts`:

```ts
  it("keeps TODO_VERIFY_OFFICIAL_SOURCE metadata intact in the topic fixtures", () => {
    expect(topics[0]?.officialTitle).toBe("TODO_VERIFY_OFFICIAL_SOURCE");
    expect(topics[0]?.sourceUrl).toBe("TODO_VERIFY_OFFICIAL_SOURCE");
  });
```

Update the imports at the top of the same file to:

```ts
import { topics } from "./mock-data";
```

- [ ] **Step 5: Run the tests again**

Run:

```bash
npm run test --workspace web -- apps/web/lib/topic-progress.test.ts
```

Expected: PASS with 5 tests passing.

- [ ] **Step 6: Commit the helpers and mock dataset**

Run:

```bash
git add apps/web/lib/mock-data.ts apps/web/lib/topic-progress.ts apps/web/lib/topic-progress.test.ts
git commit -m "feat(web): add topic progress helpers"
```

## Task 3: Build The Read-Only Topics Checklist Page

**Files:**
- Modify: `apps/web/app/topics/page.tsx`
- Modify: `apps/web/lib/mock-data.ts`
- Modify: `apps/web/lib/types.ts`

- [ ] **Step 1: Write the failing page-level expectation as a TypeScript check**

Add a temporary export to `apps/web/app/topics/page.tsx` that references `topics` fields not present in the old UI:

```ts
void topics.map((topic) => topic.normalizedTitle);
void topics.map((topic) => topic.priority);
void topics.map((topic) => topic.nextReviewAt);
```

This is a temporary red step to force the page to consume the richer contract before the JSX rewrite.

- [ ] **Step 2: Run the type checker to verify the page fails before the rewrite**

Run:

```bash
npm run lint --workspace web
```

Expected: FAIL if the page still imports the old `topicSummaries` name or no longer matches the new data shape.

- [ ] **Step 3: Replace the placeholder table with a real checklist page**

Replace `apps/web/app/topics/page.tsx` with:

```tsx
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { topics } from "@/lib/mock-data";
import { buildBlockSummaries } from "@/lib/topic-progress";

const blockSummaries = buildBlockSummaries(topics);

export default function TopicsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Topics"
        title="Study checklist"
        description="Read-only Phase 1 checklist built from mock topic data. Exact BOE wording, numbering, and sources remain TODO_VERIFY_OFFICIAL_SOURCE until official verification is added."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {blockSummaries.map((summary) => (
          <article key={summary.block} className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
            <p className="text-sm text-ink/60">{summary.block}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{summary.touchedTopics}/{summary.totalTopics}</p>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              {summary.examReadyTopics} exam-ready topic{summary.examReadyTopics === 1 ? "" : "s"} in this block.
            </p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.id}`}
            className="block rounded-3xl border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">{topic.block}</p>
                <h2 className="text-2xl font-semibold tracking-tight text-ink">{topic.normalizedTitle}</h2>
                <p className="text-sm text-ink/70">Official number: {topic.officialNumber}</p>
                <p className="text-sm leading-6 text-ink/75">{topic.shortDescription}</p>
              </div>
              <dl className="grid gap-3 text-sm text-ink/80 sm:grid-cols-2 lg:min-w-[22rem]">
                <div>
                  <dt className="text-ink/50">Status</dt>
                  <dd>{topic.status}</dd>
                </div>
                <div>
                  <dt className="text-ink/50">Confidence</dt>
                  <dd>{topic.confidence}/5</dd>
                </div>
                <div>
                  <dt className="text-ink/50">Priority</dt>
                  <dd>{topic.priority}</dd>
                </div>
                <div>
                  <dt className="text-ink/50">Next review</dt>
                  <dd>{topic.nextReviewAt}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-ink/50">Verification</dt>
                  <dd>{topic.verificationStatus}</dd>
                </div>
              </dl>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Run the type checker again to verify the checklist page compiles**

Run:

```bash
npm run lint --workspace web
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 5: Commit the checklist page**

Run:

```bash
git add apps/web/app/topics/page.tsx
git commit -m "feat(web): build read-only topics checklist"
```

## Task 4: Build The Topic Detail Route And Not-Found State

**Files:**
- Create: `apps/web/app/topics/[id]/page.tsx`
- Create: `apps/web/app/topics/[id]/not-found.tsx`
- Modify: `apps/web/lib/mock-data.ts`

- [ ] **Step 1: Write the failing route usage through the type checker**

Create `apps/web/app/topics/[id]/page.tsx` with this intentionally incomplete draft:

```tsx
type TopicDetailPageProps = {
  params: {
    id: string;
  };
};

export default function TopicDetailPage({ params }: TopicDetailPageProps) {
  return params.id;
}
```

- [ ] **Step 2: Run the type checker to verify the route is present but incomplete**

Run:

```bash
npm run lint --workspace web
```

Expected: PASS or neutral. This step exists to ensure the route file is recognized before filling in the real implementation.

- [ ] **Step 3: Implement the topic detail page and explicit not-found state**

Replace `apps/web/app/topics/[id]/page.tsx` with:

```tsx
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { topics } from "@/lib/mock-data";

type TopicDetailPageProps = {
  params: {
    id: string;
  };
};

export default function TopicDetailPage({ params }: TopicDetailPageProps) {
  const topic = topics.find((entry) => entry.id === params.id);

  if (!topic) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={topic.block}
        title={topic.normalizedTitle}
        description="Read-only Phase 1 topic detail. Official wording and source metadata remain explicitly marked until verified official imports exist."
      />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Official metadata</h2>
          <dl className="mt-4 grid gap-4 text-sm text-ink/80">
            <div>
              <dt className="text-ink/50">Official number</dt>
              <dd>{topic.officialNumber}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Official title</dt>
              <dd>{topic.officialTitle}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Source URL</dt>
              <dd>{topic.sourceUrl}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Retrieved at</dt>
              <dd>{topic.retrievedAt}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Verification</dt>
              <dd>{topic.verificationStatus}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Study state</h2>
          <dl className="mt-4 grid gap-4 text-sm text-ink/80">
            <div>
              <dt className="text-ink/50">Status</dt>
              <dd>{topic.status}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Confidence</dt>
              <dd>{topic.confidence}/5</dd>
            </div>
            <div>
              <dt className="text-ink/50">Priority</dt>
              <dd>{topic.priority}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Next review</dt>
              <dd>{topic.nextReviewAt}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Study focus</dt>
              <dd>{topic.studyFocus ?? "No study focus defined yet."}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Notes status</dt>
              <dd>{topic.notesStatus ?? "No notes status defined yet."}</dd>
            </div>
          </dl>
        </article>
      </section>
    </div>
  );
}
```

Create `apps/web/app/topics/[id]/not-found.tsx` with:

```tsx
import Link from "next/link";

export default function TopicNotFound() {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-[0.15em] text-accent">Topics</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Topic not found</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
        The requested topic does not exist in the current mock Phase 1 dataset.
      </p>
      <Link
        href="/topics"
        className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
      >
        Back to checklist
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Run the type checker to verify the new route builds**

Run:

```bash
npm run lint --workspace web
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 5: Commit the detail route**

Run:

```bash
git add apps/web/app/topics/[id]/page.tsx apps/web/app/topics/[id]/not-found.tsx
git commit -m "feat(web): add topic detail route"
```

## Task 5: Derive Dashboard Progress From Topic Data And Verify The Full Slice

**Files:**
- Modify: `apps/web/app/dashboard/page.tsx`
- Modify: `README.md`
- Test: `apps/web/lib/topic-progress.test.ts`

- [ ] **Step 1: Write the failing dashboard integration check through TypeScript**

Replace the old topic import line in `apps/web/app/dashboard/page.tsx` with:

```ts
import { buildDashboardMetrics, studyMission, topics } from "@/lib/mock-data";
import { selectWeakTopics } from "@/lib/topic-progress";
```

Leave the old `dashboardMetrics` and `topicSummaries` references in place temporarily.

- [ ] **Step 2: Run the type checker to verify the dashboard currently fails**

Run:

```bash
npm run lint --workspace web
```

Expected: FAIL because the old identifiers no longer exist in the file.

- [ ] **Step 3: Replace hardcoded dashboard progress with derived values**

Replace `apps/web/app/dashboard/page.tsx` with:

```tsx
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { PlaceholderPanel } from "@/components/placeholder-panel";
import { buildDashboardMetrics, studyMission, topics } from "@/lib/mock-data";
import { selectWeakTopics } from "@/lib/topic-progress";

const dashboardMetrics = buildDashboardMetrics();
const weakTopics = selectWeakTopics(topics);

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Morning mission and progress overview"
        description="Dashboard scaffold for the candidate’s default study rhythm. Topic progress is derived from the shared read-only Phase 1 checklist, while monitoring and countdown data remain placeholders."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <PlaceholderPanel
          title="Today’s study mission"
          description="Structured daily mission based on the candidate’s fixed afternoon and evening work schedule."
          bullets={[
            studyMission.mainTopic,
            studyMission.practiceBlock,
            studyMission.reviewBlock,
            studyMission.output,
          ]}
        />
        <PlaceholderPanel
          title="Weak topics"
          description="Lowest-confidence topics from the shared mock checklist, shown here to keep review priorities visible."
          bullets={weakTopics.map(
            (topic) =>
              `${topic.label} (${topic.status}, confidence ${topic.confidence}/5, ${topic.verificationStatus})`,
          )}
        />
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Update the status line in `README.md`**

Replace:

```md
## Current status

Foundation phase.
```

With:

```md
## Current status

Phase 1 in progress: read-only study checklist MVP.
```

- [ ] **Step 5: Run the full verification commands**

Run:

```bash
npm run test --workspace web
npm run lint --workspace web
npm run build --workspace web
```

Expected:
- `npm run test --workspace web`: PASS with all topic helper tests green
- `npm run lint --workspace web`: PASS with no TypeScript errors
- `npm run build --workspace web`: PASS with a successful Next.js production build

- [ ] **Step 6: Commit the dashboard integration and status update**

Run:

```bash
git add apps/web/app/dashboard/page.tsx README.md
git commit -m "feat(web): derive dashboard progress from topics"
```

## Final Review Checklist

- [ ] The topic list route is read-only and links to detail pages
- [ ] The topic detail route shows explicit verification metadata
- [ ] No route claims official verification where it does not exist
- [ ] Topic progress is derived from shared helper functions
- [ ] Helper behavior is covered by automated tests
- [ ] `README.md` reflects that the repo has moved beyond foundation-only scaffolding
