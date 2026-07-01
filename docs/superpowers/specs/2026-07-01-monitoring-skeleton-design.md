# Monitoring Skeleton Design

Date: 2026-07-01
Branch: `develop`

## Goal

Replace the monitoring placeholder with a read-only BOE/AEMET monitoring dashboard skeleton that makes the future workflow visible without claiming active polling, scraping, alerts, or verified official changes.

## Scope

This slice adds:

- Monitoring source and event domain types.
- Local placeholder source/event fixtures.
- Summary helpers for source/event status.
- A monitoring page that shows current non-operational status, source checklist, and event queue.
- Tests that ensure `TODO_VERIFY_OFFICIAL_SOURCE` sources are not treated as active or verified.

## Official-Source Boundary

No live URLs are imported in this slice. Source URLs remain `TODO_VERIFY_OFFICIAL_SOURCE` until a separate verification slice records official source URLs intentionally.

The app must say monitoring is not active. It must not claim:

- polling is running
- scraping is running
- alerts are active
- BOE/AEMET changes have been detected
- any future call, exam date, deadline, or number of places

## Application Design

Add monitoring fields to `apps/web/lib/types.ts`.

Add `apps/web/lib/monitoring.ts`:

- `isMonitoringSourceConfigured(source)`
- `isMonitoringSourceActive(source)`
- `buildMonitoringSummary(sources, events)`
- `getPendingMonitoringEvents(events)`

Add placeholder fixtures to `apps/web/lib/mock-data.ts`:

- Source rows for BOE/AEMET monitoring categories with `TODO_VERIFY_OFFICIAL_SOURCE` URLs.
- A small event queue with `requiresReview: true` and `verificationStatus: "needs_review"`.

Update `apps/web/app/monitoring/page.tsx`:

- Show non-operational status.
- Show monitoring summary cards.
- Show source checklist.
- Show event queue.

## Testing

Use test-first changes:

- Sources with `TODO_VERIFY_OFFICIAL_SOURCE` are not configured or active.
- Summary counts active/configured sources and pending events correctly.
- Pending events are sorted newest first.

## Non-Goals

- No network fetches.
- No database table.
- No background jobs.
- No notifications.
- No official source verification.
- No official event detection.
