import type { DashboardMetric } from "@/lib/types";

type MetricCardProps = {
  metric: DashboardMetric;
};

export function MetricCard({ metric }: MetricCardProps) {
  return (
    <article className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
      <p className="text-sm text-ink/60">{metric.label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">{metric.value}</p>
      <p className="mt-3 text-sm leading-6 text-ink/70">{metric.detail}</p>
    </article>
  );
}
