# Supabase Canonical Question Bank Plan

**Goal:** Serve verified practice questions from Supabase; Notion never controls runtime availability.

1. Add source-question/audit migration with read-only source RLS and indexes.
2. Add typed repository + tests for source rows, verified query, empty fallback.
3. Add validated server seed/upsert from `officialPastExamSubsetSource`; audit source hashes.
4. Replace `loadQuestionsSource` runtime Notion query with repository-first source; retain checked-in verified fallback only for unavailable/empty migration state.
5. Run migration, full tests/lint/build, docs, merge/push.

Constraints: exact official content/provenance; no inferred keys; existing stable IDs preserve attempts/progress; no user writes to canonical content.
