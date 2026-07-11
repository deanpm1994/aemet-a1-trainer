# 2014 Past-Exam Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add eight source-verified 2014 AEMET A1 first-exercise questions to private study practice.

**Architecture:** `official-past-exam-subset.ts` remains canonical checked-in source content and runs each record through official import validation. A matching manifest records source provenance. User attempts/progress stay separate in existing Supabase tables.

**Tech Stack:** TypeScript, Vitest, Next.js.

## Global Constraints

- Preserve exact checked wording/options, AEMET source URL, MITECO answer URL, retrieved date, verified status.
- Import only 2014 questions 1, 2, 3, 5, 6, 8, 9, 10.
- Exclude 4/7 because formula OCR remains ambiguous.
- No inferred answer, source-status downgrade, schema change, or storage refactor.

---

### Task 1: Prove current 2014 gap

**Files:** Modify `apps/web/lib/official-past-exam-subset.test.ts`.

- [ ] Add failing test that filters `sourceYear === 2014`, expects numbers `["1", "2", "3", "5", "6", "8", "9", "10"]`, 27 total loaded questions, official answers, and 2014 source URLs.
- [ ] Run `npm --prefix apps/web test -- official-past-exam-subset.test.ts`; expect failure because no 2014 records exist.

### Task 2: Add verified source record and questions

**Files:** Modify `apps/web/lib/official-past-exam-subset.ts`; create `docs/official-sources/aemet-miteco-a1-2014-primer-ejercicio.md`.

- [ ] Add 2014 question/answer URL constants and shared verified source fields, retrieved `2026-07-11`.
- [ ] Append eight manually checked records with exact statement/options and answer letters from MITECO template: 1=A, 2=D, 3=A, 5=B, 6=B, 8=C, 9=C, 10=A.
- [ ] Add manifest: source owners, URLs, historical index, exam phase/date, authoritative scope, exclusion of questions 4/7, verification decision.
- [ ] Run focused test; expect PASS.
- [ ] Commit: `feat(questions): import 2014 exam subset`.

### Task 3: Record and verify batch

**Files:** Modify `docs/PROJECT_MEMORY.md`, `docs/DATA_MODEL.md`, `docs/GITHUB_ISSUES.md`.

- [ ] Record 2014 question numbers and answer-provenance status; leave issue #13 open because import remains incremental.
- [ ] Run `npm --prefix apps/web test`, `npm --prefix apps/web run lint`, `npm --prefix apps/web run build`, `git diff --check`; expect exit 0.
- [ ] Commit: `docs(import): record 2014 exam subset`.

## Plan Self-Review

- Scope exactly matches approved design and excludes OCR-ambiguous records.
- All source, test, implementation, documentation paths and commands are explicit.
