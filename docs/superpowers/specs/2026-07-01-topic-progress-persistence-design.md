# Topic Progress Persistence Design

Date: 2026-07-01
Branch: `develop`

## Goal

Persist per-user topic study progress in Supabase without copying or mutating official/source-owned topic metadata.

## Current State

- Topic content is loaded through `loadTopicsSource()`, which prefers Notion and falls back to local mock data.
- Topic fields currently combine source metadata and study state on the `Topic` type.
- Official fields remain unverified in local fixtures and must not be presented as official unless verified.
- Supabase persistence already covers settings and study sessions.

## Scope

This slice persists user-owned progress only:

- `status`
- `confidence`
- `priority`
- `nextReviewAt`
- `notesStatus`

The app overlays those fields onto topics loaded from Notion/local fallback for signed-in users. Anonymous users keep the current source-only topic state.

## Data Model

Create `public.topic_progress`:

- `user_id uuid not null references auth.users (id) on delete cascade`
- `topic_id text not null`
- `status text not null`
- `confidence integer not null`
- `priority text not null`
- `next_review_at text not null default ''`
- `notes_status text not null default ''`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- primary key `(user_id, topic_id)`

Row-level security allows authenticated users to select, insert, update, and delete only rows where `auth.uid() = user_id`.

## Application Design

Add `apps/web/lib/topic-progress-persistence.ts`:

- `TopicProgressRow`
- `TopicProgressRowInput`
- `TopicProgressUpdate`
- `mapRowToTopicProgressUpdate(row)`
- `mapTopicProgressUpdateToRowInput(userId, topicId, update)`
- `applyTopicProgress(topics, updates)`

Add `apps/web/lib/topic-progress-repository.ts`:

- `getTopicProgress(client, userId)`
- `saveTopicProgress(client, userId, topicId, update)`

Update `apps/web/app/topics/page.tsx`:

- Load topics from the existing Notion-first source.
- If signed in and Supabase is configured, load progress rows and overlay them.
- Keep fallback messaging explicit when progress cannot load.

Update `apps/web/app/topics/[id]/page.tsx`:

- Load one topic with the same overlay behavior.
- Add a small server-action-backed study-state form for signed-in users.
- Keep official metadata display-only.
- Anonymous users see the same topic detail plus a local-only status message.

## Testing

Use test-first changes:

- Mapper tests for row/input conversion and overlay behavior.
- Repository tests for loading rows by user and upserting one progress record.
- Existing topic progress summary tests must remain green.

## Documentation

Update:

- `docs/DATA_MODEL.md`
- `docs/PROJECT_MEMORY.md`
- `docs/ROADMAP.md`

## Non-Goals

- No official topic import.
- No modification of official wording, source URL, retrieval date, or verification status.
- No question-attempt persistence in this slice.
- No monitoring, reminders, or countdown changes.
