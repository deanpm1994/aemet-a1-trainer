import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { SourceStateBanner } from "@/components/source-state-banner";
import { loadTopicsSource } from "@/lib/notion-topics";
import { buildBlockSummaries } from "@/lib/topic-progress";

export default async function TopicsPage() {
  const { topics, sourceState, message } = await loadTopicsSource();
  const blockSummaries = buildBlockSummaries(topics);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Topics"
        title="Study checklist"
        description="Phase 4 topic sync prefers one dedicated Notion workspace and falls back to local topic data when live sync is unavailable. Official BOE wording and numbering remain explicitly marked until verified."
      />

      <SourceStateBanner sourceState={sourceState} message={message} />

      <section className="grid gap-4 md:grid-cols-3">
        {blockSummaries.map((summary) => (
          <article key={summary.block} className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
            <p className="text-sm text-ink/60">{summary.block}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {summary.touchedTopics}/{summary.totalTopics}
            </p>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              {summary.examReadyTopics} exam-ready topic{summary.examReadyTopics === 1 ? "" : "s"} in this
              block.
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
                <p className="text-sm text-ink/70">Official number: {topic.officialNumber}</p>
                <p className="text-sm leading-6 text-ink/75">{topic.shortDescription}</p>
              </div>
              <dl className="grid gap-3 text-sm text-ink/80 sm:grid-cols-2 lg:min-w-[22rem]">
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
                <div className="sm:col-span-2">
                  <dt className="text-ink/50">Verification</dt>
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
