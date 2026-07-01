# Monitoring Source Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add source-verification workflow rules and UI for monitoring sources.

**Architecture:** Extend `MonitoringSource` with verification metadata. Add pure helpers to calculate readiness and queue items. Render the queue on `/monitoring` while keeping all placeholder sources unready.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Tailwind CSS.

---

## Tasks

- [ ] Add failing monitoring verification tests.
- [ ] Extend monitoring source types and fixtures.
- [ ] Implement verification readiness helpers.
- [ ] Render source verification queue on the monitoring page.
- [ ] Update monitoring docs.
- [ ] Run `npm --prefix apps/web test`, `npm --prefix apps/web run lint`, and `npm --prefix apps/web run build`.
- [ ] Commit with a Conventional Commit message.
