import type { ContentReadiness } from "@/lib/content-readiness";
import { DEFAULT_LOCALE, t, type TranslationKey } from "@/lib/i18n";

type ContentReadinessCardProps = {
  readiness: ContentReadiness;
};

const cardClasses: Record<ContentReadiness["state"], string> = {
  empty: "border-rose-200 bg-rose-50 text-rose-950",
  official_verification_pending: "border-amber-200 bg-amber-50 text-amber-950",
  official_content_ready: "border-emerald-200 bg-emerald-50 text-emerald-950",
};

const titleKeys: Record<ContentReadiness["state"], TranslationKey> = {
  empty: "contentReadiness.empty.title",
  official_verification_pending: "contentReadiness.pending.title",
  official_content_ready: "contentReadiness.officialReady.title",
};

const detailKeys: Record<ContentReadiness["state"], TranslationKey> = {
  empty: "contentReadiness.empty.detail",
  official_verification_pending: "contentReadiness.pending.detail",
  official_content_ready: "contentReadiness.officialReady.detail",
};

export function ContentReadinessCard({ readiness }: ContentReadinessCardProps) {
  return (
    <section className={`rounded-3xl border p-5 shadow-sm ${cardClasses[readiness.state]}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-medium">
            {t(DEFAULT_LOCALE, "contentReadiness.label")}
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            {t(DEFAULT_LOCALE, titleKeys[readiness.state])}
          </h2>
          <p className="mt-2 text-sm leading-6 opacity-85">
            {t(DEFAULT_LOCALE, detailKeys[readiness.state])}
          </p>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-3 lg:min-w-[24rem]">
          <div>
            <dt className="opacity-70">
              {t(DEFAULT_LOCALE, "contentReadiness.stat.total")}
            </dt>
            <dd className="text-2xl font-semibold">{readiness.totalItems}</dd>
          </div>
          <div>
            <dt className="opacity-70">
              {t(DEFAULT_LOCALE, "contentReadiness.stat.verified")}
            </dt>
            <dd className="text-2xl font-semibold">{readiness.verifiedItems}</dd>
          </div>
          <div>
            <dt className="opacity-70">
              {t(DEFAULT_LOCALE, "contentReadiness.stat.pending")}
            </dt>
            <dd className="text-2xl font-semibold">{readiness.pendingOfficialItems}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
