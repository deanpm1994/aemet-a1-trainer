import { PageHeader } from "@/components/page-header";
import { topicSummaries } from "@/lib/mock-data";

export default function TopicsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Topics"
        title="Official syllabus checklist placeholder"
        description="This page uses mock topics with explicit unverified labels. Exact BOE wording and official numbering remain TODO_VERIFY_OFFICIAL_SOURCE."
      />

      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-sm">
        <div className="grid grid-cols-[1.1fr_0.9fr_0.9fr_0.8fr_0.8fr_1fr] gap-4 border-b border-ink/10 px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-ink/60">
          <span>Block</span>
          <span>Official no.</span>
          <span>Title</span>
          <span>Status</span>
          <span>Confidence</span>
          <span>Verification</span>
        </div>
        {topicSummaries.map((topic) => (
          <div
            key={topic.id}
            className="grid grid-cols-[1.1fr_0.9fr_0.9fr_0.8fr_0.8fr_1fr] gap-4 border-b border-ink/5 px-6 py-4 text-sm text-ink/80 last:border-b-0"
          >
            <span>{topic.block}</span>
            <span>{topic.officialNumber}</span>
            <span>{topic.shortTitle}</span>
            <span>{topic.status}</span>
            <span>{topic.confidence}/5</span>
            <span>{topic.verificationStatus}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
