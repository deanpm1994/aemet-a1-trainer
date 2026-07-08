# Past Exam Import Design

Date: 2026-07-09
Branch: develop

## Purpose

Import real past AEMET A1 exam questions so the app can train with official
question wording instead of mock practice fixtures.

The first implementation slice should be deliberately small: define the source
contract, document the official source, and import one official batch. The goal
is trustworthy practice content, not bulk extraction.

## Source Policy

Use only official AEMET or Spanish government sources for imported past exams.

Accepted sources:
- AEMET official process pages or PDF attachments
- BOE or Spanish government pages only when they directly host or reference the
  official exam material
- Official answer templates, tribunal publications, or equivalent official
  correction documents

Rejected sources:
- academy summaries
- copied question banks
- forum posts
- user-transcribed answer keys
- inferred answer keys in the official import path

## Answer Policy

Questions and answer keys are verified separately.

If an official answer template exists:
- import `correctAnswer`
- set `answerSourceStatus` to `official`
- store the answer source URL and retrieval date when it differs from the
  question source
- set `verificationStatus` to `verified` when the statement, options, and answer
  are all source-backed

If no official answer template exists:
- import the official question statement and options
- leave `correctAnswer` as an empty string
- set `answerSourceStatus` to `unknown`
- set `verificationStatus` to `needs_review`
- do not display the answer as official

Later practice workflows may support user-entered or inferred answers, but those
must be stored outside the official source-owned import record.

## Scope

Included:
- A checked-in official past-exam subset source file.
- A loader that maps imported records into the existing `Question` shape.
- Validation that preserves source metadata and rejects unsupported official
  claims.
- Tests for official-answer and no-answer imports.
- Documentation for the official source used by the first batch.
- Question bank loader preference for verified or reviewable official imports
  before mock fallback, if the imported subset is valid.

Excluded:
- Bulk import of all historical exams.
- PDF scraping automation.
- OCR workflows.
- Inferred answer generation.
- Supabase schema changes.
- UI redesign of the question bank.
- Claiming the question bank is complete or fully official.

## Data Contract

Each imported past-exam question record should include:
- `id`
- `sourceName`
- `sourceUrl`
- `retrievedAt`
- `sourceYear`
- `sourceExam`
- `questionNumber`
- `statement`
- `options`
- `correctAnswer`
- `answerSourceStatus`
- `answerSourceUrl`
- `answerRetrievedAt`
- `verificationStatus`
- `topicIds`
- `difficulty`

The existing import type already covers the core official fields. The first
implementation should extend the raw source record for answer-source metadata
before mapping into the current `Question` domain fields.

## Mapping Rules

Source-owned fields:
- `sourceYear`
- `sourceExam`
- `sourceUrl`
- `retrievedAt`
- `verificationStatus`
- `questionNumber`
- `statement`
- `options`
- `correctAnswer`
- `answerSourceStatus`
- `answerSourceUrl`
- `answerRetrievedAt`
- `topicIds`
- `difficulty`

App-owned defaults:
- `attemptsCount`: `0`
- `lastAttemptAt`: `TODO_VERIFY_OFFICIAL_SOURCE`
- `nextReviewAt`: `TODO_VERIFY_OFFICIAL_SOURCE`
- `mistakeTypes`: `["none"]`
- `explanation`: empty string unless sourced separately

Derived fields:
- `id`: stable slug from exam, year, and question number
- `name`: short display label derived from exam and question number
- `type`: `multiple_choice` for test-style official questions in the first
  batch unless the source clearly represents another existing app type

## Validation Rules

The importer must reject or downgrade records when official metadata is missing.

Required for every imported official question:
- non-empty `sourceUrl`
- non-empty `retrievedAt`
- non-empty `sourceExam`
- numeric `sourceYear`
- non-empty `questionNumber`
- non-empty `statement`
- at least one option for multiple-choice questions
- `verificationStatus` of `verified` or `needs_review`

Additional rules:
- `verificationStatus: "verified"` is only valid when
  `answerSourceStatus: "official"` and the answer key comes from an official
  source.
- Official answer imports require `answerSourceUrl` and `answerRetrievedAt`.

Questions without an official answer key must remain `needs_review` and
`answerSourceStatus: "unknown"`.

## First Batch Strategy

Start with one official source and a small batch of 5 to 10 questions.

Preferred first source:
- an AEMET or Spanish government page/PDF for a Cuerpo Superior de Meteorologos
  del Estado selection process
- with an official answer template if available

If the best official exam source lacks an answer template, import the questions
anyway as `needs_review` and treat answer handling as a follow-up design.

## Error Handling

Invalid imported records should return structured validation issues. The loader
should fail closed:
- do not merge invalid official imports into the question bank
- fall back to existing mock/Notion behavior when the checked-in subset is
  invalid
- expose validation issues in tests and developer-facing code paths

The app must not silently convert `unknown` answers into official answers.

## Testing

Add focused tests for:
- valid official question with official answer key
- valid official question without official answer key marked `needs_review`
- rejection of `verified` imports with `unknown`, `user`, or `inferred` answer
  sources
- required source metadata
- mapping imported questions into the existing `Question` shape
- question loader preference for valid official imports
- safe fallback when official import validation fails

No tests should require network access.

## Documentation

For the first source batch, add a manifest under `docs/official-sources/` with:
- source owner
- source URL
- retrieval date
- document type
- exam year and phase
- whether an official answer key exists
- verification decision
- unresolved questions

Update:
- `docs/PROJECT_MEMORY.md`
- `docs/DATA_MODEL.md`

The docs must keep syllabus readiness separate from question-bank readiness.
The syllabus can be source-complete while the question bank remains partial.

## Success Criteria

This design is implemented when:
- the first official past-exam subset is checked in
- imported records preserve official wording and source metadata
- official answer claims require official answer sources
- unanswered official questions are imported as reviewable, not answer-verified
- tests cover both answered and unanswered official exam imports
- the question bank can train with the imported subset without overstating
  answer verification
