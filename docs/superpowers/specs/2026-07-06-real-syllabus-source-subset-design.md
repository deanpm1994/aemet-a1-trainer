# Real Syllabus Source Subset Design

Date: 2026-07-06
Branch: real-syllabus-source-subset

## Purpose

Use the new official-content import foundation to onboard the first real verified syllabus content from the authoritative BOE source for the AEMET A1 process.

This slice should prove the full chain:
- documented official source manifest
- exact official wording preserved in a checked-in import file
- import through the source-owned parser
- `/topics` preferring imported verified syllabus records when available

The slice stays intentionally small by importing only a verified subset from Annex I instead of the full syllabus.

## Authoritative Source

Primary source:
- BOE record: `BOE-A-2026-1292`
- BOE HTML: `https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292`
- BOE PDF: `https://www.boe.es/boe/dias/2026/01/20/pdfs/BOE-A-2026-1292.pdf`

Source description:
- Resolution of 30 December 2025, published in BOE on 20 January 2026
- Convocation for entry into the `Cuerpo Superior de Meteorólogos del Estado`
- The BOE text explicitly states that the governing programme is included in `anexo I`

Supporting reference only:
- AEMET page for OEP 2025 access-free A1 process
- It may be referenced in the manifest, but the imported syllabus wording should be sourced from BOE Annex I, not from secondary summaries

## Scope

Included:
- One real source manifest for `BOE-A-2026-1292`
- One checked-in raw syllabus subset file containing exact Annex I wording for a small verified topic subset
- Import of that subset into source-owned topic records
- Mapping of imported verified syllabus records into the existing `Topic` shape
- Loader update so `/topics` prefers imported verified syllabus topics when the subset file is present and valid
- Tests for source manifest linkage, exact wording preservation, and loader preference behavior
- Documentation updates reflecting that real verified syllabus import has begun on a small subset only

Excluded:
- Full Annex I import
- Real past-exam question import
- Automatic scraping or PDF parsing
- Bulk extraction of all 127 topics in this branch
- Replacing the question source
- Any claim that the whole syllabus is now verified

## Subset Strategy

Import only a small verified subset first.

Recommended subset:
- 1 topic from Mathematics
- 1 topic from Physics
- 1 topic from Meteorology and Climatology
- 1 topic from Informatics and Communications
- 1 topic from General/Common topics

Reason:
- exercises the block mapping across the known syllabus structure
- limits transcription risk
- gives the app a representative verified sample without overstating completeness

The exact selected topics must be copied verbatim from Annex I.

## Data Rules

For each imported topic in this slice:
- `officialTitle` must preserve exact BOE wording
- `sourceUrl` must point to the BOE source
- `retrievedAt` must be recorded in the manifest and in the imported record metadata
- `verificationStatus` may be `verified` only if the checked-in wording was copied from the BOE Annex I source represented in the manifest
- `normalizedTitle` is derived for app display and matching only

The app must not:
- infer missing topic wording
- translate the official field
- mark non-imported topics as verified
- imply the full syllabus is verified

## Architecture

Add a real-source content path on top of the import foundation:

1. Source manifest
   - A dedicated manifest file under `docs/official-sources/`
   - Captures provenance and verification decision for `BOE-A-2026-1292`

2. Checked-in raw subset file
   - A structured local file under the app codebase containing only the chosen subset
   - Stores exact official wording plus source metadata needed by the importer

3. Import adapter
   - Reuse `apps/web/lib/official-content-import.ts`
   - Parse the checked-in raw subset file into imported syllabus records and then `Topic` records

4. Topics loader preference
   - Update the topics source path so imported verified records are preferred before mock fallback
   - If imported subset loading fails, the loader must degrade safely and explicitly

## Integration Plan

The most conservative route integration is:
- keep Notion and fallback behavior intact
- if imported verified syllabus subset records exist and load successfully, use them as the source topic list for `/topics`
- otherwise use the current source path

This gives us one live verified-content flow without changing unrelated routes or user progress logic.

## UI and Messaging

The topics UI may show imported verified subset topics as normal verified topics, but the app must remain explicit that:
- only a subset is verified from the real source
- non-imported topics are not implicitly verified

If additional wording is needed, it should describe this as a partial verified syllabus subset, not a complete official syllabus import.

## Testing

Add coverage for:
- manifest file presence and required metadata fields
- exact BOE wording preservation for the selected subset
- normalized title derivation from exact wording
- successful mapping into `Topic`
- loader preference for imported verified syllabus subset
- safe fallback if the subset file is missing or invalid

No tests should depend on network access.

## Documentation

Update:
- `docs/PROJECT_MEMORY.md`
- `docs/DATA_MODEL.md` if needed for the subset source path
- `docs/official-sources/README.md` only if the manifest convention needs clarification

The docs must clearly state:
- the first real verified syllabus subset was imported from BOE Annex I
- it is a partial subset, not the full official syllabus
- the next step after this branch is to continue Annex I import in controlled batches or with a verified full-set workflow

## Success Criteria

This slice is complete when:
- the branch contains a manifest for `BOE-A-2026-1292`
- a small Annex I subset is checked in with exact official wording
- the subset imports through the official-content import layer
- `/topics` prefers the imported verified subset when available
- tests cover the source path and fallback behavior
- the app does not imply the full syllabus is verified
