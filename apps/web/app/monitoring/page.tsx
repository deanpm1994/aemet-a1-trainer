import { PageHeader } from "@/components/page-header";
import { monitoringEvents, monitoringSources } from "@/lib/mock-data";
import { getMonitoringEvents, getMonitoringSources } from "@/lib/monitoring-repository";
import { createSupabaseServerClient, getAuthenticatedUserId } from "@/lib/supabase-server";
import {
  buildMonitoringSummary,
  buildSourceVerificationQueue,
  getPendingMonitoringEvents,
  isMonitoringSourceActive,
  isMonitoringSourceConfigured,
} from "@/lib/monitoring";

export default async function MonitoringPage() {
  let sources = monitoringSources;
  let events = monitoringEvents;

  try {
    const userId = await getAuthenticatedUserId();
    if (userId) {
      const client = await createSupabaseServerClient();
      const [storedSources, storedEvents] = await Promise.all([
        getMonitoringSources(client as never, userId),
        getMonitoringEvents(client as never, userId),
      ]);
      if (storedSources.length > 0) sources = storedSources;
      if (storedEvents.length > 0) events = storedEvents;
    }
  } catch {
    // Manual placeholders remain available when persistence is unavailable.
  }
  const summary = buildMonitoringSummary(sources, events);
  const pendingEvents = getPendingMonitoringEvents(events);
  const verificationQueue = buildSourceVerificationQueue(sources);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Monitorización"
        title="Esqueleto de monitorización de fuentes oficiales"
        description="El seguimiento de fuentes BOE/AEMET está estructurado aquí, pero polling, scraping, alertas y detección oficial de cambios aún no están activos."
      />

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-800">
          Estado manual
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-amber-950">
          La monitorización no está activa
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-amber-900">
          Esta página define el flujo de monitorización de fuentes oficiales, pero no hay
          comprobaciones automáticas en ejecución. Las URL deben verificarse antes de hacer
          polling, comparar snapshots, detectar cambios o enviar alertas.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Fuentes configuradas</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.configuredSources}/{summary.totalSources}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Comprobaciones activas</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.activeSources}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Eventos pendientes de revisión</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.pendingReviewEvents}
          </p>
        </article>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Checklist de fuentes</h2>
          <p className="mt-2 text-sm text-slate-600">
            Estas entradas son marcadores hasta verificar y guardar las URL oficiales.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {sources.map((source) => (
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
                  <dt className="font-medium text-slate-900">Configurada</dt>
                  <dd>{isMonitoringSourceConfigured(source) ? "sí" : "no"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Activa</dt>
                  <dd>{isMonitoringSourceActive(source) ? "sí" : "no"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Verificación</dt>
                  <dd>{source.verificationStatus}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">URL</dt>
                  <dd>{source.url}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Palabras clave</dt>
                  <dd>{source.keywords.join(", ")}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Cola de verificación de fuentes
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Una fuente debe tener URL oficial verificada, metadatos de revisión y señales
            oficiales esperadas antes de considerarse lista para automatización.
          </p>
        </div>
        <div className="space-y-3">
          {verificationQueue.map((item) => (
            <article
              key={item.sourceId}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.sourceName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Lista para automatización: {item.readyForAutomation ? "sí" : "no"}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  {item.blockers.length} bloqueos
                </span>
              </div>
              {item.blockers.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2 text-xs text-slate-700">
                  {item.blockers.map((blocker) => (
                    <li
                      key={blocker}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1"
                    >
                      {blocker}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Cola de revisión</h2>
          <p className="mt-2 text-sm text-slate-600">
            Los eventos aquí son marcadores de flujo, no cambios oficiales detectados.
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
                requiere revisión
              </span>
            </div>
            <dl className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
              <div>
                <dt className="font-medium text-slate-900">Detectado en</dt>
                <dd>{event.detectedAt}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Verificación</dt>
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
