import { PageHeader } from "@/components/page-header";
import { ContentReadinessCard } from "@/components/content-readiness-card";
import { QuestionAttemptForm } from "@/components/question-attempt-form";
import { QuizRunner } from "@/components/quiz-runner";
import { SourceStateBanner } from "@/components/source-state-banner";
import { buildContentReadiness } from "@/lib/content-readiness";
import { buildDidacticQuestions } from "@/lib/didactic-question-bank";
import { loadQuestionsSource } from "@/lib/notion-questions";
import { loadTopicsSource } from "@/lib/notion-topics";
import { buildQuestionProgressFromAttempts } from "@/lib/question-attempts";
import {
  getQuestionAttempts,
  saveQuestionAttempt,
} from "@/lib/question-attempts-repository";
import { applyQuestionProgress } from "@/lib/question-progress-persistence";
import {
  getQuestionProgress,
  saveQuestionProgress,
} from "@/lib/question-progress-repository";
import {
  buildQuestionStats,
  getDefaultQuestionFilters,
  getOverdueQuestions,
  getPracticePainPoints,
  matchesQuestionFilters,
} from "@/lib/question-bank";
import { selectRandomQuestions, selectTopicQuestions } from "@/lib/quiz";
import { SupabaseConfigError, getSupabaseBrowserConfig } from "@/lib/supabase-config";
import { createSupabaseServerClient, getAuthenticatedUserId } from "@/lib/supabase-server";
import type { MistakeType } from "@/lib/types";

type QuestionProgressRepositoryClient = Parameters<typeof getQuestionProgress>[0];
type QuestionAttemptRepositoryClient = Parameters<typeof getQuestionAttempts>[0];

const allowedMistakeTypes: MistakeType[] = [
  "concept",
  "formula",
  "units",
  "reading",
  "legal_wording",
  "time_management",
  "none",
];

function parseMistakeTypes(values: FormDataEntryValue[]): MistakeType[] {
  const parsed = values
    .map((value) => String(value))
    .filter((value): value is MistakeType =>
      allowedMistakeTypes.includes(value as MistakeType),
    );

  if (parsed.length === 0 || parsed.includes("none")) {
    return ["none"];
  }

  return parsed;
}

function parseConfidenceAfter(value: FormDataEntryValue | null): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    return 3;
  }

  return Math.min(5, Math.max(1, parsed));
}

type QuestionsPageProps = {
  searchParams: Promise<{ mode?: string; topic?: string }>;
};

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
  const query = await searchParams;
  const [questionSource, topicSource] = await Promise.all([
    loadQuestionsSource(),
    loadTopicsSource(),
  ]);
  const sourceQuestions = [
    ...questionSource.questions,
    ...buildDidacticQuestions(topicSource.topics),
  ];
  const { sourceState, message } = questionSource;
  let questions = sourceQuestions;
  let canPersist = false;
  let progressMessage = "Inicia sesión para guardar progreso de preguntas.";

  try {
    getSupabaseBrowserConfig();

    const userId = await getAuthenticatedUserId();

    if (userId) {
      const client = await createSupabaseServerClient();
      const progress = await getQuestionProgress(
        client as QuestionProgressRepositoryClient,
        userId,
      );
      questions = applyQuestionProgress(sourceQuestions, progress);
      canPersist = true;
      progressMessage = "Progreso de preguntas cargado desde Supabase.";
    }
  } catch (error) {
    progressMessage =
      error instanceof SupabaseConfigError
        ? "El progreso de preguntas en Supabase no está disponible hasta configurar las variables requeridas."
        : "No se pudo cargar el progreso guardado de preguntas. Mostrando estado fuente.";
  }

  const filters = getDefaultQuestionFilters();
  const visibleQuestions = questions.filter((question) =>
    matchesQuestionFilters(question, filters),
  );
  const stats = buildQuestionStats(questions);
  const overdueQuestions = getOverdueQuestions(questions, "2026-06-22");
  const painPoints = getPracticePainPoints(questions);
  const contentReadiness = buildContentReadiness(topicSource.topics, questions);
  const randomSeed = Number.parseInt(new Date().toISOString().slice(0, 10).replaceAll("-", ""), 10);
  const quizQuestions = query.topic
    ? selectTopicQuestions(questions, query.topic)
    : query.mode === "random"
      ? selectRandomQuestions(questions, 10, randomSeed)
      : [];

  async function saveQuestionAttemptAction(formData: FormData) {
    "use server";

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Inicia sesión para sincronizar intentos de preguntas con Supabase.",
      };
    }

    const questionId = String(formData.get("questionId") ?? "");

    if (!questionId) {
      return {
        ok: false,
        message: "Falta el id de la pregunta. Recarga antes de reintentar.",
      };
    }

    try {
      const client = await createSupabaseServerClient();
      await saveQuestionAttempt(client as QuestionAttemptRepositoryClient, userId, {
        questionId,
        attemptedAt: String(formData.get("attemptedAt") ?? ""),
        selectedAnswer: String(formData.get("selectedAnswer") ?? ""),
        isCorrect: formData.get("isCorrect") === "true",
        mistakeTypes: parseMistakeTypes(formData.getAll("mistakeTypes")),
        confidenceAfter: parseConfidenceAfter(formData.get("confidenceAfter")),
        notes: String(formData.get("notes") ?? ""),
      });

      const attempts = await getQuestionAttempts(
        client as QuestionAttemptRepositoryClient,
        userId,
        questionId,
      );
      const progress = buildQuestionProgressFromAttempts(questionId, attempts);

      await saveQuestionProgress(
        client as QuestionProgressRepositoryClient,
        userId,
        questionId,
        progress,
      );

      return {
        ok: true,
        message: "Intento de pregunta guardado y progreso de revisión actualizado.",
      };
    } catch {
      return {
        ok: false,
        message: "No se pudo guardar el intento. Los valores quedan en el formulario.",
      };
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Preguntas"
        title="Banco de preguntas MVP"
        description="La sincronización de preguntas prefiere un workspace dedicado de Notion y usa datos locales si no hay sincronización. La redacción oficial y las fuentes de respuesta se mantienen explícitas mediante metadatos."
      />

      <SourceStateBanner sourceState={sourceState} message={message} />

      <ContentReadinessCard readiness={contentReadiness} />

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>Material didáctico no oficial.</strong> Cada tema verificado incluye una
        pregunta de alcance basada en su título oficial. Las preguntas históricas conservan
        su fuente y estado de verificación propios.
      </section>

      <section className="flex flex-wrap gap-3">
        <a className="rounded-full border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-800" href="/questions?mode=random">
          Test aleatorio
        </a>
        <a className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800" href="/topics">
          Elegir tema
        </a>
      </section>

      {quizQuestions.length > 0 ? <QuizRunner questions={quizQuestions} /> : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">{progressMessage}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Preguntas totales</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.total}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Visibles con filtros actuales</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {visibleQuestions.length}
          </p>
        </article>
        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm text-amber-700">Revisión vencida</p>
          <p className="mt-2 text-2xl font-semibold text-amber-900">
            {overdueQuestions.length}
          </p>
        </article>
        <article className="rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
          <p className="text-sm text-rose-700">Puntos débiles de práctica</p>
          <p className="mt-2 text-2xl font-semibold text-rose-900">
            {painPoints.length}
          </p>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Base de filtros</h2>
        <p className="mt-2 text-sm text-slate-600">
          Esta fase incluye filtros predeterminados de solo lectura. Controles interactivos
          y edición quedan fuera hasta fases posteriores.
        </p>
        <dl className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-4">
          <div>
            <dt className="font-medium text-slate-900">Tipo</dt>
            <dd>{filters.type}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Verificación</dt>
            <dd>{filters.verificationStatus}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Dificultad</dt>
            <dd>{filters.difficulty}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Tipo de error</dt>
            <dd>{filters.mistakeType}</dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {visibleQuestions.map((question) => (
            <article
              key={question.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                <span>{question.type}</span>
                <span>Dificultad {question.difficulty}</span>
                <span>{question.verificationStatus}</span>
                <span>Intentos {question.attemptsCount}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{question.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{question.statement}</p>
              {question.options.length > 0 ? (
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {question.options.map((option) => (
                    <li key={option} className="rounded-2xl bg-slate-50 px-3 py-2">
                      {option}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No hay opciones guardadas para esta pregunta de respuesta corta.
                </p>
              )}
              <dl className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-900">Fuente de respuesta</dt>
                  <dd>{question.answerSourceStatus}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Próxima revisión</dt>
                  <dd>{question.nextReviewAt}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Fuente</dt>
                  <dd>
                    {question.sourceExam} {question.sourceYear}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Tipos de error</dt>
                  <dd>{question.mistakeTypes.join(", ")}</dd>
                </div>
              </dl>
              <QuestionAttemptForm
                question={question}
                canPersist={canPersist}
                onSave={saveQuestionAttemptAction}
              />
            </article>
          ))}
        </div>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Cobertura por tipo</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {Object.entries(stats.byType).map(([type, count]) => (
                <li key={type} className="flex items-center justify-between">
                  <span>{type}</span>
                  <span className="font-medium text-slate-900">{count}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Áreas débiles</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {painPoints.map((item) => (
                <li key={item.id}>
                  <p className="font-medium text-slate-900">{item.label}</p>
                  <p>Intentos: {item.attemptsCount}</p>
                  <p>Errores: {item.mistakeTypes.join(", ")}</p>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </section>
    </div>
  );
}
