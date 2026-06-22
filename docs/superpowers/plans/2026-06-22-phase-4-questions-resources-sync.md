# Phase 4.2 Questions and Resources Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add read-only Notion-backed Questions sync and a new Resources page backed by Bibliography sync, both with explicit fallback states and CSV-import-aware mappers.

**Architecture:** Extend the existing server-only Notion pattern with two route-specific loaders under `apps/web/lib`: one for Questions and one for Bibliography. Keep `/questions` and the new `/resources` route consuming normalized internal models plus the existing source-state banner, while preserving local fallback fixtures for both domains.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, `@notionhq/client`, Tailwind CSS, git

---

### Task 1: Add bibliography types and fallback fixtures

**Files:**
- Modify: `apps/web/lib/types.ts`
- Modify: `apps/web/lib/mock-data.ts`
- Test: `apps/web/lib/question-bank.test.ts`

- [ ] **Step 1: Write the failing fixture expectations**

Append this coverage to `apps/web/lib/question-bank.test.ts`:

```ts
import { bibliography, routeCards } from "./mock-data";

describe("resources fixtures", () => {
  it("exposes a non-empty bibliography fallback list", () => {
    expect(bibliography.length).toBeGreaterThan(0);
  });

  it("allows repeated source urls across bibliography items", () => {
    const sharedUrls = bibliography
      .map((item) => item.sourceUrl)
      .filter((url, index, urls) => urls.indexOf(url) !== index);

    expect(sharedUrls.length).toBeGreaterThan(0);
  });

  it("adds a resources route card", () => {
    expect(routeCards.find((card) => card.href === "/resources")?.description).toContain(
      "Study resources",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm --prefix apps/web test -- question-bank.test.ts
```

Expected:
- FAIL because `bibliography` and `/resources` do not exist yet

- [ ] **Step 3: Add bibliography types**

Append these types to `apps/web/lib/types.ts` after the `QuestionFilters` type:

```ts
export type ResourcePriority = "core" | "useful" | "optional";

export type ResourceSourceType =
  | "aemet_recommended"
  | "official"
  | "complementary";

export type BibliographyItem = {
  id: string;
  title: string;
  authors: string;
  year: number | null;
  blocks: string[];
  category: string;
  priority: ResourcePriority;
  sourceType: ResourceSourceType;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  notes: string;
};
```

- [ ] **Step 4: Add fallback bibliography fixtures and route card**

Update the `apps/web/lib/mock-data.ts` import list to include `BibliographyItem`:

```ts
import type {
  BibliographyItem,
  DashboardMetric,
  Question,
  RouteCard,
  StudyMission,
  StudySession,
  Topic,
} from "./types";
```

Add a new route card entry:

```ts
  {
    href: "/resources",
    title: "Resources",
    description: "Study resources from bibliography data with explicit access and verification context.",
  },
```

Add fallback bibliography data below `questions`:

```ts
export const bibliography: BibliographyItem[] = [
  {
    id: "wallace-hobbs-2006",
    title: "Atmospheric Science: An Introductory Survey",
    authors: "Wallace, J. M.; Hobbs, P. V.",
    year: 2006,
    blocks: ["Meteorology and Climatology"],
    category: "General",
    priority: "core",
    sourceType: "aemet_recommended",
    sourceUrl:
      "https://www.aemet.es/documentos/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/otras_convocatorias/Relacion_Bibliografia_Recomendada_AEMET_Meteorologos.pdf",
    verificationStatus: "verified",
    notes: "General atmospheric science reference.",
  },
  {
    id: "salby-2012",
    title: "Physics of the Atmosphere and Climate",
    authors: "Salby, M. L.",
    year: 2012,
    blocks: ["Meteorology and Climatology"],
    category: "General",
    priority: "core",
    sourceType: "aemet_recommended",
    sourceUrl:
      "https://www.aemet.es/documentos/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/otras_convocatorias/Relacion_Bibliografia_Recomendada_AEMET_Meteorologos.pdf",
    verificationStatus: "verified",
    notes: "Broad physical atmosphere and climate reference.",
  },
];
```

- [ ] **Step 5: Re-run the fixture test**

Run:

```bash
npm --prefix apps/web test -- question-bank.test.ts
```

Expected:
- PASS

- [ ] **Step 6: Commit the fallback resources model**

```bash
git add apps/web/lib/types.ts apps/web/lib/mock-data.ts apps/web/lib/question-bank.test.ts
git commit -m "feat(resources): add bibliography fallback model"
```

### Task 2: Add the Notion questions mapper and loader

**Files:**
- Create: `apps/web/lib/notion-questions.ts`
- Test: `apps/web/lib/notion-questions.test.ts`

- [ ] **Step 1: Write the failing question loader tests**

Create `apps/web/lib/notion-questions.test.ts` with:

```ts
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { questions as fallbackQuestions } from "./mock-data";
import type { Question } from "./types";
import { loadQuestionsSource, mapNotionQuestionPage } from "./notion-questions";

const validQuestionPage = {
  object: "page",
  properties: {
    question_id: {
      type: "title",
      title: [{ plain_text: "Q-001" }],
    },
    type: {
      type: "rich_text",
      rich_text: [{ plain_text: "multiple_choice" }],
    },
    source_year: {
      type: "rich_text",
      rich_text: [{ plain_text: "2024" }],
    },
    source_exam: {
      type: "rich_text",
      rich_text: [{ plain_text: "AEMET A1 source pack" }],
    },
    source_url: {
      type: "url",
      url: "https://example.com/question-source",
    },
    retrieved_at: {
      type: "date",
      date: { start: "2026-06-22" },
    },
    verification_status: {
      type: "rich_text",
      rich_text: [{ plain_text: "verified" }],
    },
    question_number: {
      type: "rich_text",
      rich_text: [{ plain_text: "7" }],
    },
    statement: {
      type: "rich_text",
      rich_text: [{ plain_text: "Which option is correct?" }],
    },
    option_a: {
      type: "rich_text",
      rich_text: [{ plain_text: "Option A" }],
    },
    option_b: {
      type: "rich_text",
      rich_text: [{ plain_text: "Option B" }],
    },
    option_c: {
      type: "rich_text",
      rich_text: [{ plain_text: "" }],
    },
    option_d: {
      type: "rich_text",
      rich_text: [{ plain_text: "" }],
    },
    correct_answer: {
      type: "rich_text",
      rich_text: [{ plain_text: "Option B" }],
    },
    answer_source_status: {
      type: "rich_text",
      rich_text: [{ plain_text: "official" }],
    },
    topic_ids: {
      type: "rich_text",
      rich_text: [{ plain_text: "MAT-01, MAT-02" }],
    },
    difficulty: {
      type: "rich_text",
      rich_text: [{ plain_text: "3" }],
    },
    explanation: {
      type: "rich_text",
      rich_text: [{ plain_text: "Because B is correct." }],
    },
    attempts_count: {
      type: "rich_text",
      rich_text: [{ plain_text: "2" }],
    },
    last_attempt_at: {
      type: "date",
      date: { start: "2026-06-20" },
    },
    next_review_at: {
      type: "date",
      date: { start: "2026-06-25" },
    },
    mistake_type: {
      type: "rich_text",
      rich_text: [{ plain_text: "concept, reading" }],
    },
    notes: {
      type: "rich_text",
      rich_text: [{ plain_text: "Question note" }],
    },
  },
} as const;

describe("mapNotionQuestionPage", () => {
  it("maps a csv-style Notion row into the internal Question shape", () => {
    expect(mapNotionQuestionPage(validQuestionPage)).toEqual<Question>({
      id: "Q-001",
      name: "Q-001",
      type: "multiple_choice",
      sourceYear: 2024,
      sourceExam: "AEMET A1 source pack",
      sourceUrl: "https://example.com/question-source",
      retrievedAt: "2026-06-22",
      verificationStatus: "verified",
      questionNumber: "7",
      statement: "Which option is correct?",
      options: ["Option A", "Option B"],
      correctAnswer: "Option B",
      answerSourceStatus: "official",
      explanation: "Because B is correct.",
      topicIds: ["MAT-01", "MAT-02"],
      difficulty: 3,
      attemptsCount: 2,
      lastAttemptAt: "2026-06-20",
      nextReviewAt: "2026-06-25",
      mistakeTypes: ["concept", "reading"],
    });
  });
});

describe("loadQuestionsSource", () => {
  it("returns live questions when config and query succeed", async () => {
    const result = await loadQuestionsSource({
      env: {
        NOTION_TOKEN: "secret_test_token",
        NOTION_QUESTIONS_DATA_SOURCE_ID: "12345678-1234-1234-1234-123456789abc",
      },
      fallbackQuestions,
      createClient: () => ({
        dataSources: {
          query: vi.fn().mockResolvedValue({
            results: [validQuestionPage],
          }),
        },
      }),
    });

    expect(result.sourceState).toBe("live");
    expect(result.message).toBe("Live Notion question sync is active.");
    expect(result.questions[0]?.id).toBe("Q-001");
  });

  it("returns fallback_config when question config is missing", async () => {
    const result = await loadQuestionsSource({
      env: {},
      fallbackQuestions,
    });

    expect(result.sourceState).toBe("fallback_config");
    expect(result.questions).toEqual(fallbackQuestions);
  });

  it("returns fallback_error when question mapping fails", async () => {
    const result = await loadQuestionsSource({
      env: {
        NOTION_TOKEN: "secret_test_token",
        NOTION_QUESTIONS_DATA_SOURCE_ID: "12345678-1234-1234-1234-123456789abc",
      },
      fallbackQuestions,
      createClient: () => ({
        dataSources: {
          query: vi.fn().mockResolvedValue({
            results: [
              {
                ...validQuestionPage,
                properties: {
                  ...validQuestionPage.properties,
                  difficulty: {
                    type: "rich_text",
                    rich_text: [{ plain_text: "9" }],
                  },
                },
              },
            ],
          }),
        },
      }),
    });

    expect(result.sourceState).toBe("fallback_error");
    expect(result.questions).toEqual(fallbackQuestions);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm --prefix apps/web test -- notion-questions.test.ts
```

Expected:
- FAIL because `./notion-questions` does not exist

- [ ] **Step 3: Write the question mapper and loader**

Create `apps/web/lib/notion-questions.ts` using the same server-only pattern as `notion-topics.ts`, but with these route-specific pieces:

- export `QuestionSourceState = "live" | "fallback_config" | "fallback_error"`
- export `QuestionSourceResult = { questions: Question[]; sourceState: QuestionSourceState; message: string }`
- read `NOTION_QUESTIONS_DATA_SOURCE_ID`
- fall back to `questions` from `./mock-data`

Implement these behaviors:

```ts
// Question-specific normalization rules
// - option_a..option_d -> options[]
// - topic_ids "MAT-01, MAT-02" -> ["MAT-01", "MAT-02"]
// - mistake_type "concept, reading" -> ["concept", "reading"]
// - source_year, difficulty, attempts_count may arrive as text and must parse as numbers
// - empty option fields are omitted
// - use question_id as both id and fallback name for now
```

Use these route messages:

```ts
"Live Notion question sync is active."
"Live Notion sync is not configured. Showing local fallback data."
"Live Notion sync failed. Showing local fallback data."
```

- [ ] **Step 4: Re-run the question loader tests**

Run:

```bash
npm --prefix apps/web test -- notion-questions.test.ts
```

Expected:
- PASS

- [ ] **Step 5: Commit the question loader**

```bash
git add apps/web/lib/notion-questions.ts apps/web/lib/notion-questions.test.ts
git commit -m "feat(notion): add questions sync loader"
```

### Task 3: Add the Notion bibliography mapper and loader

**Files:**
- Create: `apps/web/lib/notion-bibliography.ts`
- Test: `apps/web/lib/notion-bibliography.test.ts`

- [ ] **Step 1: Write the failing bibliography loader tests**

Create `apps/web/lib/notion-bibliography.test.ts` with:

```ts
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { bibliography as fallbackBibliography } from "./mock-data";
import type { BibliographyItem } from "./types";
import { loadBibliographySource, mapNotionBibliographyPage } from "./notion-bibliography";

const validBibliographyPage = {
  object: "page",
  properties: {
    title: {
      type: "title",
      title: [{ plain_text: "Atmospheric Science: An Introductory Survey" }],
    },
    authors: {
      type: "rich_text",
      rich_text: [{ plain_text: "Wallace, J. M.; Hobbs, P. V." }],
    },
    year: {
      type: "rich_text",
      rich_text: [{ plain_text: "2006" }],
    },
    block: {
      type: "rich_text",
      rich_text: [{ plain_text: "Meteorology and Climatology" }],
    },
    category: {
      type: "rich_text",
      rich_text: [{ plain_text: "General" }],
    },
    priority: {
      type: "rich_text",
      rich_text: [{ plain_text: "Core" }],
    },
    source_type: {
      type: "rich_text",
      rich_text: [{ plain_text: "AEMET recommended" }],
    },
    source_url: {
      type: "url",
      url: "https://example.com/resources.pdf",
    },
    verification_status: {
      type: "rich_text",
      rich_text: [{ plain_text: "verified" }],
    },
    notes: {
      type: "rich_text",
      rich_text: [{ plain_text: "General atmospheric science reference." }],
    },
  },
} as const;

describe("mapNotionBibliographyPage", () => {
  it("maps a csv-style Notion row into the internal BibliographyItem shape", () => {
    expect(mapNotionBibliographyPage(validBibliographyPage)).toEqual<BibliographyItem>({
      id: "atmospheric-science-an-introductory-survey-2006",
      title: "Atmospheric Science: An Introductory Survey",
      authors: "Wallace, J. M.; Hobbs, P. V.",
      year: 2006,
      blocks: ["Meteorology and Climatology"],
      category: "General",
      priority: "core",
      sourceType: "aemet_recommended",
      sourceUrl: "https://example.com/resources.pdf",
      verificationStatus: "verified",
      notes: "General atmospheric science reference.",
    });
  });
});

describe("loadBibliographySource", () => {
  it("returns live bibliography when config and query succeed", async () => {
    const result = await loadBibliographySource({
      env: {
        NOTION_TOKEN: "secret_test_token",
        NOTION_BIBLIOGRAPHY_DATA_SOURCE_ID: "12345678-1234-1234-1234-123456789abc",
      },
      fallbackBibliography,
      createClient: () => ({
        dataSources: {
          query: vi.fn().mockResolvedValue({
            results: [validBibliographyPage],
          }),
        },
      }),
    });

    expect(result.sourceState).toBe("live");
    expect(result.items[0]?.id).toBe("atmospheric-science-an-introductory-survey-2006");
  });

  it("returns fallback_config when bibliography config is missing", async () => {
    const result = await loadBibliographySource({
      env: {},
      fallbackBibliography,
    });

    expect(result.sourceState).toBe("fallback_config");
    expect(result.items).toEqual(fallbackBibliography);
  });

  it("keeps repeated source urls without treating them as an error", async () => {
    const result = await loadBibliographySource({
      env: {
        NOTION_TOKEN: "secret_test_token",
        NOTION_BIBLIOGRAPHY_DATA_SOURCE_ID: "12345678-1234-1234-1234-123456789abc",
      },
      fallbackBibliography,
      createClient: () => ({
        dataSources: {
          query: vi.fn().mockResolvedValue({
            results: [
              validBibliographyPage,
              {
                ...validBibliographyPage,
                properties: {
                  ...validBibliographyPage.properties,
                  title: {
                    type: "title",
                    title: [{ plain_text: "Physics of the Atmosphere and Climate" }],
                  },
                  year: {
                    type: "rich_text",
                    rich_text: [{ plain_text: "2012" }],
                  },
                },
              },
            ],
          }),
        },
      }),
    });

    expect(result.sourceState).toBe("live");
    expect(result.items).toHaveLength(2);
    expect(result.items[0]?.sourceUrl).toBe(result.items[1]?.sourceUrl);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm --prefix apps/web test -- notion-bibliography.test.ts
```

Expected:
- FAIL because `./notion-bibliography` does not exist

- [ ] **Step 3: Write the bibliography mapper and loader**

Create `apps/web/lib/notion-bibliography.ts` using the same server-only pattern as `notion-topics.ts`, but with these route-specific pieces:

- export `BibliographySourceState = "live" | "fallback_config" | "fallback_error"`
- export `BibliographySourceResult = { items: BibliographyItem[]; sourceState: BibliographySourceState; message: string }`
- read `NOTION_BIBLIOGRAPHY_DATA_SOURCE_ID`
- fall back to `bibliography` from `./mock-data`
- derive `id` from a slug of title plus year
- normalize `priority` from `Core` / `Useful` / `Optional`
- normalize `source_type` from `AEMET recommended` / `official` / `complementary`
- keep repeated `source_url` values unchanged

Use these route messages:

```ts
"Live Notion bibliography sync is active."
"Live Notion sync is not configured. Showing local fallback data."
"Live Notion sync failed. Showing local fallback data."
```

- [ ] **Step 4: Re-run the bibliography loader tests**

Run:

```bash
npm --prefix apps/web test -- notion-bibliography.test.ts
```

Expected:
- PASS

- [ ] **Step 5: Commit the bibliography loader**

```bash
git add apps/web/lib/notion-bibliography.ts apps/web/lib/notion-bibliography.test.ts
git commit -m "feat(notion): add bibliography sync loader"
```

### Task 4: Wire `/questions` to the shared Notion question loader

**Files:**
- Modify: `apps/web/app/questions/page.tsx`

- [ ] **Step 1: Keep the current question route behavior explicit in tests**

Append this assertion to `apps/web/lib/notion-questions.test.ts`:

```ts
import { routeCards } from "./mock-data";

describe("questions route copy", () => {
  it("keeps the questions route card focused on the live-capable question bank", () => {
    expect(routeCards.find((card) => card.href === "/questions")?.description).toContain(
      "live-capable",
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm --prefix apps/web test -- notion-questions.test.ts
```

Expected:
- FAIL because the route card still describes a local-only question bank

- [ ] **Step 3: Update the `/questions` route to use the loader and banner**

Replace `apps/web/app/questions/page.tsx` with an async page that:

- calls `loadQuestionsSource()`
- renders `SourceStateBanner`
- preserves the current summary cards and helper-driven question list
- computes stats, overdue items, and pain points from the loaded questions rather than direct fixtures
- updates page copy to reflect a Notion-first route with explicit fallback

Use this page header description:

```tsx
description="Phase 4 question sync prefers one dedicated Notion workspace and falls back to local question data when live sync is unavailable. Official wording and answer-source claims remain explicit through the stored verification metadata."
```

- [ ] **Step 4: Update the `/questions` route card copy in `apps/web/lib/mock-data.ts`**

Change the `/questions` route card entry to:

```ts
  {
    href: "/questions",
    title: "Questions",
    description: "Live-capable question bank with explicit local fallback and review metadata.",
  },
```

- [ ] **Step 5: Re-run the question route checks**

Run:

```bash
npm --prefix apps/web test -- notion-questions.test.ts question-bank.test.ts
```

Expected:
- PASS

- [ ] **Step 6: Commit the question route integration**

```bash
git add apps/web/app/questions/page.tsx apps/web/lib/mock-data.ts apps/web/lib/notion-questions.test.ts apps/web/lib/question-bank.test.ts
git commit -m "feat(questions): load question bank from notion"
```

### Task 5: Add the new `/resources` route and home navigation entry

**Files:**
- Create: `apps/web/app/resources/page.tsx`
- Modify: `apps/web/app/page.tsx`

- [ ] **Step 1: Write the failing route visibility expectation**

Append this to `apps/web/lib/notion-bibliography.test.ts`:

```ts
import { routeCards } from "./mock-data";

describe("resources route card", () => {
  it("adds a Resources route card that points to /resources", () => {
    expect(routeCards.find((card) => card.href === "/resources")?.title).toBe("Resources");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails if the route card is still missing**

Run:

```bash
npm --prefix apps/web test -- notion-bibliography.test.ts
```

Expected:
- FAIL until the route card exists

- [ ] **Step 3: Create the `/resources` page**

Create `apps/web/app/resources/page.tsx` with a server component that:

- calls `loadBibliographySource()`
- renders `PageHeader` and `SourceStateBanner`
- renders a list of bibliography items with:
  - title
  - authors
  - year
  - block
  - category
  - priority
  - source type
  - verification status
  - notes
  - source link
- includes copy making it explicit that:
  - repeated links are expected
  - a listed resource is not the same as owned or directly accessible content

Use this page header description:

```tsx
description="This Phase 4 resources page syncs bibliography data from Notion and keeps access limitations explicit. Repeated official source links are expected when multiple books come from the same recommended bibliography list."
```

- [ ] **Step 4: Ensure the home page picks up the new route card**

No structural change is required in `apps/web/app/page.tsx` if it already maps `routeCards`, but re-open the file and verify the `routeCards.map(...)` section still covers the new route.

- [ ] **Step 5: Re-run the bibliography and navigation checks**

Run:

```bash
npm --prefix apps/web test -- notion-bibliography.test.ts question-bank.test.ts
npm --prefix apps/web run lint
```

Expected:
- PASS
- TypeScript exits cleanly

- [ ] **Step 6: Commit the Resources route**

```bash
git add apps/web/app/resources/page.tsx apps/web/lib/notion-bibliography.test.ts apps/web/app/page.tsx apps/web/lib/mock-data.ts
git commit -m "feat(resources): add bibliography-backed resources page"
```

### Task 6: Document the new Questions and Resources sync setup

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Extend the Notion setup section**

Update the `## Notion topic sync` section in `README.md` to a broader Notion sync section with:

```md
## Notion sync

Phase 4 uses server-side Notion integrations for:

- `/topics`
- `/questions`
- `/resources`

Required environment variables:

- `NOTION_TOKEN`
- `NOTION_TOPICS_DATA_SOURCE_ID`
- `NOTION_QUESTIONS_DATA_SOURCE_ID`
- `NOTION_BIBLIOGRAPHY_DATA_SOURCE_ID`
```

And extend the behavior notes to mention question and resources fallback behavior explicitly.

- [ ] **Step 2: Verify the README wording**

Run:

```bash
rg -n "Notion sync|NOTION_QUESTIONS_DATA_SOURCE_ID|NOTION_BIBLIOGRAPHY_DATA_SOURCE_ID|/resources" README.md
```

Expected:
- the broader Notion setup section is present
- both new env vars are documented
- `/resources` is mentioned in the setup description

- [ ] **Step 3: Commit the documentation update**

```bash
git add README.md
git commit -m "docs(notion): document question and resources sync"
```

### Task 7: Full verification and status review

**Files:**
- Review only: `apps/web/lib/notion-questions.ts`
- Review only: `apps/web/lib/notion-bibliography.ts`
- Review only: `apps/web/app/questions/page.tsx`
- Review only: `apps/web/app/resources/page.tsx`
- Review only: `README.md`

- [ ] **Step 1: Run the focused automated verification**

Run:

```bash
npm --prefix apps/web test -- notion-client.test.ts notion-topics.test.ts notion-questions.test.ts notion-bibliography.test.ts question-bank.test.ts topic-progress.test.ts
npm --prefix apps/web run lint
```

Expected:
- all listed tests pass
- TypeScript exits cleanly

- [ ] **Step 2: Run a manual status check on the worktree**

Run:

```bash
git status --short
```

Expected:
- only the intended Questions/Resources sync files remain changed before final staging or all changes are already committed

- [ ] **Step 3: Review the resulting feature state**

Confirm all of the following:

- `/questions` no longer imports `questions` directly from `@/lib/mock-data`
- `/resources` exists and uses the shared bibliography loader pattern
- live question sync returns `sourceState: "live"`
- live bibliography sync returns `sourceState: "live"`
- missing config returns `sourceState: "fallback_config"` for the relevant route
- sync or mapping failures return `sourceState: "fallback_error"` for the relevant route
- both routes show explicit source-state messaging
- repeated bibliography links render without being treated as duplicates or errors
- automated tests use mocks and stubs rather than real Notion calls

- [ ] **Step 4: Create the final integration commit if prior tasks were squashed locally**

If you executed the tasks without intermediate commits, create one final commit instead:

```bash
git add apps/web/lib/types.ts apps/web/lib/mock-data.ts apps/web/lib/question-bank.test.ts apps/web/lib/notion-questions.ts apps/web/lib/notion-questions.test.ts apps/web/lib/notion-bibliography.ts apps/web/lib/notion-bibliography.test.ts apps/web/app/questions/page.tsx apps/web/app/resources/page.tsx apps/web/app/page.tsx README.md
git commit -m "feat(notion): add questions and resources sync"
```
