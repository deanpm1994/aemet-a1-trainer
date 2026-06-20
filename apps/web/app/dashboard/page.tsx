import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { PlaceholderPanel } from "@/components/placeholder-panel";
import { buildDashboardMetrics, studyMission, topics } from "@/lib/mock-data";
import { selectWeakTopics } from "@/lib/topic-progress";

const dashboardMetrics = buildDashboardMetrics();
const weakTopics = selectWeakTopics(topics);

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Morning mission and progress overview"
        description="Dashboard scaffold for the candidate’s default study rhythm. Topic progress is derived from the shared read-only Phase 1 checklist, while monitoring and countdown data remain placeholders."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <PlaceholderPanel
          title="Today’s study mission"
          description="Structured daily mission based on the candidate’s fixed afternoon and evening work schedule."
          bullets={[
            studyMission.mainTopic,
            studyMission.practiceBlock,
            studyMission.reviewBlock,
            studyMission.output,
          ]}
        />
        <PlaceholderPanel
          title="Weak topics"
          description="Lowest-confidence topics from the shared mock checklist, shown here to keep review priorities visible."
          bullets={weakTopics.map(
            (topic) =>
              `${topic.label} (${topic.status}, confidence ${topic.confidence}/5, ${topic.verificationStatus})`,
          )}
        />
      </section>
    </div>
  );
}
