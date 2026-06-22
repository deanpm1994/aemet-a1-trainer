# Phase 4.1 Notion Topics Sync Design

## Goal

Deliver the first real Notion-backed data integration for AEMET A1 Trainer by replacing the local-only Topics source with a server-side read-only sync from one dedicated Notion workspace, while preserving explicit fallback behavior and keeping all secrets server-side.

## Scope

Phase 4.1 includes:

- adding a server-only Notion integration using the official JavaScript SDK
- reading topic records from one configured Notion data source in one dedicated workspace
- mapping raw Notion rows into the existing internal `Topic` type
- replacing direct `/topics` mock-data usage with a server loader that returns normalized topic data
- showing explicit source-state messaging when the page is using fallback data instead of live Notion data
- preserving the current local mock topics as the fallback dataset
- adding automated tests for env validation, Notion row mapping, and loader fallback states using mocks and stubs only

Phase 4.1 does not include:

- question sync
- bibliography sync
- study-session sync
- write-back to Notion
- client-side browser calls to Notion
- multi-workspace switching
- runtime workspace discovery
- use of MCP Notion tools as part of the shipped app

## Product Constraints

- All Notion secrets must remain server-side.
- The feature must use one dedicated internal integration token scoped to one workspace.
- The app must not silently fall back to mock data.
- If live sync is unavailable, the UI must say that fallback data is being shown and why.
- UI messages must not leak sensitive data such as tokens, raw payloads, or full internal stack traces.
- Official-source rules still apply: synced topic fields must keep verification metadata and must not invent official wording.
- Unknown official values must remain `TODO_VERIFY_OFFICIAL_SOURCE` where the source data is incomplete.

## User Outcome

The user can open `/topics` and:

- see live topic data from Notion when configuration and sync are healthy
- continue using the page when live sync is unavailable
- understand whether the page is showing live data, fallback data because configuration is missing, or fallback data because the sync failed
- trust that the app is not pretending sync is active when it is not

## Architecture

Phase 4.1 should introduce a narrow server integration boundary:

- `apps/web/lib/types.ts` keeps the existing `Topic` model as the canonical internal shape
- a new server-only Notion client module creates the SDK client from environment variables
- a new mapping module translates raw Notion page properties into `Topic`
- a new loader module fetches rows from the configured Topics data source, normalizes them, and returns a typed source-state result
- `apps/web/app/topics/page.tsx` consumes the loader result instead of importing `topics` directly from mock data
- `apps/web/lib/mock-data.ts` continues to provide fallback topic fixtures

The UI should depend only on normalized `Topic[]` and a small source-state envelope, never on raw Notion property shapes.

## Configuration Model

Phase 4.1 should require:

- `NOTION_TOKEN`
- `NOTION_TOPICS_DATA_SOURCE_ID`

Configuration rules:

- if either value is missing or empty, the loader must enter a configuration-fallback state
- configuration validation must happen on the server before any Notion call is attempted
- the client must not be constructed in browser code
- future Notion data sources such as Questions or Bibliography may be added later, but they are out of scope for this slice

## Data Model

The internal `Topic` type remains the app contract.

Required source properties from the Notion Topics data source:

- `Name`
- `Topic ID`
- `Block`
- `Official Number`
- `Official Text`
- `Short Title`
- `Priority`
- `Status`
- `Confidence`
- `Source URL`
- `Retrieved At`
- `Verification Status`
- `Next Review`
- `Notes`

Mapping rules:

- `Topic ID` maps to `id`
- `Block` maps to `block`
- `Official Number` maps to `officialNumber`
- `Official Text` maps to `officialTitle`
- `Short Title` maps to `normalizedTitle`
- `Status` maps into the existing `TopicStatus` union
- `Priority` maps into the existing `TopicPriority` union
- `Confidence` maps to the existing numeric confidence field
- `Source URL` maps to `sourceUrl`
- `Retrieved At` maps to `retrievedAt`
- `Verification Status` maps into the existing `VerificationStatus` union
- `Next Review` maps to `nextReviewAt`
- `Notes` may map to `notesStatus` only if the current route can display it without implying verified official status

Normalization rules:

- the mapper must normalize Notion select labels into the app's lowercase union values
- if a required property is missing or malformed in a row, the row should be treated as a mapping failure for that sync attempt
- mapping failures must trigger the loader's error-fallback state rather than producing partially trusted live data
- the mapper may ignore extra Notion properties not needed by the current app surface

## Source State Model

The loader should return both data and source metadata.

Required source states:

- `live`
- `fallback_config`
- `fallback_error`

Required result shape:

- `topics`
- `sourceState`
- `message`

Behavior rules:

- `live` means Notion fetch and mapping succeeded
- `fallback_config` means configuration is missing or incomplete before any API call
- `fallback_error` means configuration exists but the fetch or mapping failed
- in both fallback states, `topics` must come from the local mock dataset
- `message` should be safe for UI display and must explain whether the page is using local fallback data because configuration is missing or because live sync failed

## Route Design

### `/topics`

The page should:

- load data through the new server loader
- render the same topic list surface using normalized `Topic[]`
- display a visible status banner above the main content
- show a live-data message when `sourceState` is `live`
- show a fallback configuration warning when `sourceState` is `fallback_config`
- show a fallback sync-error warning when `sourceState` is `fallback_error`
- keep the rest of the topic browsing experience usable when fallback data is shown

Phase 4.1 does not require a separate debug route if the source-state banner is clear enough for normal verification.

## Error Handling

Phase 4.1 should handle failures explicitly:

- missing env must not throw an unhandled route error
- SDK request failures must return fallback data plus a safe sync-failed message
- property-shape mismatches must return fallback data plus a safe mapping-failed message
- the UI must never imply that fallback data is live Notion data
- error text must remain short and operational, not diagnostic

Examples of acceptable UI messages:

- `Live Notion topic sync is active.`
- `Live Notion sync is not configured. Showing local fallback topic data.`
- `Live Notion sync failed. Showing local fallback topic data.`

## Testing Strategy

Tests must use mocks and stubs only. No automated test may make a real Notion API call.

Required coverage:

- server env validation for missing and complete config
- mapping a representative valid Notion row into `Topic`
- normalization of Notion select values into app unions
- loader behavior for `live`
- loader behavior for `fallback_config`
- loader behavior for `fallback_error`
- preservation of fallback topic data when sync is unavailable

Testing rules:

- stub the SDK client methods instead of calling the network
- avoid coupling tests to MCP Notion behavior
- prefer pure helper tests over route-rendering tests unless a route test is needed for the banner state

## Documentation Impact

Phase 4.1 should update:

- project status docs so Phase 4 work is represented accurately if implementation starts
- developer-facing setup docs to explain the required Notion environment variables
- any route copy that still implies Topics are mock-only once the integration is live-capable

## Files Expected To Change

Likely files:

- `apps/web/lib/types.ts`
- `apps/web/lib/mock-data.ts`
- new server-only Notion integration files under `apps/web/lib/`
- new tests under `apps/web/lib/`
- `apps/web/app/topics/page.tsx`
- `README.md`
- `docs/ROADMAP.md`

## Success Criteria

Phase 4.1 is complete when:

- `/topics` reads from a server-side Notion loader instead of importing topic fixtures directly
- live Notion topic data is shown when valid configuration is present and mapping succeeds
- local mock topic data is shown when configuration is missing or sync fails
- fallback behavior is explicit and visible in the UI
- no secrets are exposed to the client
- automated tests cover the loader and mapper behavior using mocks and stubs only
- the resulting integration boundary is narrow enough to extend later for Questions and Bibliography
