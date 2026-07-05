# Spanish UI Pass 2 Design

Date: 2026-07-05
Branch: `spanish-ui-pass-2`

## Goal

Translate remaining product UI copy to Spanish so the candidate sees a Spanish-first application beyond the shell and homepage.

## Scope

- Translate route/page UI copy for dashboard, calendar, focus, questions, topics, resources, monitoring, settings, and auth pages.
- Translate reusable form labels, buttons, helper text, and user-facing status messages.
- Keep the existing typed internal i18n dictionary.
- Add or update tests where UI copy moves from local constants into translation helpers.
- Update project memory after implementation.

## Non-Goals

- No language selector.
- No persisted language preference.
- No route prefixes such as `/es` or `/en`.
- No new i18n dependency.
- No official BOE/AEMET content import.
- No automated translation of official/source-owned content.

## Translation Boundary

Translate product UI strings only.

Do not rewrite source-owned study data:

- topic official wording
- question statements
- question options
- correct answers
- source URLs
- retrieval dates
- verification metadata

Starter fixture content in `mock-data.ts` may still appear in English. It remains unverified study/demo content and should be handled in a later dedicated content-cleanup pass.

## Application Design

Extend `apps/web/lib/i18n.ts` with more typed keys for remaining pages and components.

Wire pages/components to `DEFAULT_LOCALE`:

- `app/dashboard/page.tsx`
- `app/calendar/page.tsx`
- `app/focus/page.tsx`
- `app/questions/page.tsx`
- `app/topics/page.tsx`
- `app/topics/[id]/page.tsx`
- `app/topics/[id]/not-found.tsx`
- `app/resources/page.tsx`
- `app/monitoring/page.tsx`
- `app/settings/page.tsx`
- `app/auth/sign-in/page.tsx`
- `app/auth/sign-up/page.tsx`
- `components/auth-form.tsx`
- `components/calendar-planner.tsx`
- `components/focus-session-panel.tsx`
- `components/question-attempt-form.tsx`
- `components/question-progress-form.tsx`
- `components/settings-form.tsx`
- `components/topic-progress-form.tsx`

Keep domain helpers focused on behavior. If a domain helper returns user-facing English labels today, either move the label mapping into the UI or add translation keys at the UI boundary.

## Error Handling

Technical developer errors may remain English when not user-facing.

User-facing Supabase, auth, planner, focus, topic, and question messages should be Spanish.

## Testing

Run:

- `npm --prefix apps/web test`
- `npm --prefix apps/web run lint`
- `npm --prefix apps/web run build`

Add focused tests only where needed to protect dictionary completeness or moved label behavior.

## Acceptance Criteria

- Main product UI pages and forms render Spanish copy by default.
- Existing English fallback dictionary remains type-aligned.
- Source-owned study content is not rewritten.
- Tests, lint, and build pass.
