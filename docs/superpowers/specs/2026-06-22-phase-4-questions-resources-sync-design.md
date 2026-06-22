# Phase 4.2 Questions and Resources Sync Design

## Goal

Extend the Notion-backed read-only integration in AEMET A1 Trainer by replacing the local-only Questions source with a server-side Notion sync and by adding a new `Resources` page backed by the Bibliography database, while preserving explicit fallback behavior and keeping all secrets server-side.

## Scope

Phase 4.2 includes:

- adding a server-only Notion loader for Questions
- adding a server-only Notion loader for Bibliography
- mapping raw Notion rows into the existing internal `Question` type
- adding a new internal bibliography model for the `Resources` page
- replacing direct `/questions` mock-data usage with a server loader
- adding a real `/resources` route backed by Bibliography data
- adding a `Resources` route card to the home page
- preserving explicit source-state messaging for both new synced surfaces
- preserving local fallback datasets for both Questions and Resources
- adding automated tests for env validation reuse, row mapping, and loader fallback states using mocks and stubs only

Phase 4.2 does not include:

- write-back to Notion
- client-side browser calls to Notion
- study-session sync
- monitoring sync
- ownership tracking for books or resources
- downloadable content handling
- deduplication of repeated bibliography links
- use of MCP Notion tools as part of the shipped app

## Product Constraints

- All Notion secrets must remain server-side.
- The feature must use one dedicated internal integration token scoped to one workspace.
- The app must not silently fall back to mock/local data.
- If live sync is unavailable, the UI must say that fallback data is being shown and why.
- UI messages must not leak sensitive data such as tokens, raw payloads, or internal stack traces.
- The Questions and Bibliography mappers must follow the actual CSV import schemas used to create the Notion databases.
- The app must not imply that bibliography items are owned, downloadable, or uniquely linked.
- Repeated bibliography source links are allowed and should be rendered honestly.

## User Outcome

The user can:

- open `/questions` and see live Notion question data when sync is healthy
- continue using `/questions` when live sync is unavailable
- open `/resources` and browse books, references, and study resources from Notion-backed Bibliography data
- understand whether each synced page is showing live data, config fallback data, or error fallback data
- trust that the app is not pretending sync is active when it is not
- see recommended resources even when multiple items share the same official source URL

## Architecture

Phase 4.2 should extend the current server-only Notion pattern instead of inventing a second integration style:

- `apps/web/lib/notion-client.ts` remains the shared SDK/config entrypoint
- `apps/web/lib/notion-topics.ts` remains topic-specific
- a new `apps/web/lib/notion-questions.ts` handles Question mapping and loading
- a new `apps/web/lib/notion-bibliography.ts` handles Bibliography mapping and loading
- `apps/web/lib/types.ts` gains a `BibliographyItem` model and any route-level supporting types needed for Resources
- `apps/web/app/questions/page.tsx` consumes normalized question loader results instead of direct mock fixtures
- a new `apps/web/app/resources/page.tsx` consumes normalized bibliography loader results
- the UI should depend only on internal typed models and a small source-state envelope, never on raw Notion payloads

If small shared property-reading helpers become useful, they may be extracted, but Phase 4.2 should avoid unnecessary refactoring beyond what clearly reduces duplication.

## Configuration Model

Phase 4.2 should require:

- `NOTION_TOKEN`
- `NOTION_TOPICS_DATA_SOURCE_ID`
- `NOTION_QUESTIONS_DATA_SOURCE_ID`
- `NOTION_BIBLIOGRAPHY_DATA_SOURCE_ID`

Configuration rules:

- if a route's required data source ID is missing or empty, that route's loader must enter a configuration-fallback state
- configuration validation must happen on the server before any Notion call is attempted
- the client must not be constructed in browser code
- the Topics integration must keep working independently of Questions or Bibliography config

## Data Model

### Questions

Questions should continue using the existing internal `Question` type as the app contract.

The Questions mapper must follow the actual CSV import schema:

- `question_id`
- `type`
- `source_year`
- `source_exam`
- `source_url`
- `retrieved_at`
- `verification_status`
- `question_number`
- `statement`
- `option_a`
- `option_b`
- `option_c`
- `option_d`
- `correct_answer`
- `answer_source_status`
- `topic_ids`
- `difficulty`
- `explanation`
- `attempts_count`
- `last_attempt_at`
- `next_review_at`
- `mistake_type`
- `notes`

Question mapping rules:

- `question_id` maps to `id`
- `type` maps into the existing `QuestionType` union
- `source_year` maps to `sourceYear`
- `source_exam` maps to `sourceExam`
- `source_url` maps to `sourceUrl`
- `retrieved_at` maps to `retrievedAt`
- `verification_status` maps into the existing `VerificationStatus` union
- `question_number` maps to `questionNumber`
- `statement` maps to `statement`
- `option_a` through `option_d` are normalized into `options[]`, excluding empty values
- `correct_answer` maps to `correctAnswer`
- `answer_source_status` maps into the existing `AnswerSourceStatus` union
- `topic_ids` is parsed into `string[]`
- `difficulty` maps into the existing `1 | 2 | 3 | 4 | 5` union
- `explanation` maps to `explanation`
- `attempts_count` maps to `attemptsCount`
- `last_attempt_at` maps to `lastAttemptAt`
- `next_review_at` maps to `nextReviewAt`
- `mistake_type` is parsed into `mistakeTypes`
- `notes` may stay route-internal unless the current UI needs it explicitly

Question normalization rules:

- the mapper must tolerate CSV-import type drift where numeric or select-like values arrive as text
- empty optional values must not crash the mapper
- missing or malformed required values must trigger the loader's error-fallback state rather than producing partially trusted live data

### Bibliography

Phase 4.2 should add a real internal `BibliographyItem` model for the new `Resources` page.

Required fields:

- `id`
- `title`
- `authors`
- `year`
- `blocks`
- `category`
- `priority`
- `sourceType`
- `sourceUrl`
- `verificationStatus`
- `notes`

The Bibliography mapper must follow the actual CSV import schema:

- `title`
- `authors`
- `year`
- `block`
- `category`
- `priority`
- `source_type`
- `source_url`
- `verification_status`
- `notes`

Bibliography mapping rules:

- `title` maps to `title`
- `authors` maps to `authors`
- `year` maps to `year`
- `block` maps to `blocks`, initially as a one-item array unless the imported data clearly stores multiple values
- `category` maps to `category`
- `priority` maps to a resource-priority union aligned with CSV values such as `Core`, `Useful`, and `Optional`
- `source_type` maps to a source-type union aligned with CSV values such as `AEMET recommended`, `official`, and `complementary`
- `source_url` maps to `sourceUrl`
- `verification_status` maps to the existing `VerificationStatus` union
- `notes` maps to `notes`
- `id` should be derived from stable content such as title plus year when the CSV/import schema does not provide an explicit identifier

Bibliography normalization rules:

- repeated `source_url` values are valid and must not be treated as duplicates or errors
- the UI must not imply ownership or direct access to a listed work
- empty notes are acceptable

## Source State Model

Questions and Bibliography loaders should reuse the current source-state envelope pattern.

Required source states:

- `live`
- `fallback_config`
- `fallback_error`

Required result shape:

- route-specific normalized records
- `sourceState`
- `message`

Behavior rules:

- `live` means the Notion fetch and mapping succeeded
- `fallback_config` means the relevant data source configuration is missing or incomplete before any API call
- `fallback_error` means config exists but the fetch or mapping failed
- in both fallback states, the route must render its local fallback dataset
- `message` should be safe for UI display and must explain whether the page is using local fallback data because configuration is missing or because live sync failed

## Route Design

### `/questions`

The page should:

- load data through the new server loader
- preserve the current read-only summary shape as closely as practical
- display a visible status banner above the main content
- show a live-data message when `sourceState` is `live`
- show a fallback configuration warning when `sourceState` is `fallback_config`
- show a fallback sync-error warning when `sourceState` is `fallback_error`
- keep totals, overdue review, pain points, and question list behavior working on both live and fallback datasets

### `/resources`

The page should:

- be a new visible route
- display a visible status banner above the main content
- render a real resource list from Bibliography data
- show title, authors, year, block, category, priority, source type, verification, notes, and source link
- explicitly avoid implying ownership, full-text access, or downloadable content
- allow repeated source links without treating them as a problem
- remain usable when fallback data is shown

### Home Route Card

The home route list should add:

- a `Resources` card linking to `/resources`
- copy that describes the page as a real study-resources surface rather than a placeholder

## Error Handling

Phase 4.2 should handle failures explicitly:

- missing env must not throw an unhandled route error
- SDK request failures must return fallback data plus a safe sync-failed message
- property-shape mismatches must return fallback data plus a safe mapping-failed message
- the UI must never imply that fallback data is live Notion data
- error text must remain short and operational, not diagnostic

Examples of acceptable UI messages:

- `Live Notion question sync is active.`
- `Live Notion bibliography sync is active.`
- `Live Notion sync is not configured. Showing local fallback data.`
- `Live Notion sync failed. Showing local fallback data.`

## Testing Strategy

Tests must use mocks and stubs only. No automated test may make a real Notion API call.

Required coverage:

- question mapper for CSV-style Notion rows
- bibliography mapper for CSV-style Notion rows
- question loader behavior for `live`
- question loader behavior for `fallback_config`
- question loader behavior for `fallback_error`
- bibliography loader behavior for `live`
- bibliography loader behavior for `fallback_config`
- bibliography loader behavior for `fallback_error`
- question option normalization from `option_a` through `option_d`
- `topic_ids` parsing into `string[]`
- `mistake_type` parsing into internal `mistakeTypes`
- bibliography normalization when multiple records share the same `source_url`
- route-card copy for the new `Resources` page

Testing rules:

- stub the SDK client methods instead of calling the network
- avoid coupling tests to MCP Notion behavior
- prefer pure helper tests over route-rendering tests unless a route test is needed for the banner state

## Documentation Impact

Phase 4.2 should update:

- `README.md` so the Questions and Resources sync setup is documented
- status docs if the active Phase 4 wording should be narrowed further
- route copy that still implies Questions are mock-only
- any home-page navigation copy that must introduce the Resources route

## Files Expected To Change

Likely files:

- `apps/web/lib/types.ts`
- `apps/web/lib/mock-data.ts`
- `apps/web/lib/question-bank.ts`
- `apps/web/app/questions/page.tsx`
- `apps/web/app/page.tsx`
- new Notion integration files under `apps/web/lib/`
- new tests under `apps/web/lib/`
- new `apps/web/app/resources/page.tsx`
- `README.md`

## Success Criteria

Phase 4.2 is complete when:

- `/questions` reads from a server-side Notion loader instead of direct question fixtures
- `/resources` exists as a real page backed by Bibliography sync
- both routes show live data when valid configuration is present and mapping succeeds
- both routes show local fallback data when configuration is missing or sync fails
- fallback behavior is explicit and visible in the UI
- repeated bibliography links are rendered honestly and do not break the page
- no secrets are exposed to the client
- automated tests cover the new loaders and mappers using mocks and stubs only
