# Session Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist editable calendar study sessions in Supabase for signed-in users while keeping local demo behavior for unauthenticated users.

**Architecture:** Add a Supabase `study_sessions` table with RLS, mapper functions that convert between snake_case rows and `StudySession`, and a thin repository matching the existing user-settings pattern. Convert the calendar route into an auth-aware server loader with a client planner component that performs optimistic local updates and calls server actions only for persisted sessions.

**Tech Stack:** Next.js App Router, React client components, TypeScript, Supabase SSR client, Vitest.

---

## File Structure

- Create `supabase/migrations/20260630_phase_5_3_study_sessions.sql`: table, trigger, and RLS policies.
- Create `apps/web/lib/study-sessions.ts`: row types, row/session mappers, recommended-session row input helpers.
- Create `apps/web/lib/study-sessions.test.ts`: mapper unit tests.
- Create `apps/web/lib/study-sessions-repository.ts`: Supabase repository functions.
- Create `apps/web/lib/study-sessions-repository.test.ts`: repository behavior tests with a lightweight fake client.
- Create `apps/web/components/calendar-planner.tsx`: interactive planner UI moved from the current route.
- Modify `apps/web/app/calendar/page.tsx`: server component loader and server actions.
- Modify `docs/DATA_MODEL.md`: persisted `StudySession` table notes.
- Modify `docs/PROJECT_MEMORY.md`: current branch and slice status.

## Tasks

### Task 1: Schema And Mappers

**Files:**
- Create: `supabase/migrations/20260630_phase_5_3_study_sessions.sql`
- Create: `apps/web/lib/study-sessions.ts`
- Test: `apps/web/lib/study-sessions.test.ts`

- [ ] Write failing mapper tests for row-to-session and session-to-row input.
- [ ] Run `npm --prefix apps/web test -- study-sessions.test.ts` and confirm missing module failures.
- [ ] Implement `study-sessions.ts` with explicit row types and mapper functions.
- [ ] Add the Supabase migration with RLS for owner-only access.
- [ ] Run `npm --prefix apps/web test -- study-sessions.test.ts` and confirm the tests pass.
- [ ] Commit with `feat(sessions): add persistence schema mappers`.

### Task 2: Repository

**Files:**
- Create: `apps/web/lib/study-sessions-repository.ts`
- Test: `apps/web/lib/study-sessions-repository.test.ts`

- [ ] Write failing repository tests for loading, seeding, upserting, replacing, and error propagation.
- [ ] Run `npm --prefix apps/web test -- study-sessions-repository.test.ts` and confirm missing implementation failures.
- [ ] Implement repository functions with the same thin-client style as `user-settings-repository.ts`.
- [ ] Run `npm --prefix apps/web test -- study-sessions-repository.test.ts study-sessions.test.ts`.
- [ ] Commit with `feat(sessions): add supabase repository`.

### Task 3: Calendar Route Integration

**Files:**
- Create: `apps/web/components/calendar-planner.tsx`
- Modify: `apps/web/app/calendar/page.tsx`
- Test: `apps/web/lib/focus-planner.test.ts`

- [ ] Move the current interactive calendar UI into `CalendarPlanner`.
- [ ] Convert `app/calendar/page.tsx` into an async server component that gets the current user from Supabase.
- [ ] Load and seed persisted sessions for signed-in users.
- [ ] Add server actions for updating one session plan and resetting the recommended week.
- [ ] Keep unauthenticated users local-only.
- [ ] Run `npm --prefix apps/web run lint` and fix type errors.
- [ ] Run `npm --prefix apps/web test -- focus-planner.test.ts study-sessions.test.ts study-sessions-repository.test.ts`.
- [ ] Commit with `feat(calendar): persist signed-in session plans`.

### Task 4: Docs And Final Verification

**Files:**
- Modify: `docs/DATA_MODEL.md`
- Modify: `docs/PROJECT_MEMORY.md`

- [ ] Update docs to state exactly what session persistence covers.
- [ ] Run `npm --prefix apps/web run lint`.
- [ ] Run `npm --prefix apps/web test`.
- [ ] Run `npm --prefix apps/web run build`.
- [ ] Commit with `docs(sessions): record persistence status`.
