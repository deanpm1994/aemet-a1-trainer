import Link from "next/link";

import { ContentReadinessCard } from "@/components/content-readiness-card";
import { PageHeader } from "@/components/page-header";
import { SourceStateBanner } from "@/components/source-state-banner";
import { questions as fallbackQuestions } from "@/lib/mock-data";
import { buildContentReadiness } from "@/lib/content-readiness";
import { loadTopicsSource } from "@/lib/notion-topics";
import { SupabaseConfigError, getSupabaseBrowserConfig } from "@/lib/supabase-config";
import { createSupabaseServerClient, getAuthenticatedUserId } from "@/lib/supabase-server";
import { applyTopicProgress } from "@/lib/topic-progress-persistence";
import { getTopicProgress } from "@/lib/topic-progress-repository";
import { buildBlockSummaries } from "@/lib/topic-progress";

type TopicProgressRepositoryClient = Parameters<typeof getTopicProgress>[0];

export default async function TopicsPage() {
  const { topics: sourceTopics, sourceState, message } = await loadTopicsSource();
  let topics = sourceTopics;
  let progressMessage = "Inicia sesión para guardar progreso de temas.";

  try {
    getSupabaseBrowserConfig();

    const userId = await getAuthenticatedUserId();

    if (userId) {
      const client = await createSupabaseServerClient();
      const progress = await getTopicProgress(
        client as TopicProgressRepositoryClient,
        userId,
      );
      topics = applyTopicProgress(sourceTopics, progress);
      progressMessage = "Progreso de temas cargado desde Supabase.";
    }
  } catch (error) {
    progressMessage =
      error instanceof SupabaseConfigError
        ? "El progreso de temas en Supabase no está disponible hasta configurar las variables requeridas."
        : "No se pudo cargar el progreso guardado de temas. Mostrando estado fuente.";
  }

  const blockSummaries = buildBlockSummaries(topics);
  const contentReadiness = buildContentReadiness(topics, fallbackQuestions);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Temario"
        title="Checklist de estudio"
        description="La sincronización de temas prefiere un workspace dedicado de Notion y usa datos locales si no hay sincronización. La redacción y numeración oficial BOE siguen marcadas hasta verificarse."
      />

      <SourceStateBanner sourceState={sourceState} message={message} />

      <ContentReadinessCard readiness={contentReadiness} />

      <section className="rounded-3xl border border-ink/10 bg-white p-4 shadow-sm">
        <p className="text-sm text-ink/70">{progressMessage}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {blockSummaries.map((summary) => (
          <article key={summary.block} className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
            <p className="text-sm text-ink/60">{summary.block}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {summary.touchedTopics}/{summary.totalTopics}
            </p>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              {summary.examReadyTopics} temas listos para examen en este bloque.
            </p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.id}`}
            className="block rounded-3xl border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">{topic.block}</p>
                <h2 className="text-2xl font-semibold tracking-tight text-ink">{topic.normalizedTitle}</h2>
                <p className="text-sm text-ink/70">Número oficial: {topic.officialNumber}</p>
                <p className="text-sm leading-6 text-ink/75">{topic.shortDescription}</p>
              </div>
              <dl className="grid gap-3 text-sm text-ink/80 sm:grid-cols-2 lg:min-w-[22rem]">
                <div>
                  <dt className="text-ink/50">Estado</dt>
                  <dd>{topic.status}</dd>
                </div>
                <div>
                  <dt className="text-ink/50">Confianza</dt>
                  <dd>{topic.confidence}/5</dd>
                </div>
                <div>
                  <dt className="text-ink/50">Prioridad</dt>
                  <dd>{topic.priority}</dd>
                </div>
                <div>
                  <dt className="text-ink/50">Próxima revisión</dt>
                  <dd>{topic.nextReviewAt}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-ink/50">Verificación</dt>
                  <dd>{topic.verificationStatus}</dd>
                </div>
              </dl>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
