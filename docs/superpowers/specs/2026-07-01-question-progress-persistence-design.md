# Question Progress Persistence Design

Date: 2026-07-01
Branch: `develop`

## Goal

Persist per-user question practice progress in Supabase without copying or mutating source-owned question statements, options, answer keys, explanations, or verification metadata.

## Scope

Persist user-owned practice state only:

- `attemptsCount`
- `lastAttemptAt`
- `nextReviewAt`
- `mistakeTypes`

The app overlays those values onto questions loaded from the existing Notion/local fallback source for signed-in users. Anonymous users keep the current source-only question state.

## Data Model

Create `public.question_progress`:

- `user_id uuid not null references auth.users (id) on delete cascade`
- `question_id text not null`
- `attempts_count integer not null default 0`
- `last_attempt_at text not null default ''`
- `next_review_at text not null default ''`
- `mistake_types text[] not null default '{}'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- primary key `(user_id, question_id)`

Row-level security allows authenticated users to select, insert, update, and delete only rows where `auth.uid() = user_id`.

## Application Design

Add mapper/overlay helpers:

- `apps/web/lib/question-progress-persistence.ts`
- `apps/web/lib/question-progress-repository.ts`

Update `apps/web/app/questions/page.tsx`:

- Load questions from the existing Notion-first source.
- If signed in and Supabase is configured, load progress rows and overlay them.
- Add a small progress form on each question card for signed-in users.
- Keep source question content, answer source status, source exam, and verification metadata read-only.

## Testing

Use test-first changes:

- Mapper tests for row/input conversion and overlay behavior.
- Repository tests for user-scoped reads and upserts.
- Existing question bank summary tests must remain green.

## Non-Goals

- No official answer-key changes.
- No user-entered answer explanations.
- No official source imports.
- No separate attempt history table in this slice.
- No monitoring, reminders, or countdown changes.
