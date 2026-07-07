# Meteorology and Climatology Syllabus 21-30 Design

Date: 2026-07-07
Branch: meteo-syllabus-21-30

## Purpose

Continue the Meteorology and Climatology block as the largest remaining verified BOE-backed syllabus area after importing topics 1 through 20.

The current subset already contains Meteorology and Climatology topics 1 through 20 plus the full Mathematics and Physics blocks. This slice should extend the verified source-owned subset to cover Meteorology and Climatology topics 21 through 30 so the block continues to progress in controlled, reviewable batches.

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
- Meteorology and Climatology topics 21 through 30 must be copied from BOE Annex I
- `officialTitle` must preserve the BOE wording for each imported topic
- No inferred, summarized, or translated wording may replace the source-owned field

## Scope

Included:
- Extend the checked-in BOE subset with Meteorology and Climatology topics `21` through `30`
- Make Meteorology and Climatology topics `1` through `30` present in the imported subset
- Preserve the current full Mathematics and Physics blocks
- Preserve the current verified starter topics for Informatics and Communications and General/Common
- Keep the same official-content import architecture and loader preference behavior
- Add tests that assert the Meteorology and Climatology 1-30 batch is present in order
- Update docs to state that Meteorology and Climatology is partially imported through topic 30 while the overall syllabus is still partial

Excluded:
- Meteorology and Climatology topics `31` through `59`
- Additional Informatics and Communications topics
- Additional General/Common topics
- Real past-exam question import
- Automatic extraction/parsing from the PDF
- Claims that the full 127-topic syllabus is complete

## Batch Strategy

Continue the Meteorology and Climatology block with the next reviewable chunk:
- add topics `21` through `30`
- stop once the block reaches topic `30`

Reason:
- it maintains the same proven batch size
- it gives steady progress through the largest block
- it keeps review and transcription risk under control

## Data Rules

For each imported Meteorology and Climatology topic in this slice:
- `officialNumber` must match the BOE numbering
- `officialTitle` must match the BOE wording transcribed for that topic
- `normalizedTitle` may remain derived for app use only
- `sourceName`, `sourceUrl`, `retrievedAt`, and `verificationStatus` must remain source-backed and explicit

The app must not:
- claim that Meteorology and Climatology is complete after this slice
- mark non-imported Meteorology and Climatology topics as verified
- rewrite the source-owned wording to fit UI preferences
- imply that completing topics 1 through 30 means the entire syllabus is close to complete

## Architecture

No architectural change is needed.

This slice should extend the same path already in production:
1. `docs/official-sources/boe-a-2026-1292.md` remains the governing manifest
2. `apps/web/lib/official-syllabus-subset.ts` remains the checked-in subset source
3. `apps/web/lib/official-content-import.ts` remains the import validation and mapping boundary
4. `apps/web/lib/notion-topics.ts` continues to prefer the imported BOE subset before fallback sources

The only code change should be more verified Meteorology and Climatology records and the tests/docs that reflect the expanded state.

## Integration Plan

Integration remains conservative:
- append Meteorology and Climatology topics `21` through `30` after topic `20`
- keep all current loader behavior intact
- keep user progress overlays untouched because they are already layered on top of source-owned topics

This keeps the feature scoped to verified content expansion, not route behavior changes.

## UI and Messaging

The UI may continue to render imported Meteorology and Climatology topics as normal verified topics.

Status messaging must remain precise:
- Mathematics is fully imported from the BOE source
- Physics is fully imported from the BOE source
- Meteorology and Climatology is partially imported through topic `30`
- Informatics and Communications and General/Common still only have one verified starter topic each
- the overall syllabus import remains partial

If wording changes are needed, they must distinguish between:
- two complete blocks
- one in-progress large block now extended through topic 30
- overall syllabus incomplete

## Testing

Add or extend coverage for:
- Meteorology and Climatology topics `1` through `30` present in order
- expanded total subset count
- preserved source metadata for later Meteorology and Climatology topics
- continued `/topics` loader preference using the larger subset
- continued safe fallback behavior in tests when the subset loader is disabled

No tests should require network access.

## Documentation

Update:
- `docs/PROJECT_MEMORY.md`
- `docs/DATA_MODEL.md` if the current subset description needs to state that Meteorology and Climatology is imported through topic 30

The docs must clearly state:
- Meteorology and Climatology topics `1` through `30` are now imported from BOE Annex I
- Mathematics and Physics remain complete
- the remaining Meteorology and Climatology topics plus the other two blocks are still partial
- the next recommended syllabus step is Meteorology and Climatology topics `31` onward in another controlled batch
- real past-exam import remains a separate value track

## Success Criteria

This slice is complete when:
- the checked-in BOE subset contains Meteorology and Climatology topics `1` through `30`
- those records import successfully through the official-content import layer
- `/topics` continues to prefer the imported BOE subset
- tests prove the Meteorology and Climatology 1-30 sequence and still pass
- docs state that Meteorology and Climatology is only partially complete without overstating the rest of the syllabus
