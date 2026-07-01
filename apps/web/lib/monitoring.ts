import type {
  MonitoringEvent,
  MonitoringSource,
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
