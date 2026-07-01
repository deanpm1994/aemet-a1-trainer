# Question Progress Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist signed-in users' question practice progress while keeping source question content read-only.

**Architecture:** Add a `question_progress` Supabase overlay table keyed by `(user_id, question_id)`. Map rows into practice-state updates and overlay them onto questions loaded from the existing Notion/local source. Save practice-state edits from each question card through a server action.

**Tech Stack:** Next.js App Router, React server actions, TypeScript, Vitest, Supabase PostgreSQL.

---

## Tasks

- [ ] Write failing mapper and overlay tests.
- [ ] Implement question progress mapper and overlay functions.
- [ ] Write failing repository tests.
- [ ] Implement question progress repository functions.
- [ ] Add Supabase migration with RLS policies.
- [ ] Add question progress form and server action.
- [ ] Overlay progress on the questions route.
- [ ] Update docs.
- [ ] Run `npm --prefix apps/web test`, `npm --prefix apps/web run lint`, and `npm --prefix apps/web run build`.
- [ ] Apply migration with `supabase db push`.
- [ ] Commit with a Conventional Commit message.
