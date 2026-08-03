import { describe, expect, it, vi } from "vitest";

import {
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
  showBrowserStudyReminder,
  type BrowserNotificationApi,
} from "./browser-notifications";

const morningReminder = {
  slot: "morning" as const,
  href: "/dashboard" as const,
  dismissalKey: "aemet-reminder:2026-08-03:morning",
};

function buildApi(permission: NotificationPermission): BrowserNotificationApi {
  return {
    permission,
    requestPermission: vi.fn().mockResolvedValue("granted"),
    show: vi.fn(),
  };
}

describe("browser notifications", () => {
  it("reports unsupported when the browser API is absent", () => {
    expect(getBrowserNotificationPermission(null)).toBe("unsupported");
  });

  it("requests permission only while the browser state is default", async () => {
    const api = buildApi("default");

    await expect(requestBrowserNotificationPermission(api)).resolves.toBe("granted");
    expect(api.requestPermission).toHaveBeenCalledOnce();

    const grantedApi = buildApi("granted");
    await expect(requestBrowserNotificationPermission(grantedApi)).resolves.toBe("granted");
    expect(grantedApi.requestPermission).not.toHaveBeenCalled();

    const rejectedApi = buildApi("default");
    rejectedApi.requestPermission = vi.fn().mockRejectedValue(new Error("blocked"));
    await expect(requestBrowserNotificationPermission(rejectedApi)).resolves.toBe("default");
  });

  it("shows a foreground study notification only after permission is granted", () => {
    const api = buildApi("granted");

    expect(showBrowserStudyReminder(api, morningReminder)).toBe(true);
    expect(api.show).toHaveBeenCalledWith("AEMET A1 Trainer", {
      body: "Es tu hora de estudio. Abre el plan de hoy.",
      icon: "/icon.svg",
      tag: morningReminder.dismissalKey,
    });

    expect(showBrowserStudyReminder(buildApi("denied"), morningReminder)).toBe(false);

    const failingApi = buildApi("granted");
    failingApi.show = vi.fn(() => {
      throw new Error("not available");
    });
    expect(showBrowserStudyReminder(failingApi, morningReminder)).toBe(false);
  });
});
