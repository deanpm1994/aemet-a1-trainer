# Manual Monitoring MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement task-by-task.

**Goal:** Persist manual, source-allowlisted BOE/AEMET checks and review-only change events.

**Architecture:** Server-only check engine hashes normalized source text. Supabase stores source metadata, snapshots, events. Route consumes repository data; no cron/alert path exists.

## Constraints

- AEMET/BOE HTTPS allowlist only.
- Baseline/unchanged/change/error distinct.
- Change events always `needs_review`; no automatic official claim.
- No inferred dates/deadlines/places.

### Task 1: Pure check engine

Files: create `apps/web/lib/monitoring-check.ts`, test `apps/web/lib/monitoring-check.test.ts`.

- [ ] Red tests: reject non-allowlisted URLs; stable normalization/hash; baseline/unchanged/change; keyword hits.
- [ ] Implement URL validation, bounded fetch response normalization, SHA-256 hash, comparison result.
- [ ] Run focused tests; commit `feat(monitoring): add manual check engine`.

### Task 2: Persistent monitoring records

Files: create migration, repository/types tests.

- [ ] Red repository tests for user-owned source/snapshot/event reads/writes.
- [ ] Add RLS migrations and repository mapping.
- [ ] Run focused tests; commit `feat(monitoring): persist check snapshots`.

### Task 3: Manual UI/action

Files: monitoring action, route/components, tests.

- [ ] Red route/action tests for baseline/change review-only state.
- [ ] Add authenticated manual-check control and persisted history/review queue; preserve inactive automation copy.
- [ ] Run full tests/lint/build; docs; commit `feat(monitoring): add manual source checks`.
