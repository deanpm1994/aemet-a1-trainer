# Phase 5.1 Supabase Settings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add first real Supabase-backed persistence slice by saving profile, study preferences, and reminder preferences on `/settings` with auth-aware gating, explicit non-active reminder copy, and per-user RLS.

**Architecture:** Keep Phase 5.1 narrow and server-trusted. Add a single `user_settings` table plus RLS in SQL, model settings in small typed helpers under `apps/web/lib`, and use a server-side Supabase repository to load and upsert one row per authenticated user. Replace the settings placeholder page with a real client form that consumes server-provided initial state and never overstates auth or notification capabilities.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Supabase (`@supabase/supabase-js`, `@supabase/ssr`), Tailwind CSS, SQL, git

---

## File map

- Create: `apps/web/lib/user-settings.ts`
  Purpose: settings domain types, defaults, validation, row/domain mappers
- Create: `apps/web/lib/user-settings.test.ts`
  Purpose: TDD coverage for defaults and mapping rules
- Create: `apps/web/lib/supabase-config.ts`
  Purpose: validate env vars for publishable and secret key use
- Create: `apps/web/lib/supabase-config.test.ts`
  Purpose: TDD coverage for env parsing and missing-key failures
- Create: `apps/web/lib/supabase-server.ts`
  Purpose: server-only Supabase client factory and auth-aware user lookup
- Create: `apps/web/lib/user-settings-repository.ts`
  Purpose: load/upsert functions for `user_settings`
- Create: `apps/web/lib/user-settings-repository.test.ts`
  Purpose: TDD coverage for repository behavior with mocked Supabase client
- Create: `apps/web/components/settings-form.tsx`
  Purpose: client form for profile, study preferences, reminder preferences
- Modify: `apps/web/app/settings/page.tsx`
  Purpose: replace placeholder with auth-aware settings page
- Modify: `apps/web/lib/types.ts`
  Purpose: export shared settings-related types if kept in central type file
- Modify: `apps/web/package.json`
  Purpose: add Supabase dependencies
- Modify: `package-lock.json`
  Purpose: lock installed dependencies
- Create: `supabase/migrations/20260623_phase_5_1_user_settings.sql`
  Purpose: schema, timestamp trigger, and RLS policies
- Create: `apps/web/lib/user-settings-schema.test.ts`
  Purpose: guard that migration contains required table and policies
- Modify: `README.md`
  Purpose: document Phase 5.1 status and env setup
- Modify: `docs/ROADMAP.md`
  Purpose: clarify Phase 5.1 scope under Supabase persistence

### Task 1: Add settings domain model and mapping helpers

**Files:**
- Create: `apps/web/lib/user-settings.ts`
- Create: `apps/web/lib/user-settings.test.ts`
- Modify: `apps/web/lib/types.ts`

- [ ] **Step 1: Write the failing settings-domain tests**

Create `apps/web/lib/user-settings.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  buildDefaultUserSettings,
  mapRowToUserSettings,
  mapUserSettingsToRowInput,
} from "./user-settings";

describe("user settings defaults", () => {
  it("builds defaults from the candidate study rhythm", () => {
    expect(buildDefaultUserSettings()).toEqual({
      profile: {
        displayName: "",
        timezone: "Europe/Madrid",
      },
      studyPreferences: {
        studyStartTime: "07:30",
        deepWorkMinutes: 90,
        practiceMinutes: 60,
        reviewMinutes: 40,
        workdayStartTime: "12:30",
        workdayEndTime: "23:00",
      },
      reminderPreferences: {
        remindersEnabled: false,
        reminderChannel: "in_app",
        morningReminderTime: "07:20",
        eveningReminderTime: "23:20",
      },
    });
  });
});

describe("user settings row mapping", () => {
  it("maps a database row into the domain shape", () => {
    expect(
      mapRowToUserSettings({
        user_id: "user-1",
        display_name: "Dean",
        timezone: "Europe/Madrid",
        study_start_time: "08:00",
        deep_work_minutes: 75,
        practice_minutes: 55,
        review_minutes: 35,
        workday_start_time: "12:30",
        workday_end_time: "23:00",
        reminders_enabled: true,
        reminder_channel: "in_app",
        morning_reminder_time: "07:50",
        evening_reminder_time: "23:10",
        created_at: "2026-06-23T07:00:00.000Z",
        updated_at: "2026-06-23T07:30:00.000Z",
      }),
    ).toEqual({
      profile: {
        displayName: "Dean",
        timezone: "Europe/Madrid",
      },
      studyPreferences: {
        studyStartTime: "08:00",
        deepWorkMinutes: 75,
        practiceMinutes: 55,
        reviewMinutes: 35,
        workdayStartTime: "12:30",
        workdayEndTime: "23:00",
      },
      reminderPreferences: {
        remindersEnabled: true,
        reminderChannel: "in_app",
        morningReminderTime: "07:50",
        eveningReminderTime: "23:10",
      },
    });
  });

  it("falls back to defaults when row data is incomplete", () => {
    expect(
      mapRowToUserSettings({
        user_id: "user-1",
        display_name: "",
        timezone: "",
        study_start_time: "bad-time",
        deep_work_minutes: -1,
        practice_minutes: 0,
        review_minutes: 40,
        workday_start_time: "12:30",
        workday_end_time: "23:00",
        reminders_enabled: false,
        reminder_channel: "email",
        morning_reminder_time: null,
        evening_reminder_time: null,
        created_at: "2026-06-23T07:00:00.000Z",
        updated_at: "2026-06-23T07:30:00.000Z",
      }),
    ).toEqual(buildDefaultUserSettings());
  });

  it("maps the domain shape into a row input payload", () => {
    expect(
      mapUserSettingsToRowInput("user-1", {
        profile: {
          displayName: "Dean",
          timezone: "Europe/Madrid",
        },
        studyPreferences: {
          studyStartTime: "08:00",
          deepWorkMinutes: 75,
          practiceMinutes: 55,
          reviewMinutes: 35,
          workdayStartTime: "12:30",
          workdayEndTime: "23:00",
        },
        reminderPreferences: {
          remindersEnabled: true,
          reminderChannel: "in_app",
          morningReminderTime: "07:50",
          eveningReminderTime: "23:10",
        },
      }),
    ).toEqual({
      user_id: "user-1",
      display_name: "Dean",
      timezone: "Europe/Madrid",
      study_start_time: "08:00",
      deep_work_minutes: 75,
      practice_minutes: 55,
      review_minutes: 35,
      workday_start_time: "12:30",
      workday_end_time: "23:00",
      reminders_enabled: true,
      reminder_channel: "in_app",
      morning_reminder_time: "07:50",
      evening_reminder_time: "23:10",
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm --prefix apps/web test -- user-settings.test.ts
```

Expected:
- FAIL because `./user-settings` does not exist yet

- [ ] **Step 3: Add the settings domain types and helpers**

Append these exports to `apps/web/lib/types.ts`:

```ts
export type ReminderChannel = "in_app";

export type UserSettings = {
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
    reminderChannel: ReminderChannel;
    morningReminderTime: string | null;
    eveningReminderTime: string | null;
  };
};
```

Create `apps/web/lib/user-settings.ts`:

```ts
import type { ReminderChannel, UserSettings } from "./types";

export type UserSettingsRow = {
  user_id: string;
  display_name: string;
  timezone: string;
  study_start_time: string;
  deep_work_minutes: number;
  practice_minutes: number;
  review_minutes: number;
  workday_start_time: string;
  workday_end_time: string;
  reminders_enabled: boolean;
  reminder_channel: string;
  morning_reminder_time: string | null;
  evening_reminder_time: string | null;
  created_at: string;
  updated_at: string;
};

export type UserSettingsRowInput = Omit<UserSettingsRow, "created_at" | "updated_at">;

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function isTime(value: string | null): value is string {
  return typeof value === "string" && TIME_PATTERN.test(value);
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function isReminderChannel(value: string): value is ReminderChannel {
  return value === "in_app";
}

export function buildDefaultUserSettings(): UserSettings {
  return {
    profile: {
      displayName: "",
      timezone: "Europe/Madrid",
    },
    studyPreferences: {
      studyStartTime: "07:30",
      deepWorkMinutes: 90,
      practiceMinutes: 60,
      reviewMinutes: 40,
      workdayStartTime: "12:30",
      workdayEndTime: "23:00",
    },
    reminderPreferences: {
      remindersEnabled: false,
      reminderChannel: "in_app",
      morningReminderTime: "07:20",
      eveningReminderTime: "23:20",
    },
  };
}

export function mapRowToUserSettings(row: UserSettingsRow): UserSettings {
  const defaults = buildDefaultUserSettings();

  if (
    !row.timezone ||
    !isTime(row.study_start_time) ||
    !isPositiveInteger(row.deep_work_minutes) ||
    !isPositiveInteger(row.practice_minutes) ||
    !isPositiveInteger(row.review_minutes) ||
    !isTime(row.workday_start_time) ||
    !isTime(row.workday_end_time) ||
    !isReminderChannel(row.reminder_channel) ||
    (row.morning_reminder_time !== null && !isTime(row.morning_reminder_time)) ||
    (row.evening_reminder_time !== null && !isTime(row.evening_reminder_time))
  ) {
    return defaults;
  }

  return {
    profile: {
      displayName: row.display_name,
      timezone: row.timezone,
    },
    studyPreferences: {
      studyStartTime: row.study_start_time,
      deepWorkMinutes: row.deep_work_minutes,
      practiceMinutes: row.practice_minutes,
      reviewMinutes: row.review_minutes,
      workdayStartTime: row.workday_start_time,
      workdayEndTime: row.workday_end_time,
    },
    reminderPreferences: {
      remindersEnabled: row.reminders_enabled,
      reminderChannel: row.reminder_channel,
      morningReminderTime: row.morning_reminder_time,
      eveningReminderTime: row.evening_reminder_time,
    },
  };
}

export function mapUserSettingsToRowInput(
  userId: string,
  settings: UserSettings,
): UserSettingsRowInput {
  return {
    user_id: userId,
    display_name: settings.profile.displayName,
    timezone: settings.profile.timezone,
    study_start_time: settings.studyPreferences.studyStartTime,
    deep_work_minutes: settings.studyPreferences.deepWorkMinutes,
    practice_minutes: settings.studyPreferences.practiceMinutes,
    review_minutes: settings.studyPreferences.reviewMinutes,
    workday_start_time: settings.studyPreferences.workdayStartTime,
    workday_end_time: settings.studyPreferences.workdayEndTime,
    reminders_enabled: settings.reminderPreferences.remindersEnabled,
    reminder_channel: settings.reminderPreferences.reminderChannel,
    morning_reminder_time: settings.reminderPreferences.morningReminderTime,
    evening_reminder_time: settings.reminderPreferences.eveningReminderTime,
  };
}
```

- [ ] **Step 4: Re-run the settings-domain test**

Run:

```bash
npm --prefix apps/web test -- user-settings.test.ts
```

Expected:
- PASS

- [ ] **Step 5: Commit the settings domain layer**

```bash
git add apps/web/lib/types.ts apps/web/lib/user-settings.ts apps/web/lib/user-settings.test.ts
git commit -m "feat(settings): add user settings domain helpers"
```

### Task 2: Add Supabase config parsing and dependencies

**Files:**
- Modify: `apps/web/package.json`
- Modify: `package-lock.json`
- Create: `apps/web/lib/supabase-config.ts`
- Create: `apps/web/lib/supabase-config.test.ts`

- [ ] **Step 1: Add failing config tests**

Create `apps/web/lib/supabase-config.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  SupabaseConfigError,
  getSupabaseBrowserConfig,
  getSupabaseServerConfig,
} from "./supabase-config";

describe("supabase config", () => {
  it("reads browser-safe config from env", () => {
    expect(
      getSupabaseBrowserConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
      }),
    ).toEqual({
      url: "https://example.supabase.co",
      publishableKey: "sb_publishable_test",
    });
  });

  it("reads server config from env", () => {
    expect(
      getSupabaseServerConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        SUPABASE_SECRET_KEY: "sb_secret_test",
      }),
    ).toEqual({
      url: "https://example.supabase.co",
      secretKey: "sb_secret_test",
    });
  });

  it("throws when browser config is incomplete", () => {
    expect(() =>
      getSupabaseBrowserConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      }),
    ).toThrow(SupabaseConfigError);
  });

  it("throws when server config is incomplete", () => {
    expect(() =>
      getSupabaseServerConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      }),
    ).toThrow(SupabaseConfigError);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm --prefix apps/web test -- supabase-config.test.ts
```

Expected:
- FAIL because `./supabase-config` does not exist yet

- [ ] **Step 3: Install Supabase dependencies**

Run:

```bash
npm install --prefix apps/web @supabase/supabase-js @supabase/ssr
```

Expected:
- `package.json` and `package-lock.json` updated with Supabase packages

- [ ] **Step 4: Add the config helper**

Create `apps/web/lib/supabase-config.ts`:

```ts
export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

type SupabaseEnv = Record<string, string | undefined>;

function readRequiredValue(value: string | undefined, name: string): string {
  const trimmed = value?.trim();

  if (!trimmed) {
    throw new SupabaseConfigError(`Missing required Supabase env var: ${name}`);
  }

  return trimmed;
}

export function getSupabaseBrowserConfig(env: SupabaseEnv = process.env) {
  return {
    url: readRequiredValue(env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey: readRequiredValue(
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ),
  };
}

export function getSupabaseServerConfig(env: SupabaseEnv = process.env) {
  return {
    url: readRequiredValue(env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    secretKey: readRequiredValue(env.SUPABASE_SECRET_KEY, "SUPABASE_SECRET_KEY"),
  };
}
```

- [ ] **Step 5: Re-run the config test**

Run:

```bash
npm --prefix apps/web test -- supabase-config.test.ts
```

Expected:
- PASS

- [ ] **Step 6: Commit the Supabase config foundation**

```bash
git add apps/web/package.json package-lock.json apps/web/lib/supabase-config.ts apps/web/lib/supabase-config.test.ts
git commit -m "build(settings): add supabase config foundation"
```

### Task 3: Add migration and repository behavior

**Files:**
- Create: `supabase/migrations/20260623_phase_5_1_user_settings.sql`
- Create: `apps/web/lib/user-settings-schema.test.ts`
- Create: `apps/web/lib/supabase-server.ts`
- Create: `apps/web/lib/user-settings-repository.ts`
- Create: `apps/web/lib/user-settings-repository.test.ts`

- [ ] **Step 1: Write the failing schema and repository tests**

Create `apps/web/lib/user-settings-schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("user settings migration", () => {
  it("creates the table and enables RLS", () => {
    const sql = readFileSync(
      resolve(process.cwd(), "../..", "supabase/migrations/20260623_phase_5_1_user_settings.sql"),
      "utf8",
    );

    expect(sql).toContain("create table if not exists public.user_settings");
    expect(sql).toContain("alter table public.user_settings enable row level security");
    expect(sql).toContain("create policy \"user_settings_select_own\"");
    expect(sql).toContain("create policy \"user_settings_insert_own\"");
    expect(sql).toContain("create policy \"user_settings_update_own\"");
  });
});
```

Create `apps/web/lib/user-settings-repository.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";

import { buildDefaultUserSettings } from "./user-settings";
import { getUserSettings, saveUserSettings } from "./user-settings-repository";

describe("user settings repository", () => {
  it("returns defaults when no row exists", async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: null });
    const maybeSingle = vi.fn(() => ({ single }));
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));

    await expect(getUserSettings({ from } as never, "user-1")).resolves.toEqual(
      buildDefaultUserSettings(),
    );
  });

  it("upserts one row per user", async () => {
    const select = vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle: vi.fn() })) }));
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn(() => ({ select, upsert }));

    await saveUserSettings({ from } as never, "user-1", buildDefaultUserSettings());

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-1",
        timezone: "Europe/Madrid",
      }),
      { onConflict: "user_id" },
    );
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
npm --prefix apps/web test -- user-settings-schema.test.ts user-settings-repository.test.ts
```

Expected:
- FAIL because migration and repository files do not exist yet

- [ ] **Step 3: Add the SQL migration**

Create `supabase/migrations/20260623_phase_5_1_user_settings.sql`:

```sql
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  timezone text not null,
  study_start_time text not null,
  deep_work_minutes integer not null,
  practice_minutes integer not null,
  review_minutes integer not null,
  workday_start_time text not null,
  workday_end_time text not null,
  reminders_enabled boolean not null default false,
  reminder_channel text not null default 'in_app',
  morning_reminder_time text,
  evening_reminder_time text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reminder_channel_in_app_only check (reminder_channel = 'in_app')
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_settings_updated_at on public.user_settings;

create trigger set_user_settings_updated_at
before update on public.user_settings
for each row
execute function public.set_updated_at();

alter table public.user_settings enable row level security;

create policy "user_settings_select_own"
on public.user_settings
for select
to authenticated
using (auth.uid() = user_id);

create policy "user_settings_insert_own"
on public.user_settings
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "user_settings_update_own"
on public.user_settings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

- [ ] **Step 4: Add server client and repository helpers**

Create `apps/web/lib/supabase-server.ts`:

```ts
import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { getSupabaseBrowserConfig } from "./supabase-config";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const config = getSupabaseBrowserConfig();

  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookieValues) {
        cookieValues.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

export async function getAuthenticatedUserId() {
  const client = await createSupabaseServerClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  return user?.id ?? null;
}
```

Create `apps/web/lib/user-settings-repository.ts`:

```ts
import type { UserSettings } from "./types";
import {
  buildDefaultUserSettings,
  mapRowToUserSettings,
  mapUserSettingsToRowInput,
  type UserSettingsRow,
} from "./user-settings";

type UserSettingsTableClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{ data: UserSettingsRow | null; error: Error | null }>;
      };
    };
    upsert: (
      values: Record<string, unknown>,
      options: { onConflict: string },
    ) => Promise<{ error: Error | null }>;
  };
};

export async function getUserSettings(client: UserSettingsTableClient, userId: string) {
  const { data, error } = await client
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapRowToUserSettings(data) : buildDefaultUserSettings();
}

export async function saveUserSettings(
  client: UserSettingsTableClient,
  userId: string,
  settings: UserSettings,
) {
  const payload = mapUserSettingsToRowInput(userId, settings);
  const { error } = await client.from("user_settings").upsert(payload, { onConflict: "user_id" });

  if (error) {
    throw error;
  }
}
```

- [ ] **Step 5: Re-run the schema and repository tests**

Run:

```bash
npm --prefix apps/web test -- user-settings-schema.test.ts user-settings-repository.test.ts
```

Expected:
- PASS

- [ ] **Step 6: Commit the persistence foundation**

```bash
git add supabase/migrations/20260623_phase_5_1_user_settings.sql apps/web/lib/supabase-server.ts apps/web/lib/user-settings-repository.ts apps/web/lib/user-settings-repository.test.ts apps/web/lib/user-settings-schema.test.ts
git commit -m "feat(settings): add supabase persistence foundation"
```

### Task 4: Replace settings placeholder with real auth-aware page

**Files:**
- Create: `apps/web/components/settings-form.tsx`
- Modify: `apps/web/app/settings/page.tsx`

- [ ] **Step 1: Write the failing settings page expectations through type usage**

Replace `apps/web/app/settings/page.tsx` imports with:

```ts
import { PageHeader } from "@/components/page-header";
import { SettingsForm } from "@/components/settings-form";
import { createSupabaseServerClient, getAuthenticatedUserId } from "@/lib/supabase-server";
import { getUserSettings, saveUserSettings } from "@/lib/user-settings-repository";
```

Leave the old `PlaceholderPanel` JSX in place temporarily.

- [ ] **Step 2: Run typecheck to verify the page now fails**

Run:

```bash
npm --prefix apps/web run lint
```

Expected:
- FAIL because new imports and symbols do not exist in page yet

- [ ] **Step 3: Add the client form**

Create `apps/web/components/settings-form.tsx`:

```tsx
"use client";

import { useState } from "react";

import type { UserSettings } from "@/lib/types";

type SettingsFormProps = {
  initialSettings: UserSettings;
  persistenceAvailable: boolean;
  canSave: boolean;
  statusMessage: string;
  onSave: (formData: FormData) => Promise<{ ok: boolean; message: string }>;
};

export function SettingsForm({
  initialSettings,
  persistenceAvailable,
  canSave,
  statusMessage,
  onSave,
}: SettingsFormProps) {
  const [message, setMessage] = useState(statusMessage);
  const [isSaving, setIsSaving] = useState(false);

  return (
    <form
      className="space-y-8"
      action={async (formData) => {
        setIsSaving(true);
        const result = await onSave(formData);
        setMessage(result.message);
        setIsSaving(false);
      }}
    >
      <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight text-ink">Profile</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-ink/80">
            <span>Display name</span>
            <input
              name="displayName"
              defaultValue={initialSettings.profile.displayName}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Timezone</span>
            <input
              name="timezone"
              defaultValue={initialSettings.profile.timezone}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight text-ink">Study preferences</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input name="studyStartTime" defaultValue={initialSettings.studyPreferences.studyStartTime} className="rounded-2xl border border-ink/10 bg-surface px-4 py-3" />
          <input name="deepWorkMinutes" type="number" defaultValue={initialSettings.studyPreferences.deepWorkMinutes} className="rounded-2xl border border-ink/10 bg-surface px-4 py-3" />
          <input name="practiceMinutes" type="number" defaultValue={initialSettings.studyPreferences.practiceMinutes} className="rounded-2xl border border-ink/10 bg-surface px-4 py-3" />
          <input name="reviewMinutes" type="number" defaultValue={initialSettings.studyPreferences.reviewMinutes} className="rounded-2xl border border-ink/10 bg-surface px-4 py-3" />
          <input name="workdayStartTime" defaultValue={initialSettings.studyPreferences.workdayStartTime} className="rounded-2xl border border-ink/10 bg-surface px-4 py-3" />
          <input name="workdayEndTime" defaultValue={initialSettings.studyPreferences.workdayEndTime} className="rounded-2xl border border-ink/10 bg-surface px-4 py-3" />
        </div>
      </section>

      <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Reminder preferences</h2>
          <p className="text-sm leading-6 text-ink/70">
            Preferences save now. Notification delivery is not active yet.
          </p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-sm text-ink/80">
            <input
              name="remindersEnabled"
              type="checkbox"
              defaultChecked={initialSettings.reminderPreferences.remindersEnabled}
            />
            <span>Enable saved reminder preferences</span>
          </label>
          <input
            name="reminderChannel"
            defaultValue={initialSettings.reminderPreferences.reminderChannel}
            readOnly
            className="rounded-2xl border border-ink/10 bg-surface px-4 py-3"
          />
          <input
            name="morningReminderTime"
            defaultValue={initialSettings.reminderPreferences.morningReminderTime ?? ""}
            className="rounded-2xl border border-ink/10 bg-surface px-4 py-3"
          />
          <input
            name="eveningReminderTime"
            defaultValue={initialSettings.reminderPreferences.eveningReminderTime ?? ""}
            className="rounded-2xl border border-ink/10 bg-surface px-4 py-3"
          />
        </div>
      </section>

      <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <p className="text-sm text-ink/70">{message}</p>
        <button
          type="submit"
          disabled={!persistenceAvailable || !canSave || isSaving}
          className="mt-4 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-ink/40"
        >
          {isSaving ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 4: Replace the settings page with server-backed state**

Replace `apps/web/app/settings/page.tsx` with:

```tsx
import { PageHeader } from "@/components/page-header";
import { SettingsForm } from "@/components/settings-form";
import { SupabaseConfigError, getSupabaseServerConfig } from "@/lib/supabase-config";
import { createSupabaseServerClient, getAuthenticatedUserId } from "@/lib/supabase-server";
import { buildDefaultUserSettings } from "@/lib/user-settings";
import { getUserSettings, saveUserSettings } from "@/lib/user-settings-repository";

function parseNumber(value: FormDataEntryValue | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function SettingsPage() {
  let persistenceAvailable = true;
  let canSave = false;
  let statusMessage = "Sign in required before saved settings can sync to Supabase.";
  let initialSettings = buildDefaultUserSettings();

  try {
    getSupabaseServerConfig();

    const userId = await getAuthenticatedUserId();

    if (userId) {
      const client = await createSupabaseServerClient();
      initialSettings = await getUserSettings(client, userId);
      canSave = true;
      statusMessage = "Settings loaded from Supabase. Reminder delivery is still not active.";
    }
  } catch (error) {
    persistenceAvailable = false;
    statusMessage =
      error instanceof SupabaseConfigError
        ? "Supabase settings persistence unavailable until required env vars are configured."
        : "Unable to load saved settings right now.";
  }

  async function saveAction(formData: FormData) {
    "use server";

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Sign in required before saved settings can sync to Supabase.",
      };
    }

    const nextSettings = {
      profile: {
        displayName: String(formData.get("displayName") ?? ""),
        timezone: String(formData.get("timezone") ?? "Europe/Madrid"),
      },
      studyPreferences: {
        studyStartTime: String(formData.get("studyStartTime") ?? "07:30"),
        deepWorkMinutes: parseNumber(formData.get("deepWorkMinutes"), 90),
        practiceMinutes: parseNumber(formData.get("practiceMinutes"), 60),
        reviewMinutes: parseNumber(formData.get("reviewMinutes"), 40),
        workdayStartTime: String(formData.get("workdayStartTime") ?? "12:30"),
        workdayEndTime: String(formData.get("workdayEndTime") ?? "23:00"),
      },
      reminderPreferences: {
        remindersEnabled: formData.get("remindersEnabled") === "on",
        reminderChannel: "in_app" as const,
        morningReminderTime: String(formData.get("morningReminderTime") ?? "") || null,
        eveningReminderTime: String(formData.get("eveningReminderTime") ?? "") || null,
      },
    };

    try {
      const client = await createSupabaseServerClient();
      await saveUserSettings(client, userId, nextSettings);

      return {
        ok: true,
        message: "Settings saved. Notification delivery still pending future phase.",
      };
    } catch {
      return {
        ok: false,
        message: "Could not save settings. Form values remain in place for retry.",
      };
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="Saved study preferences"
        description="Profile, study defaults, and reminder preferences persist per user when a Supabase-authenticated session exists. Reminder delivery is not active yet."
      />
      <SettingsForm
        initialSettings={initialSettings}
        persistenceAvailable={persistenceAvailable}
        canSave={canSave}
        statusMessage={statusMessage}
        onSave={saveAction}
      />
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

- [ ] **Step 6: Commit the real settings page**

```bash
git add apps/web/components/settings-form.tsx apps/web/app/settings/page.tsx
git commit -m "feat(settings): add supabase-backed settings page"
```

### Task 5: Update docs and run final verification

**Files:**
- Modify: `README.md`
- Modify: `docs/ROADMAP.md`

- [ ] **Step 1: Write the docs updates**

Update `README.md` current status section:

```md
Phase 5.1 in progress: Supabase-backed user settings persistence for profile, study preferences, and reminder preferences.
```

Add env section under stack or setup:

```md
## Supabase settings persistence

Phase 5.1 expects:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

Current scope:

- saves user settings when an authenticated Supabase session exists
- does not yet provide login/signup UI
- does not yet send notifications
```

Update `docs/ROADMAP.md` under Phase 5:

```md
## Phase 5 — Supabase persistence

- Phase 5.1: persist profile, study preferences, and reminder preferences
- Add Supabase schema
- Add auth
- Store topics/questions/sessions
- Add row-level security
- Add user settings
```

- [ ] **Step 2: Run focused tests**

Run:

```bash
npm --prefix apps/web test -- user-settings.test.ts supabase-config.test.ts user-settings-schema.test.ts user-settings-repository.test.ts
```

Expected:
- PASS

- [ ] **Step 3: Run full project verification**

Run:

```bash
npm --prefix apps/web run lint
npm --prefix apps/web test
```

Expected:
- PASS for typecheck and full Vitest suite

- [ ] **Step 4: Commit docs and verification-ready state**

```bash
git add README.md docs/ROADMAP.md
git commit -m "docs(settings): document phase 5.1 persistence scope"
```
