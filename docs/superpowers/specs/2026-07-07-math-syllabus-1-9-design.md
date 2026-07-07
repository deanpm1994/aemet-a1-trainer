# Mathematics Syllabus 1-9 Design

Date: 2026-07-07
Branch: math-syllabus-1-9

## Purpose

Extend the real BOE-backed syllabus import from a tiny cross-block sample into the first meaningful subject-area batch.

This slice should make Mathematics topics 1 through 9 available as verified source-owned syllabus records from BOE Annex I while keeping the current import architecture, loader behavior, and source-manifest rules intact.

The goal is not to finish Mathematics in one branch. The goal is to create a reviewable, low-risk batch that materially increases official syllabus coverage and establishes the repeatable pattern for the remaining Mathematics topics and later blocks.

## Authoritative Source

Primary source:
- BOE record: `BOE-A-2026-1292`
- BOE HTML: `https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292`
- BOE PDF: `https://www.boe.es/boe/dias/2026/01/20/pdfs/BOE-A-2026-1292.pdf`

Source description:
- Resolution of 30 December 2025, published in BOE on 20 January 2026
- Convocation for entry into the `Cuerpo Superior de Meteorologos del Estado`
- The official programme is stated in Annex I

Rules for this slice:
- Mathematics topics 1 through 9 must be copied from BOE Annex I
- The imported official wording must remain source-owned
- No non-BOE summary may replace or rewrite the BOE wording

## Scope

Included:
- Extend the checked-in BOE syllabus subset from 5 topics to 13 topics total
- Import Mathematics topics `1` through `9` exactly as they appear in Annex I
- Keep the previously imported single verified records for the other four blocks
- Preserve source metadata for every imported Mathematics topic
- Verify that `/topics` continues to prefer the BOE subset source
- Add tests that assert Mathematics 1-9 import integrity and ordering
- Update project documentation to reflect the larger but still partial BOE import state

Excluded:
- Mathematics topics `10` through `18`
- Full Annex I import
- Real past-exam question import
- Automatic PDF extraction
- Changes to question routes or question source handling
- Claims that Mathematics is complete or that the full syllabus is official-ready

## Batch Strategy

Use a depth-first subject-area batch:
- complete Mathematics topics `1` through `9`
- leave Mathematics topics `10` through `18` for the next branch

Reason:
- produces a meaningful official study block instead of isolated samples
- stays small enough for careful review and exact transcription checks
- reduces merge risk compared with importing all 18 Mathematics topics at once
- creates a clean handoff point for the next Mathematics branch

## Data Rules

For each imported Mathematics topic:
- `officialNumber` must match the BOE topic number
- `officialTitle` must preserve the BOE wording copied for that topic
- `normalizedTitle` may remain derived for app use, but it must not replace `officialTitle`
- `sourceName` must remain `BOE`
- `sourceUrl` must remain the BOE HTML record URL
- `retrievedAt` must remain explicit
- `verificationStatus` may be `verified` only when the record was copied from BOE Annex I

The app must not:
- renumber Mathematics topics
- mark non-imported Mathematics topics as verified
- translate or paraphrase the source-owned `officialTitle`
- imply that the Mathematics block is complete after this branch

## Architecture

No new import architecture is needed.

This slice should extend the existing path:
1. `docs/official-sources/boe-a-2026-1292.md` remains the governing manifest
2. `apps/web/lib/official-syllabus-subset.ts` remains the checked-in source file for the currently verified BOE subset
3. `apps/web/lib/official-content-import.ts` remains the parser and mapper boundary
4. `apps/web/lib/notion-topics.ts` continues to prefer the imported BOE subset before falling back elsewhere

The only structural change is larger verified content inside the existing subset file and corresponding test coverage.

## Integration Plan

Integration should stay conservative:
- extend the BOE subset source with Mathematics topics `2` through `9`
- preserve the existing imported records for Physics, Meteorology and Climatology, Informatics and Communications, and General/Common
- keep `/topics` consuming the same subset loader
- keep user progress overlays untouched because they already sit on top of source-owned topic records

This avoids unnecessary route changes while increasing real official coverage.

## UI and Messaging

The app should continue to treat imported BOE topics as verified topics in `/topics`.

Project messaging and status copy must remain accurate:
- the BOE import is still partial
- Mathematics is only imported through topic `9`
- the app is not yet fully official-content ready

If any copy changes are needed, they should say partial verified BOE syllabus import, not full verified syllabus.

## Testing

Add or extend coverage for:
- presence of Mathematics topics `1` through `9` in order
- exact topic count for the expanded subset
- preservation of BOE source metadata on Mathematics records
- continued successful mapping into `Topic`
- continued `/topics` loader preference for the imported BOE subset
- continued safe behavior when the subset loader is disabled or invalid in tests

No tests should require network access.

## Documentation

Update:
- `docs/PROJECT_MEMORY.md`
- `docs/DATA_MODEL.md` only if the documented import notes need to mention the deeper Mathematics batch

The docs must clearly state:
- verified BOE syllabus import now includes Mathematics topics `1` through `9`
- the overall syllabus import remains partial
- the next recommended syllabus step is Mathematics topics `10` through `18`
- real past-exam import remains a separate next-value track after this branch

## Success Criteria

This slice is complete when:
- the BOE subset source contains Mathematics topics `1` through `9`
- those records import successfully through the official-content import layer
- `/topics` still prefers the imported BOE subset
- tests cover the larger Mathematics batch and still pass
- docs reflect the new partial-import status without overstating completion
