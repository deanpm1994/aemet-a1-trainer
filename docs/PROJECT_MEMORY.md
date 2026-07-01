# Project Memory

This file stores persistent project context for Codex and contributors.

## Project

Name: AEMET A1 Trainer

Purpose:
A web/PWA app for preparing the Spanish public opposition exam:
Grupo A1 – Cuerpo Superior de Meteorólogos del Estado, AEMET.

## User

The primary user is preparing for the next AEMET A1 opening.

Known constraints:
- Works 12:30–23:00.
- Best study time: morning.
- Background: Meteorology degree from Cuba.
- Spanish qualification: Master in Meteorology and Geophysics.
- Wants calendar-based checklist and focus support.
- Wants a question bank from past exams.
- Wants countdowns for future openings and exam phases.
- Wants official BOE/AEMET monitoring.
- Husband is a software developer and wants this as a GitHub portfolio project.

## Study defaults

Morning deep work is preferred.

Default weekday plan:
- 07:30–09:00 deep technical study
- 09:10–10:10 problems/practical case
- 10:20–11:00 legal/informatics/flashcards
- 23:30–00:00 optional light review

Avoid heavy study after 23:00.

## Official syllabus size

Current known structure from latest referenced A1 programme:
- Mathematics: 18 topics
- Physics: 18 topics
- Meteorology and Climatology: 59 topics
- Informatics and Communications: 10 topics
- General/Common topics: 22 topics

Total: 127 topics

Important:
The exact topic wording must be verified against the official BOE call before importing.

## Core app modules

1. Dashboard
2. Official topic checklist
3. Question bank
4. Practical case trainer
5. Focus mode
6. Calendar planner
7. Countdown system
8. BOE/AEMET monitor
9. Notion sync
10. Progress analytics

## Architecture direction

Preferred stack:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Notion API
- Google Calendar API later
- Vercel deployment
- PWA-first design

## Official-source policy

Only official-source verified data may be displayed as official.

Official preferred sources:
- BOE
- AEMET
- Spanish government legal sources
- WMO
- ECMWF
- EUMETSAT

Use `TODO_VERIFY_OFFICIAL_SOURCE` for uncertain data.

## Current implementation handoff

Date: 2026-07-01

Branch:
- `develop`

Phase 5 status:
- Phase 5.1 Supabase-backed user settings persistence implemented
- Phase 5.2 Supabase email/password auth implemented
- Phase 5.3 Supabase-backed calendar study-session persistence implemented and merged
- Phase 5.4 Supabase-backed focus-session timer and review outcome persistence implemented
- Phase 5.5 Supabase-backed topic progress overlay persistence implemented
- Phase 5.6 Supabase-backed question progress overlay persistence implemented
- Phase 5.7 Supabase-backed question attempt history implemented and remote migration applied

Phase 6 status:
- Monitoring skeleton implemented as a read-only manual workflow dashboard
- Monitoring source verification readiness queue implemented
- No BOE/AEMET polling, scraping, snapshot comparison, event detection, or alerts are active

Supabase notes:
- Project URL configured in local env
- Project ref linked locally: `adwapclevjpltyxprbyx`
- Supabase now uses publishable and secret keys instead of legacy anon/service-role labels
- Local auth issue was caused by a mistyped publishable key prefix in `.env.local`; working prefix is `sb_publishable_...`
- Dev server restart is required after local env changes
- Remote migrations verified applied: `20260623`, `20260630`, `20260701`, `20260702`

Verified working recently:
- Sign-up and sign-in flow worked after env fix
- `npm --prefix apps/web run lint`
- `npm --prefix apps/web test`
- `npm --prefix apps/web run build`
- Local `/calendar` smoke test returned HTTP 200 and rendered the planner
- Focus route now loads the next persisted actionable session for signed-in users and saves timer/review transitions through `study_sessions`
- Topic list and detail routes overlay signed-in user progress from `topic_progress` without mutating source-owned official metadata
- Question route overlays signed-in user practice progress from `question_progress` without mutating source-owned statements, options, answer keys, or verification metadata
- Monitoring route shows manual-only source checklist and review queue placeholders; it does not claim active monitoring
- Dashboard now acts as a Today study cockpit, combining next session, weak topics, overdue questions, and monitoring readiness with signed-in persistence overlays
- Question bank now records signed-in user attempts and derives aggregate review progress from attempt history

Next persistence slices:
- Consider focus completion updates to topic and question progress after attempt history is stable
- GitHub issues track focus outcomes, progress persistence, live monitoring, PWA reminders, and docs refresh

Ignored local artifacts:
- `apps/web/package-lock.json`
- `supabase/.temp/`
