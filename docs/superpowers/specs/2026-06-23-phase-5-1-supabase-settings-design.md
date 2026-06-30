# Phase 5.1 Supabase Settings Design

Date: 2026-06-23
Phase: 5.1
Status: proposed

## Goal

Deliver first Supabase-backed persistence slice for `AEMET A1 Trainer` by saving user-owned settings for:

- profile
- study preferences
- reminder preferences

This slice establishes database, RLS, and typed application boundaries for later Phase 5 work without claiming that full auth UI, notifications, or wider domain persistence already exist.

## Why this slice first

Phase 5 in roadmap includes Supabase schema, auth, persistence, RLS, and user settings. The smallest useful vertical slice is persisted settings because it:

- creates real Supabase integration
- exercises authenticated ownership and RLS
- avoids mixing unrelated persistence concerns for topics, questions, and sessions
- keeps current local study features working while adding one durable user-specific foundation

## Scope

In scope:

- Supabase database table for user settings
- row-level security for per-user ownership
- typed app model for settings
- server-side load and save path
- settings page UI wired to saved settings
- explicit placeholders for auth-required and notifications-not-active states
- unit tests for defaults and mapping helpers
- documentation updates for Phase 5.1 behavior

Out of scope:

- signup or login UI
- social auth setup
- live reminder delivery
- persisted topics, questions, or study sessions
- monitoring automation changes
- official exam content changes

## Constraints

- Do not claim auth UI exists unless implemented and verified.
- Do not claim reminders are active; saved reminder preferences are configuration only.
- Keep official-source and exam data separate from user settings.
- Use TypeScript with explicit types.
- Prefer server-side secret-key access for privileged paths only.
- Client-side Supabase usage, if added, must use publishable key only.

## User experience

### Authenticated user

Authenticated user opens `/settings` and can:

- edit display name and timezone
- edit study schedule defaults derived from candidate study rhythm
- edit reminder preferences
- save preferences to Supabase
- see success or failure state

If no row exists yet, page loads default values seeded from app defaults and allows first save.

### Unauthenticated user

If no authenticated session exists:

- page stays reachable
- form persistence is disabled
- page explains that saved settings require authentication
- page does not pretend login flow is already implemented

### Reminder messaging

Reminder fields are shown as saved preferences only. UI must state that notification delivery is not active yet.

## Data model

Create one table: `user_settings`

Columns:

- `user_id uuid primary key references auth.users(id) on delete cascade`
- `display_name text not null default ''`
- `timezone text not null`
- `study_start_time text not null`
- `deep_work_minutes integer not null`
- `practice_minutes integer not null`
- `review_minutes integer not null`
- `workday_start_time text not null`
- `workday_end_time text not null`
- `reminders_enabled boolean not null default false`
- `reminder_channel text not null default 'in_app'`
- `morning_reminder_time text`
- `evening_reminder_time text`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Notes:

- time values are stored as `HH:MM` text for MVP simplicity and direct UI binding
- `reminder_channel` is stored even though delivery is not implemented yet
- `display_name` is user-entered profile data, not official identity data

## Domain model

App domain should use one typed settings object with three sections:

- `profile`
- `studyPreferences`
- `reminderPreferences`

Suggested structure:

```ts
type UserSettings = {
  profile: {
    displayName: string;
    timezone: string;
  };
  studyPreferences: {
    studyStartTime: string;
    deepWorkMinutes: number;
    practiceMinutes: number;
    reviewMinutes: number;
    workdayStartTime: string;
    workdayEndTime: string;
  };
  reminderPreferences: {
    remindersEnabled: boolean;
    reminderChannel: "in_app";
    morningReminderTime: string | null;
    eveningReminderTime: string | null;
  };
};
```

For Phase 5.1, `reminderChannel` should stay narrow unless another channel is actually implemented. Use `"in_app"` as saved placeholder value, not as claim of live delivery.

## Defaults

When no saved row exists, defaults should come from known project study template and user context:

- timezone: `Europe/Madrid`
- study start time: `07:30`
- deep work minutes: `90`
- practice minutes: `60`
- review minutes: `40`
- workday start time: `12:30`
- workday end time: `23:00`
- reminders enabled: `false`
- morning reminder time: `07:20`
- evening reminder time: `23:20`

`display_name` may default to empty string.

These are user productivity defaults, not official data.

## Database access model

Phase 5.1 should keep persistence on trusted server path.

Recommended structure:

- shared settings types and mapping helpers in `apps/web/lib`
- Supabase server helper for loading and upserting settings
- page-level server action or route-bound server function for save flow

Use `SUPABASE_SECRET_KEY` only in secure server context. Never expose it to browser code.

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` may exist for later auth/session work, but this slice does not need to depend on broad client-side DB writes.

## Row-level security

Enable RLS on `user_settings`.

Policies:

- authenticated user can `select` row where `auth.uid() = user_id`
- authenticated user can `insert` row where `auth.uid() = user_id`
- authenticated user can `update` row where `auth.uid() = user_id`

No cross-user access. No anonymous write access.

Even with server-side secret-key operations, policy intent must remain explicit in schema because publishable-key and auth-backed access are planned later in Phase 5.

## Page behavior

`/settings` should move from placeholder to real settings surface.

Sections:

1. Profile
2. Study preferences
3. Reminder preferences

Behavior:

- load existing row for authenticated user
- if missing, render defaults
- if user unauthenticated, show auth-required state and disable save path
- on save, upsert one row per user
- show concise success message after successful save
- show concise error message if save fails
- preserve unsaved form values after failure

Copy requirements:

- do not say reminders are active
- do not say auth is complete
- do not imply any official exam data comes from settings

## Validation

Validation can stay lightweight in Phase 5.1:

- time strings must follow `HH:MM`
- duration values must be positive integers
- timezone must be non-empty
- reminder times may be `null` when reminders are disabled

If invalid DB data is read:

- do not crash route
- log or surface controlled error on server path if pattern exists
- fall back to defaults for display

## Failure handling

### Missing environment variables

If Supabase environment variables are missing:

- settings page should render a clear persistence-unavailable message
- app should not attempt misleading save behavior

### No session

If no authenticated user session exists:

- page explains persistence requires auth
- save action is disabled or blocked before DB write

### Save failure

If Supabase save fails:

- keep edited values in form
- show concise error state
- do not show false success

### Corrupt payload

If row payload is incomplete or invalid:

- parser returns defaults or controlled failure
- UI remains usable

## Testing strategy

Write tests before implementation for:

- default settings builder
- database row to domain model mapper
- domain model to database payload mapper
- invalid time or reminder payload handling, if parser enforces it

Keep tests focused on pure transformations and business rules first.

## Documentation updates

Update docs that mention current phase or settings behavior so they reflect:

- Phase 5.1 adds persisted user settings foundation
- auth UI still pending
- reminder delivery still pending

Likely docs:

- `README.md`
- `docs/ROADMAP.md` if phase granularity needs note
- any implementation notes created during work

## Acceptance criteria

- authenticated user can save one settings row to Supabase
- saved values reload on next page render
- unauthenticated user sees auth-required state instead of fake persistence
- reminder settings are labeled as saved preferences only
- no auth or notification capability is overstated
- unit tests cover defaults and mapping helpers

## Implementation notes for next phase

After Phase 5.1, next logical slices are:

1. persist topics, questions, and study sessions
2. add user-facing auth flow
3. add richer settings or real reminder delivery

This design intentionally keeps first persistence slice narrow so later work can build on stable schema and app boundaries.
