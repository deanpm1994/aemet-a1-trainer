# Question bank rebuild

Status date: 2026-07-20

## Safety boundary

PDF text extraction and OCR are candidate transcriptions. Historical questions
that passed the existing verification and extraction audit may be served when
their statement, four options and official answer are complete. Rows flagged by
the audit still require explicit visual review. Annulled, deprecated and
quarantined records remain in the audit history but are excluded from learner
queries.

The permanent document inventory is
`data/official-question-source-manifest.json`. It records the official URL,
SHA-256, retrieval date, OEP year, known exam date, exam part and document
role. Unknown historical exam dates remain `TODO_VERIFY_OFFICIAL_SOURCE`.

## Implemented contracts

- `QuestionOption` derives A/B/C/D keys from array position. Stored option text
  remains source-owned and may be labelled or unlabelled.
- Official answer letters are graded by option index, not by a prefix embedded
  in option text.
- Questions carry OEP, exam part/date, role, reserve disposition, publication
  disposition, case group, answer format, model solution and rubric metadata.
- Answer supports accept multiple authoritative sources and explicit placement.
- Source crops include placement, optional option key and accessible alt text.
- Practical attempts retain the draft and the learner's self-assessment.
- Learner loaders require `verified` plus `available`; annulled, quarantined and
  deprecated records are excluded.

## Current source reconciliation

`aemet-a1-question-bank-reconciliation.csv` accounts for the 518 selected
2014–2018 source rows without a database write:

- 512 rows are structurally complete but need visual review under the new
  evidence standard.
- Six 2016 rows have incomplete option extraction and remain quarantined.
- 513 stable IDs already exist in Supabase; five incomplete stable IDs are
  absent.

The hardened importer itself promotes no new rows without a review file. In the
existing Supabase inventory, 283 historical rows are verified, structurally
complete and free of extraction-audit flags; 230 remain quarantined for review.
The six rejected 2016 source rows are not learner-visible.

## Recent official candidates

The extraction scripts use the hash-pinned AEMET PDFs and definitive
resolutions:

- `data/recent-official-question-candidates.json`: 230 raw candidates.
  - OEP 2024: 105 records, five annulled, reserves 101–105 activated.
  - OEP 2025: 125 records, two annulled, reserves 121–122 activated and
    123–125 unused.
  - Definitive OEP 2025 answers 37=B and 96=B are preserved.
  - Exactly 223 records are non-annulled.
- `data/recent-official-practical-candidates.json`: 32 official raw prompts,
  eight per A/B paper and OEP year.

These files deliberately use `needs_review` and `quarantined`. Candidate text
does not become verified merely because all three options were parsed.
Practical model answers and rubrics remain null until independently solved,
source-supported and reviewed.

## Commands

```bash
npm --prefix apps/web run seed:official-source-manifest -- --dry-run
npm --prefix apps/web run reconcile:question-bank
npm --prefix apps/web run extract:recent-official-questions
npm --prefix apps/web run extract:recent-practical-cases
npm --prefix apps/web run stage:recent-question-candidates
```

`stage:recent-question-candidates` is a dry run unless `--apply` is passed.
Applied candidates remain quarantined and preserve existing topic mappings and
stable IDs.

## Remaining editorial work

The following work cannot be truthfully marked complete without human-grade
source review:

1. Visually review all 518 historical selected rows and recover the six
   incomplete 2016 extractions.
2. Visually review all 230 recent multiple-choice transcriptions.
3. Solve and independently recalculate the 32 practical exercises, write
   rubrics, attach authoritative support, and perform editorial review.
4. Author 128 three-option factual questions with one authoritative factual
   source per item and reject duplicates/near-copies.

Until those gates pass, the acceptance content counts are inventory targets,
not learner-visible claims.

## Supabase rollout

Applied to linked project `adwapclevjpltyxprbyx` on 2026-07-20:

- `20260720_question_bank_rebuild`
- `20260721_quarantine_unreviewed_question_content`
- `20260722_restore_deciphered_historical_questions`
- 16 source-manifest rows
- 230 recent multiple-choice candidate rows
- 32 practical candidate rows

Read-only verification returned 105 OEP 2024 multiple-choice records
(5 annulled, 100 quarantined), 125 OEP 2025 records (2 annulled,
123 quarantined), and 32 quarantined practical records. Definitive samples
37=B, 96=B, annulments 41/62 and reserve dispositions 121–123 matched.

The legacy-evidence migration preserved every stable row and user-progress
reference. The follow-up migration restores the 283 verified, structurally
complete 2014–2018 questions; the 230 audit-flagged historical rows remain
quarantined. Recent candidates and practical prompts remain quarantined until
their editorial review gates pass.
