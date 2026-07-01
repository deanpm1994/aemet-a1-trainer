import { describe, expect, it } from "vitest";

import manifest from "./manifest";

describe("web app manifest", () => {
  it("describes the installable AEMET A1 Trainer app", () => {
    const result = manifest();

    expect(result.name).toBe("AEMET A1 Trainer");
    expect(result.short_name).toBe("AEMET A1");
    expect(result.start_url).toBe("/");
    expect(result.scope).toBe("/");
    expect(result.display).toBe("standalone");
    expect(result.lang).toBe("en");
    expect(result.categories).toContain("education");
  });

  it("uses project-owned icons for normal and maskable install surfaces", () => {
    const result = manifest();

    expect(result.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "/icon.svg",
          type: "image/svg+xml",
          purpose: "any",
        }),
        expect.objectContaining({
          src: "/icon.svg",
          type: "image/svg+xml",
          purpose: "maskable",
        }),
      ]),
    );
  });

  it("does not claim active reminders, active monitoring, or official status", () => {
    const result = manifest();
    const searchable = [
      result.name,
      result.short_name,
      result.description,
      ...(result.screenshots ?? []).map((screenshot) => screenshot.label ?? ""),
    ]
      .join(" ")
      .toLowerCase();

    expect(searchable).not.toContain("official");
    expect(searchable).not.toContain("active reminder");
    expect(searchable).not.toContain("push notification");
    expect(searchable).not.toContain("active monitoring");
  });
});
