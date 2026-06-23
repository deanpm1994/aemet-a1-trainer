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
