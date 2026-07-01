# Study Content Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a safe content-readiness layer so private study can start without presenting unverified content as official.

**Architecture:** Add pure TypeScript helpers for content readiness, a reusable React card, and render it on study entry routes. Keep source-owned topic/question fields unchanged.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Tailwind CSS.

---

## Tasks

- [ ] Add failing `apps/web/lib/content-readiness.test.ts` coverage for starter, mixed, verified, and placeholder-metadata states.
- [ ] Implement `apps/web/lib/content-readiness.ts`.
- [ ] Add `apps/web/components/content-readiness-card.tsx`.
- [ ] Render the card on dashboard, topics, and questions.
- [ ] Update `docs/PROJECT_MEMORY.md`.
- [ ] Run `npm --prefix apps/web test`, `npm --prefix apps/web run lint`, and `npm --prefix apps/web run build`.
- [ ] Commit with `feat(content): add study readiness status`.
