# Monitoring Source Verification Design

Date: 2026-07-01
Branch: `develop`

## Goal

Add a source-verification workflow for BOE/AEMET monitoring without adding unverified official URLs or claiming automated monitoring is active.

## Scope

This slice adds:

- Source verification requirements.
- A verification queue derived from monitoring sources.
- Helper rules that explain why a source is not ready for automation.
- Monitoring page UI for source verification status.

## Official-Source Boundary

No URL is upgraded from `TODO_VERIFY_OFFICIAL_SOURCE` to verified in this slice.

A monitoring source is ready for automation only when:

- URL is not `TODO_VERIFY_OFFICIAL_SOURCE`.
- `verificationStatus` is `verified`.
- `lastVerifiedAt` is present.
- `verifiedBy` is present.
- At least one expected official signal is recorded.

Even a ready source must not be counted as active unless `status` is `active`.

## Non-Goals

- No network polling.
- No scraping.
- No source URL verification by inference.
- No official event detection.
- No alerts.
