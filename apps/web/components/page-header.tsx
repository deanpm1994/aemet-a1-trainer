type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
        <p className="max-w-3xl text-sm leading-6 text-ink/70 sm:text-base">{description}</p>
      </div>
    </div>
  );
}
