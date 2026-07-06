# Official Content Import Foundation Design

Date: 2026-07-06
Branch: official-content-import-foundation

## Purpose

Build the first trustworthy import boundary for official AEMET A1 study content.

This slice defines how verified official syllabus topics and past exam questions should enter the application without mixing source-owned content with user-owned study progress. It implements the syllabus side first and prepares the same structure for past exam questions.

The goal is not to import real official files yet. The goal is to make the next real import step safe, typed, testable, and explicit about missing source documentation.

## Scope

Included:
- A source-owned import foundation for official syllabus topics and past exam questions.
- Typed source record models that require official metadata.
- Pure parser and normalization helpers under `apps/web/lib`.
- First concrete importer for syllabus records only.
- Mapping from imported syllabus records into the existing `Topic` domain shape.
- Tests for validation, preservation of exact wording, and normalization behavior.
- Documentation updates that mark real source documentation as the next controlled step.

Excluded:
- Browsing or downloading official BOE/AEMET files in this slice.
- Claiming any new official data is verified in the running app.
- Replacing Notion as the live content source in this slice.
- Supabase schema changes for official source data.
- Full past-exam question importer implementation.
- UI claims that monitoring or import automation is active.

## Why This Slice

The app already has:
- source-owned topic/question content
- user-owned Supabase progress overlays
- anti-hallucination rules

But it still lacks a dedicated ingestion boundary for official materials. Today, the system can display mock or Notion-backed content, but it does not yet have a formal path for importing exact official wording with source metadata and review rules.

That boundary is the main prerequisite before the app can become trustworthy for official syllabus tracking.

## Design Principles

1. Preserve exact official wording.
2. Keep source-owned content separate from user-owned progress.
3. Reject or downgrade incomplete source records rather than inferring missing official fields.
4. Reuse the existing `Topic` and `Question` domain shapes where practical, but keep import-specific metadata and validation at the boundary layer.
5. Prepare the same pattern for questions without forcing full question import into this first slice.

## Architecture

Add a new import layer under `apps/web/lib` with three responsibilities:

1. Source record types
   - Define typed source record models for official syllabus topics and official past-exam questions.
   - These models require official metadata fields such as `sourceUrl`, `retrievedAt`, and `verificationStatus`.
   - For syllabus topics, exact official wording remains in a dedicated field and is never replaced by normalized display text.

2. Parser and normalization helpers
   - Parse raw import input into source-owned records.
   - Validate required fields.
   - Normalize derived fields such as IDs, normalized titles, and block labels.
   - Keep all derivation clearly separate from official text.

3. Domain mapping
   - Convert validated syllabus source records into the existing `Topic` shape used by the app.
   - Use safe defaults only for non-official study-state fields that are already app-owned placeholders, such as `status`, `confidence`, or `nextReviewAt`.
   - Do not mutate or invent official metadata during mapping.

## Data Model Direction

### Syllabus source record

Add an import-specific type for official syllabus records with at least:
- `id`
- `block`
- `officialNumber`
- `officialTitle`
- `normalizedTitle`
- `sourceName`
- `sourceUrl`
- `retrievedAt`
- `verificationStatus`

Notes:
- `officialTitle` must preserve the exact wording from the source document.
- `normalizedTitle` is derived and may be used for app display or matching.
- `verificationStatus` may be `verified` or `needs_review`, but the importer must not silently promote uncertain data to `verified`.

### Past exam question source record

Define the parallel type now, even though this slice will not fully wire it into the app:
- `id`
- `sourceExam`
- `sourceYear`
- `questionNumber`
- `statement`
- `options`
- `correctAnswer`
- `answerSourceStatus`
- `sourceName`
- `sourceUrl`
- `retrievedAt`
- `verificationStatus`

Notes:
- Statement and options must preserve exact source wording.
- `correctAnswer` may only be marked official when backed by an official answer template or equally authoritative source.
- If a question lacks a verified official answer source, `answerSourceStatus` must remain non-official.

## Validation Rules

The import foundation should enforce these rules:

- Missing `sourceUrl` => invalid for verified import.
- Missing `retrievedAt` => invalid for verified import.
- Missing exact official text field => invalid.
- Empty or malformed option arrays => invalid for question source records.
- Unknown block or unsupported verification value => fail validation explicitly.

For this slice, validation should return structured result objects that tests can inspect.

Reason:
- parser behavior stays deterministic in pure tests
- invalid source records remain explicit data outcomes instead of mixed exception paths
- later importer callers can decide whether to fail fast or aggregate reviewable errors

## Integration Plan

This slice should integrate conservatively.

Immediate integration:
- Add the new import layer and tests.
- Add syllabus mapping to `Topic`.

Deferred integration:
- Switching `/topics` to consume imported official syllabus records.
- Switching `/questions` to consume imported official question records.
- Replacing current Notion-backed content source behavior.

Reason:
The first safe step is to prove the ingestion contract, not to rewire the app and content operations in the same change.

## Error Handling

Import helpers must fail loudly when official metadata is missing.

Acceptable behavior:
- return structured validation failures
- throw domain-specific import errors

Unacceptable behavior:
- filling unknown official fields with invented values
- auto-marking records as verified
- stripping official wording because display normalization is convenient

## Testing

Add focused tests for:
- exact official title preservation
- normalized title derivation
- deterministic ID generation where applicable
- missing source metadata failures
- invalid verification status handling
- syllabus source record to `Topic` mapping
- question source contract validation for missing options or unsupported answer-source claims

Tests should stay pure and local to `apps/web/lib`.

## Documentation

Update project docs to reflect:
- the new official import boundary
- that syllabus import foundation exists before real source import
- that real-source documentation is still required before any content is shown as newly verified

The next documentation step must be explicit and real, not implied.

Add a dedicated next-step note covering:
- official source document URL
- retrieval date
- document type
- verification decision
- import provenance notes

## Real Source Documentation Next

After this slice, the next controlled step is to create source documentation for the first real syllabus import set.

That next step should produce a documented source manifest for the actual official materials used, including:
- official URL
- retrieval date
- source owner
- document description
- whether the document is the authoritative syllabus source
- any unresolved verification questions

This documentation should exist before importing real records into the app as verified official content.

## Success Criteria

This slice is complete when:
- a typed import boundary exists for syllabus and questions
- syllabus importer behavior is implemented and tested
- exact official wording preservation is enforced by tests
- question import contract exists even if full question import is deferred
- docs clearly mark real source documentation as the next step
- no route or UI overstates official readiness
