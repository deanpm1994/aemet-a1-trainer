# Question Bank Visibility and Verified 2014 Expansion Design

## Goal

Show every verified canonical question already stored in Supabase, then increase
practice volume through a small, source-verified 2014 first-exercise batch.

## Scope

1. Diagnose why the Questions route reports 23 items when Supabase contains 27
   verified rows: 2014 (8), 2015 (4), 2016 (5), 2017 (5), and 2018 (5).
2. Correct the route, deployment, or source fallback responsible for that
   discrepancy without changing user-owned attempt or progress records.
3. Inspect the official 2014 questionnaire and official answer template
   visually. Import only cleanly transcribed questions from the candidate set
   13 and 15--22 when both wording/options and answer letters are confirmed.
4. Keep any formula-heavy, OCR-ambiguous, annulled, or answer-key-unconfirmed
   item out of verified practice. Mark it `TODO_VERIFY_OFFICIAL_SOURCE` in
   source notes rather than inferring its content.
5. Seed the validated additions into Supabase and verify the live total before
   recommending the next study topic.

## Source Rules

- Questionnaire: AEMET 2014 Acceso Libre first-exercise PDF.
- Answer key: MITECO official 2014 answer-template PDF.
- Preserve exact statement/options, source URL, retrieval date, verification
  status, and answer provenance in every record.
- `official-past-exam-subset.ts` remains checked-in canonical content;
  Supabase `questions` and `question_sources` remain runtime storage.

## Data Flow

`official-past-exam-subset.ts` validates each record -> seed script upserts
`questions` and provenance hashes -> Questions route loads verified Supabase
rows -> user attempts/progress overlay separately.

If Supabase fails, the route may use checked-in verified content, but that
fallback must contain the same verified total after this batch. The UI source
state must make any fallback explicit.

## Tests and Verification

- Add a failing test for the 27-row source/runtime count and corrected missing
  2015 visibility before changing route behavior.
- Add failing subset tests for only the visually verified 2014 question
  numbers, official URLs, answer provenance, and exact expected total.
- Run focused tests, full web test suite, lint, production build, and
  `git diff --check`.
- Query Supabase read-only after seeding; report total and per-year counts.

## Out of Scope

- New question types, topic rewrites, inferred answer keys, OCR repair by
  guesswork, Notion runtime integration, reminder work, and unrelated worktree
  changes.
