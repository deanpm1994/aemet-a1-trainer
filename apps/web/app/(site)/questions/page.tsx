import { PageHeader } from "@/components/page-header";
import { ContentReadinessCard } from "@/components/content-readiness-card";
import { QuestionAttemptForm } from "@/components/question-attempt-form";
import { QuestionRichText } from "@/components/question-rich-text";
import { QuestionSourceReviewPanel } from "@/components/question-source-review-panel";
import { SourceStateBanner } from "@/components/source-state-banner";
import { saveQuestionAttemptAction } from "@/app/actions/question-actions";
import { buildContentReadiness } from "@/lib/content-readiness";
import { loadTopicsSource } from "@/lib/notion-topics";
import { loadQuestionPracticeContext } from "@/lib/question-practice-context";
import {
  buildQuestionStats,
  getDefaultQuestionFilters,
  getOverdueQuestions,
  getPracticePainPoints,
  matchesQuestionFilters,
} from "@/lib/question-bank";
import { getQuestionOptions } from "@/lib/question-options";

type QuestionsPageProps = {
  searchParams: Promise<{ mode?: string; topic?: string; size?: string }>;
};

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
  const query = await searchParams;
  const [practiceContext, topicSource] = await Promise.all([
    loadQuestionPracticeContext(),
    loadTopicsSource(),
  ]);
  const { questions, questionSource, canPersist, progressMessage } = practiceContext;
  const { sourceState, message } = questionSource;
  const inventoryTotal = questionSource.inventoryQuestions.length;
  const unavailableTotal = Math.max(0, inventoryTotal - questions.length);

  const filters = getDefaultQuestionFilters();
  const visibleQuestions = questions.filter((question) =>
    matchesQuestionFilters(question, filters),
  );
  const stats = buildQuestionStats(questions);
  const today = new Date().toISOString().slice(0, 10);
  const overdueQuestions = getOverdueQuestions(questions, today);
  const painPoints = getPracticePainPoints(questions);
  const contentReadiness = buildContentReadiness(
    topicSource.topics,
    questionSource.inventoryQuestions,
  );
  const practicalQuestions = questions.filter((question) => question.type === "practical_case");
  const practicalPapers = [...new Set(practicalQuestions
    .filter((question) => question.oepYear && question.caseGroup)
    .map((question) => `${question.oepYear}:${question.caseGroup}`))];
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Preguntas"
        title="Banco de preguntas MVP"
        description="Preguntas históricas oficiales verificadas, con la procedencia del examen y la plantilla de respuestas conservadas."
      />

      <SourceStateBanner sourceState={sourceState} message={message} />

      <ContentReadinessCard readiness={contentReadiness} />

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Inventario del banco</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          «Histórica oficial» significa que la pregunta procede de un examen oficial anterior;
          no significa que esté obsoleta. Solo se publica para practicar si está verificada,
          completa y no está anulada, en cuarentena o deprecada.
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <dt className="text-sm text-slate-500">Guardadas en la base de datos</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900">{inventoryTotal}</dd>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4">
            <dt className="text-sm text-emerald-700">Disponibles para practicar</dt>
            <dd className="mt-1 text-2xl font-semibold text-emerald-950">{questions.length}</dd>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4">
            <dt className="text-sm text-amber-700">En revisión o solo auditoría</dt>
            <dd className="mt-1 text-2xl font-semibold text-amber-950">{unavailableTotal}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Nueva sesión</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {["20", "50", "survival"].map((size) => <a className="rounded-full border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-800" href={`/questions/session?mode=random&size=${size}`} key={size}>Aleatorio · {size === "survival" ? "Supervivencia" : size}</a>)}
          <a className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800" href="/topics">Por tema</a>
        </div>
        {query.topic ? <div className="mt-3 flex flex-wrap gap-3 text-sm"><span className="self-center text-slate-600">Sesión por tema:</span>{["20", "50", "survival"].map((size) => <a className="rounded-full border border-slate-300 px-3 py-1.5" href={`/questions/session?topic=${query.topic}&size=${size}`} key={size}>{size === "survival" ? "Supervivencia" : size}</a>)}</div> : null}
      </section>

      {practicalQuestions.length > 0 ? (
        <section className="rounded-3xl border border-sky-200 bg-sky-50 p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-sky-950">Supuestos prácticos</h2>
          <p className="mt-2 text-sm text-sky-900">
            Enunciados oficiales con soluciones modelo revisadas no oficiales. El borrador o la omisión explícita son obligatorios antes de revelar la solución.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {practicalPapers.map((paper) => {
              const [oep, group] = paper.split(":");
              return (
                <a
                  className="rounded-full border border-sky-400 bg-white px-4 py-2 text-sm font-medium text-sky-900"
                  href={`/questions/practical/session?oep=${oep}&paper=${group}`}
                  key={paper}
                >
                  OEP {oep} · Supuesto {group} completo
                </a>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">{progressMessage}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Disponibles para practicar</p>
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
                {question.origin === "didactic_reviewed" ? <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-950">Creada para practicar · no oficial</span> : null}
                {question.type === "practical_case" ? <span className="rounded-full bg-sky-100 px-2 py-1 text-sky-950">Enunciado oficial · modelo no oficial</span> : null}
                {question.questionRole === "reserve" ? <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-950">Reserva · {question.reserveDisposition}</span> : null}
                <span>Dificultad {question.difficulty}</span>
                <span>{question.verificationStatus}</span>
                <span>Intentos {question.attemptsCount}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{question.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700"><QuestionRichText contentFormat={question.contentFormat} text={question.statement} /></p>
              <QuestionSourceReviewPanel question={question} />
              {question.options.length > 0 ? (
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {getQuestionOptions(question).map((option) => (
                    <li key={option.key} className="flex gap-3 rounded-2xl bg-slate-50 px-3 py-2">
                      <span className="font-semibold text-slate-900">{option.key}</span>
                      <QuestionRichText contentFormat={question.contentFormat} text={option.text} />
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
              {question.type === "practical_case" ? (
                <a
                  className="mt-5 inline-flex rounded-full bg-sky-800 px-4 py-2 text-sm font-medium text-white"
                  href={`/questions/practical/session?id=${question.id}`}
                >
                  Practicar este ejercicio
                </a>
              ) : (
                <QuestionAttemptForm
                  question={question}
                  canPersist={canPersist}
                  onSave={saveQuestionAttemptAction}
                />
              )}
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
