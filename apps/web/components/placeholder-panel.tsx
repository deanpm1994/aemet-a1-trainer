type PlaceholderPanelProps = {
  title: string;
  description: string;
  bullets: string[];
};

export function PlaceholderPanel({ title, description, bullets }: PlaceholderPanelProps) {
  return (
    <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">{description}</p>
      <ul className="mt-4 space-y-2 text-sm text-ink/80">
        {bullets.map((bullet) => (
          <li key={bullet} className="rounded-2xl bg-surface px-3 py-2">
            {bullet}
          </li>
        ))}
      </ul>
    </section>
  );
}
