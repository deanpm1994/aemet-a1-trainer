# Spanish UI Pass 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Translate remaining product UI routes and forms to Spanish while keeping source-owned study content unchanged.

**Architecture:** Extend the existing typed dictionary in `apps/web/lib/i18n.ts`, then wire remaining pages/components to `DEFAULT_LOCALE`. Keep source fixtures and official-content fields untouched.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Tailwind CSS.

---

## File Structure

- Modify `apps/web/lib/i18n.ts`: add keys for remaining route/form/status UI copy.
- Modify page routes under `apps/web/app`: replace hardcoded user-facing English UI with `t(DEFAULT_LOCALE, key)`.
- Modify reusable forms/components under `apps/web/components`: translate labels/buttons/messages.
- Modify `docs/PROJECT_MEMORY.md`: record pass-2 UI coverage.

## Task 1: Dictionary Expansion

**Files:**
- Modify: `apps/web/lib/i18n.ts`
- Test: `apps/web/lib/i18n.test.ts`

- [ ] Add Spanish/English keys for remaining pages and components.
- [ ] Keep `TranslationKey` explicit so TypeScript catches missing keys.
- [ ] Run `npm --prefix apps/web test -- lib/i18n.test.ts`.
- [ ] Commit with `feat(i18n): expand Spanish UI dictionary`.

## Task 2: Routes

**Files:**
- Modify: `apps/web/app/dashboard/page.tsx`
- Modify: `apps/web/app/calendar/page.tsx`
- Modify: `apps/web/app/focus/page.tsx`
- Modify: `apps/web/app/questions/page.tsx`
- Modify: `apps/web/app/topics/page.tsx`
- Modify: `apps/web/app/topics/[id]/page.tsx`
- Modify: `apps/web/app/topics/[id]/not-found.tsx`
- Modify: `apps/web/app/resources/page.tsx`
- Modify: `apps/web/app/monitoring/page.tsx`
- Modify: `apps/web/app/settings/page.tsx`
- Modify: `apps/web/app/auth/sign-in/page.tsx`
- Modify: `apps/web/app/auth/sign-up/page.tsx`

- [ ] Replace user-facing page headers, status messages, stat labels, section headings, and action messages with dictionary keys.
- [ ] Leave rendered source/study content fields unchanged.
- [ ] Run `npm --prefix apps/web run lint`.
- [ ] Commit with `feat(i18n): localize remaining routes`.

## Task 3: Components

**Files:**
- Modify: `apps/web/components/auth-form.tsx`
- Modify: `apps/web/components/calendar-planner.tsx`
- Modify: `apps/web/components/focus-session-panel.tsx`
- Modify: `apps/web/components/question-attempt-form.tsx`
- Modify: `apps/web/components/question-progress-form.tsx`
- Modify: `apps/web/components/settings-form.tsx`
- Modify: `apps/web/components/topic-progress-form.tsx`

- [ ] Replace user-facing form labels, buttons, helper text, local-only messages, placeholders, and option labels with dictionary keys.
- [ ] Keep form field names and persisted enum values unchanged.
- [ ] Run `npm --prefix apps/web run lint`.
- [ ] Commit with `feat(i18n): localize form components`.

## Task 4: Verification And Merge

**Files:**
- Modify: `docs/PROJECT_MEMORY.md`

- [ ] Update memory with Spanish UI pass-2 status and remaining fixture-content caveat.
- [ ] Run `npm --prefix apps/web test`.
- [ ] Run `npm --prefix apps/web run lint`.
- [ ] Run `npm --prefix apps/web run build`.
- [ ] Commit docs with `docs(i18n): record Spanish UI pass 2`.
- [ ] Merge `spanish-ui-pass-2` back to `develop`.

## Self-Review

- Spec coverage: routes, forms, status messages, source-content boundary, docs, verification all covered.
- Placeholder scan: no unresolved placeholders.
- Type consistency: all UI strings flow through `TranslationKey`, `DEFAULT_LOCALE`, and `t`.
