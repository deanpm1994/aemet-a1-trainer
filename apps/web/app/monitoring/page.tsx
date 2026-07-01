import { PageHeader } from "@/components/page-header";
import { monitoringEvents, monitoringSources } from "@/lib/mock-data";
import {
  buildMonitoringSummary,
  getPendingMonitoringEvents,
  isMonitoringSourceActive,
  isMonitoringSourceConfigured,
} from "@/lib/monitoring";

export default function MonitoringPage() {
  const summary = buildMonitoringSummary(monitoringSources, monitoringEvents);
  const pendingEvents = getPendingMonitoringEvents(monitoringEvents);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Monitoring"
        title="Official-source monitoring skeleton"
        description="BOE/AEMET source tracking is structured here, but polling, scraping, alerts, and official change detection are not active yet."
      />

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-800">
          Manual-only status
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-amber-950">
          Monitoring is not active
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-900">
          This page defines the workflow for official-source monitoring, but no automated
          checks are running. Source URLs must be verified before the app can poll,
          compare snapshots, detect changes, or send alerts.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Sources configured</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.configuredSources}/{summary.totalSources}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Active checks</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.activeSources}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Pending review events</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.pendingReviewEvents}
          </p>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Source checklist</h2>
          <p className="mt-2 text-sm text-slate-600">
            These entries are placeholders until official URLs are verified and stored.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {monitoringSources.map((source) => (
            <article
              key={source.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {source.sourceType}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {source.name}
                  </h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  {source.status}
                </span>
              </div>
              <dl className="mt-4 space-y-3 text-sm text-slate-600">
                <div>
                  <dt className="font-medium text-slate-900">Configured</dt>
                  <dd>{isMonitoringSourceConfigured(source) ? "yes" : "no"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Active</dt>
                  <dd>{isMonitoringSourceActive(source) ? "yes" : "no"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Verification</dt>
                  <dd>{source.verificationStatus}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">URL</dt>
                  <dd>{source.url}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Keywords</dt>
                  <dd>{source.keywords.join(", ")}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Review queue</h2>
          <p className="mt-2 text-sm text-slate-600">
            Events here are workflow placeholders, not detected official changes.
          </p>
        </div>
        {pendingEvents.map((event) => (
          <article
            key={event.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {event.eventType}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {event.summary}
                </p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">
                requires review
              </span>
            </div>
            <dl className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
              <div>
                <dt className="font-medium text-slate-900">Detected at</dt>
                <dd>{event.detectedAt}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Verification</dt>
                <dd>{event.verificationStatus}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">URL</dt>
                <dd>{event.url}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}
