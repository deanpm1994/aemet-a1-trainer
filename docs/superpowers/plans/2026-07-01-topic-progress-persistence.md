# Topic Progress Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist signed-in users' topic study progress while keeping official/source topic metadata read-only.

**Architecture:** Add a `topic_progress` Supabase overlay table keyed by `(user_id, topic_id)`. Map Supabase rows into study-state updates and overlay them onto topics loaded from the existing Notion/local source. Save study-state edits from topic detail through a server action.

**Tech Stack:** Next.js App Router, React server actions, TypeScript, Vitest, Supabase PostgreSQL.

---

## File Structure

- Create `supabase/migrations/20260701_phase_5_5_topic_progress.sql`.
- Create `apps/web/lib/topic-progress-persistence.ts`.
- Create `apps/web/lib/topic-progress-persistence.test.ts`.
- Create `apps/web/lib/topic-progress-repository.ts`.
- Create `apps/web/lib/topic-progress-repository.test.ts`.
- Create `apps/web/components/topic-progress-form.tsx`.
- Modify `apps/web/app/topics/page.tsx`.
- Modify `apps/web/app/topics/[id]/page.tsx`.
- Modify `docs/DATA_MODEL.md`, `docs/PROJECT_MEMORY.md`, and `docs/ROADMAP.md`.

## Tasks

- [ ] Write failing mapper and overlay tests.
- [ ] Implement topic progress mapper and overlay functions.
- [ ] Write failing repository tests.
- [ ] Implement topic progress repository functions.
- [ ] Add Supabase migration with RLS policies.
- [ ] Add topic detail progress form and server action.
- [ ] Overlay progress on topics list and detail routes.
- [ ] Update docs.
- [ ] Run `npm --prefix apps/web test`, `npm --prefix apps/web run lint`, and `npm --prefix apps/web run build`.
- [ ] Commit with a Conventional Commit message.
