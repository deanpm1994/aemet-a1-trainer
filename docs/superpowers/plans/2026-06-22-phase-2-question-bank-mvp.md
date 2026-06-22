# Phase 2 Question Bank MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a read-only Phase 2 question bank with shared mock question data, tested filter and summary helpers, copied Notion schema reference docs, and updated project status docs that mark Phase 1 complete.

**Architecture:** Keep Phase 2 local and deterministic, matching the Phase 1 approach. Add question domain types and fixtures under `apps/web/lib`, compute all question-bank summaries through pure helper functions, and have `/questions` consume those helpers while project docs track the current phase and future Notion mapping reference.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Tailwind CSS, git

---

### Task 1: Copy reference docs and close Phase 1 status messaging

**Files:**
- Create: `docs/NOTION_DATABASE_SCHEMAS.md`
- Modify: `README.md`
- Modify: `docs/ROADMAP.md`

- [ ] **Step 1: Write the failing documentation expectations**

Create `docs/phase-status.test.md` locally as a checklist for manual verification:

```md
- `docs/NOTION_DATABASE_SCHEMAS.md` exists and matches the external source pack schema headings.
- `README.md` no longer says "Phase 1 in progress".
- `README.md` says Phase 1 is complete and Phase 2 is active.
- `docs/ROADMAP.md` labels Phase 1 as complete.
- `docs/ROADMAP.md` labels Phase 2 as current.
```

- [ ] **Step 2: Verify the expectations fail against current docs**

Run: `rg -n "Phase 1 in progress|Phase 1 —|Phase 2 —|Question bank MVP|Notion Database Schemas" README.md docs/ROADMAP.md docs/NOTION_DATABASE_SCHEMAS.md`

Expected:
- `README.md` contains `Phase 1 in progress: read-only study checklist MVP.`
- `docs/NOTION_DATABASE_SCHEMAS.md` does not exist yet
- `docs/ROADMAP.md` has plain Phase 1 and Phase 2 headings without completion/current wording

- [ ] **Step 3: Copy the Notion schema reference and update status docs**

Create `docs/NOTION_DATABASE_SCHEMAS.md` with this content:

```md
# Notion Database Schemas

## Topics

Properties:
- Name: title
- Topic ID: text
- Block: select
- Official Number: number
- Official Text: text
- Short Title: text
- Priority: select High / Medium / Low
- Status: select Not started / In progress / First pass / Reviewed / Exam-ready
- Confidence: number 1–5
- Source URL: url
- Source Ref: text
- Retrieved At: date
- Verification Status: select verified / unverified / needs_review / deprecated
- Last Studied: date
- Next Review: date
- Notes: text

## Questions

Properties:
- Name: title
- Question ID: text
- Type: select multiple_choice / practical_case / formula / flashcard / legal_short_answer
- Source Year: number
- Source Exam: text
- Source URL: url
- Retrieved At: date
- Verification Status: select verified / unverified / needs_review / deprecated
- Question Number: text
- Statement: text
- Options: text
- Correct Answer: text
- Answer Source Status: select official / inferred / user / unknown
- Explanation: text
- Topics: relation to Topics
- Difficulty: select 1 / 2 / 3 / 4 / 5
- Attempts Count: number
- Last Attempt: date
- Next Review: date
- Mistake Type: multi-select concept / formula / units / reading / legal_wording / time_management / none

## Bibliography

Properties:
- Name: title
- Authors: text
- Year: number
- Block: multi-select
- Category: select
- Priority: select Core / Useful / Optional
- Source Type: select AEMET recommended / official / complementary
- Source URL: url
- Verification Status: select verified / unverified / needs_review / deprecated
- Notes: text

## Study Sessions

Properties:
- Name: title
- Planned Start: date
- Planned End: date
- Actual Start: date
- Actual End: date
- Session Type: select deep_topic / questions / practical_case / legal / informatics / flashcards / review / mock_exam
- Objective: text
- Topics: relation to Topics
- Questions: relation to Questions
- Completed: checkbox
- Focus Score: number
- Notes Created: checkbox
- Questions Solved: number
- Flashcards Created: number
- Mistakes Logged: number
- Confidence After: number
- Next Review: date

## Monitoring Sources

Properties:
- Name: title
- URL: url
- Source Type: select BOE / AEMET / AdministracionGob / MITECO / Other
- Keywords: multi-select
- Check Frequency: select weekly / daily / every_2_days / manual
- Last Checked: date
- Last Hash: text
- Last Change: date
- Status: select active / paused / needs_review
- Notes: text
```

Update `README.md` current status block to:

```md
## Current status

Phase 1 complete: read-only study checklist MVP.
Phase 2 active: question bank MVP.
```

Update `docs/ROADMAP.md` phase headings to:

```md
## Phase 1 — Study checklist MVP (complete)
```

```md
## Phase 2 — Question bank MVP (current)
```

- [ ] **Step 4: Re-run doc verification**

Run: `rg -n "Phase 1 in progress|Phase 1 — Study checklist MVP \\(complete\\)|Phase 2 — Question bank MVP \\(current\\)|# Notion Database Schemas" README.md docs/ROADMAP.md docs/NOTION_DATABASE_SCHEMAS.md`

Expected:
- no `Phase 1 in progress`
- `README.md` shows `Phase 1 complete` and `Phase 2 active`
- `docs/ROADMAP.md` shows complete/current wording
- `docs/NOTION_DATABASE_SCHEMAS.md` exists with the expected heading

- [ ] **Step 5: Commit**

```bash
git add README.md docs/ROADMAP.md docs/NOTION_DATABASE_SCHEMAS.md
git commit -m "docs(phase2): add notion schema reference and update phase status"
```

### Task 2: Add question domain types and shared mock data

**Files:**
- Modify: `apps/web/lib/types.ts`
- Modify: `apps/web/lib/mock-data.ts`
- Test: `apps/web/lib/question-bank.test.ts`

- [ ] **Step 1: Write the failing test for question fixtures and route data**

Create `apps/web/lib/question-bank.test.ts` with:

```ts
import { describe, expect, it } from "vitest";

import { questions, routeCards } from "./mock-data";

describe("question fixtures", () => {
  it("exposes a non-empty question bank fixture list", () => {
    expect(questions.length).toBeGreaterThan(0);
  });

  it("includes source and verification metadata for every question", () => {
    expect(questions.every((question) => question.sourceUrl.length > 0)).toBe(true);
    expect(questions.every((question) => question.retrievedAt.length > 0)).toBe(true);
    expect(questions.every((question) => question.verificationStatus.length > 0)).toBe(true);
  });

  it("keeps TODO_VERIFY_OFFICIAL_SOURCE markers in unverified fixtures", () => {
    expect(
      questions.some(
        (question) =>
          question.verificationStatus !== "verified" &&
          question.sourceUrl === "TODO_VERIFY_OFFICIAL_SOURCE",
      ),
    ).toBe(true);
  });

  it("updates the questions route card to describe a real question bank", () => {
    expect(routeCards.find((card) => card.href === "/questions")?.description).toContain(
      "Read-only question bank",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm --prefix apps/web test -- question-bank.test.ts`

Expected: FAIL with errors because `questions` is not exported yet and the route card description still says placeholder.

- [ ] **Step 3: Add question types and fixture data**

Append these types to `apps/web/lib/types.ts` after `Topic`-related types:

```ts
export type QuestionType =
  | "multiple_choice"
  | "practical_case"
  | "formula"
  | "flashcard"
  | "legal_short_answer";

export type AnswerSourceStatus = "official" | "inferred" | "user" | "unknown";

export type MistakeType =
  | "concept"
  | "formula"
  | "units"
  | "reading"
  | "legal_wording"
  | "time_management"
  | "none";

export type Question = {
  id: string;
  name: string;
  type: QuestionType;
  sourceYear: number;
  sourceExam: string;
  sourceUrl: string;
  retrievedAt: string;
  verificationStatus: VerificationStatus;
  questionNumber: string;
  statement: string;
  options: string[];
  correctAnswer: string;
  answerSourceStatus: AnswerSourceStatus;
  explanation: string;
  topicIds: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  attemptsCount: number;
  lastAttemptAt: string;
  nextReviewAt: string;
  mistakeTypes: MistakeType[];
};

export type QuestionFilters = {
  type: QuestionType | "all";
  verificationStatus: VerificationStatus | "all";
  difficulty: Question["difficulty"] | "all";
  mistakeType: MistakeType | "all";
};
```

Update `apps/web/lib/mock-data.ts` imports and exports to include `Question`, then add:

```ts
export const questions: Question[] = [
  {
    id: "q-met-thermo-01",
    name: "Atmospheric stability basics",
    type: "multiple_choice",
    sourceYear: 2024,
    sourceExam: "Mock AEMET A1 set",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    verificationStatus: "unverified",
    questionNumber: "1",
    statement:
      "Which process most directly increases the relative humidity of an unsaturated air parcel if water vapor content stays constant?",
    options: [
      "Increasing parcel temperature",
      "Decreasing parcel temperature",
      "Increasing pressure altitude definition only",
      "Reducing cloud condensation nuclei",
    ],
    correctAnswer: "Decreasing parcel temperature",
    answerSourceStatus: "inferred",
    explanation:
      "Cooling an unsaturated parcel raises relative humidity when vapor content does not change.",
    topicIds: ["met-01"],
    difficulty: 2,
    attemptsCount: 3,
    lastAttemptAt: "2026-06-20",
    nextReviewAt: "2026-06-21",
    mistakeTypes: ["concept"],
  },
  {
    id: "q-math-calc-01",
    name: "Gradient and extrema review",
    type: "formula",
    sourceYear: 2023,
    sourceExam: "Mock AEMET A1 set",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    verificationStatus: "needs_review",
    questionNumber: "7",
    statement:
      "For a differentiable function, what condition must hold at an interior local maximum point?",
    options: [
      "The derivative must be zero if it exists",
      "The second derivative must always be positive",
      "The function must be discontinuous nearby",
      "The gradient must increase without bound",
    ],
    correctAnswer: "The derivative must be zero if it exists",
    answerSourceStatus: "inferred",
    explanation:
      "At an interior local maximum, the first derivative vanishes when the derivative exists.",
    topicIds: ["math-01"],
    difficulty: 3,
    attemptsCount: 5,
    lastAttemptAt: "2026-06-18",
    nextReviewAt: "2026-06-19",
    mistakeTypes: ["formula", "time_management"],
  },
  {
    id: "q-gen-admin-01",
    name: "Public administration fundamentals",
    type: "legal_short_answer",
    sourceYear: 2022,
    sourceExam: "Mock AEMET A1 set",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    verificationStatus: "unverified",
    questionNumber: "12",
    statement:
      "Name one constitutional principle that constrains public administration action and explain it briefly.",
    options: [],
    correctAnswer: "TODO_VERIFY_OFFICIAL_SOURCE",
    answerSourceStatus: "unknown",
    explanation:
      "Short-answer review item used to rehearse legal wording before verified sources are imported.",
    topicIds: ["gen-01"],
    difficulty: 4,
    attemptsCount: 1,
    lastAttemptAt: "2026-06-21",
    nextReviewAt: "2026-06-25",
    mistakeTypes: ["legal_wording"],
  },
  {
    id: "q-inf-networks-01",
    name: "TCP/IP protocol stack quick check",
    type: "flashcard",
    sourceYear: 2024,
    sourceExam: "Mock AEMET A1 set",
    sourceUrl: "TODO_VERIFY_OFFICIAL_SOURCE",
    retrievedAt: "TODO_VERIFY_OFFICIAL_SOURCE",
    verificationStatus: "unverified",
    questionNumber: "19",
    statement: "Which transport protocol is connection-oriented: TCP or UDP?",
    options: ["TCP", "UDP"],
    correctAnswer: "TCP",
    answerSourceStatus: "inferred",
    explanation: "TCP is connection-oriented and adds reliability guarantees.",
    topicIds: ["inf-01"],
    difficulty: 1,
    attemptsCount: 2,
    lastAttemptAt: "2026-06-22",
    nextReviewAt: "2026-06-27",
    mistakeTypes: ["none"],
  },
];
```

Change the `/questions` route card in `routeCards` to:

```ts
{
  href: "/questions",
  title: "Questions",
  description: "Read-only question bank for past-exam practice, formulas, and legal review.",
},
```

- [ ] **Step 4: Run the fixture test to verify it passes**

Run: `npm --prefix apps/web test -- question-bank.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web/lib/types.ts apps/web/lib/mock-data.ts apps/web/lib/question-bank.test.ts
git commit -m "feat(phase2): add question domain model and mock data"
```

### Task 3: Add pure question-bank helpers with test coverage

**Files:**
- Create: `apps/web/lib/question-bank.ts`
- Modify: `apps/web/lib/question-bank.test.ts`

- [ ] **Step 1: Expand the failing test with filter and summary expectations**

Append these tests to `apps/web/lib/question-bank.test.ts`:

```ts
import {
  buildQuestionStats,
  getDefaultQuestionFilters,
  getOverdueQuestions,
  getPracticePainPoints,
  matchesQuestionFilters,
} from "./question-bank";

describe("question bank helpers", () => {
  it("returns default filters that keep all questions visible", () => {
    expect(getDefaultQuestionFilters()).toEqual({
      type: "all",
      verificationStatus: "all",
      difficulty: "all",
      mistakeType: "all",
    });
  });

  it("filters by question type", () => {
    expect(
      questions.filter((question) =>
        matchesQuestionFilters(question, {
          type: "formula",
          verificationStatus: "all",
          difficulty: "all",
          mistakeType: "all",
        }),
      ),
    ).toHaveLength(1);
  });

  it("filters by mistake type", () => {
    expect(
      questions.filter((question) =>
        matchesQuestionFilters(question, {
          type: "all",
          verificationStatus: "all",
          difficulty: "all",
          mistakeType: "legal_wording",
        }),
      )[0]?.id,
    ).toBe("q-gen-admin-01");
  });

  it("builds counts by type, verification status, and mistake type", () => {
    expect(buildQuestionStats(questions)).toEqual({
      total: 4,
      byType: {
        multiple_choice: 1,
        practical_case: 0,
        formula: 1,
        flashcard: 1,
        legal_short_answer: 1,
      },
      byVerificationStatus: {
        verified: 0,
        unverified: 3,
        needs_review: 1,
        deprecated: 0,
      },
      byMistakeType: {
        concept: 1,
        formula: 1,
        units: 0,
        reading: 0,
        legal_wording: 1,
        time_management: 1,
        none: 1,
      },
    });
  });

  it("selects overdue review questions before today", () => {
    expect(getOverdueQuestions(questions, "2026-06-22").map((question) => question.id)).toEqual([
      "q-math-calc-01",
      "q-met-thermo-01",
    ]);
  });

  it("ranks practice pain points by repeated attempts and mistake count", () => {
    expect(getPracticePainPoints(questions)).toEqual([
      {
        id: "q-math-calc-01",
        label: "formula: Gradient and extrema review",
        attemptsCount: 5,
        mistakeTypes: ["formula", "time_management"],
      },
      {
        id: "q-met-thermo-01",
        label: "multiple_choice: Atmospheric stability basics",
        attemptsCount: 3,
        mistakeTypes: ["concept"],
      },
      {
        id: "q-gen-admin-01",
        label: "legal_short_answer: Public administration fundamentals",
        attemptsCount: 1,
        mistakeTypes: ["legal_wording"],
      },
    ]);
  });
});
```

- [ ] **Step 2: Run the helper test to verify it fails**

Run: `npm --prefix apps/web test -- question-bank.test.ts`

Expected: FAIL because `question-bank.ts` does not exist yet.

- [ ] **Step 3: Write the minimal helper implementation**

Create `apps/web/lib/question-bank.ts` with:

```ts
import type {
  MistakeType,
  Question,
  QuestionFilters,
  QuestionType,
  VerificationStatus,
} from "./types";

type QuestionCountsByType = Record<QuestionType, number>;
type QuestionCountsByVerification = Record<VerificationStatus, number>;
type QuestionCountsByMistakeType = Record<MistakeType, number>;

export type QuestionStats = {
  total: number;
  byType: QuestionCountsByType;
  byVerificationStatus: QuestionCountsByVerification;
  byMistakeType: QuestionCountsByMistakeType;
};

export type PracticePainPoint = {
  id: string;
  label: string;
  attemptsCount: number;
  mistakeTypes: MistakeType[];
};

export function getDefaultQuestionFilters(): QuestionFilters {
  return {
    type: "all",
    verificationStatus: "all",
    difficulty: "all",
    mistakeType: "all",
  };
}

export function matchesQuestionFilters(
  question: Question,
  filters: QuestionFilters,
): boolean {
  const matchesType = filters.type === "all" || question.type === filters.type;
  const matchesVerification =
    filters.verificationStatus === "all" ||
    question.verificationStatus === filters.verificationStatus;
  const matchesDifficulty =
    filters.difficulty === "all" || question.difficulty === filters.difficulty;
  const matchesMistakeType =
    filters.mistakeType === "all" || question.mistakeTypes.includes(filters.mistakeType);

  return matchesType && matchesVerification && matchesDifficulty && matchesMistakeType;
}

export function buildQuestionStats(questions: Question[]): QuestionStats {
  const stats: QuestionStats = {
    total: questions.length,
    byType: {
      multiple_choice: 0,
      practical_case: 0,
      formula: 0,
      flashcard: 0,
      legal_short_answer: 0,
    },
    byVerificationStatus: {
      verified: 0,
      unverified: 0,
      needs_review: 0,
      deprecated: 0,
    },
    byMistakeType: {
      concept: 0,
      formula: 0,
      units: 0,
      reading: 0,
      legal_wording: 0,
      time_management: 0,
      none: 0,
    },
  };

  for (const question of questions) {
    stats.byType[question.type] += 1;
    stats.byVerificationStatus[question.verificationStatus] += 1;

    for (const mistakeType of question.mistakeTypes) {
      stats.byMistakeType[mistakeType] += 1;
    }
  }

  return stats;
}

export function getOverdueQuestions(
  questions: Question[],
  today: string,
): Question[] {
  return questions
    .filter((question) => question.nextReviewAt < today)
    .sort((left, right) => left.nextReviewAt.localeCompare(right.nextReviewAt));
}

export function getPracticePainPoints(questions: Question[]): PracticePainPoint[] {
  return [...questions]
    .filter((question) => !question.mistakeTypes.includes("none"))
    .sort((left, right) => {
      if (right.attemptsCount !== left.attemptsCount) {
        return right.attemptsCount - left.attemptsCount;
      }

      return right.mistakeTypes.length - left.mistakeTypes.length;
    })
    .slice(0, 3)
    .map((question) => ({
      id: question.id,
      label: `${question.type}: ${question.name}`,
      attemptsCount: question.attemptsCount,
      mistakeTypes: question.mistakeTypes,
    }));
}
```

- [ ] **Step 4: Run the helper test to verify it passes**

Run: `npm --prefix apps/web test -- question-bank.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/web/lib/question-bank.ts apps/web/lib/question-bank.test.ts
git commit -m "test(phase2): add question bank helper coverage"
```

### Task 4: Replace the questions placeholder route with real read-only UI

**Files:**
- Modify: `apps/web/app/questions/page.tsx`
- Modify: `apps/web/lib/question-bank.test.ts`

- [ ] **Step 1: Add route-level expectations to the failing test**

Append a lightweight copy assertion to `apps/web/lib/question-bank.test.ts`:

```ts
it("exposes real question-bank summary counts for the route", () => {
  const stats = buildQuestionStats(questions);

  expect(stats.total).toBe(4);
  expect(getOverdueQuestions(questions, "2026-06-22")).toHaveLength(2);
});
```

- [ ] **Step 2: Run the test suite to confirm current UI work is still pending**

Run: `npm --prefix apps/web test -- question-bank.test.ts && npm --prefix apps/web lint`

Expected:
- tests PASS
- `lint` PASS before route change, confirming safe baseline

- [ ] **Step 3: Replace the placeholder page with real question-bank rendering**

Replace `apps/web/app/questions/page.tsx` with:

```tsx
import { PageHeader } from "@/components/page-header";
import {
  buildQuestionStats,
  getDefaultQuestionFilters,
  getOverdueQuestions,
  getPracticePainPoints,
  matchesQuestionFilters,
} from "@/lib/question-bank";
import { questions } from "@/lib/mock-data";

const filters = getDefaultQuestionFilters();
const visibleQuestions = questions.filter((question) =>
  matchesQuestionFilters(question, filters),
);
const stats = buildQuestionStats(questions);
const overdueQuestions = getOverdueQuestions(questions, "2026-06-22");
const painPoints = getPracticePainPoints(questions);

export default function QuestionsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Questions"
        title="Question bank MVP"
        description="Read-only Phase 2 question bank built from local mock data. Official wording, answer keys, and source metadata remain TODO_VERIFY_OFFICIAL_SOURCE until verified imports exist."
      />

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total questions</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.total}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Visible with current filters</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {visibleQuestions.length}
          </p>
        </article>
        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm text-amber-700">Overdue review</p>
          <p className="mt-2 text-2xl font-semibold text-amber-900">
            {overdueQuestions.length}
          </p>
        </article>
        <article className="rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
          <p className="text-sm text-rose-700">Practice pain points</p>
          <p className="mt-2 text-2xl font-semibold text-rose-900">
            {painPoints.length}
          </p>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Filter baseline</h2>
        <p className="mt-2 text-sm text-slate-600">
          Phase 2 ships read-only default filters only. Interactive filter controls and editing stay
          out of scope until later phases.
        </p>
        <dl className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-4">
          <div>
            <dt className="font-medium text-slate-900">Type</dt>
            <dd>{filters.type}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Verification</dt>
            <dd>{filters.verificationStatus}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Difficulty</dt>
            <dd>{filters.difficulty}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Mistake type</dt>
            <dd>{filters.mistakeType}</dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {visibleQuestions.map((question) => (
            <article
              key={question.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                <span>{question.type}</span>
                <span>Difficulty {question.difficulty}</span>
                <span>{question.verificationStatus}</span>
                <span>Attempts {question.attemptsCount}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{question.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{question.statement}</p>
              {question.options.length > 0 ? (
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {question.options.map((option) => (
                    <li key={option} className="rounded-2xl bg-slate-50 px-3 py-2">
                      {option}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No options stored for this short-answer item.
                </p>
              )}
              <dl className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-900">Answer source</dt>
                  <dd>{question.answerSourceStatus}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Next review</dt>
                  <dd>{question.nextReviewAt}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Source</dt>
                  <dd>{question.sourceExam} {question.sourceYear}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Mistake types</dt>
                  <dd>{question.mistakeTypes.join(", ")}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Coverage by type</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {Object.entries(stats.byType).map(([type, count]) => (
                <li key={type} className="flex items-center justify-between">
                  <span>{type}</span>
                  <span className="font-medium text-slate-900">{count}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Weak areas</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {painPoints.map((item) => (
                <li key={item.id}>
                  <p className="font-medium text-slate-900">{item.label}</p>
                  <p>Attempts: {item.attemptsCount}</p>
                  <p>Mistakes: {item.mistakeTypes.join(", ")}</p>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Run verification**

Run: `npm --prefix apps/web test -- question-bank.test.ts && npm --prefix apps/web lint`

Expected:
- PASS for `question-bank.test.ts`
- PASS for `lint`

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/questions/page.tsx apps/web/lib/question-bank.test.ts
git commit -m "feat(phase2): build read-only question bank page"
```

### Task 5: Final verification and status review

**Files:**
- Verify: `README.md`
- Verify: `docs/ROADMAP.md`
- Verify: `docs/NOTION_DATABASE_SCHEMAS.md`
- Verify: `apps/web/lib/types.ts`
- Verify: `apps/web/lib/mock-data.ts`
- Verify: `apps/web/lib/question-bank.ts`
- Verify: `apps/web/lib/question-bank.test.ts`
- Verify: `apps/web/app/questions/page.tsx`

- [ ] **Step 1: Run full app verification**

Run: `npm --prefix apps/web test && npm --prefix apps/web lint`

Expected:
- all Vitest tests PASS
- TypeScript check PASS

- [ ] **Step 2: Check git diff scope**

Run: `git status --short`

Expected:
- only Phase 2 docs, question-bank files, and status-doc changes remain unstaged or committed

- [ ] **Step 3: Summarize verification before any final merge or PR**

Capture:

```md
- Docs copied: `docs/NOTION_DATABASE_SCHEMAS.md`
- Phase status updated: `README.md`, `docs/ROADMAP.md`
- Question model added: `apps/web/lib/types.ts`
- Question fixtures added: `apps/web/lib/mock-data.ts`
- Helpers tested: `apps/web/lib/question-bank.ts`, `apps/web/lib/question-bank.test.ts`
- UI updated: `apps/web/app/questions/page.tsx`
- Verification: `npm --prefix apps/web test`, `npm --prefix apps/web lint`
```
