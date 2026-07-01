import Link from "next/link";

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
  let persistenceMessage = "Dashboard uses local fallback data until you sign in.";

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
      persistenceMessage = "Dashboard loaded saved sessions and progress overlays.";
    }
  } catch (error) {
    persistenceMessage =
      error instanceof SupabaseConfigError
        ? "Supabase dashboard persistence unavailable until required env vars are configured."
        : "Unable to load saved dashboard progress right now. Showing source state.";
  }

  const todayDashboard = buildTodayDashboard({
    sessions,
    topics,
    questions,
    monitoringSources,
    monitoringEvents,
    today: new Date().toISOString().slice(0, 10),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Today’s study cockpit"
        description="One actionable view for the next focus session, weak topics, overdue questions, and monitoring readiness."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-medium text-amber-900">Primary action</p>
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
            Continue
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Next session</h2>
          {todayDashboard.nextSession ? (
            <dl className="mt-4 grid gap-4 text-sm text-slate-700 md:grid-cols-2">
              <div>
                <dt className="font-medium text-slate-900">Block</dt>
                <dd>{todayDashboard.nextSession.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Time</dt>
                <dd>
                  {todayDashboard.nextSession.plannedStartTime}-
                  {todayDashboard.nextSession.plannedEndTime}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-medium text-slate-900">Objective</dt>
                <dd>{todayDashboard.nextSession.objective}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Status</dt>
                <dd>{todayDashboard.nextSession.status}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Review state</dt>
                <dd>{todayDashboard.nextSession.reviewState}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              No scheduled, active, extended, or review-ready session is queued.
            </p>
          )}
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Monitoring readiness</h2>
          <dl className="mt-4 grid gap-4 text-sm text-slate-700">
            <div>
              <dt className="font-medium text-slate-900">Active checks</dt>
              <dd>{todayDashboard.monitoringSummary.activeSources}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Pending review events</dt>
              <dd>{todayDashboard.monitoringSummary.pendingReviewEvents}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-900">Configured sources</dt>
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
            <h2 className="text-xl font-semibold text-slate-900">Weak topics</h2>
            <Link className="text-sm font-medium text-accent" href="/topics">
              Open topics
            </Link>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {todayDashboard.weakTopics.map((topic) => (
              <li key={topic.id} className="rounded-2xl bg-slate-50 p-3">
                <p className="font-medium text-slate-900">{topic.label}</p>
                <p className="mt-1">
                  {topic.status}, confidence {topic.confidence}/5,{" "}
                  {topic.verificationStatus}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-900">Overdue questions</h2>
            <Link className="text-sm font-medium text-accent" href="/questions">
              Open questions
            </Link>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {todayDashboard.overdueQuestions.slice(0, 4).map((question) => (
              <li key={question.id} className="rounded-2xl bg-slate-50 p-3">
                <p className="font-medium text-slate-900">{question.name}</p>
                <p className="mt-1">
                  Due {question.nextReviewAt || "unscheduled"}, attempts{" "}
                  {question.attemptsCount}, mistakes {question.mistakeTypes.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
