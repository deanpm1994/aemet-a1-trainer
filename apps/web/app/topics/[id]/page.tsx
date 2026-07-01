import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { SourceStateBanner } from "@/components/source-state-banner";
import { TopicProgressForm } from "@/components/topic-progress-form";
import { loadTopicsSource } from "@/lib/notion-topics";
import { SupabaseConfigError, getSupabaseBrowserConfig } from "@/lib/supabase-config";
import { createSupabaseServerClient, getAuthenticatedUserId } from "@/lib/supabase-server";
import { applyTopicProgress } from "@/lib/topic-progress-persistence";
import { getTopicProgress, saveTopicProgress } from "@/lib/topic-progress-repository";
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
  let progressMessage = "Sign in to persist topic progress.";

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
      progressMessage = "Topic progress loaded from Supabase.";
    }
  } catch (error) {
    progressMessage =
      error instanceof SupabaseConfigError
        ? "Supabase topic progress unavailable until required env vars are configured."
        : "Unable to load saved topic progress right now. Showing source topic state.";
  }

  const topic = topics.find((entry) => entry.id === id);

  if (!topic) {
    notFound();
  }

  async function saveTopicProgressAction(formData: FormData) {
    "use server";

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Sign in required before topic progress can sync to Supabase.",
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
        message: "Topic progress saved.",
      };
    } catch {
      return {
        ok: false,
        message: "Could not save topic progress. Form values remain in place.",
      };
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={topic.block}
        title={topic.normalizedTitle}
        description="Phase 4 topic detail uses the same Notion-first loader as the checklist and keeps fallback behavior explicit when live sync is unavailable."
      />

      <SourceStateBanner sourceState={sourceState} message={message} />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Official metadata</h2>
          <dl className="mt-4 grid gap-4 text-sm text-ink/80">
            <div>
              <dt className="text-ink/50">Official number</dt>
              <dd>{topic.officialNumber}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Official title</dt>
              <dd>{topic.officialTitle}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Source URL</dt>
              <dd>{topic.sourceUrl}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Retrieved at</dt>
              <dd>{topic.retrievedAt}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Verification</dt>
              <dd>{topic.verificationStatus}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Study state</h2>
          <dl className="mt-4 grid gap-4 text-sm text-ink/80">
            <div>
              <dt className="text-ink/50">Status</dt>
              <dd>{topic.status}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Confidence</dt>
              <dd>{topic.confidence}/5</dd>
            </div>
            <div>
              <dt className="text-ink/50">Priority</dt>
              <dd>{topic.priority}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Next review</dt>
              <dd>{topic.nextReviewAt}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Study focus</dt>
              <dd>{topic.studyFocus ?? "No study focus defined yet."}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Notes status</dt>
              <dd>{topic.notesStatus ?? "No notes status defined yet."}</dd>
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
    </div>
  );
}
