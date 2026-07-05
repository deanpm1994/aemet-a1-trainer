import { describe, expect, it } from "vitest";

import { buildCountdownStatus } from "./countdown";

describe("countdown status", () => {
  it("returns an explicit no-date state when no verified official date exists", () => {
    const status = buildCountdownStatus({
      officialDate: null,
      today: "2026-07-05",
    });

    expect(status).toEqual({
      label: "Cuenta atrás oficial",
      value: "Sin fecha verificada",
      detail:
        "La próxima convocatoria o fecha de examen aparecerá aquí solo cuando exista una fuente oficial verificada.",
      sourceNote: "Fuente: TODO_VERIFY_OFFICIAL_SOURCE",
      state: "no_verified_date",
    });
  });

  it("ignores unverified date records", () => {
    const status = buildCountdownStatus({
      officialDate: {
        label: "Convocatoria",
        date: "2026-09-01",
        sourceUrl: "https://www.boe.es/",
        retrievedAt: "2026-07-05",
        verificationStatus: "needs_review",
      },
      today: "2026-07-05",
    });

    expect(status.state).toBe("no_verified_date");
    expect(status.value).toBe("Sin fecha verificada");
  });

  it("shows remaining days for a verified future date", () => {
    const status = buildCountdownStatus({
      officialDate: {
        label: "Convocatoria",
        date: "2026-07-20",
        sourceUrl: "https://www.boe.es/",
        retrievedAt: "2026-07-05",
        verificationStatus: "verified",
      },
      today: "2026-07-05",
    });

    expect(status).toEqual({
      label: "Convocatoria",
      value: "15 días",
      detail: "Fecha oficial verificada: 2026-07-20.",
      sourceNote: "Fuente verificada: https://www.boe.es/ · Recuperado: 2026-07-05",
      state: "future",
    });
  });

  it("shows when a verified date is today", () => {
    const status = buildCountdownStatus({
      officialDate: {
        label: "Examen",
        date: "2026-07-05",
        sourceUrl: "https://www.boe.es/",
        retrievedAt: "2026-07-05",
        verificationStatus: "verified",
      },
      today: "2026-07-05",
    });

    expect(status.value).toBe("Hoy");
    expect(status.state).toBe("today");
  });

  it("does not present past verified dates as upcoming", () => {
    const status = buildCountdownStatus({
      officialDate: {
        label: "Plazo de solicitud",
        date: "2026-07-01",
        sourceUrl: "https://www.boe.es/",
        retrievedAt: "2026-07-05",
        verificationStatus: "verified",
      },
      today: "2026-07-05",
    });

    expect(status.value).toBe("Hace 4 días");
    expect(status.state).toBe("past");
  });
});
