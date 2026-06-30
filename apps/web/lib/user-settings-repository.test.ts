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
