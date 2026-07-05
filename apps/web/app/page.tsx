import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { DEFAULT_LOCALE, routeCards } from "@/lib/i18n";

export default function HomePage() {
  const routes = routeCards(DEFAULT_LOCALE);

  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-[2rem] bg-[linear-gradient(135deg,#fbfcf8_0%,#e5efe1_55%,#d6e0d0_100%)] p-8 shadow-sm ring-1 ring-ink/10 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <PageHeader
            eyebrow="Foundation"
            title="Study operating system scaffold for the AEMET A1 opposition"
            description="This first version focuses on structure: route placeholders, project docs, mock progress signals, and strict anti-hallucination rules before any official data import or external integration."
          />
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent/90"
            >
              Open dashboard
            </Link>
            <Link
              href="/topics"
              className="rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-medium text-ink hover:border-accent hover:text-accent"
            >
              Review topic checklist
            </Link>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-white/80 bg-white/80 p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Current focus</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/80">
            <li>Morning-first study structure around the 12:30–23:00 work schedule.</li>
            <li>Mock data is intentionally marked unverified or needs review.</li>
            <li>Monitoring is manual until official-source jobs actually exist.</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5 hover:border-accent"
          >
            <h2 className="text-xl font-semibold tracking-tight text-ink">{route.title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/70">{route.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
