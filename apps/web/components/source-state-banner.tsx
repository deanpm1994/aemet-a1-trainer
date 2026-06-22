import type { TopicSourceState } from "@/lib/notion-topics";

type SourceStateBannerProps = {
  sourceState: TopicSourceState;
  message: string;
};

const bannerClasses: Record<TopicSourceState, string> = {
  live: "border-emerald-200 bg-emerald-50 text-emerald-950",
  fallback_config: "border-amber-200 bg-amber-50 text-amber-950",
  fallback_error: "border-red-200 bg-red-50 text-red-900",
};

export function SourceStateBanner({
  sourceState,
  message,
}: SourceStateBannerProps) {
  return (
    <section className={`rounded-2xl border p-4 text-sm ${bannerClasses[sourceState]}`}>
      <p>{message}</p>
    </section>
  );
}
