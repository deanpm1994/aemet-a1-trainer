# Session Persistence Design

Date: 2026-06-30
Branch: `feature/session-persistence`
GitHub issue: https://github.com/deanpm1994/aemet-a1-trainer/issues/1

## Goal

Persist the editable calendar study sessions in Supabase for signed-in users while keeping the existing local demo planner available for unauthenticated users.

## Current State

- `apps/web/app/calendar/page.tsx` is a client component that stores `studySessions` in React state.
- `apps/web/lib/focus-planner.ts` owns planner transformations such as grouping sessions, updating objective/start/end, and resetting to the recommended week.
- `apps/web/lib/types.ts` already defines `StudySession`.
- Supabase persistence currently covers `user_settings` only.
- The project uses mapper modules plus thin repository wrappers, as seen in `user-settings.ts` and `user-settings-repository.ts`.

## Scope

This slice persists calendar planning only:

- Load a signed-in user's study sessions from Supabase.
- Seed the recommended week when a signed-in user has no saved sessions.
- Persist edits to objective, planned start time, and planned end time.
- Reset the signed-in user's persisted sessions to the recommended week.
- Keep unauthenticated users on the current local-only planner.

This slice does not persist focus review outcomes, topic progress, question attempts, monitoring events, or official exam data. Those remain tracked separately.

## Data Model

Create a `study_sessions` table owned by `auth.users`.

Required columns:

- `id uuid primary key`
- `user_id uuid not null references auth.users (id) on delete cascade`
- `name text not null`
- `session_type text not null`
- `objective text not null`
- `topic_ids text[] not null default '{}'`
- `question_ids text[] not null default '{}'`
- `planned_date date not null`
- `planned_start_time text not null`
- `planned_end_time text not null`
- `planned_duration_minutes integer not null`
- `status text not null`
- `timer_status text not null`
- `completed boolean not null default false`
- `review_state text not null`
- `notes_created boolean not null default false`
- `questions_solved integer not null default 0`
- `flashcards_created integer not null default 0`
- `mistakes_logged integer not null default 0`
- `confidence_after integer`
- `next_review_at date`
- `notes text not null default ''`
- `is_template boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

The app-level `StudySession.isPersisted` field remains derived from whether a row came from Supabase, not stored as authoritative user data.

Row-level security:

- Authenticated users can select, insert, update, and delete only rows where `auth.uid() = user_id`.

## Application Design

Add `apps/web/lib/study-sessions.ts` for row mapping and row input creation:

- `StudySessionRow`
- `StudySessionRowInput`
- `mapRowToStudySession(row)`
- `mapStudySessionToRowInput(userId, session)`
- `mapRecommendedSessionsToRowInputs(userId, sessions)`

Add `apps/web/lib/study-sessions-repository.ts` for Supabase operations:

- `getStudySessions(client, userId)` returns mapped sessions sorted by date and start time.
- `saveStudySessionPlan(client, userId, session)` upserts one session after planner edits.
- `replaceStudySessionsWithRecommendedWeek(client, userId, recommendedSessions)` deletes the user's current sessions and inserts the recommended week.
- `ensureStudySessions(client, userId, recommendedSessions)` returns existing sessions, or seeds and returns the recommended week when no rows exist.

Update the calendar route to a server component that checks the current Supabase user and loads persisted sessions when signed in. Move the interactive planner UI into a client component:

- `apps/web/app/calendar/page.tsx`: server loader and auth-aware data selection.
- `apps/web/components/calendar-planner.tsx`: existing interactive planner UI with server action callbacks.

Add server actions in the calendar route or a small helper module:

- Update session plan for a signed-in user.
- Reset sessions to the recommended week for a signed-in user.

For unauthenticated users, the client component receives `isPersisted={false}` and keeps all changes in local state only.

## Error Handling

- If Supabase reads fail for a signed-in user, throw the error and let Next.js surface the route failure during development.
- If a session update action fails, keep the previous local state and show a short inline persistence error.
- Do not silently claim persistence when no authenticated user exists.

## Testing

Use test-first changes.

Mapper tests:

- Maps Supabase rows to `StudySession`.
- Maps `StudySession` values to row inputs for a user.
- Derives `isPersisted: true` from Supabase rows.
- Preserves nullable `confidence_after` and `next_review_at`.

Repository tests:

- Returns default seeded sessions when the user has no saved rows.
- Upserts one edited session for the current user.
- Replaces only the current user's sessions on reset.
- Throws Supabase errors instead of swallowing them.

Existing planner tests remain valid and should not be weakened.

## Documentation

Update:

- `docs/DATA_MODEL.md` to describe the persisted `StudySession` table.
- `docs/PROJECT_MEMORY.md` with the new branch and current slice status.

## Non-Goals

- No official source imports.
- No BOE/AEMET monitoring.
- No future exam date, deadline, or countdown assumptions.
- No browser notifications.
- No focus review outcome persistence in this slice.
