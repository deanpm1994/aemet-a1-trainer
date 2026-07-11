# Manual Official-Source Monitoring MVP Design

## Goal

Give candidate trustworthy, manually triggered BOE/AEMET change check. Persist evidence; send every possible change to review; never claim official conclusion.

## Architecture

- Seed fixed allowlist of verified official AEMET/BOE source records; user cannot supply fetch URL.
- Store sources, immutable check snapshots, review events in Supabase with authenticated RLS ownership.
- Server action fetches allowlisted URL, normalizes text, computes deterministic SHA-256 hash, compares latest snapshot.
- First check records baseline. Changed hash creates `needs_review` generic-change event. Keyword matches enrich review metadata only.
- UI shows manual check history/review queue; states scheduling, polling, alerts, official conclusion inactive.

## Safety

- Only AEMET and BOE HTTPS URLs in source records may be fetched.
- Timeout, non-OK response, oversized payload, empty normalized text yields check error, not event.
- Source content never becomes verified official fact merely because change detected.
- No exam date, deadline, places, event text inferred from keywords.

## Data and Tests

- Add `monitoring_sources`, `monitoring_snapshots`, `monitoring_events` migrations with user-owned RLS.
- Unit-test allowlist, normalization/hash stability, baseline, unchanged/changed snapshot, keyword detection.
- Repository tests cover user-owned reads/inserts.

## Out of Scope

- Cron, polling, browser notifications, push, source scraping beyond manual fetch, official-date parsing, automatic status transitions.
