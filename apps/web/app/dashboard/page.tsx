import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { PlaceholderPanel } from "@/components/placeholder-panel";
import { dashboardMetrics, studyMission, topicSummaries } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Morning mission and progress overview"
        description="Dashboard scaffold for the candidate’s default study rhythm. All numbers are placeholders until topic, session, and monitoring data are implemented."
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
          description="Mock topic list to prove route structure and UI shape before Supabase or Notion are connected."
          bullets={topicSummaries.map(
            (topic) =>
              `${topic.block}: ${topic.shortTitle} (${topic.status}, confidence ${topic.confidence}/5, ${topic.verificationStatus})`,
          )}
        />
      </section>
    </div>
  );
}
