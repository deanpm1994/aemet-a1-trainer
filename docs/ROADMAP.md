# Roadmap

## Phase 0 — Foundation

- Create repo structure
- Create documentation
- Create AGENTS.md
- Create initial Next.js app
- Create basic routes
- Create design skeleton

## Phase 1 — Study checklist MVP (complete)

- Add topic data model
- Add mock topic data
- Build topics page
- Build topic detail page
- Add status and confidence fields
- Add progress dashboard

## Phase 2 — Question bank MVP (complete)

- Add question data model
- Add manual question entry
- Add question list
- Add filters
- Add attempt tracking
- Add mistake log

## Phase 3 — Focus and calendar (complete)

- Add focus timer
- Add study session model
- Add weekly planner
- Add default schedule based on user work hours
- Add session completion checklist
- Add Today dashboard workflow from sessions, topics, questions, and monitoring readiness
- Add deterministic schedule orchestrator using due/weak/unstarted topics and the default morning template (complete)

## Study content MVP (complete; non-official guidance clearly labelled)

- Expose complete verified BOE syllabus (complete)
- Add Spanish study cards per verified topic (complete)
- Do not generate syllabus-recognition questions; add reviewed, source-backed subject-matter simulacra only
- Add topic and random quiz feedback (complete)
- Add detailed Spanish study notes for all 128 verified topics (complete; explicitly non-official)

## Phase 4 — Notion integration (complete)

- Create Notion database mapping
- Sync topics from Notion
- Sync bibliography from Notion
- Keep Notion question sync optional for future editorial import; Supabase is canonical runtime storage
- Add verification status handling

## Phase 5 — Supabase persistence (complete)

- Phase 5.1: persist profile, study preferences, and reminder preferences (complete)
- Phase 5.2: add email/password auth for settings persistence testing (complete)
- Phase 5.3: persist calendar study sessions (complete)
- Phase 5.4: persist focus-session timer and review outcomes (complete)
- Phase 5.5: persist topic progress overlays (complete)
- Phase 5.6: persist question progress overlays (complete)
- Phase 5.7: persist detailed question attempt history (complete)
- Phase 5.8: update topic/question progress from completed focus sessions (complete)
- Add Supabase schema (complete)
- Add auth (complete)
- Add row-level security (complete)
- Add user settings (complete)

## Phase 6 — Monitoring (manual persisted checks complete; automation pending)

- Add BOE/AEMET source list skeleton (complete)
- Add manual persisted snapshot/hash checks and review-only events (complete)
- Add scheduled execution and notification hooks (pending)

## Phase 7 — PWA and reminders (partial)

- Add PWA manifest (complete)
- Add installable mobile view metadata (complete)
- Add in-app reminders for the configured local minute (complete; only while the app is open)
- Add browser notifications (pending; not active)
- Add countdown/status widget shell (complete; no source-backed official dates loaded)
- Add offline review mode (pending)

## Release readiness

- Question-bank release merged to `develop` on 2026-08-03 (complete)
- Vercel production deployment for that release completed successfully (complete)
- Real-phone production study-flow evidence is required by GitHub issue #22 (pending)
