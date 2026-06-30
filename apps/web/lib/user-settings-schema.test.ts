import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("user settings migration", () => {
  it("creates the table and enables RLS", () => {
    const sql = readFileSync(
      resolve(process.cwd(), "../..", "supabase/migrations/20260623_phase_5_1_user_settings.sql"),
      "utf8",
    );

    expect(sql).toContain("create table if not exists public.user_settings");
    expect(sql).toContain("alter table public.user_settings enable row level security");
    expect(sql).toContain('create policy "user_settings_select_own"');
    expect(sql).toContain('create policy "user_settings_insert_own"');
    expect(sql).toContain('create policy "user_settings_update_own"');
  });
});
