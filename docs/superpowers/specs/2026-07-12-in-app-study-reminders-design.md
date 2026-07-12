# In-App Study Reminders Design

## Goal

Make persisted reminder preferences useful while the app is open, without
claiming background, push, or browser-notification delivery.

## Behavior

- A client reminder component evaluates local current time against saved morning
  and evening times.
- Morning banner links to Today/Calendar study work. Evening banner uses light
  review wording only.
- Reminder displays only when enabled, in matching local minute, and not
  dismissed for that date/time slot. Dismissal is browser local storage.
- Banner says it appears only while app is open. No permission prompt, service
  worker, push subscription, cron, or background schedule.

## Tests

- Pure helper tests for disabled settings, time matching, morning/evening
  classification, and one-dismissal-per-day key.
- Component renders only eligible reminder and preserves safe wording.
