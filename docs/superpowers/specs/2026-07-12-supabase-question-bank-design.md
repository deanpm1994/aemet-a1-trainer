# Supabase Canonical Question Bank Design

## Goal

Move runtime question authority from Notion/static fallback to Supabase so an
empty Notion database cannot hide practice questions.

## Data Model

- `questions`: stable id, exact statement/options, answer, type, year/exam,
  topic ids, difficulty, verification status, source URL/retrieval date, answer
  source URL/retrieval date/status, explanation.
- `question_sources`: immutable import audit with source URL, content hash,
  retrieved/imported timestamps, verification decision.
- Existing `question_progress` and `question_attempts` continue using stable
  text `question_id`; no user history migration required.

## Runtime

- Server question repository reads verified questions from Supabase first.
- Checked-in official subset seeds/upserts data through a server-only validated
  importer; id conflict updates source-owned fields only.
- If Supabase is unavailable or has no canonical rows, show explicit source
  unavailability and safe checked-in official fallback during migration.
- Notion is removed from runtime reads; optional future import/editor path only.

## Safety

- No user writes to source-owned question tables.
- Public/authenticated reads expose only verified records.
- Import keeps exact source wording and provenance; no inferred answer keys.
- Migration applies before importer; tests cover mapping, RLS-facing repository
  calls, empty database fallback, and stable ids.

## Delivery

1. Schema/migration + repository mapping.
2. Validated seed/import action for existing verified subset.
3. Route migration and Notion runtime removal.
4. Tests, docs, remote migration, deploy verification.
