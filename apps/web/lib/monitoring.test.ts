import { describe, expect, it } from "vitest";

import type { MonitoringEvent, MonitoringSource } from "./types";
import {
  buildMonitoringSummary,
  buildSourceVerificationQueue,
  getPendingMonitoringEvents,
  getSourceAutomationBlockers,
  isMonitoringSourceActive,
  isMonitoringSourceReadyForAutomation,
  isMonitoringSourceConfigured,
} from "./monitoring";

const source: MonitoringSource = {
  id: "boe-search",
  name: "BOE search",
  url: "TODO_VERIFY_OFFICIAL_SOURCE",
  sourceType: "boe",
  keywords: ["AEMET", "Meteorólogos del Estado"],
  checkFrequency: "manual",
  lastCheckedAt: "",
  lastChangeAt: "",
  status: "manual_only",
  notes: "Official URL pending verification.",
  verificationStatus: "needs_review",
  lastVerifiedAt: "",
  verifiedBy: "",
  expectedSignals: [],
};

const events: MonitoringEvent[] = [
  {
    id: "event-older",
    sourceId: "boe-search",
    detectedAt: "2026-07-01T08:00:00.000Z",
    eventType: "generic_change",
    title: "Placeholder older event",
    url: "TODO_VERIFY_OFFICIAL_SOURCE",
    summary: "Manual review placeholder.",
    confidence: 1,
    requiresReview: true,
    resolved: false,
    verificationStatus: "needs_review",
  },
  {
    id: "event-newer",
    sourceId: "aemet-empleo",
    detectedAt: "2026-07-01T09:00:00.000Z",
    eventType: "generic_change",
    title: "Placeholder newer event",
    url: "TODO_VERIFY_OFFICIAL_SOURCE",
    summary: "Manual review placeholder.",
    confidence: 1,
    requiresReview: true,
    resolved: false,
    verificationStatus: "needs_review",
  },
  {
    id: "event-resolved",
    sourceId: "aemet-empleo",
    detectedAt: "2026-07-01T10:00:00.000Z",
    eventType: "generic_change",
    title: "Resolved placeholder event",
    url: "TODO_VERIFY_OFFICIAL_SOURCE",
    summary: "Resolved placeholder.",
    confidence: 1,
    requiresReview: false,
    resolved: true,
    verificationStatus: "needs_review",
  },
];

describe("monitoring helpers", () => {
  it("does not treat TODO source URLs as configured", () => {
    expect(isMonitoringSourceConfigured(source)).toBe(false);
  });

  it("does not treat unverified manual sources as active monitoring", () => {
    expect(
      isMonitoringSourceActive({
        ...source,
        url: "https://example.test/official-source",
      }),
    ).toBe(false);
  });

  it("counts configured and active sources separately from placeholders", () => {
    expect(
      buildMonitoringSummary(
        [
          source,
          {
            ...source,
            id: "verified-active",
            url: "https://example.test/official-source",
            status: "active",
            verificationStatus: "verified",
          },
        ],
        events,
      ),
    ).toEqual({
      totalSources: 2,
      configuredSources: 1,
      activeSources: 1,
      totalEvents: 3,
      pendingReviewEvents: 2,
      resolvedEvents: 1,
    });
  });

  it("returns unresolved review events newest first", () => {
    expect(getPendingMonitoringEvents(events).map((event) => event.id)).toEqual([
      "event-newer",
      "event-older",
    ]);
  });

  it("requires verification metadata before a source is ready for automation", () => {
    expect(
      isMonitoringSourceReadyForAutomation({
        ...source,
        url: "https://example.test/official-source",
        verificationStatus: "verified",
      }),
    ).toBe(false);
  });

  it("returns source automation blockers", () => {
    expect(getSourceAutomationBlockers(source)).toEqual([
      "source_url_unverified",
      "verification_status_not_verified",
      "last_verified_at_missing",
      "verified_by_missing",
      "expected_signals_missing",
    ]);
  });

  it("builds a verification queue with unready sources first", () => {
    expect(
      buildSourceVerificationQueue([
        {
          ...source,
          id: "ready-source",
          url: "https://example.test/official-source",
          verificationStatus: "verified",
          lastVerifiedAt: "2026-07-01",
          verifiedBy: "manual-review",
          expectedSignals: ["BOE title contains AEMET"],
        },
        source,
      ]),
    ).toEqual([
      {
        sourceId: "boe-search",
        sourceName: "BOE search",
        readyForAutomation: false,
        blockers: [
          "source_url_unverified",
          "verification_status_not_verified",
          "last_verified_at_missing",
          "verified_by_missing",
          "expected_signals_missing",
        ],
      },
      {
        sourceId: "ready-source",
        sourceName: "BOE search",
        readyForAutomation: true,
        blockers: [],
      },
    ]);
  });
});
