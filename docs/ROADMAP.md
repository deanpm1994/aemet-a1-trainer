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

## Phase 4 — Notion integration (complete)

- Create Notion database mapping
- Sync topics from Notion
- Sync bibliography from Notion
- Sync questions from Notion
- Add verification status handling

## Phase 5 — Supabase persistence

- Phase 5.1: persist profile, study preferences, and reminder preferences
- Phase 5.2: add email/password auth for settings persistence testing
- Phase 5.3: persist calendar study sessions
- Phase 5.4: persist focus-session timer and review outcomes
- Phase 5.5: persist topic progress overlays
- Phase 5.6: persist question progress overlays
- Phase 5.7: persist detailed question attempt history
- Phase 5.8: update topic/question progress from completed focus sessions
- Add Supabase schema
- Add auth
- Add row-level security
- Add user settings

## Phase 6 — Monitoring

- Add BOE/AEMET source list skeleton
- Add snapshot checking
- Add keyword detection
- Add monitoring events
- Add notification hooks

## Phase 7 — PWA and reminders

- Add PWA manifest (complete)
- Add installable mobile view metadata (complete)
- Add reminder settings shell (complete; delivery inactive)
- Add notifications
- Add countdown widgets
- Add offline review mode
