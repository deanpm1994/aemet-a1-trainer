# Phase 2 Question Bank MVP Design

## Goal

Deliver the first real question-bank slice for AEMET A1 Trainer with a typed local dataset, a real `/questions` route, derived study summaries, and a data shape that maps cleanly to the planned Notion databases.

## Scope

Phase 2 includes:

- copying the Notion database schema reference into the project docs
- closing Phase 1 in project status docs where implementation is already complete
- adding a richer question domain model aligned with the planned Notion fields
- adding local mock question data for multiple question types
- replacing the `/questions` placeholder with a real read-only question bank page
- adding filter and summary helpers derived from the shared question dataset
- adding automated tests for question filtering and summary logic
- documenting Phase 2 as the active implementation phase

Phase 2 does not include:

- Notion API integration
- question create or edit UI
- persistence
- authentication
- official answer-key claims without verified source metadata
- automated import from official exam documents

## Product Constraints

- All question content in this phase is local mock or placeholder unless explicitly marked otherwise.
- Unknown official statement wording, answer keys, and source metadata must remain `TODO_VERIFY_OFFICIAL_SOURCE`.
- Fields representing official material must keep source URL, retrieval date, and verification metadata.
- The question bank must stay focused on AEMET A1 preparation and avoid generic quiz-platform features.

## User Outcome

The user can open the app and:

- browse a structured question bank instead of a placeholder panel
- filter questions by study-relevant properties such as type, verification status, difficulty, and mistake type
- inspect source and review metadata for each question
- see summary counts for question coverage and weak areas derived from the same shared dataset
- understand clearly which content is not yet verified from official sources

## Architecture

The implementation should match the lightweight Phase 1 pattern:

- `apps/web/lib/types.ts` defines the `Question` domain model and any derived summary structures
- `apps/web/lib/mock-data.ts` stores local question records and route-level static copy
- a new helper module under `apps/web/lib/` computes filter results and question summaries
- `apps/web/app/questions/page.tsx` consumes the shared data and helpers without embedding domain logic in JSX
- project docs store the copied Notion schema reference used for future mapping work

This keeps Phase 2 deterministic and easy to test while reducing friction for the next Notion integration phase.

## Data Model

Phase 2 should expand the current placeholder route into a real `Question` model shaped around the planned Notion schema and existing project data model.

Required fields:

- `id`
- `name`
- `type`
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
- `explanation`
- `topicIds`
- `difficulty`
- `attemptsCount`
- `lastAttemptAt`
- `nextReviewAt`
- `mistakeTypes`

Modeling rules:

- `statement` preserves exact official wording when verified data exists
- `options` preserve original option text ordering when present
- `correctAnswer` may only be treated as official when `answerSourceStatus` is `official`
- `topicIds` reference existing topic records without requiring full relational storage yet
- official metadata fields may contain `TODO_VERIFY_OFFICIAL_SOURCE` in this phase
- verification values must stay within `verified`, `unverified`, `needs_review`, or `deprecated`

## Derived Data

The app should compute question-bank summaries from the shared dataset instead of hardcoding route copy.

Required helper outputs:

- total question count
- filtered question count
- counts by question type
- counts by verification status
- counts by mistake type
- overdue review question list
- low-confidence or high-friction practice areas inferred from mistake types and repeated attempts

These helpers must stay pure so they can be tested independently from the UI.

## Route Design

### `/questions`

The page should:

- render a real read-only question bank list
- show statement excerpt, type, source metadata, verification status, difficulty, attempts, mistake types, and next review date
- support lightweight filter controls for type, verification status, difficulty, and mistake type
- show summary cards derived from helper outputs
- make the local and unverified status of the dataset explicit
- avoid implying that question editing or official imports already exist

Phase 2 does not require a question detail route yet if the page remains readable and scan-friendly.

## Error Handling

Phase 2 only needs lightweight local handling:

- missing optional fields fall back to explicit placeholder text
- empty filter results render a clear no-results state
- the route must not imply verified official content when metadata is incomplete

## Testing Strategy

Tests should focus on data logic first.

Required coverage:

- filtering by type, verification status, difficulty, and mistake type
- total and filtered counts
- mistake-type summary generation
- overdue review selection
- safe handling of records containing `TODO_VERIFY_OFFICIAL_SOURCE`

Rendering tests are optional unless current project patterns already require them.

## Documentation Impact

Phase 2 should update:

- status docs that still say Phase 1 is in progress
- roadmap wording so Phase 1 is clearly complete and Phase 2 is current
- project docs with the copied Notion schema reference for the upcoming integration phase

## Files Expected To Change

Likely files:

- `docs/NOTION_DATABASE_SCHEMAS.md`
- `docs/ROADMAP.md`
- `README.md`
- `apps/web/lib/types.ts`
- `apps/web/lib/mock-data.ts`
- new helper and test files under `apps/web/lib/`
- `apps/web/app/questions/page.tsx`

## Success Criteria

Phase 2 is complete when:

- the project contains the copied Notion schema reference for future integration work
- project docs no longer describe Phase 1 as in progress when the implemented slice is already done
- the questions page is a functioning read-only question bank
- filter and summary logic is covered by automated tests
- all unverified or unofficial question content stays explicitly marked as such
- the resulting data model does not block the next Notion integration phase
