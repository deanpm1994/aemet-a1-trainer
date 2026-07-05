# Countdown Status Widget Design

Date: 2026-07-05
Branch: countdown-status-widget

## Purpose

Add the first countdown/status widget without inventing an AEMET A1 call date, deadline, exam date, or phase date.

The widget should make the current truth visible: no source-backed official date has been verified yet. It should support the later addition of verified date records without changing the dashboard UI contract.

## Scope

Included:
- A typed countdown status model.
- A pure helper that converts optional source-backed date data into a dashboard-ready status.
- A dashboard card that displays the current official-date state in Spanish.
- Tests for no-date, future-date, today, and past-date behavior.
- Documentation updates that distinguish countdown UI from verified official dates.

Excluded:
- BOE/AEMET scraping or polling.
- Notification delivery.
- Hardcoded future dates.
- User-entered date editing.
- Treating any unverified date as official.

## Data Rules

Official dates may only be treated as verified when a record includes:
- a date value
- a label
- a source URL
- a retrieval date
- `verificationStatus: "verified"`

If no verified date record exists, the widget must show a no-date state. Unknown values must remain explicit rather than inferred.

## UX

The dashboard gets one compact card near the top of the page.

Initial state:
- Label: `Cuenta atrás oficial`
- Value: `Sin fecha verificada`
- Detail: `La próxima convocatoria o fecha de examen aparecerá aquí solo cuando exista una fuente oficial verificada.`
- Source note: `Fuente: TODO_VERIFY_OFFICIAL_SOURCE`

When a future verified date is added later, the same card can show days remaining and source metadata. This implementation does not add such a date.

## Architecture

Create `apps/web/lib/countdown.ts` for the pure transformation. Keep route JSX simple by importing a prebuilt default status from the helper.

The helper accepts an optional verified date record and a `today` ISO date. It returns a display model with:
- `label`
- `value`
- `detail`
- `sourceNote`
- `state`

## Testing

Add `apps/web/lib/countdown.test.ts`.

Coverage:
- no date returns explicit unverified/no-date status
- unverified date is ignored
- verified future date returns days remaining
- verified date equal to today returns today state
- verified past date returns elapsed state without pretending it is upcoming

## Documentation

Update:
- `docs/PROJECT_MEMORY.md`
- `docs/ROADMAP.md`

The docs must say the countdown/status widget exists, but no source-backed official dates are loaded.
