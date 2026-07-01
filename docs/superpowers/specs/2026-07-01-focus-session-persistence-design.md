# Focus Session Persistence Design

Date: 2026-07-01
Branch: `develop`

## Goal

Persist focus-session timer and review outcomes for signed-in users through the existing Supabase-backed `study_sessions` table.

## Current State

- `/calendar` loads, seeds, edits, and resets signed-in users' `study_sessions` rows in Supabase.
- `/focus` is a client-only demo page initialized from `studySessions[1]`.
- `StudySession` already contains the fields needed for focus outcomes: `status`, `timerStatus`, `reviewState`, checklist outputs, `confidenceAfter`, `nextReviewAt`, and `notes`.
- `study_sessions` already stores those fields in Supabase.

## Scope

This slice persists focus-session outcomes only:

- Load a signed-in user's next actionable focus session from persisted `study_sessions`.
- Keep anonymous users on the existing local-only demo behavior.
- Persist focus transitions for signed-in users:
  - start timer
  - pause timer
  - reset timer
  - move to review after timer end
  - complete review
  - extend session
  - abandon session
- Surface a short inline persistence status message.

This slice does not add official exam content, monitoring, browser notifications, topic progress persistence, question attempts, or future exam-date assumptions.

## Application Design

Add focus-specific helper functions in `apps/web/lib/focus-planner.ts`:

- `getNextFocusSession(sessions)` returns the first session that can reasonably be opened in focus mode, preferring scheduled, in-progress, extended, and ready-for-review sessions sorted by planned date and start time.
- `abandonSession(session)` returns a finished abandoned session with review state done.

Add tests in `apps/web/lib/focus-planner.test.ts` for these helper behaviors.

Update `apps/web/app/focus/page.tsx` to match the calendar persistence pattern:

- Make the route a server component.
- Check Supabase configuration and authenticated user.
- For signed-in users, load or seed sessions through `ensureStudySessions`.
- Select the next focus session with `getNextFocusSession`.
- Pass the selected session, persistence status, and server actions into a new client component.

Create `apps/web/components/focus-session-panel.tsx`:

- Owns the interactive focus UI and local optimistic state.
- Calls server actions only when `canPersist` is true.
- Keeps anonymous users fully local with clear local-only copy.
- Shows the checklist and review actions currently present on `/focus`.

Server actions in the focus route save the whole updated session row through `saveStudySessionPlan`:

- `saveFocusSessionAction(session)`

The client computes the next session state with existing pure helpers, updates local state, then calls the save action.

## Error Handling

- If Supabase is not configured, show the local demo session and explain persistence is unavailable.
- If no user is signed in, show local-only behavior.
- If loading saved sessions fails, show the local demo session and a short warning.
- If saving fails, keep the optimistic local state and show a short message telling the user the change was not persisted.

## Testing

Use test-first changes:

- Add failing `focus-planner` tests for selecting the next focus session.
- Add a failing `focus-planner` test for abandoning a session.
- Run the focused test file and confirm the new tests fail before implementation.
- Implement the helpers.
- Run the focused test file until it passes.
- Run the full web test suite, lint, and build if available.

## Documentation

Update:

- `docs/PROJECT_MEMORY.md` with focus-session outcome persistence status.
- `docs/DATA_MODEL.md` only if the behavior description needs to clarify that the existing `study_sessions` outcome fields are now used by focus mode.

## Non-Goals

- No new tables.
- No official-source imports.
- No BOE/AEMET monitoring.
- No future exam date, deadline, or countdown assumptions.
- No browser notifications.
