# Complete Topic Documentation Design

## Goal

Make every verified AEMET A1 syllabus topic immediately studyable by adding
reviewed Spanish guidance for the remaining Physics, Informatics and
Communications, and General/Common topics.

## Scope

- Extend the existing `getTopicStudyMaterial` source instead of changing
  source-owned syllabus records.
- Add one didactic card for each remaining verified topic: 18 Physics, 10
  Informatics and Communications, and 23 General/Common topics.
- Every card retains the label `Material didáctico no oficial` and provides a
  concise objective, key relations, output checklist, and review prompts.
- Preserve each topic's exact BOE title, source URL, retrieval date, and
  verification status outside the didactic content.
- Add coverage and source-label tests, then update project documentation.

## Out of Scope

- No new official syllabus wording, bibliography, dates, past-exam answer
  keys, monitoring claims, notifications, or source scraping.
- No modification of Question Bank, quiz selection, or schedule-orchestrator
  behaviour: all are already working MVP capabilities.
- Phone smoke test remains issue #8 because it needs the candidate's device
  and authenticated study flow.

## Design

`apps/web/lib/topic-study-material.ts` remains the sole owner of didactic
study-card content. It uses topic category and number to return a card for
each verified topic. The topic detail route continues to render that card
next to source metadata, so users can distinguish learning guidance from BOE
content.

Content is organized in three independently releasable batches:

1. Physics topics 1–18.
2. Informatics and Communications topics 1–10.
3. General/Common topics 1–23.

Each batch is protected by a focused test that proves full category coverage
and verifies the non-official label. Existing tests continue proving the
material does not replace source-owned official metadata.

## Verification

- Focused Vitest files after each batch.
- Full web test suite, lint, and production build before merge.
- Review docs and live issue status before closing #12.

## Git Plan

- `feat(content): add physics topic study notes`
- `feat(content): add informatics study notes`
- `feat(content): add general topic study notes`
- `docs(roadmap): record complete topic coverage`

Merge only verified commits into `develop`. Keep #4, #5, and #8 open; close
#12 only after all coverage and verification checks pass.
