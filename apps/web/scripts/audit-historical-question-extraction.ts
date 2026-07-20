import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import "./load-env";

type QuestionRow = {
  id: string;
  source_year: number;
  question_number: string;
  statement: string;
  options: string[];
  source_url: string;
  verification_status: "verified" | "needs_review" | "unverified" | "deprecated";
};

type PdfSource = {
  pdfPath: string;
  pageCount: number;
  header: (questionNumber: string) => RegExp;
};

const outputPath = resolve("../../aemet-a1-historical-question-extraction-review.csv");
const pdfDirectory = "/private/tmp/aemet-a1-2014-2018";

const pdfSources: Record<number, PdfSource> = {
  2014: {
    pdfPath: `${pdfDirectory}/2014-questions.pdf`,
    pageCount: 61,
    header: (number) => new RegExp(`^\\s*${number}\\.\\s+`, "m"),
  },
  2015: {
    pdfPath: `${pdfDirectory}/2015-questions.pdf`,
    pageCount: 62,
    header: (number) => new RegExp(`Pregunta nº\\s*${number}:`, "i"),
  },
  2017: {
    pdfPath: `${pdfDirectory}/2017-questions.pdf`,
    pageCount: 28,
    header: (number) => new RegExp(`^\\s*${number.split("").join("\\s*")}\\s*\\.\\s+`, "m"),
  },
  2018: {
    pdfPath: `${pdfDirectory}/2018-questions.pdf`,
    pageCount: 34,
    header: (number) => new RegExp(`Pregunta nº\\s*${number}:`, "i"),
  },
};

function csv(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function sourcePageText(source: PdfSource, page: number): string {
  return execFileSync("pdftotext", ["-layout", "-f", String(page), "-l", String(page), source.pdfPath, "-"], {
    encoding: "utf8",
  });
}

function buildPdfPageIndex(year: number): Map<string, number> {
  if (year === 2016) {
    const pages = new Map<string, number>();
    for (let page = 0; page < 42; page += 1) {
      const text = readFileSync(`${pdfDirectory}/ocr/2016-questions/page-${page}.txt`, "utf8");
      for (const match of text.matchAll(/Pregun(?:ta|ita)[^\n:;]*?(\d{1,3})\s*[:;]/gi)) {
        let number = Number(match[1]);
        if (number > 120 && String(number).length === 3 && String(number).startsWith("2")) {
          number = Number(String(number).slice(1));
        }
        if (number >= 1 && number <= 120) pages.set(String(number), page + 1);
      }
    }
    pages.set("14", 5);
    pages.set("89", 31);
    return pages;
  }

  const source = pdfSources[year];
  if (!source) throw new Error(`No source PDF configured for ${year}`);
  const pages = new Map<string, number>();
  for (let page = 1; page <= source.pageCount; page += 1) {
    const text = sourcePageText(source, page);
    for (let number = 1; number <= 120; number += 1) {
      if (!pages.has(String(number)) && source.header(String(number)).test(text)) {
        pages.set(String(number), page);
      }
    }
  }
  return pages;
}

function flagsFor(question: QuestionRow): string[] {
  const text = [question.statement, ...question.options].join(" ");
  const flags: string[] = [];
  if (question.verification_status === "needs_review") flags.push("scanned_pdf_ocr_requires_visual_review");
  if (/Tribunal Calificador|PRIMER EJERCICIO|DILIGENCIA|_{10,}|\b\d+\s*\|\s*\d+\b/i.test(text)) {
    flags.push("pdf_page_header_or_footer_embedded");
  }
  if (/[\u0590-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/u.test(text)) {
    flags.push("unexpected_non_latin_script");
  }
  if (/\b(?:Sefiale|Sefale|funcidn|ecuacidn|distribucidn|circulacidn|hipdtesis|latitudin|trdpicos|cual|Cual)\b/i.test(text)) {
    flags.push("suspected_ocr_word_corruption");
  }
  if (question.options.length !== 4 || question.options.some((option) => !option.trim())) {
    flags.push("incomplete_multiple_choice_options");
  }
  return flags;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required");
  const client = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await client.from("questions")
    .select("id,source_year,question_number,statement,options,source_url,verification_status")
    .eq("origin", "official_historic")
    .gte("source_year", 2014)
    .lte("source_year", 2018)
    .order("source_year", { ascending: true })
    .order("question_number", { ascending: true });
  if (error) throw error;

  const pageIndexes = new Map<number, Map<string, number>>();
  const auditRows: string[][] = [];
  const flaggedQuestionIds: string[] = [];
  for (const question of (data ?? []) as QuestionRow[]) {
    const flags = flagsFor(question);
    if (flags.length === 0) continue;
    flaggedQuestionIds.push(question.id);
    let pages = pageIndexes.get(question.source_year);
    if (!pages) {
      pages = buildPdfPageIndex(question.source_year);
      pageIndexes.set(question.source_year, pages);
    }
    const page = pages.get(question.question_number) ?? "TODO_VERIFY_PDF_PAGE";
    auditRows.push([
      question.id,
      String(question.source_year),
      question.question_number,
      String(page),
      flags.join(";"),
      question.verification_status,
      question.source_url,
      "Open the source PDF at the listed page and compare statement plus all four options before updating the bank.",
    ]);
  }

  const header = ["question_id", "year", "question_number", "source_pdf_page", "issue_flags", "current_verification_status", "source_pdf_url", "review_action"];
  writeFileSync(outputPath, `${[header, ...auditRows].map((row) => row.map(csv).join(",")).join("\n")}\n`);
  console.log(`Wrote ${auditRows.length} extraction-review rows to ${outputPath}`);

  if (process.argv.includes("--mark-needs-review")) {
    for (let index = 0; index < flaggedQuestionIds.length; index += 100) {
      const ids = flaggedQuestionIds.slice(index, index + 100);
      const { error: updateError } = await client.from("questions")
        .update({ verification_status: "needs_review" })
        .in("id", ids);
      if (updateError) throw updateError;
    }
    console.log(`Marked ${flaggedQuestionIds.length} audit-flagged questions as needs_review.`);
  }
}

void main();
