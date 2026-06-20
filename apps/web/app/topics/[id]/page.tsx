import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { topics } from "@/lib/mock-data";

type TopicDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TopicDetailPage({ params }: TopicDetailPageProps) {
  const { id } = await params;
  const topic = topics.find((entry) => entry.id === id);

  if (!topic) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={topic.block}
        title={topic.normalizedTitle}
        description="Read-only Phase 1 topic detail. Official wording and source metadata remain explicitly marked until verified official imports exist."
      />

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
        </article>
      </section>
    </div>
  );
}
