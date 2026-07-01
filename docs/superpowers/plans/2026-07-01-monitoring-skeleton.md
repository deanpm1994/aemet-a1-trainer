# Monitoring Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a tested read-only monitoring dashboard skeleton without claiming active BOE/AEMET monitoring.

**Architecture:** Add pure monitoring domain helpers and local placeholder fixtures. Render those fixtures on `/monitoring` with explicit non-operational copy. Keep official URL verification, polling, persistence, and alerts out of scope.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Tailwind CSS.

---

## Tasks

- [ ] Write failing monitoring helper tests.
- [ ] Add monitoring types, helpers, and mock fixtures.
- [ ] Replace the placeholder monitoring route with read-only summary/source/event sections.
- [ ] Update docs and project memory.
- [ ] Run `npm --prefix apps/web test`, `npm --prefix apps/web run lint`, and `npm --prefix apps/web run build`.
- [ ] Commit with a Conventional Commit message.
