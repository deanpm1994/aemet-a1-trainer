import { PageHeader } from "@/components/page-header";
import { SourceStateBanner } from "@/components/source-state-banner";
import { loadBibliographySource } from "@/lib/notion-bibliography";

export default async function ResourcesPage() {
  const { items, sourceState, message } = await loadBibliographySource();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Recursos"
        title="Recursos de estudio"
        description="Esta página sincroniza bibliografía desde Notion y mantiene explícitas las limitaciones de acceso. Puede haber enlaces oficiales repetidos cuando varios libros comparten una misma referencia bibliográfica."
      />

      <SourceStateBanner sourceState={sourceState} message={message} />

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm text-slate-700">
          Un recurso listado no equivale a contenido poseído ni accesible directamente.
          Los enlaces repetidos son esperables cuando varios libros comparten la misma
          referencia bibliográfica oficial.
        </p>
      </section>

      <section className="space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">
                  {item.blocks.join(", ")}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {item.title}
                </h2>
                <p className="text-sm text-slate-700">{item.authors}</p>
                <p className="text-sm text-slate-600">
                  {item.year ?? "Año no registrado"} · {item.category}
                </p>
                <p className="text-sm leading-6 text-slate-700">{item.notes}</p>
              </div>
              <dl className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:min-w-[22rem]">
                <div>
                  <dt className="text-slate-500">Prioridad</dt>
                  <dd>{item.priority}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Tipo de fuente</dt>
                  <dd>{item.sourceType}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Verificación</dt>
                  <dd>{item.verificationStatus}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Enlace de fuente</dt>
                  <dd>
                    <a
                      className="text-accent underline underline-offset-2"
                      href={item.sourceUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Abrir referencia de fuente
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
