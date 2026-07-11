import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { SourceStateBanner } from "@/components/source-state-banner";
import { TopicProgressForm } from "@/components/topic-progress-form";
import { loadTopicsSource } from "@/lib/notion-topics";
import { SupabaseConfigError, getSupabaseBrowserConfig } from "@/lib/supabase-config";
import { createSupabaseServerClient, getAuthenticatedUserId } from "@/lib/supabase-server";
import { applyTopicProgress } from "@/lib/topic-progress-persistence";
import { getTopicProgress, saveTopicProgress } from "@/lib/topic-progress-repository";
import { getTopicStudyCard } from "@/lib/topic-study-material";
import type { Topic, TopicPriority, TopicStatus } from "@/lib/types";

type TopicDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type TopicProgressRepositoryClient = Parameters<typeof getTopicProgress>[0];

function parseTopicStatus(value: FormDataEntryValue | null): TopicStatus {
  switch (value) {
    case "not_started":
    case "in_progress":
    case "first_pass":
    case "reviewed":
    case "exam_ready":
      return value;
    default:
      return "not_started";
  }
}

function parseTopicPriority(value: FormDataEntryValue | null): TopicPriority {
  switch (value) {
    case "high":
    case "medium":
    case "low":
      return value;
    default:
      return "medium";
  }
}

function parseConfidence(value: FormDataEntryValue | null): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    return 1;
  }

  return Math.min(5, Math.max(1, parsed));
}

export default async function TopicDetailPage({ params }: TopicDetailPageProps) {
  const { id } = await params;
  const { topics: sourceTopics, sourceState, message } = await loadTopicsSource();
  let topics = sourceTopics;
  let canPersist = false;
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
      canPersist = true;
      progressMessage = "Progreso de temas cargado desde Supabase.";
    }
  } catch (error) {
    progressMessage =
      error instanceof SupabaseConfigError
        ? "El progreso de temas en Supabase no está disponible hasta configurar las variables requeridas."
        : "No se pudo cargar el progreso guardado de temas. Mostrando estado fuente.";
  }

  const topic = topics.find((entry) => entry.id === id);

  if (!topic) {
    notFound();
  }

  const studyCard = getTopicStudyCard(topic);

  async function saveTopicProgressAction(formData: FormData) {
    "use server";

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Inicia sesión para sincronizar progreso de temas con Supabase.",
      };
    }

    const update: Pick<
      Topic,
      "status" | "confidence" | "priority" | "nextReviewAt" | "notesStatus"
    > = {
      status: parseTopicStatus(formData.get("status")),
      confidence: parseConfidence(formData.get("confidence")),
      priority: parseTopicPriority(formData.get("priority")),
      nextReviewAt: String(formData.get("nextReviewAt") ?? ""),
      notesStatus: String(formData.get("notesStatus") ?? ""),
    };

    try {
      const client = await createSupabaseServerClient();
      await saveTopicProgress(
        client as TopicProgressRepositoryClient,
        userId,
        id,
        update,
      );

      return {
        ok: true,
        message: "Progreso del tema guardado.",
      };
    } catch {
      return {
        ok: false,
        message: "No se pudo guardar el progreso del tema. Los valores quedan en el formulario.",
      };
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={topic.block}
        title={topic.normalizedTitle}
        description="El detalle usa el mismo cargador Notion-first que el checklist y mantiene explícito el fallback cuando no hay sincronización."
      />

      <SourceStateBanner sourceState={sourceState} message={message} />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Metadatos oficiales</h2>
          <dl className="mt-4 grid gap-4 text-sm text-ink/80">
            <div>
              <dt className="text-ink/50">Número oficial</dt>
              <dd>{topic.officialNumber}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Título oficial</dt>
              <dd>{topic.officialTitle}</dd>
            </div>
            <div>
              <dt className="text-ink/50">URL fuente</dt>
              <dd>{topic.sourceUrl}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Recuperado el</dt>
              <dd>{topic.retrievedAt}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Verificación</dt>
              <dd>{topic.verificationStatus}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Estado de estudio</h2>
          <dl className="mt-4 grid gap-4 text-sm text-ink/80">
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
            <div>
              <dt className="text-ink/50">Foco de estudio</dt>
              <dd>{topic.studyFocus ?? "Sin foco de estudio definido aún."}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Estado de notas</dt>
              <dd>{topic.notesStatus ?? "Sin estado de notas definido aún."}</dd>
            </div>
          </dl>
          <TopicProgressForm
            topic={topic}
            canPersist={canPersist}
            statusMessage={progressMessage}
            onSave={saveTopicProgressAction}
          />
        </article>
      </section>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-medium text-amber-900">{studyCard.label}</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">Guía de estudio</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          <div>
            <h3 className="font-medium text-ink">Objetivo</h3>
            <ul className="mt-2 space-y-2 text-sm text-ink/80">
              {studyCard.objectives.map((objective) => <li key={objective}>{objective}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-ink">Checklist</h3>
            <ul className="mt-2 space-y-2 text-sm text-ink/80">
              {studyCard.checklist.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-ink">Repaso</h3>
            <ul className="mt-2 space-y-2 text-sm text-ink/80">
              {studyCard.reviewPrompts.map((prompt) => <li key={prompt}>{prompt}</li>)}
              {studyCard.richNotes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </div>
        </div>
        <a className="mt-5 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-white" href={`/questions?topic=${topic.id}`}>
          Practicar este tema
        </a>
      </section>
    </div>
  );
}
