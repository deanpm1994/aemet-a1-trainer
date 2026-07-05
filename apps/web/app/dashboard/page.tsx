import Link from "next/link";

import { ContentReadinessCard } from "@/components/content-readiness-card";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import {
  buildDashboardMetrics,
  monitoringEvents,
  monitoringSources,
  questions as fallbackQuestions,
  studySessions,
  topics as fallbackTopics,
} from "@/lib/mock-data";
import { buildContentReadiness } from "@/lib/content-readiness";
import { buildTodayDashboard } from "@/lib/dashboard-today";
import { loadQuestionsSource } from "@/lib/notion-questions";
import { loadTopicsSource } from "@/lib/notion-topics";
import { applyQuestionProgress } from "@/lib/question-progress-persistence";
import { getQuestionProgress } from "@/lib/question-progress-repository";
import { SupabaseConfigError, getSupabaseBrowserConfig } from "@/lib/supabase-config";
import { createSupabaseServerClient, getAuthenticatedUserId } from "@/lib/supabase-server";
import { ensureStudySessions } from "@/lib/study-sessions-repository";
import { applyTopicProgress } from "@/lib/topic-progress-persistence";
import { getTopicProgress } from "@/lib/topic-progress-repository";

const dashboardMetrics = buildDashboardMetrics();

type StudySessionsRepositoryClient = Parameters<typeof ensureStudySessions>[0];
type TopicProgressRepositoryClient = Parameters<typeof getTopicProgress>[0];
type QuestionProgressRepositoryClient = Parameters<typeof getQuestionProgress>[0];

export default async function DashboardPage() {
  const [{ topics: sourceTopics }, { questions: sourceQuestions }] = await Promise.all([
    loadTopicsSource(),
    loadQuestionsSource(),
  ]);
  let sessions = studySessions;
  let topics = sourceTopics.length > 0 ? sourceTopics : fallbackTopics;
  let questions = sourceQuestions.length > 0 ? sourceQuestions : fallbackQuestions;
  let persistenceMessage = "El panel usa datos locales hasta iniciar sesión.";

  try {
    getSupabaseBrowserConfig();

    const userId = await getAuthenticatedUserId();

    if (userId) {
      const client = await createSupabaseServerClient();
      const [savedSessions, topicProgress, questionProgress] = await Promise.all([
        ensureStudySessions(
          client as StudySessionsRepositoryClient,
          userId,
          studySessions,
        ),
        getTopicProgress(client as TopicProgressRepositoryClient, userId),
        getQuestionProgress(client as QuestionProgressRepositoryClient, userId),
      ]);

      sessions = savedSessions;
      topics = applyTopicProgress(topics, topicProgress);
      questions = applyQuestionProgress(questions, questionProgress);
      persistenceMessage = "Panel cargado con sesiones guardadas y progreso persistido.";
    }
  } catch (error) {
    persistenceMessage =
      error instanceof SupabaseConfigError
        ? "La persistencia del panel en Supabase no está disponible hasta configurar las variables requeridas."
        : "No se pudo cargar el progreso guardado del panel. Mostrando estado fuente.";
  }

  const todayDashboard = buildTodayDashboard({
    sessions,
    topics,
    questions,
    monitoringSources,
    monitoringEvents,
    today: new Date().toISOString().slice(0, 10),
  });
  const contentReadiness = buildContentReadiness(topics, questions);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Panel"
        title="Cabina de estudio de hoy"
        description="Una vista accionable para la próxima sesión, temas débiles, preguntas vencidas y preparación de monitorización."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <ContentReadinessCard readiness={contentReadiness} />

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-medium text-amber-900">Acción principal</p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-amber-950">
              {todayDashboard.primaryAction.label}
            </h2>
            <p className="mt-2 text-sm text-amber-900">
              {todayDashboard.primaryAction.detail}
            </p>
            <p className="mt-2 text-sm text-amber-800">{persistenceMessage}</p>
          </div>
          <Link
            className="w-fit rounded-full bg-amber-900 px-5 py-3 text-sm font-medium text-white"
            href={todayDashboard.primaryAction.href}
          >
            Continuar
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Próxima sesión</h2>
          {todayDashboard.nextSession ? (
            <dl className="mt-4 grid gap-4 text-sm text-slate-700 md:grid-cols-2">
              <div>
                <dt className="font-medium text-slate-900">Bloque</dt>
                <dd>{todayDashboard.nextSession.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Hora</dt>
                <dd>
                  {todayDashboard.nextSession.plannedStartTime}-
                  {todayDashboard.nextSession.plannedEndTime}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-medium text-slate-900">Objetivo</dt>
                <dd>{todayDashboard.nextSession.objective}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Estado</dt>
                <dd>{todayDashboard.nextSession.status}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Estado de revisión</dt>
                <dd>{todayDashboard.nextSession.reviewState}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              No hay sesión programada, activa, extendida o lista para revisión en cola.
            </p>
          )}
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Preparación de monitorización</h2>
          <dl className="mt-4 grid gap-4 text-sm text-slate-700">
            <div>
              <dt className="font-medium text-slate-900">Comprobaciones activas</dt>
              <dd>{todayDashboard.monitoringSummary.activeSources}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Eventos pendientes de revisión</dt>
              <dd>{todayDashboard.monitoringSummary.pendingReviewEvents}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Fuentes configuradas</dt>
              <dd>
                {todayDashboard.monitoringSummary.configuredSources}/
                {todayDashboard.monitoringSummary.totalSources}
              </dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900">Temas débiles</h2>
            <Link className="text-sm font-medium text-accent" href="/topics">
              Abrir temario
            </Link>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {todayDashboard.weakTopics.map((topic) => (
              <li key={topic.id} className="rounded-2xl bg-slate-50 p-3">
                <p className="font-medium text-slate-900">{topic.label}</p>
                <p className="mt-1">
                  {topic.status}, confianza {topic.confidence}/5,{" "}
                  {topic.verificationStatus}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900">Preguntas vencidas</h2>
            <Link className="text-sm font-medium text-accent" href="/questions">
              Abrir preguntas
            </Link>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {todayDashboard.overdueQuestions.slice(0, 4).map((question) => (
              <li key={question.id} className="rounded-2xl bg-slate-50 p-3">
                <p className="font-medium text-slate-900">{question.name}</p>
                <p className="mt-1">
                  Vence {question.nextReviewAt || "sin programar"}, intentos{" "}
                  {question.attemptsCount}, errores {question.mistakeTypes.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
