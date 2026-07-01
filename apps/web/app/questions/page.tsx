import { PageHeader } from "@/components/page-header";
import { ContentReadinessCard } from "@/components/content-readiness-card";
import { QuestionAttemptForm } from "@/components/question-attempt-form";
import { SourceStateBanner } from "@/components/source-state-banner";
import { topics as fallbackTopics } from "@/lib/mock-data";
import { buildContentReadiness } from "@/lib/content-readiness";
import { loadQuestionsSource } from "@/lib/notion-questions";
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

export default async function QuestionsPage() {
  const { questions: sourceQuestions, sourceState, message } = await loadQuestionsSource();
  let questions = sourceQuestions;
  let canPersist = false;
  let progressMessage = "Sign in to persist question progress.";

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
      progressMessage = "Question progress loaded from Supabase.";
    }
  } catch (error) {
    progressMessage =
      error instanceof SupabaseConfigError
        ? "Supabase question progress unavailable until required env vars are configured."
        : "Unable to load saved question progress right now. Showing source question state.";
  }

  const filters = getDefaultQuestionFilters();
  const visibleQuestions = questions.filter((question) =>
    matchesQuestionFilters(question, filters),
  );
  const stats = buildQuestionStats(questions);
  const overdueQuestions = getOverdueQuestions(questions, "2026-06-22");
  const painPoints = getPracticePainPoints(questions);
  const contentReadiness = buildContentReadiness(fallbackTopics, questions);

  async function saveQuestionAttemptAction(formData: FormData) {
    "use server";

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Sign in required before question attempts can sync to Supabase.",
      };
    }

    const questionId = String(formData.get("questionId") ?? "");

    if (!questionId) {
      return {
        ok: false,
        message: "Missing question id. Refresh before retrying.",
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
        message: "Question attempt saved and review progress updated.",
      };
    } catch {
      return {
        ok: false,
        message: "Could not save question attempt. Form values remain in place.",
      };
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Questions"
        title="Question bank MVP"
        description="Phase 4 question sync prefers one dedicated Notion workspace and falls back to local question data when live sync is unavailable. Official wording and answer-source claims remain explicit through the stored verification metadata."
      />

      <SourceStateBanner sourceState={sourceState} message={message} />

      <ContentReadinessCard readiness={contentReadiness} />

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">{progressMessage}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total questions</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.total}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Visible with current filters</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {visibleQuestions.length}
          </p>
        </article>
        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm text-amber-700">Overdue review</p>
          <p className="mt-2 text-2xl font-semibold text-amber-900">
            {overdueQuestions.length}
          </p>
        </article>
        <article className="rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
          <p className="text-sm text-rose-700">Practice pain points</p>
          <p className="mt-2 text-2xl font-semibold text-rose-900">
            {painPoints.length}
          </p>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Filter baseline</h2>
        <p className="mt-2 text-sm text-slate-600">
          Phase 4 ships read-only default filters only. Interactive filter controls and
          editing stay out of scope until later phases.
        </p>
        <dl className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-4">
          <div>
            <dt className="font-medium text-slate-900">Type</dt>
            <dd>{filters.type}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Verification</dt>
            <dd>{filters.verificationStatus}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Difficulty</dt>
            <dd>{filters.difficulty}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Mistake type</dt>
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
                <span>Difficulty {question.difficulty}</span>
                <span>{question.verificationStatus}</span>
                <span>Attempts {question.attemptsCount}</span>
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
                  No options stored for this short-answer item.
                </p>
              )}
              <dl className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-900">Answer source</dt>
                  <dd>{question.answerSourceStatus}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Next review</dt>
                  <dd>{question.nextReviewAt}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Source</dt>
                  <dd>
                    {question.sourceExam} {question.sourceYear}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Mistake types</dt>
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
            <h2 className="text-lg font-semibold text-slate-900">Coverage by type</h2>
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
            <h2 className="text-lg font-semibold text-slate-900">Weak areas</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {painPoints.map((item) => (
                <li key={item.id}>
                  <p className="font-medium text-slate-900">{item.label}</p>
                  <p>Attempts: {item.attemptsCount}</p>
                  <p>Mistakes: {item.mistakeTypes.join(", ")}</p>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </section>
    </div>
  );
}
