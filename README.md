# AEMET A1 Trainer

A web/PWA study system for preparing the Spanish public opposition exam:

Grupo A1 – Cuerpo Superior de Meteorólogos del Estado, AEMET.

## Goals

- Track the official syllabus.
- Build a past-question bank.
- Schedule study sessions.
- Improve focus.
- Monitor BOE/AEMET official sources.
- Support countdowns and progress analytics.
- Use Notion as an editable knowledge layer.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Notion API
- Google Calendar API later
- Vercel

## Current status

Phase 1 complete: read-only study checklist MVP.
Phase 2 complete: question bank MVP.
Phase 3 complete: focus and calendar MVP.
Phase 4 complete: Notion sync for topics, questions, and resources.

## Notion sync

Phase 4 uses server-side Notion integrations for:

- `/topics`
- `/questions`
- `/resources`

Required environment variables:

- `NOTION_TOKEN`
- `NOTION_TOPICS_DATA_SOURCE_ID`
- `NOTION_QUESTIONS_DATA_SOURCE_ID`
- `NOTION_BIBLIOGRAPHY_DATA_SOURCE_ID`

Behavior:

- when the relevant route config is present and the Notion sync succeeds, the app shows live Notion data
- when configuration is missing, the app shows local fallback data with an explicit warning
- when the sync fails or mapping is invalid, the app shows local fallback data with an explicit error

The app does not expose the Notion token to the browser.

## Safety

Official exam information must be verified from official sources before being displayed as official.

Use:
- `verified`
- `unverified`
- `needs_review`
- `deprecated`

Never invent official dates, deadlines, answer keys or syllabus wording.
