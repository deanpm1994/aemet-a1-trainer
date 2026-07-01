import type { ContentReadiness } from "@/lib/content-readiness";

type ContentReadinessCardProps = {
  readiness: ContentReadiness;
};

const cardClasses: Record<ContentReadiness["state"], string> = {
  empty: "border-rose-200 bg-rose-50 text-rose-950",
  official_verification_pending: "border-amber-200 bg-amber-50 text-amber-950",
  official_content_ready: "border-emerald-200 bg-emerald-50 text-emerald-950",
};

export function ContentReadinessCard({ readiness }: ContentReadinessCardProps) {
  return (
    <section className={`rounded-3xl border p-5 shadow-sm ${cardClasses[readiness.state]}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-medium">Study content readiness</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">{readiness.title}</h2>
          <p className="mt-2 text-sm leading-6 opacity-85">{readiness.detail}</p>
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-3 lg:min-w-[24rem]">
          <div>
            <dt className="opacity-70">Loaded items</dt>
            <dd className="text-2xl font-semibold">{readiness.totalItems}</dd>
          </div>
          <div>
            <dt className="opacity-70">Verified</dt>
            <dd className="text-2xl font-semibold">{readiness.verifiedItems}</dd>
          </div>
          <div>
            <dt className="opacity-70">Pending official review</dt>
            <dd className="text-2xl font-semibold">{readiness.pendingOfficialItems}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
