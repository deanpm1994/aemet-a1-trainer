import { describe, expect, it } from "vitest";

import {
  buildManualCheckResult,
  isAllowedMonitoringUrl,
  normalizeMonitoringText,
} from "./monitoring-check";

describe("manual monitoring check", () => {
  it("accepts only HTTPS BOE and AEMET URLs", () => {
    expect(isAllowedMonitoringUrl("https://www.boe.es/buscar/")).toBe(true);
    expect(isAllowedMonitoringUrl("https://www.aemet.es/es/empleo")).toBe(true);
    expect(isAllowedMonitoringUrl("http://www.boe.es/buscar/")).toBe(false);
    expect(isAllowedMonitoringUrl("https://example.test/aemet")).toBe(false);
  });

  it("normalizes whitespace before creating a stable baseline hash", async () => {
    expect(normalizeMonitoringText(" AEMET\n\n convocatoria  ")).toBe("AEMET convocatoria");

    const result = await buildManualCheckResult({
      url: "https://www.aemet.es/es/empleo",
      content: " AEMET\n\n convocatoria  ",
      previousHash: null,
      keywords: ["convocatoria"],
    });

    expect(result.status).toBe("baseline");
    expect(result.keywordHits).toEqual(["convocatoria"]);
  });

  it("distinguishes unchanged and review-only changed snapshots", async () => {
    const baseline = await buildManualCheckResult({
      url: "https://www.boe.es/buscar/",
      content: "Cuerpo Superior de Meteorólogos del Estado",
      previousHash: null,
      keywords: ["Meteorólogos"],
    });
    const unchanged = await buildManualCheckResult({
      url: "https://www.boe.es/buscar/",
      content: "Cuerpo Superior de Meteorólogos del Estado",
      previousHash: baseline.hash,
      keywords: ["Meteorólogos"],
    });
    const changed = await buildManualCheckResult({
      url: "https://www.boe.es/buscar/",
      content: "Cuerpo Superior de Meteorólogos del Estado convocatoria",
      previousHash: baseline.hash,
      keywords: ["Meteorólogos", "convocatoria"],
    });

    expect(unchanged.status).toBe("unchanged");
    expect(changed).toMatchObject({
      status: "changed",
      requiresReview: true,
      verificationStatus: "needs_review",
      keywordHits: ["Meteorólogos", "convocatoria"],
    });
  });
});
