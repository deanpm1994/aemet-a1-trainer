# Anti-Hallucination Policy

This project deals with public exam preparation. Incorrect official information can cause serious user harm.

## Core rule

Never invent official information.

## Data categories

### Official verified

Use only when:
- Source is official.
- URL is stored.
- Retrieval date is stored.
- Content has been checked.

Examples:
- BOE call
- AEMET opposition page
- Official exam PDF
- Official answer template
- Consolidated Spanish legislation

### User-entered

Content entered manually by the user.

Must not be shown as official unless verified.

### Derived

Summaries, explanations, topic tags, difficulty scores and study recommendations.

Must be clearly separated from official text.

### Unverified

Anything imported from unofficial sites, copied notes, AI output, or incomplete sources.

Must be marked `needs_review`.

## Required fields for official data

Every official item should include:
- `source_name`
- `source_url`
- `retrieved_at`
- `verification_status`
- `official_text` where applicable

## Forbidden behavior

Do not:
- Invent exam dates.
- Invent deadlines.
- Invent tribunals.
- Invent answer keys.
- Invent official bibliography.
- Invent syllabus wording.
- Invent number of places.
- Claim a BOE/AEMET change happened without source evidence.
- Claim notification/monitoring is active unless implemented.

## Safe fallback phrases

Use these in UI or comments:
- `Pending official verification`
- `Source required`
- `Needs review`
- `Official source not yet linked`
- `TODO_VERIFY_OFFICIAL_SOURCE`
