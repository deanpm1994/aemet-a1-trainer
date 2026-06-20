# AGENTS.md

## Mission

This repository builds `AEMET A1 Trainer`, a web application for preparing the Spanish public opposition exam:

Grupo A1 – Cuerpo Superior de Meteorólogos del Estado, AEMET.

The app must help the user study with structure, focus, reminders, official syllabus tracking, past question practice, countdowns and official source monitoring.

## Non-negotiable rules

1. Do not invent official facts.
2. Do not fabricate BOE, AEMET, syllabus, exam, bibliography or legal information.
3. If an official detail is unknown, mark it as `TODO_VERIFY_OFFICIAL_SOURCE`.
4. Prefer official sources:
   - BOE
   - AEMET
   - INAP when relevant
   - Spanish government legal sources
   - WMO, ECMWF, EUMETSAT for meteorological institutional references
5. Do not hardcode unverified exam dates.
6. Do not assume the next opening date.
7. Do not claim monitoring is active unless code exists and tests confirm it.
8. Keep the app focused on AEMET A1 preparation.
9. Avoid feature creep.
10. Every feature should support one of:
    - syllabus tracking
    - question practice
    - calendar planning
    - focus improvement
    - countdowns
    - official monitoring
    - progress analytics

## Candidate context

The candidate:
- Works from 12:30 to 23:00.
- Studies mainly in the morning.
- Has meteorology background.
- Has a Spanish Master in Meteorology and Geophysics.
- Wants to prepare for the next AEMET A1 opening.
- Wants a web/PWA app with reminders and focus support.

Default study template:
- 07:30–09:00 deep technical topic
- 09:10–10:10 questions or practical case
- 10:20–11:00 legal, informatics or flashcards
- 23:30–00:00 optional light review only

## Development style

- Use TypeScript.
- Prefer explicit types.
- Keep components small.
- Keep domain logic separate from UI.
- Add tests for data transformations and parsers.
- Use clear naming.
- Document assumptions.
- Do not add complex dependencies without justification.
- Prefer simple MVP features over ambitious unfinished systems.

## When working on a task

Before coding:
1. Read `docs/PROJECT_MEMORY.md`.
2. Read `docs/GROUND_RULES.md`.
3. Read relevant docs for the feature.
4. Identify unknown official data.
5. Mark unknowns clearly.

After coding:
1. Update docs if behavior or architecture changed.
2. Add TODOs for unverified data.
3. Do not leave broken routes.
4. Run lint/tests if available.
5. Summarize what changed.

## Anti-hallucination protocol

When adding official content:
- Include source URL fields.
- Include retrieval date fields.
- Include verification status.
- Never treat user-entered content as official unless marked verified.
- Use `verified`, `unverified`, `needs_review`, or `deprecated`.

When importing syllabus topics:
- Preserve exact BOE wording in a dedicated field.
- Store normalized title separately.
- Do not rewrite official wording without keeping the original.

When importing questions:
- Preserve original statement.
- Preserve original options.
- Store explanations separately.
- Mark answer key as official only if sourced from an official template.

## Focus protocol

The app should help the user avoid open-ended study.

Every study session should have:
- one objective
- one topic or question set
- timebox
- output checklist
- confidence score
- next review date

Session outputs:
- notes created
- questions solved
- flashcards created
- mistakes logged
- topic status updated

## Product principle

The app is not only a database.
It is a preparation operating system.
