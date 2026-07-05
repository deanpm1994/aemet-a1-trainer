import { DEFAULT_LOCALE, t, type TranslationKey } from "@/lib/i18n";
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

const sourceStateKeys: Record<TopicSourceState, TranslationKey> = {
  live: "sourceState.live",
  fallback_config: "sourceState.fallbackConfig",
  fallback_error: "sourceState.fallbackError",
};

export function SourceStateBanner({
  sourceState,
  message,
}: SourceStateBannerProps) {
  return (
    <section className={`rounded-2xl border p-4 text-sm ${bannerClasses[sourceState]}`}>
      <p>{t(DEFAULT_LOCALE, sourceStateKeys[sourceState])}</p>
      <p className="mt-1 opacity-75">{message}</p>
    </section>
  );
}
