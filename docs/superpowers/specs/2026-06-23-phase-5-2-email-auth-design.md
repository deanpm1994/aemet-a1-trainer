# Phase 5.2 Email Auth Design

Date: 2026-06-23
Phase: 5.2
Status: proposed

## Goal

Add minimal Supabase email-and-password authentication so the app can support:

- sign up
- sign in
- sign out
- authenticated end-to-end testing of saved settings

This phase exists to make the Phase 5.1 settings persistence usable from the app itself without adding unrelated provider integrations or full account management.

## Why this slice next

Phase 5.1 added Supabase-backed settings persistence, but real end-to-end testing still depends on having a Supabase-authenticated browser session. The next smallest useful slice is email authentication because it:

- unlocks real testing of saved settings from the app
- establishes session handling for later user-owned data persistence
- avoids premature Google or multi-provider auth scope
- keeps Phase 5 focused on practical persistence foundations

## Scope

In scope:

- sign-up page for email + password
- sign-in page for email + password
- sign-out action
- auth status UI in shared shell/navigation
- reuse of Supabase server-side session handling
- auth-aware settings workflow validation
- documentation updates for auth scope and limitations

Out of scope:

- Google auth
- GitHub auth
- password reset
- profile editing beyond existing settings page
- route protection for all pages
- reminder delivery
- topics/questions/sessions persistence

## Constraints

- Do not claim Google integration exists.
- Do not claim email notifications or alerts are active.
- Keep the auth surface small and operational.
- Use Supabase Auth only; do not add extra auth libraries.
- Prefer server actions and server-first session access over client-heavy auth state management.
- Preserve the current settings behavior for unauthenticated users: page visible, save unavailable.

## User experience

### Signed-out visitor

Signed-out visitor can:

- open sign-up page
- create account with email and password
- open sign-in page
- sign in with existing credentials
- browse non-protected pages
- open settings page but not save

Shared shell should clearly show:

- `Sign in`
- `Sign up`

### Signed-in user

Signed-in user can:

- see authenticated status in navigation or shell
- sign out
- open settings page and save preferences

The app does not need broader access-control behavior yet. This phase is about identity and settings persistence usability, not locking down the entire site.

### Email confirmation

If Supabase project configuration requires email confirmation, UI copy should say account creation may require confirmation before first sign-in. The app should not promise immediate access in that case.

## Routes

Add routes:

- `/auth/sign-in`
- `/auth/sign-up`

Keep current routes intact.

No password reset route in this phase.

## Architecture

### Session handling

Reuse the current server-first Supabase pattern:

- `createSupabaseServerClient()` for cookie-backed authenticated session access
- `getAuthenticatedUserId()` for server-side identity checks

This keeps settings loading and auth flows aligned on one session model.

### Auth actions

Add small auth helpers or server actions for:

- `signUpWithEmailPassword`
- `signInWithEmailPassword`
- `signOutCurrentUser`

These actions should:

- validate required fields
- call Supabase Auth methods
- return concise success/error states for UI rendering
- avoid exposing secret credentials or misleading success states

### Shared shell status

Add an auth status area to shared shell or top navigation:

- signed out: links to sign in and sign up
- signed in: authenticated label or email plus sign-out control

This area should remain simple and must not imply rich account management.

## Form behavior

### Sign-up form

Fields:

- email
- password

Behavior:

- require non-empty email
- require non-empty password
- submit to server action
- show success or failure state
- if confirmation is required, state that clearly

### Sign-in form

Fields:

- email
- password

Behavior:

- require non-empty email
- require non-empty password
- submit to server action
- on success, redirect to a useful route such as `/settings`
- on failure, keep entered email if practical and show concise error

### Sign-out

Behavior:

- server action signs out current session
- redirect to stable route such as `/`

## Settings integration

Phase 5.1 settings page should continue to:

- load defaults if no saved row exists
- disable saving when no authenticated session exists
- save successfully when authenticated session exists and migration has been applied

No feature claims change here. Phase 5.2 only supplies the missing auth path.

## Error handling

### Missing environment variables

If required Supabase auth configuration is missing:

- auth pages should render clear configuration error state
- app should not claim account creation or sign-in succeeded

### Invalid credentials

If sign-in fails:

- show concise invalid-credentials message
- do not redirect

### Existing account conflicts

If sign-up fails because account already exists or Supabase rejects input:

- show concise error state
- do not imply account was created

### Confirmation pending

If sign-up succeeds but confirmation is required:

- show clear next-step message
- do not imply settings access is immediately available if Supabase blocks it

## Security and boundaries

- no custom password policy beyond what Supabase already enforces unless current project needs stronger UI validation
- no secret-key usage in auth page browser flows
- no client exposure of secret server credentials
- no admin auth behavior
- no irreversible destructive actions beyond normal sign-out

## Testing strategy

Write tests before implementation for:

- auth config or action input validation helpers, if created
- auth status derivation for signed-in vs signed-out shell state
- sign-in/sign-up action behavior using mocked Supabase client interfaces where practical

Verification:

- typecheck
- full Vitest suite
- manual browser test:
  - sign up
  - sign in
  - sign out
  - save settings while signed in

## Documentation updates

Update docs to reflect:

- Phase 5.2 adds email/password auth foundation
- Google auth is not implemented
- settings persistence now testable end-to-end once migration is applied

Likely docs:

- `README.md`
- `docs/ROADMAP.md`

## Acceptance criteria

- user can open `/auth/sign-up` and submit email/password
- user can open `/auth/sign-in` and sign in with email/password
- shared shell shows signed-in vs signed-out state
- signed-in user can sign out
- signed-in user can save settings through existing Phase 5.1 page flow
- docs do not overstate auth/provider scope

## Future follow-up

After Phase 5.2, likely next auth-related options are:

1. password reset flow
2. provider auth such as Google if calendar/reminder integrations become real scope
3. broader route protection for user-owned pages

Google auth should wait until it serves a concrete product need such as Google Calendar integration or Google-specific reminder workflows.
