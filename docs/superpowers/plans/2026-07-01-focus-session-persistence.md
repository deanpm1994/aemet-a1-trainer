# Focus Session Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist focus-session timer and review outcomes for signed-in users using the existing Supabase `study_sessions` table.

**Architecture:** Keep focus state transformations in `apps/web/lib/focus-planner.ts`. Make `/focus` an auth-aware server route that loads persisted sessions and delegates interaction to a focused client component. Save updated session rows through the existing `saveStudySessionPlan` repository function.

**Tech Stack:** Next.js App Router, React client components, TypeScript, Vitest, Supabase server client.

---

## File Structure

- Modify `apps/web/lib/focus-planner.ts`: add pure helper selection and abandon-state transformations.
- Modify `apps/web/lib/focus-planner.test.ts`: add TDD coverage for the new helper behavior.
- Create `apps/web/components/focus-session-panel.tsx`: client-side focus controls and optimistic persistence messages.
- Modify `apps/web/app/focus/page.tsx`: server loader and save action for persisted focus sessions.
- Modify `docs/PROJECT_MEMORY.md`: record the new persistence slice.
- Modify `docs/DATA_MODEL.md`: clarify focus mode now uses persisted `study_sessions` outcome fields.

### Task 1: Focus Planner Helpers

**Files:**
- Modify: `apps/web/lib/focus-planner.ts`
- Test: `apps/web/lib/focus-planner.test.ts`

- [ ] **Step 1: Write failing tests**

Add tests showing `getNextFocusSession` skips completed and abandoned sessions, sorts by date/start time, and returns review-ready sessions. Add a test showing `abandonSession` marks a session abandoned, finished, incomplete, and reviewed.

- [ ] **Step 2: Run focused tests to verify RED**

Run: `npm --prefix apps/web test -- apps/web/lib/focus-planner.test.ts`

Expected: FAIL because `getNextFocusSession` and `abandonSession` are not exported.

- [ ] **Step 3: Implement minimal helper code**

Add `getNextFocusSession` and `abandonSession` in `focus-planner.ts`, using existing `StudySession` types and no Supabase dependencies.

- [ ] **Step 4: Run focused tests to verify GREEN**

Run: `npm --prefix apps/web test -- apps/web/lib/focus-planner.test.ts`

Expected: PASS.

### Task 2: Focus Client Component

**Files:**
- Create: `apps/web/components/focus-session-panel.tsx`
- Modify: `apps/web/app/focus/page.tsx`

- [ ] **Step 1: Extract the current interactive UI**

Move the current focus page's client-side interaction into `FocusSessionPanel`, with props for initial session, status message, persistence flag, and save callback.

- [ ] **Step 2: Preserve local-only behavior**

When `canPersist` is false, update local state only and show local-only status copy.

- [ ] **Step 3: Persist signed-in focus transitions**

When `canPersist` is true, call the save action after each transition and display the returned message.

### Task 3: Focus Server Loader

**Files:**
- Modify: `apps/web/app/focus/page.tsx`

- [ ] **Step 1: Load persisted sessions for signed-in users**

Use `getSupabaseBrowserConfig`, `getAuthenticatedUserId`, `createSupabaseServerClient`, and `ensureStudySessions`, matching the calendar route pattern.

- [ ] **Step 2: Select the next focus session**

Use `getNextFocusSession` against persisted sessions for signed-in users and mock sessions for anonymous users.

- [ ] **Step 3: Add the save server action**

Create `saveFocusSessionAction(session)` that requires an authenticated user and calls `saveStudySessionPlan`.

### Task 4: Documentation and Verification

**Files:**
- Modify: `docs/PROJECT_MEMORY.md`
- Modify: `docs/DATA_MODEL.md`

- [ ] **Step 1: Update documentation**

Record that focus-session review outcomes now persist for signed-in users through `study_sessions`.

- [ ] **Step 2: Run verification**

Run:

```bash
npm --prefix apps/web test
npm --prefix apps/web run lint
npm --prefix apps/web run build
```

Expected: all commands pass.
