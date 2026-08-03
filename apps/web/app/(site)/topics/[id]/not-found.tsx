import Link from "next/link";

export default function TopicNotFound() {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-[0.15em] text-accent">Temario</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Tema no encontrado</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
        El tema solicitado no existe en el conjunto local actual.
      </p>
      <Link
        href="/topics"
        className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
      >
        Volver al checklist
      </Link>
    </div>
  );
}
