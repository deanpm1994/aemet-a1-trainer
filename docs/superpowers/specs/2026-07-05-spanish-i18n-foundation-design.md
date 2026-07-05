# Spanish i18n Foundation Design

Date: 2026-07-05
Branch: `spanish-i18n`

## Goal

Make the app Spanish-first for the candidate while keeping an English UI fallback available.

This slice introduces the translation foundation and converts the shared shell plus first-screen/core status copy. It does not import or translate official BOE/AEMET content.

## Scope

- Add a typed internal i18n helper with `es` and `en` dictionaries.
- Make Spanish the default locale.
- Set the root document language to Spanish.
- Translate shared app shell copy, navigation labels, homepage copy, and reusable readiness/status copy.
- Keep official/source-owned data fields unchanged.
- Add tests for locale fallback and dictionary completeness.

## Non-Goals

- No BOE/AEMET syllabus import.
- No official past-question import.
- No machine translation of official wording.
- No route-prefix locale system such as `/es` or `/en`.
- No browser language detection.
- No new heavy i18n dependency.
- No full-app translation in this first slice.

## Data Boundary

Product UI strings may be translated.

Source-owned study content must not be translated or rewritten by the i18n layer:

- topic `officialTitle`
- topic `officialNumber`
- question `statement`
- question `options`
- question `correctAnswer`
- source URLs
- retrieval dates
- verification statuses stored with source data

When verified official content is imported later, exact official wording must remain preserved in the source field. A separate normalized/display title may be localized only if the app clearly keeps the original official wording alongside it.

## Application Design

Create `apps/web/lib/i18n.ts` with:

- `type Locale = "es" | "en"`
- `DEFAULT_LOCALE = "es"`
- typed dictionary keys for translated UI strings
- `getDictionary(locale)`
- `t(locale, key)`

Use the helper in shared components first:

- `app/layout.tsx`
- `components/site-shell.tsx`
- `components/content-readiness-card.tsx`
- `components/source-state-banner.tsx`
- the homepage route

Route card labels and descriptions should move out of `mock-data.ts` if they are product navigation copy rather than source data.

## User Preference

Language preference persistence is intentionally deferred to the next slice. The app defaults to Spanish everywhere in this slice. English remains available in code and tests so adding a settings selector later is straightforward.

## Error Handling

If an unsupported locale is requested internally, use Spanish.

Missing dictionary keys should be caught by TypeScript and tests rather than hidden at runtime.

## Testing

Add focused unit tests for:

- default locale is Spanish
- unsupported locale falls back to Spanish
- English and Spanish dictionaries expose the same keys
- translated readiness/source-state copy does not change readiness logic

Run:

- `npm --prefix apps/web test`
- `npm --prefix apps/web run lint`
- `npm --prefix apps/web run build`

## Documentation

Update `docs/PROJECT_MEMORY.md` after implementation with:

- Spanish-first UI foundation status
- the official-content translation boundary
- remaining next step: language selector in settings, if still desired

## Acceptance Criteria

- The app shell and homepage default to Spanish.
- The root HTML language is `es`.
- English fallback strings exist for the translated keys.
- Tests, lint, and build pass.
- No official/source-owned study content is translated or relabeled as official.
