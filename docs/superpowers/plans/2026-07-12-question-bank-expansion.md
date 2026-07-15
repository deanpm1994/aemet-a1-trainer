# Question Bank Visibility and Verified 2014 Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show all 27 canonical questions and expand verified historical practice to 36 questions.

**Architecture:** `official-past-exam-subset.ts` remains canonical content. Validated records seed Supabase `questions`; route reads live rows and uses equivalent checked-in fallback only on remote failure. Attempts/progress remain separate.

**Tech Stack:** TypeScript, Vitest, Next.js, Supabase PostgreSQL.

## Global Constraints

- Preserve exact official statement/options, URLs, dates, verification, and answer provenance.
- Import only 2014 questions 13 and 15–22; answers: `B, B, A, B, B, D, D, B, A, D`.
- Exclude 4, 7, 11, 12, 14, and uninspected items; source notes use `TODO_VERIFY_OFFICIAL_SOURCE`.
- Do not touch local reminder changes.

## File Structure

- `apps/web/lib/canonical-questions-source.ts`: live/fallback loader.
- `apps/web/lib/canonical-questions-source.test.ts`: deterministic parity tests.
- `apps/web/lib/official-past-exam-subset.ts`: 2014 records.
- `apps/web/lib/official-past-exam-subset.test.ts`: source contract.
- `docs/official-sources/aemet-miteco-a1-2014-primer-ejercicio.md`: provenance manifest.
- `docs/PROJECT_MEMORY.md`, `docs/GITHUB_ISSUES.md`: handoff state.

### Task 1: Test canonical/live parity

**Files:** Create `apps/web/lib/canonical-questions-source.test.ts`; modify `apps/web/lib/canonical-questions-source.ts`.

**Produces:** deterministic success and failure tests: both paths return 27 unique verified ids.

- [ ] Write failing tests: success result has `sourceState === "live"`, 27 questions, 27 unique ids; injected loader failure returns `fallback_error`, 27 questions, same ids.
- [ ] Run `npm --prefix apps/web test -- canonical-questions-source.test.ts`; expected FAIL because loader has no injected dependency seam.
- [ ] Add optional `loadCanonicalQuestions = getVerifiedCanonicalQuestions` parameter to `loadCanonicalQuestionsSource`; production calls it with Supabase client, tests pass a 27-record source or throwing loader.
- [ ] Run focused test; expected PASS without network.
- [ ] Commit `fix(questions): preserve canonical source parity` staging only loader and test.

### Task 2: Add verified 2014 records

**Files:** Modify `apps/web/lib/official-past-exam-subset.ts`, `apps/web/lib/official-past-exam-subset.test.ts`, and `docs/official-sources/aemet-miteco-a1-2014-primer-ejercicio.md`.

**Produces:** 36 total records; 2014 question numbers `1,2,3,5,6,8,9,10,13,15,16,17,18,19,20,21,22`.

- [ ] Write failing test: total 36; full 2014 number list; nine new answer letters `B,B,A,B,B,D,D,B,A,D`; all new records have official source/answer URLs and retrieval date 2026-07-12.
- [ ] Run `npm --prefix apps/web test -- official-past-exam-subset.test.ts`; expected FAIL with total 27.
- [ ] Append nine exact AEMET PDF statement/option records; spread common 2014 fields, use dates 2026-07-12, answers only from MITECO template. Copy all four options word-for-word; do not normalize symbols. Update manifest with imported numbers and exclusions `4,7,11,12,14,23+` marked `TODO_VERIFY_OFFICIAL_SOURCE`.
- [ ] Run focused test; expected PASS with 36 total and 17 verified 2014 records.
- [ ] Commit `feat(questions): expand verified 2014 exam subset` staging only these source files.

### Task 3: Seed and verify live bank

**Files:** Modify `docs/PROJECT_MEMORY.md` and `docs/GITHUB_ISSUES.md`.

**Produces:** Supabase holds 36 verified rows; #13 remains open for later inspected batches.

- [ ] Run `npm --prefix apps/web run seed:canonical-questions`; expected `Seeded 36 verified canonical questions.`
- [ ] Run read-only verified-row query; expected 2014×17, 2015×4, 2016×5, 2017×5, 2018×5.
- [ ] Record 36 total and imported 2014 numbers in project memory. Keep issue #13 open; later batch requires fresh official inspection.
- [ ] Run `npm --prefix apps/web test`, `npm --prefix apps/web run lint`, `npm --prefix apps/web run build`, and `git diff --check`; expected exit 0 and reminder changes unstaged.
- [ ] Commit `docs(questions): record 2014 expansion` staging only docs.

## Plan Self-Review

- Task 1 resolves 23/27 parity. Task 2 imports only verified source material. Task 3 confirms remote storage and updates handoff.
- No inferred answers, schema changes, or unrelated reminder edits.
