import { describe, expect, it } from "vitest";

import {
  DEFAULT_LOCALE,
  getDictionary,
  getSupportedLocale,
  routeCards,
  t,
  type Locale,
} from "./i18n";

describe("i18n", () => {
  it("defaults to Spanish", () => {
    expect(DEFAULT_LOCALE).toBe("es");
    expect(t(DEFAULT_LOCALE, "app.shell.phase")).toBe("Fase base");
  });

  it("falls back to Spanish for unsupported locales", () => {
    expect(getSupportedLocale("fr")).toBe("es");
    expect(getSupportedLocale(undefined)).toBe("es");
    expect(t("fr", "app.nav.dashboard")).toBe("Panel");
  });

  it("keeps Spanish and English dictionaries aligned", () => {
    const spanishKeys = Object.keys(getDictionary("es")).sort();
    const englishKeys = Object.keys(getDictionary("en")).sort();

    expect(englishKeys).toEqual(spanishKeys);
  });

  it("exposes translated route cards for every locale", () => {
    const locales: Locale[] = ["es", "en"];

    for (const locale of locales) {
      const cards = routeCards(locale);

      expect(cards.map((card) => card.href)).toEqual([
        "/dashboard",
        "/topics",
        "/questions",
        "/resources",
        "/calendar",
        "/focus",
        "/monitoring",
        "/settings",
      ]);
      expect(cards.every((card) => card.title.length > 0)).toBe(true);
      expect(cards.every((card) => card.description.length > 0)).toBe(true);
    }
  });
});
