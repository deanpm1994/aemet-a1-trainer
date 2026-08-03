"use client";

import type { Question } from "@/lib/types";

type QuestionSourceReviewPanelProps = {
  question: Pick<Question, "verificationStatus" | "sourceUrl" | "sourceAssets">;
  compact?: boolean;
};

export function QuestionSourceReviewPanel({ question, compact = false }: QuestionSourceReviewPanelProps) {
  const asset = question.sourceAssets?.find((item) => item.assetType === "official_question_crop");
  const hasWarning = question.verificationStatus === "needs_review";

  if (!hasWarning && !asset) return null;

  return (
    <section className={`mt-4 rounded-2xl border p-3 text-sm ${hasWarning ? "border-amber-300 bg-amber-50 text-amber-950" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
      {hasWarning ? <p className="font-semibold">Texto extraído pendiente de revisión visual con la fuente oficial.</p> : null}
      {hasWarning && !compact ? <p className="mt-1">Puede contener errores de OCR o notación. Contrasta el enunciado y las opciones antes de usarlo como referencia.</p> : null}
      {asset ? (
        <details className={hasWarning ? "mt-2" : ""}>
          <summary className="cursor-pointer font-medium">Ver recorte de la fuente oficial · página {asset.officialPdfPage}</summary>
          {asset.signedUrl ? <img alt={asset.altText} className="mt-3 max-h-[42rem] w-full rounded-xl border border-slate-200 bg-white object-contain" src={asset.signedUrl} /> : <p className="mt-2">La imagen no está disponible en esta sesión.</p>}
          <a className="mt-3 inline-block underline" href={asset.officialPdfUrl} rel="noreferrer" target="_blank">Abrir PDF oficial</a>
        </details>
      ) : hasWarning ? <a className="mt-2 inline-block underline" href={question.sourceUrl} rel="noreferrer" target="_blank">Abrir PDF oficial para verificar</a> : null}
    </section>
  );
}
