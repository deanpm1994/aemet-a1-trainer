# Phase 1 Study Checklist MVP Design

## Goal

Deliver the first real study-checklist slice for AEMET A1 Trainer with a read-only topic checklist, a topic detail route, and dashboard progress derived from shared mock topic data.

## Scope

Phase 1 includes:

- a richer topic domain model
- mock topic data for multiple syllabus blocks
- a real `/topics` checklist page
- a real `/topics/[id]` detail page
- dashboard metrics and weak-topic summaries derived from topic data
- tests for topic-derived progress and summary helpers

Phase 1 does not include:

- editing topic status, confidence, or review dates
- persistence
- authentication
- Notion sync
- Supabase
- official-source import automation

## Product Constraints

- All topic content in this phase is mock or placeholder unless explicitly marked otherwise.
- Unknown official syllabus wording, numbering, and metadata must remain `TODO_VERIFY_OFFICIAL_SOURCE`.
- If a field represents official content, it must carry source and verification metadata.
- The feature must remain focused on study tracking for the AEMET A1 syllabus.

## User Outcome

The user can open the app and:

- see a structured list of study topics
- understand each topic's block, study status, confidence, priority, and review timing
- navigate into a topic detail page for fuller study context
- see dashboard progress based on the same topic dataset instead of hardcoded placeholder counts

## Architecture

The implementation should stay lightweight and local:

- `apps/web/lib/types.ts` defines the domain types for topics and derived progress structures
- `apps/web/lib/mock-data.ts` stores the mock topic records and any route-level static content
- a new helper module in `apps/web/lib/` computes derived values such as counts, weak topics, and block progress
- route components consume mock data plus helper outputs and avoid embedding business logic in JSX

This keeps the Phase 1 slice easy to test and prepares for later replacement of mock data with Notion or Supabase sources.

## Data Model

Phase 1 should replace the current summary-only topic structure with a fuller `Topic` model.

Required topic fields:

- `id`
- `block`
- `officialNumber`
- `officialTitle`
- `normalizedTitle`
- `status`
- `confidence`
- `priority`
- `nextReviewAt`
- `verificationStatus`
- `sourceUrl`
- `retrievedAt`

Optional but useful fields for the detail route:

- `shortDescription`
- `studyFocus`
- `relatedQuestionCount`
- `notesStatus`

Modeling rules:

- `officialTitle` preserves exact official wording when verified data exists
- `normalizedTitle` supports concise UI display without overwriting official wording
- official metadata fields may contain `TODO_VERIFY_OFFICIAL_SOURCE` in this phase
- `verificationStatus` must continue to use the existing controlled values

## Derived Data

The app should compute dashboard and checklist values from the topic dataset instead of storing duplicate progress strings.

Phase 1 helper outputs should cover:

- total topic count
- count of topics touched, meaning any topic not in `not_started`
- count of exam-ready topics
- weak topics list, prioritizing low-confidence topics that are not exam-ready
- block summaries for checklist context

These helpers must be pure functions so they can be tested independently from the UI.

## Route Design

### `/topics`

The checklist page should:

- present topics in a scan-friendly structure
- show block, official number, title, status, confidence, priority, next review, and verification
- include navigation into the detail page for each topic
- make the mock and unverified nature of the dataset explicit

The layout can remain simple, but it should feel like a real checklist instead of a placeholder table.

### `/topics/[id]`

The topic detail page should:

- resolve a topic from the shared mock dataset by `id`
- show a not-found state if the topic does not exist
- present official metadata separately from normalized display content
- show study status, confidence, priority, next review, and verification state clearly
- reserve space for future study artifacts such as questions or notes without claiming they exist yet

### `/dashboard`

The dashboard should:

- replace hardcoded topic progress strings with values derived from topic data
- continue showing study mission and monitoring placeholders where those features are not yet implemented
- surface weak topics from the derived helper output

## Error Handling

Phase 1 only needs lightweight local error handling:

- invalid topic IDs render a clear local not-found state
- missing optional mock fields fall back to explicit placeholder text
- the app must not imply verified official data when metadata is missing

## Testing Strategy

Tests should focus on data transformations first.

Required test coverage:

- touched-topic counting
- exam-ready counting
- weak-topic ranking and filtering
- block summary generation
- safe handling of topics with `TODO_VERIFY_OFFICIAL_SOURCE` metadata

Rendering tests are optional for this phase unless existing project patterns already favor them.

## Files Expected To Change

Likely files:

- `apps/web/lib/types.ts`
- `apps/web/lib/mock-data.ts`
- new helper and test files under `apps/web/lib/`
- `apps/web/app/topics/page.tsx`
- new route files under `apps/web/app/topics/[id]/`
- `apps/web/app/dashboard/page.tsx`

## Success Criteria

Phase 1 is complete when:

- the topics page is a functioning read-only checklist
- the topic detail route exists and handles missing IDs
- dashboard topic progress is derived from shared topic data
- helper logic is covered by automated tests
- all topic content that is not officially verified stays explicitly marked as such
