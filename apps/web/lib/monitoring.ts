import type {
  MonitoringAutomationBlocker,
  MonitoringEvent,
  MonitoringSource,
  MonitoringSourceVerificationQueueItem,
  MonitoringSummary,
} from "./types";

const unverifiedSourceMarkers = new Set(["", "TODO_VERIFY_OFFICIAL_SOURCE"]);

export function isMonitoringSourceConfigured(source: MonitoringSource): boolean {
  return (
    !unverifiedSourceMarkers.has(source.url.trim()) &&
    source.verificationStatus === "verified"
  );
}

export function isMonitoringSourceActive(source: MonitoringSource): boolean {
  return isMonitoringSourceConfigured(source) && source.status === "active";
}

export function getSourceAutomationBlockers(
  source: MonitoringSource,
): MonitoringAutomationBlocker[] {
  const blockers: MonitoringAutomationBlocker[] = [];

  if (unverifiedSourceMarkers.has(source.url.trim())) {
    blockers.push("source_url_unverified");
  }

  if (source.verificationStatus !== "verified") {
    blockers.push("verification_status_not_verified");
  }

  if (!source.lastVerifiedAt.trim()) {
    blockers.push("last_verified_at_missing");
  }

  if (!source.verifiedBy.trim()) {
    blockers.push("verified_by_missing");
  }

  if (source.expectedSignals.length === 0) {
    blockers.push("expected_signals_missing");
  }

  return blockers;
}

export function isMonitoringSourceReadyForAutomation(
  source: MonitoringSource,
): boolean {
  return getSourceAutomationBlockers(source).length === 0;
}

export function buildSourceVerificationQueue(
  sources: MonitoringSource[],
): MonitoringSourceVerificationQueueItem[] {
  return sources
    .map((source) => {
      const blockers = getSourceAutomationBlockers(source);

      return {
        sourceId: source.id,
        sourceName: source.name,
        readyForAutomation: blockers.length === 0,
        blockers,
      };
    })
    .sort((left, right) =>
      Number(left.readyForAutomation) - Number(right.readyForAutomation),
    );
}

export function buildMonitoringSummary(
  sources: MonitoringSource[],
  events: MonitoringEvent[],
): MonitoringSummary {
  return {
    totalSources: sources.length,
    configuredSources: sources.filter(isMonitoringSourceConfigured).length,
    activeSources: sources.filter(isMonitoringSourceActive).length,
    totalEvents: events.length,
    pendingReviewEvents: events.filter(
      (event) => event.requiresReview && !event.resolved,
    ).length,
    resolvedEvents: events.filter((event) => event.resolved).length,
  };
}

export function getPendingMonitoringEvents(
  events: MonitoringEvent[],
): MonitoringEvent[] {
  return [...events]
    .filter((event) => event.requiresReview && !event.resolved)
    .sort((left, right) => right.detectedAt.localeCompare(left.detectedAt));
}
