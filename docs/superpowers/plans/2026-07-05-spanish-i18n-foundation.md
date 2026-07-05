# Spanish i18n Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Spanish-first typed UI translation foundation while preserving source-owned study content exactly as stored.

**Architecture:** Add a small internal dictionary module in `apps/web/lib/i18n.ts` with Spanish as the default and English fallback strings. Move navigation/product copy into the dictionary, then wire shared components and the homepage to the default locale without adding route prefixes or browser detection.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, existing Tailwind components.

---

## File Structure

- Create `apps/web/lib/i18n.ts`: locale types, dictionaries, fallback behavior, and route navigation copy.
- Create `apps/web/lib/i18n.test.ts`: default locale, fallback, dictionary completeness, route copy coverage.
- Modify `apps/web/app/layout.tsx`: set Spanish metadata/default document language.
- Modify `apps/web/components/site-shell.tsx`: use translated shell and navigation copy.
- Modify `apps/web/components/content-readiness-card.tsx`: use translated labels/messages from readiness state.
- Modify `apps/web/components/source-state-banner.tsx`: use translated source-state labels.
- Modify `apps/web/app/page.tsx`: use translated homepage copy.
- Modify `apps/web/lib/mock-data.ts`: remove route cards from source/content fixture data.
- Modify `apps/web/lib/types.ts`: keep or move `RouteCard` type as needed for translated navigation.
- Modify `docs/PROJECT_MEMORY.md`: record Spanish-first UI foundation status.

## Task 1: i18n Dictionary

**Files:**
- Create: `apps/web/lib/i18n.ts`
- Create: `apps/web/lib/i18n.test.ts`

- [ ] **Step 1: Write failing tests**

Add tests proving Spanish default, unsupported fallback, matching dictionary keys, and route copy availability:

```ts
import { describe, expect, it } from "vitest";

import {
  DEFAULT_LOCALE,
  getDictionary,
  getSupportedLocale,
  routeCards,
  t,
  type Locale,
} from "./i18n";

describe("i18n", () => {
  it("defaults to Spanish", () => {
    expect(DEFAULT_LOCALE).toBe("es");
    expect(t(DEFAULT_LOCALE, "app.shell.phase")).toBe("Fase base");
  });

  it("falls back to Spanish for unsupported locales", () => {
    expect(getSupportedLocale("fr")).toBe("es");
    expect(getSupportedLocale(undefined)).toBe("es");
    expect(t("fr", "app.nav.dashboard")).toBe("Panel");
  });

  it("keeps Spanish and English dictionaries aligned", () => {
    const spanishKeys = Object.keys(getDictionary("es")).sort();
    const englishKeys = Object.keys(getDictionary("en")).sort();

    expect(englishKeys).toEqual(spanishKeys);
  });

  it("exposes translated route cards for every locale", () => {
    const locales: Locale[] = ["es", "en"];

    for (const locale of locales) {
      const cards = routeCards(locale);

      expect(cards.map((card) => card.href)).toEqual([
        "/dashboard",
        "/topics",
        "/questions",
        "/resources",
        "/calendar",
        "/focus",
        "/monitoring",
        "/settings",
      ]);
      expect(cards.every((card) => card.title.length > 0)).toBe(true);
      expect(cards.every((card) => card.description.length > 0)).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm --prefix apps/web test -- apps/web/lib/i18n.test.ts`

Expected: FAIL because `apps/web/lib/i18n.ts` does not exist.

- [ ] **Step 3: Implement dictionary module**

Create `apps/web/lib/i18n.ts` with `Locale`, `DEFAULT_LOCALE`, translated keys, `getDictionary`, `getSupportedLocale`, `t`, and `routeCards`.

- [ ] **Step 4: Run tests to verify pass**

Run: `npm --prefix apps/web test -- apps/web/lib/i18n.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/lib/i18n.ts apps/web/lib/i18n.test.ts
git commit -m "feat(i18n): add Spanish UI dictionary"
```

## Task 2: Shared UI Wiring

**Files:**
- Modify: `apps/web/app/layout.tsx`
- Modify: `apps/web/components/site-shell.tsx`
- Modify: `apps/web/components/content-readiness-card.tsx`
- Modify: `apps/web/components/source-state-banner.tsx`
- Modify: `apps/web/lib/mock-data.ts`
- Modify: `apps/web/lib/types.ts`

- [ ] **Step 1: Wire root metadata and shell**

Set the root document language to `es`, use Spanish metadata, and replace `routeCards` imports from `mock-data.ts` with `routeCards(DEFAULT_LOCALE)` from `i18n.ts`.

- [ ] **Step 2: Wire reusable status components**

Translate static labels in content readiness and source-state banners while leaving readiness/source-state logic unchanged.

- [ ] **Step 3: Remove navigation copy from mock source data**

Delete `routeCards` from `apps/web/lib/mock-data.ts` and keep source/content fixtures there only. Move the `RouteCard` type to `apps/web/lib/i18n.ts` or keep it in `types.ts` if imported by both modules.

- [ ] **Step 4: Run targeted checks**

Run:

```bash
npm --prefix apps/web test -- apps/web/lib/i18n.test.ts apps/web/lib/content-readiness.test.ts
npm --prefix apps/web run lint
```

Expected: tests and lint pass.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/layout.tsx apps/web/components/site-shell.tsx apps/web/components/content-readiness-card.tsx apps/web/components/source-state-banner.tsx apps/web/lib/mock-data.ts apps/web/lib/types.ts
git commit -m "feat(i18n): localize shared UI shell"
```

## Task 3: Homepage and Documentation

**Files:**
- Modify: `apps/web/app/page.tsx`
- Modify: `docs/PROJECT_MEMORY.md`

- [ ] **Step 1: Translate homepage product copy**

Use `t(DEFAULT_LOCALE, key)` for homepage headings, descriptions, checklist labels, and route-card copy. Do not translate source-owned topic/question fields.

- [ ] **Step 2: Update project memory**

Record that Spanish-first UI foundation is implemented, English fallback exists in code, and language preference persistence remains a future slice.

- [ ] **Step 3: Run full verification**

Run:

```bash
npm --prefix apps/web test
npm --prefix apps/web run lint
npm --prefix apps/web run build
```

Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/page.tsx docs/PROJECT_MEMORY.md
git commit -m "docs(i18n): record Spanish UI foundation"
```

## Task 4: Merge Back

**Files:**
- Git branch state only.

- [ ] **Step 1: Confirm clean feature branch**

Run:

```bash
git status --short
git log --oneline develop..spanish-i18n
```

Expected: clean status and only the i18n design/implementation commits.

- [ ] **Step 2: Merge to develop**

Run:

```bash
git switch develop
git merge --no-ff spanish-i18n
```

Expected: merge succeeds.

- [ ] **Step 3: Final status check**

Run:

```bash
git status --short --branch
```

Expected: clean `develop`.

## Self-Review

- Spec coverage: the plan covers the typed dictionary, Spanish default, root language, shared shell/home/status copy, source-owned content boundary, tests, docs, and merge-back workflow.
- Placeholder scan: no unresolved placeholders or deferred implementation details are required for this slice.
- Type consistency: locale type is `Locale`, supported locales are `es` and `en`, and route cards use the same `href/title/description` shape currently used by the app.
