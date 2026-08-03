import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";

import { createClient } from "@supabase/supabase-js";

import "./load-env";

type CropArguments = {
  questionId: string;
  pdfPath: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  verificationStatus: "verified" | "needs_review";
  placement: "statement" | "option" | "diagram" | "model_answer";
  optionKey?: string;
  altText: string;
  dryRun: boolean;
};

function optionalValue(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  const result = index >= 0 ? process.argv[index + 1] : undefined;
  return !result || result.startsWith("--") ? undefined : result;
}

function value(name: string): string {
  const result = optionalValue(name);
  if (!result) throw new Error(`Missing ${name}`);
  return result;
}

function positiveInteger(name: string): number {
  const result = Number(value(name));
  if (!Number.isInteger(result) || result < 1) throw new Error(`${name} must be a positive integer`);
  return result;
}

function parseArguments(): CropArguments {
  const pdfPath = value("--pdf");
  if (!existsSync(pdfPath)) throw new Error(`PDF not found: ${pdfPath}`);
  const placement = optionalValue("--placement") ?? "statement";
  if (!["statement", "option", "diagram", "model_answer"].includes(placement)) {
    throw new Error("--placement must be statement, option, diagram or model_answer");
  }
  return {
    questionId: value("--question-id"),
    pdfPath,
    page: positiveInteger("--page"),
    x: positiveInteger("--x"),
    y: positiveInteger("--y"),
    width: positiveInteger("--width"),
    height: positiveInteger("--height"),
    verificationStatus: process.argv.includes("--needs-review") ? "needs_review" : "verified",
    placement: placement as CropArguments["placement"],
    optionKey: optionalValue("--option-key"),
    altText: optionalValue("--alt-text") ?? `Recorte del documento oficial, página ${positiveInteger("--page")}.`,
    dryRun: process.argv.includes("--dry-run"),
  };
}

function environment() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required");
  return { url, secretKey };
}

async function main() {
  const args = parseArguments();
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "aemet-question-crop-"));
  const pageBase = join(temporaryDirectory, "page");
  const pageImage = `${pageBase}-${String(args.page).padStart(2, "0")}.png`;
  const cropImage = join(temporaryDirectory, "question.png");

  try {
    try {
      execFileSync("pdftocairo", ["-f", String(args.page), "-l", String(args.page), "-png", "-r", "300", args.pdfPath, pageBase], { stdio: "ignore" });
    } catch {
      // Some local Poppler builds cannot write PNG due to a libpng mismatch.
      // ImageMagick delegates PDF rendering to Ghostscript on those machines.
      execFileSync("magick", ["-density", "300", `${args.pdfPath}[${args.page - 1}]`, pageImage]);
    }
    if (!existsSync(pageImage)) throw new Error(`Unable to render page ${args.page} from ${basename(args.pdfPath)}`);
    execFileSync("magick", [pageImage, "-crop", `${args.width}x${args.height}+${args.x}+${args.y}`, "+repage", cropImage]);
    const content = readFileSync(cropImage);
    const contentHash = createHash("sha256").update(content).digest("hex");
    const cropBox = { x: args.x, y: args.y, width: args.width, height: args.height };

    if (args.dryRun) {
      console.log(JSON.stringify({
        questionId: args.questionId,
        sourcePdfPage: args.page,
        cropBox,
        placement: args.placement,
        optionKey: args.optionKey,
        altText: args.altText,
        contentHash,
        bytes: content.length,
      }, null, 2));
      return;
    }

    const { url, secretKey } = environment();
    const client = createClient(url, secretKey, { auth: { persistSession: false } });
    const { data: question, error: questionError } = await client.from("questions").select("id,source_url,source_year,question_number").eq("id", args.questionId).single();
    if (questionError || !question) throw new Error(`Question not found: ${args.questionId}`);
    const storageBucket = "official-question-source-images";
    const storagePath = `aemet-a1/${question.source_year}/${question.question_number}/${contentHash}.png`;
    const { error: uploadError } = await client.storage.from(storageBucket).upload(storagePath, content, { contentType: "image/png", upsert: false });
    if (uploadError && !/already exists/i.test(uploadError.message)) throw uploadError;
    const retrievedAt = new Date().toISOString().slice(0, 10);
    const { error: assetError } = await client.from("question_source_assets").upsert({
      question_id: question.id,
      asset_type: "official_question_crop",
      source_label: "Recorte del enunciado oficial",
      official_pdf_url: question.source_url,
      official_pdf_page: args.page,
      crop_box: cropBox,
      storage_bucket: storageBucket,
      storage_path: storagePath,
      content_hash: contentHash,
      retrieved_at: retrievedAt,
      verification_status: args.verificationStatus,
      placement: args.placement,
      option_key: args.optionKey ?? null,
      alt_text: args.altText,
    }, { onConflict: "question_id,storage_bucket,storage_path" });
    if (assetError) throw assetError;
    console.log(`Uploaded official source crop for ${args.questionId}: ${storagePath}`);
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

void main();
