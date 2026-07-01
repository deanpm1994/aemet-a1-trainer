# Study Content Readiness Design

Date: 2026-07-01
Branch: `develop`

## Goal

Show whether the app is ready for private study tracking while making clear that official syllabus and past-question content still needs verification.

## Scope

- Add a pure content-readiness helper for topics and questions.
- Count total, verified, needs-review, unverified, and deprecated items.
- Return safe user-facing readiness states:
  - ready for private tracking when content exists;
  - official verification pending when not all content is verified;
  - empty when no content exists.
- Render the readiness status on dashboard, topics, and questions.
- Add tests that prevent unverified content from being labeled official.

## Non-Goals

- No BOE/AEMET content import.
- No official syllabus wording changes.
- No official past-question or answer-key claims.
- No future exam date assumptions.
- No monitoring automation.

## Application Design

Create `apps/web/lib/content-readiness.ts` with:

- `buildContentReadiness(topics, questions)`
- `summarizeVerification(items)`

The helper treats `verified` as the only official-ready status. Any `unverified`, `needs_review`, `deprecated`, or `TODO_VERIFY_OFFICIAL_SOURCE` metadata keeps official content readiness pending.

Create `apps/web/components/content-readiness-card.tsx` as a small reusable status card. It should say the app is usable for private tracking when source items exist, but official content remains pending unless every source item is verified.

Use the card on:

- `/dashboard`
- `/topics`
- `/questions`

## Testing

Use test-first implementation:

- Add tests for all-unverified starter content.
- Add tests for mixed verified and unverified content.
- Add tests for fully verified content.
- Add tests that placeholder official metadata prevents official-ready status.

## Documentation

Update `docs/PROJECT_MEMORY.md` with the content-readiness status and the remaining blocker: verified official syllabus and question imports.
