# Phase 3 Focus and Calendar MVP Design

## Goal

Deliver the first real study-execution slice for AEMET A1 Trainer with a local weekly planner, typed study-session data, a focus timer flow, and an explicit session review step that helps the user close study blocks with structure instead of open-ended work.

## Scope

Phase 3 includes:

- adding a typed `StudySession` domain model aligned with the existing project data model
- adding local current-week study-session fixtures based on the known work schedule
- replacing the `/focus` placeholder with a real focus-session page
- replacing the `/calendar` placeholder with a real current-week planner page
- adding a recommended weekly schedule derived from the candidate's morning-first study template
- allowing local edits to the current week's sessions for cases such as time off or changed work hours
- adding a timer flow that moves a session into a review state when time ends
- adding an explicit session completion checklist and end-of-session decision flow
- adding pure planner and focus helpers that can be tested outside the UI
- updating status docs so Phase 3 becomes the active phase

Phase 3 does not include:

- persistence
- authentication
- notifications or reminders
- template editing for future weeks
- automatic topic or question progress updates on timer completion
- claiming that a finished timer means a completed study session

## Product Constraints

- Phase 3 must stay local and deterministic like Phases 1 and 2.
- The user must decide whether a session is completed, extended, or abandoned.
- The timer reaching zero must not automatically mark a session complete.
- The weekly planner may be edited only for the current week in this MVP.
- Default schedule generation must reflect the known work hours and the documented morning-first study system.
- Night study should remain optional and light in the generated schedule.
- The feature must stay focused on AEMET A1 preparation and avoid becoming a generic productivity tool.

## User Outcome

The user can open the app and:

- see a real current-week study plan instead of a planner placeholder
- review the recommended study blocks derived from the candidate's known schedule
- adjust the current week's sessions locally when a day changes
- open a session in focus mode and run it with a real timer
- reach a structured review step when time ends
- decide whether to complete, extend, or abandon the session
- record study outputs such as notes, solved questions, flashcards, mistakes, confidence, and next review timing

## Architecture

The implementation should follow the existing lightweight pattern:

- `apps/web/lib/types.ts` defines session, planner, and focus-flow domain types
- `apps/web/lib/mock-data.ts` stores current-week session fixtures and updated route copy
- a new helper module under `apps/web/lib/` computes week summaries, schedule grouping, and review-state transitions
- `apps/web/app/calendar/page.tsx` consumes shared planner data and helpers without embedding scheduling logic in JSX
- `apps/web/app/focus/page.tsx` consumes session fixtures and focus-flow helpers without embedding domain rules in JSX
- project docs track the phase handoff from Phase 2 to Phase 3

This keeps the phase testable, explicit, and easy to evolve later when persistence and user settings arrive.

## Data Model

Phase 3 should use the existing `StudySession` entity direction and refine it into a UI-ready local model.

Required fields:

- `id`
- `name`
- `sessionType`
- `objective`
- `topicIds`
- `questionIds`
- `plannedDate`
- `plannedStartTime`
- `plannedEndTime`
- `plannedDurationMinutes`
- `status`
- `timerStatus`
- `completed`
- `reviewState`
- `notesCreated`
- `questionsSolved`
- `flashcardsCreated`
- `mistakesLogged`
- `confidenceAfter`
- `nextReviewAt`
- `notes`

Required status behavior:

- `status` should distinguish scheduled, in-progress, ready-for-review, completed, extended, and abandoned sessions
- `timerStatus` should distinguish idle, running, paused, and finished timer behavior
- `reviewState` should make the review step explicit rather than implied from elapsed time
- `completed` remains a user-confirmed result, not a timer-driven result

Modeling rules:

- current-week session records are local fixtures in this phase
- a generated default schedule may be adjusted only in local UI state
- sessions may reference topics and questions without requiring persistence
- `nextReviewAt` may remain empty when the user has not chosen a review date
- notes and output fields must support partial completion when a session is abandoned

## Derived Data

The app should derive planner and focus summaries from the shared dataset instead of hardcoding route copy.

Required helper outputs:

- current-week session list grouped by day
- total planned sessions for the week
- completed session count
- ready-for-review session count
- total planned study minutes for the week
- total completed study minutes for the week
- today's mission summary
- next focusable session
- timer-end transition that moves a running session into review state
- review decision transitions for complete, extend, and abandon

These helpers must stay pure so they can be tested independently from the UI.

## Route Design

### `/calendar`

The page should:

- render a real current-week planner
- show each day's study blocks with session type, objective, planned time, and status
- clearly label the week as a local editable plan
- allow lightweight edits to current-week session timing and objective fields
- support marking a session as the active focus candidate
- show summary cards for weekly planned hours, completed blocks, and sessions needing review
- include a reset-to-recommended-week action

Phase 3 does not require future-week generation or saved user preferences.

### `/focus`

The page should:

- render a real focus session instead of placeholder content
- show one selected session with objective, linked topics or questions, planned duration, and output checklist
- support starting, pausing, resuming, and resetting the timer locally
- move the session to a review state when the timer ends
- present explicit actions to complete, extend, or abandon the session
- collect end-of-session outputs without auto-updating unrelated progress records
- make it clear that this phase is local only and not yet saved

Phase 3 does not require background timers, notifications, or multi-session queue management.

## Interaction Rules

- Starting a session moves it from scheduled to in-progress.
- Pausing a session does not change completion state.
- Resetting a timer returns only the timer state, not the output checklist.
- When the timer reaches zero, the session enters ready-for-review.
- Completing a session requires explicit user confirmation.
- Extending a session should add local extra time and return the session to in-progress.
- Abandoning a session should preserve partial outputs and mark the session as not completed.

## Error Handling

Phase 3 only needs lightweight local handling:

- if no session is selected for focus mode, render a clear empty state with guidance to choose one from the planner
- if a day has no sessions, render an intentional empty planner state
- invalid or missing optional output fields should fall back to explicit placeholder text
- timer and review copy must not imply saved data or automatic progress syncing

## Testing Strategy

Tests should focus on planner and focus logic first.

Required coverage:

- week grouping and summary generation
- default schedule shape based on the documented study template
- current-week editable session transformations
- timer-end transition into review state
- explicit review decision transitions for complete, extend, and abandon
- safe handling of sessions with partial outputs or no `nextReviewAt`

Rendering tests are optional unless current project patterns already require them.

## Documentation Impact

Phase 3 should update:

- status docs that still describe Phase 2 as current
- roadmap wording so Phase 3 is clearly active
- route descriptions that still describe planner and focus pages as placeholders

## Files Expected To Change

Likely files:

- `README.md`
- `docs/ROADMAP.md`
- `apps/web/lib/types.ts`
- `apps/web/lib/mock-data.ts`
- new helper and test files under `apps/web/lib/`
- `apps/web/app/calendar/page.tsx`
- `apps/web/app/focus/page.tsx`

## Success Criteria

Phase 3 is complete when:

- the app contains a real current-week planner instead of a calendar placeholder
- the app contains a real focus-session page instead of a focus placeholder
- the planner shows a recommended week based on the documented study system
- the current week's sessions can be adjusted locally without persistence
- timer completion moves a session into review state instead of auto-completing it
- the user can explicitly complete, extend, or abandon a session
- session summary and transition logic is covered by automated tests
- project docs clearly show Phase 3 as the active implementation phase
