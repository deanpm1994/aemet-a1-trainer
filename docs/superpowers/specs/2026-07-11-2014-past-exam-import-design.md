# 2014 Past-Exam Import Design

## Goal

Add a small verified subset from the 2014 AEMET A1 acceso libre first exercise
without treating OCR-uncertain wording as official practice content.

## Verified Sources

- Question wording: AEMET historical Acceso Libre PDF,
  `https://www.aemet.es/documentos/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/otras_convocatorias/ex_met_lib_2014.pdf`.
- Answer key: MITECO official first-exercise template,
  `https://www.miteco.gob.es/content/dam/miteco/es/ministerio/servicios/empleo-publico/plantilla%20respuestas_tcm30-92321.pdf`.
- Both documents identify Orden AAA/1183/2014, published in BOE no. 166 of
  9 July 2014; the AEMET questionnaire identifies the 18 October 2014 first
  exercise.

## Scope

- Add a source manifest with URLs, retrieval date, authoritative scope, and
  verification decision.
- Append exact checked question wording/options for questions 1, 2, 3, 5, 6,
  8, 9, and 10 to `officialPastExamSubsetSource`.
- Preserve source year, question number, official answer provenance, verified
  status, and existing stable-id mapping.
- Extend source-subset tests with count, number, wording, and answer-key
  assertions.

## Exclusions

- Questions 4 and 7 stay out of verified import: extracted formula notation is
  OCR-ambiguous and has not received visual transcription review.
- No inferred answers, topic tags, modified wording, or import of later
  exercise sections.
- No storage-model refactor. Canonical source-question storage remains a
  separate follow-up issue; user-owned progress remains in Supabase.

## Verification

- Test-first focused subset test for 2014.
- Full Vitest suite, TypeScript lint, production build, and diff check.
- Update source/readiness documentation and GitHub issue ledger only with
  verified facts.
