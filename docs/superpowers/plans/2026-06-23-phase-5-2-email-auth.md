# Phase 5.2 Email Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add minimal Supabase email-and-password auth with sign-up, sign-in, sign-out, and shared auth status so Phase 5.1 settings persistence can be tested end-to-end from the app.

**Architecture:** Keep auth server-first and small. Reuse the existing Supabase SSR cookie-based server client, add auth form parsing and action helpers under `apps/web/lib`, expose two auth routes for sign-up and sign-in, and make the shared shell render session-aware controls plus a sign-out form. Avoid broad route protection and keep settings page behavior unchanged except that users can now reach an authenticated session through the app.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Supabase Auth, `@supabase/ssr`, Tailwind CSS, git

---

## File map

- Create: `apps/web/lib/auth-forms.ts`
  Purpose: auth input parsing and field validation for sign-up/sign-in forms
- Create: `apps/web/lib/auth-forms.test.ts`
  Purpose: TDD coverage for email/password parsing behavior
- Create: `apps/web/lib/auth-actions.ts`
  Purpose: sign-up, sign-in, sign-out server helpers over Supabase SSR client
- Create: `apps/web/lib/auth-actions.test.ts`
  Purpose: TDD coverage for auth action result handling with mocked Supabase clients
- Create: `apps/web/components/auth-form.tsx`
  Purpose: reusable auth page form for sign-up and sign-in
- Create: `apps/web/components/auth-status.tsx`
  Purpose: shell status area for signed-in vs signed-out state and sign-out action
- Create: `apps/web/app/auth/sign-in/page.tsx`
  Purpose: sign-in route UI
- Create: `apps/web/app/auth/sign-up/page.tsx`
  Purpose: sign-up route UI
- Modify: `apps/web/components/site-shell.tsx`
  Purpose: render auth status alongside existing navigation
- Modify: `apps/web/lib/mock-data.ts`
  Purpose: add auth route cards only if navigation should expose them directly
- Modify: `README.md`
  Purpose: document Phase 5.2 auth scope
- Modify: `docs/ROADMAP.md`
  Purpose: reflect auth slice progress inside Phase 5

### Task 1: Add auth form parsing helpers

**Files:**
- Create: `apps/web/lib/auth-forms.ts`
- Create: `apps/web/lib/auth-forms.test.ts`

- [ ] **Step 1: Write the failing auth-form tests**

Create `apps/web/lib/auth-forms.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { parseEmailPasswordForm } from "./auth-forms";

describe("parseEmailPasswordForm", () => {
  it("returns trimmed email and password", () => {
    const formData = new FormData();
    formData.set("email", "  user@example.com  ");
    formData.set("password", "secret-pass");

    expect(parseEmailPasswordForm(formData)).toEqual({
      email: "user@example.com",
      password: "secret-pass",
    });
  });

  it("throws when email is missing", () => {
    const formData = new FormData();
    formData.set("password", "secret-pass");

    expect(() => parseEmailPasswordForm(formData)).toThrow("Email is required.");
  });

  it("throws when password is missing", () => {
    const formData = new FormData();
    formData.set("email", "user@example.com");

    expect(() => parseEmailPasswordForm(formData)).toThrow("Password is required.");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm --prefix apps/web test -- auth-forms.test.ts
```

Expected:
- FAIL because `./auth-forms` does not exist yet

- [ ] **Step 3: Add the auth form parser**

Create `apps/web/lib/auth-forms.ts`:

```ts
export type EmailPasswordInput = {
  email: string;
  password: string;
};

function readRequiredString(value: FormDataEntryValue | null, message: string) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    throw new Error(message);
  }

  return trimmed;
}

export function parseEmailPasswordForm(formData: FormData): EmailPasswordInput {
  return {
    email: readRequiredString(formData.get("email"), "Email is required."),
    password: readRequiredString(formData.get("password"), "Password is required."),
  };
}
```

- [ ] **Step 4: Re-run the auth-form test**

Run:

```bash
npm --prefix apps/web test -- auth-forms.test.ts
```

Expected:
- PASS

- [ ] **Step 5: Commit the auth form helpers**

```bash
git add apps/web/lib/auth-forms.ts apps/web/lib/auth-forms.test.ts
git commit -m "feat(auth): add email form parsing helpers"
```

### Task 2: Add auth action helpers

**Files:**
- Create: `apps/web/lib/auth-actions.ts`
- Create: `apps/web/lib/auth-actions.test.ts`

- [ ] **Step 1: Write the failing auth-action tests**

Create `apps/web/lib/auth-actions.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";

import {
  buildSignInResult,
  buildSignOutResult,
  buildSignUpResult,
} from "./auth-actions";

describe("buildSignUpResult", () => {
  it("reports confirmation guidance when the user exists but session does not", () => {
    expect(
      buildSignUpResult({
        data: {
          user: { id: "user-1", email: "user@example.com" },
          session: null,
        },
        error: null,
      }),
    ).toEqual({
      ok: true,
      message:
        "Account created. If email confirmation is enabled in Supabase, confirm the email before signing in.",
      redirectTo: null,
    });
  });

  it("reports sign-up failures", () => {
    expect(
      buildSignUpResult({
        data: {
          user: null,
          session: null,
        },
        error: { message: "User already registered" },
      }),
    ).toEqual({
      ok: false,
      message: "User already registered",
      redirectTo: null,
    });
  });
});

describe("buildSignInResult", () => {
  it("redirects to settings on successful sign-in", () => {
    expect(
      buildSignInResult({
        data: {
          user: { id: "user-1", email: "user@example.com" },
          session: { access_token: "token" },
        },
        error: null,
      }),
    ).toEqual({
      ok: true,
      message: "Signed in.",
      redirectTo: "/settings",
    });
  });

  it("shows auth failures without redirect", () => {
    expect(
      buildSignInResult({
        data: {
          user: null,
          session: null,
        },
        error: { message: "Invalid login credentials" },
      }),
    ).toEqual({
      ok: false,
      message: "Invalid login credentials",
      redirectTo: null,
    });
  });
});

describe("buildSignOutResult", () => {
  it("redirects home after sign-out", () => {
    expect(buildSignOutResult({ error: null })).toEqual({
      ok: true,
      redirectTo: "/",
    });
  });

  it("returns failure when sign-out errors", () => {
    expect(buildSignOutResult({ error: { message: "Sign-out failed" } })).toEqual({
      ok: false,
      redirectTo: null,
      message: "Sign-out failed",
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm --prefix apps/web test -- auth-actions.test.ts
```

Expected:
- FAIL because `./auth-actions` does not exist yet

- [ ] **Step 3: Add auth result helpers**

Create `apps/web/lib/auth-actions.ts`:

```ts
import "server-only";

type AuthResponse = {
  data: {
    user: { id: string; email?: string | null } | null;
    session: { access_token: string } | null;
  };
  error: { message: string } | null;
};

type SignOutResponse = {
  error: { message: string } | null;
};

export type AuthActionResult = {
  ok: boolean;
  message: string;
  redirectTo: string | null;
};

export function buildSignUpResult(response: AuthResponse): AuthActionResult {
  if (response.error) {
    return {
      ok: false,
      message: response.error.message,
      redirectTo: null,
    };
  }

  return {
    ok: true,
    message:
      "Account created. If email confirmation is enabled in Supabase, confirm the email before signing in.",
    redirectTo: null,
  };
}

export function buildSignInResult(response: AuthResponse): AuthActionResult {
  if (response.error) {
    return {
      ok: false,
      message: response.error.message,
      redirectTo: null,
    };
  }

  return {
    ok: true,
    message: "Signed in.",
    redirectTo: "/settings",
  };
}

export function buildSignOutResult(response: SignOutResponse) {
  if (response.error) {
    return {
      ok: false,
      redirectTo: null,
      message: response.error.message,
    };
  }

  return {
    ok: true,
    redirectTo: "/",
  };
}
```

- [ ] **Step 4: Re-run the auth-action test**

Run:

```bash
npm --prefix apps/web test -- auth-actions.test.ts
```

Expected:
- PASS

- [ ] **Step 5: Commit the auth result helpers**

```bash
git add apps/web/lib/auth-actions.ts apps/web/lib/auth-actions.test.ts
git commit -m "feat(auth): add auth action result helpers"
```

### Task 3: Wire Supabase auth actions to SSR client

**Files:**
- Modify: `apps/web/lib/auth-actions.ts`
- Modify: `apps/web/lib/supabase-server.ts`

- [ ] **Step 1: Force a type failure by importing server client helper**

Append this import to `apps/web/lib/auth-actions.ts`:

```ts
import { createSupabaseServerClient } from "./supabase-server";
```

Do not add any usage yet.

- [ ] **Step 2: Run typecheck to verify the file now needs real action wiring**

Run:

```bash
npm --prefix apps/web run lint
```

Expected:
- FAIL because `createSupabaseServerClient` is imported but unused

- [ ] **Step 3: Add the real auth server actions**

Replace `apps/web/lib/auth-actions.ts` with:

```ts
import "server-only";

import { redirect } from "next/navigation";

import { parseEmailPasswordForm } from "./auth-forms";
import { createSupabaseServerClient } from "./supabase-server";

type AuthResponse = {
  data: {
    user: { id: string; email?: string | null } | null;
    session: { access_token: string } | null;
  };
  error: { message: string } | null;
};

type SignOutResponse = {
  error: { message: string } | null;
};

export type AuthActionResult = {
  ok: boolean;
  message: string;
  redirectTo: string | null;
};

export function buildSignUpResult(response: AuthResponse): AuthActionResult {
  if (response.error) {
    return {
      ok: false,
      message: response.error.message,
      redirectTo: null,
    };
  }

  return {
    ok: true,
    message:
      "Account created. If email confirmation is enabled in Supabase, confirm the email before signing in.",
    redirectTo: null,
  };
}

export function buildSignInResult(response: AuthResponse): AuthActionResult {
  if (response.error) {
    return {
      ok: false,
      message: response.error.message,
      redirectTo: null,
    };
  }

  return {
    ok: true,
    message: "Signed in.",
    redirectTo: "/settings",
  };
}

export function buildSignOutResult(response: SignOutResponse) {
  if (response.error) {
    return {
      ok: false,
      redirectTo: null,
      message: response.error.message,
    };
  }

  return {
    ok: true,
    redirectTo: "/",
  };
}

export async function signUpWithEmailPassword(formData: FormData) {
  const credentials = parseEmailPasswordForm(formData);
  const client = await createSupabaseServerClient();
  const result = buildSignUpResult(
    await client.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    }),
  );

  return result;
}

export async function signInWithEmailPassword(formData: FormData) {
  const credentials = parseEmailPasswordForm(formData);
  const client = await createSupabaseServerClient();
  const result = buildSignInResult(
    await client.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    }),
  );

  if (result.ok && result.redirectTo) {
    redirect(result.redirectTo);
  }

  return result;
}

export async function signOutCurrentUser() {
  const client = await createSupabaseServerClient();
  const result = buildSignOutResult(await client.auth.signOut());

  if (result.ok && result.redirectTo) {
    redirect(result.redirectTo);
  }

  return result;
}
```

- [ ] **Step 4: Re-run typecheck**

Run:

```bash
npm --prefix apps/web run lint
```

Expected:
- PASS

- [ ] **Step 5: Commit the real auth actions**

```bash
git add apps/web/lib/auth-actions.ts apps/web/lib/supabase-server.ts
git commit -m "feat(auth): wire supabase auth actions"
```

### Task 4: Add auth UI routes and shared shell state

**Files:**
- Create: `apps/web/components/auth-form.tsx`
- Create: `apps/web/components/auth-status.tsx`
- Create: `apps/web/app/auth/sign-in/page.tsx`
- Create: `apps/web/app/auth/sign-up/page.tsx`
- Modify: `apps/web/components/site-shell.tsx`

- [ ] **Step 1: Trigger a type failure by importing the new UI components**

Replace the imports at the top of `apps/web/components/site-shell.tsx` with:

```ts
import Link from "next/link";
import type { ReactNode } from "react";

import { AuthStatus } from "@/components/auth-status";
import { routeCards } from "@/lib/mock-data";
```

Leave the old JSX unchanged.

- [ ] **Step 2: Run typecheck to verify it fails**

Run:

```bash
npm --prefix apps/web run lint
```

Expected:
- FAIL because `@/components/auth-status` does not exist yet

- [ ] **Step 3: Add the auth components and routes**

Create `apps/web/components/auth-form.tsx`:

```tsx
"use client";

import { useState } from "react";

import type { AuthActionResult } from "@/lib/auth-actions";

type AuthFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  helperText: string;
  action: (formData: FormData) => Promise<AuthActionResult>;
};

export function AuthForm({
  title,
  description,
  submitLabel,
  helperText,
  action,
}: AuthFormProps) {
  const [message, setMessage] = useState(helperText);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="text-sm leading-6 text-ink/70">{description}</p>
      </div>
      <form
        className="mt-6 space-y-4"
        action={async (formData) => {
          setIsSubmitting(true);
          const result = await action(formData);
          setMessage(result.message);
          setIsSubmitting(false);
        }}
      >
        <label className="space-y-2 text-sm text-ink/80">
          <span>Email</span>
          <input
            name="email"
            type="email"
            className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
          />
        </label>
        <label className="space-y-2 text-sm text-ink/80">
          <span>Password</span>
          <input
            name="password"
            type="password"
            className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
          />
        </label>
        <p className="text-sm text-ink/70">{message}</p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-ink/40"
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </button>
      </form>
    </section>
  );
}
```

Create `apps/web/components/auth-status.tsx`:

```tsx
import Link from "next/link";

import { signOutCurrentUser } from "@/lib/auth-actions";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function AuthStatus() {
  const client = await createSupabaseServerClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-wrap gap-2">
        <Link
          href="/auth/sign-in"
          className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm text-ink/80 hover:border-accent hover:text-accent"
        >
          Sign in
        </Link>
        <Link
          href="/auth/sign-up"
          className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm text-ink/80 hover:border-accent hover:text-accent"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="rounded-full border border-success/20 bg-success/10 px-3 py-2 text-sm text-success">
        Signed in{user.email ? `: ${user.email}` : ""}
      </span>
      <form action={signOutCurrentUser}>
        <button
          type="submit"
          className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm text-ink/80 hover:border-accent hover:text-accent"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
```

Create `apps/web/app/auth/sign-in/page.tsx`:

```tsx
import { AuthForm } from "@/components/auth-form";
import { signInWithEmailPassword } from "@/lib/auth-actions";

export default function SignInPage() {
  return (
    <AuthForm
      title="Sign in"
      description="Sign in with your Supabase email and password to save settings in the app."
      submitLabel="Sign in"
      helperText="Enter your existing account credentials."
      action={signInWithEmailPassword}
    />
  );
}
```

Create `apps/web/app/auth/sign-up/page.tsx`:

```tsx
import { AuthForm } from "@/components/auth-form";
import { signUpWithEmailPassword } from "@/lib/auth-actions";

export default function SignUpPage() {
  return (
    <AuthForm
      title="Create account"
      description="Create a Supabase email-and-password account for saved settings. Email confirmation may be required depending on project configuration."
      submitLabel="Create account"
      helperText="Use an email and password that meet your Supabase project rules."
      action={signUpWithEmailPassword}
    />
  );
}
```

- [ ] **Step 4: Replace the shell header to include auth state**

Replace `apps/web/components/site-shell.tsx` with:

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

import { AuthStatus } from "@/components/auth-status";
import { routeCards } from "@/lib/mock-data";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Link href="/" className="text-2xl font-semibold tracking-tight text-ink">
                AEMET A1 Trainer
              </Link>
              <p className="mt-1 max-w-3xl text-sm text-ink/70">
                PWA-first study system scaffold for the AEMET Grupo A1 opposition.
                Official data is not loaded yet.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                Foundation phase
              </div>
              <AuthStatus />
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            {routeCards.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm text-ink/80 hover:border-accent hover:text-accent"
              >
                {route.title}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 5: Re-run typecheck**

Run:

```bash
npm --prefix apps/web run lint
```

Expected:
- PASS

- [ ] **Step 6: Commit auth routes and shell status**

```bash
git add apps/web/components/auth-form.tsx apps/web/components/auth-status.tsx apps/web/app/auth/sign-in/page.tsx apps/web/app/auth/sign-up/page.tsx apps/web/components/site-shell.tsx
git commit -m "feat(auth): add email auth pages and shell status"
```

### Task 5: Update docs and verify full suite

**Files:**
- Modify: `README.md`
- Modify: `docs/ROADMAP.md`

- [ ] **Step 1: Update auth documentation**

Append to `README.md` current status:

```md
Phase 5.2 in progress: Supabase email/password auth for sign-up, sign-in, and sign-out.
```

Add to Supabase section:

```md
Current auth scope:

- email/password sign-up
- email/password sign-in
- sign-out
- no Google auth yet
- no password reset yet
```

Update `docs/ROADMAP.md` Phase 5 section:

```md
- Phase 5.2: add email/password auth for settings persistence testing
```

- [ ] **Step 2: Run focused auth tests**

Run:

```bash
npm --prefix apps/web test -- auth-forms.test.ts auth-actions.test.ts
```

Expected:
- PASS

- [ ] **Step 3: Run full verification**

Run:

```bash
npm --prefix apps/web run lint
npm --prefix apps/web test
```

Expected:
- PASS

- [ ] **Step 4: Commit docs and verification-ready auth slice**

```bash
git add README.md docs/ROADMAP.md
git commit -m "docs(auth): document phase 5.2 email auth scope"
```
