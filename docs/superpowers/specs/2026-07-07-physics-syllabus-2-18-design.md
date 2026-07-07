# Physics Syllabus 2-18 Design

Date: 2026-07-07
Branch: physics-syllabus-2-18

## Purpose

Complete the Physics block as the second fully verified BOE-backed subject area in the syllabus import pipeline.

The current subset already contains Physics topic 1 and the full Mathematics block. This slice should extend the verified source-owned subset to cover Physics topics 2 through 18 so that Physics becomes complete while Meteorology and Climatology, Informatics and Communications, and General/Common remain explicitly partial.

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
- Physics topics 2 through 18 must be copied from BOE Annex I
- `officialTitle` must preserve the BOE wording for each imported topic
- No inferred, summarized, or translated wording may replace the source-owned field

## Scope

Included:
- Extend the checked-in BOE subset with Physics topics `2` through `18`
- Make Physics topics `1` through `18` complete in the imported subset
- Preserve the current full Mathematics block
- Preserve the current verified starter topics for Meteorology and Climatology, Informatics and Communications, and General/Common
- Keep the same official-content import architecture and loader preference behavior
- Add tests that assert the full Physics block is present in order
- Update docs to state that Physics is now fully imported from BOE Annex I while the overall syllabus is still partial

Excluded:
- Additional Meteorology and Climatology topics
- Additional Informatics and Communications topics
- Additional General/Common topics
- Real past-exam question import
- Automatic extraction/parsing from the PDF
- Claims that the full 127-topic syllabus is complete

## Batch Strategy

Finish the open Physics block in one branch:
- add topics `2` through `18`
- stop once Physics reaches `18`

Reason:
- creates the second fully official-ready subject block
- keeps the overall roadmap simple and predictable
- avoids leaving Physics half-finished after Mathematics is already complete

## Data Rules

For each imported Physics topic in this slice:
- `officialNumber` must match the BOE numbering
- `officialTitle` must match the BOE wording transcribed for that topic
- `normalizedTitle` may remain derived for app use only
- `sourceName`, `sourceUrl`, `retrievedAt`, and `verificationStatus` must remain source-backed and explicit

The app must not:
- claim that Meteorology and Climatology, Informatics and Communications, or General/Common are complete
- mark non-imported topics in those blocks as verified
- rewrite the source-owned wording to fit UI preferences
- imply that finishing Physics means the entire syllabus is imported

## Architecture

No architectural change is needed.

This slice should extend the same path already in production:
1. `docs/official-sources/boe-a-2026-1292.md` remains the governing manifest
2. `apps/web/lib/official-syllabus-subset.ts` remains the checked-in subset source
3. `apps/web/lib/official-content-import.ts` remains the import validation and mapping boundary
4. `apps/web/lib/notion-topics.ts` continues to prefer the imported BOE subset before fallback sources

The only code change should be more verified Physics records and the tests/docs that reflect the expanded state.

## Integration Plan

Integration remains conservative:
- append Physics topics `2` through `18` to the checked-in BOE subset after Physics topic `1`
- keep all current loader behavior intact
- keep user progress overlays untouched because they are already layered on top of source-owned topics

This keeps the feature scoped to verified content expansion, not route behavior changes.

## UI and Messaging

The UI may continue to render imported Physics topics as normal verified topics.

Status messaging must remain precise:
- Mathematics is fully imported from the BOE source
- Physics is fully imported from the BOE source after this slice
- the app still has only starter verified coverage in the other three blocks
- the overall syllabus import remains partial

If wording changes are needed, they must distinguish between:
- Mathematics complete
- Physics complete
- overall syllabus incomplete

## Testing

Add or extend coverage for:
- Physics topics `1` through `18` present in order
- expanded total subset count
- preserved source metadata for later Physics topics
- continued `/topics` loader preference using the larger subset
- continued safe fallback behavior in tests when the subset loader is disabled

No tests should require network access.

## Documentation

Update:
- `docs/PROJECT_MEMORY.md`
- `docs/DATA_MODEL.md` if the current subset description needs to state that Physics is also complete

The docs must clearly state:
- Physics topics `1` through `18` are now imported from BOE Annex I
- Mathematics remains complete
- the remaining syllabus blocks are still only partially imported
- the next recommended syllabus step is Meteorology and Climatology as the largest remaining block
- real past-exam import remains a separate value track

## Success Criteria

This slice is complete when:
- the checked-in BOE subset contains Physics topics `1` through `18`
- those records import successfully through the official-content import layer
- `/topics` continues to prefer the imported BOE subset
- tests prove the full Physics sequence and still pass
- docs state that Mathematics and Physics are complete without overstating the rest of the syllabus
