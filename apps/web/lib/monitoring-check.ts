import { createHash } from "node:crypto";

import type { VerificationStatus } from "./types";

const ALLOWED_HOSTS = new Set(["www.boe.es", "boe.es", "www.aemet.es", "aemet.es"]);

export type ManualCheckStatus = "baseline" | "unchanged" | "changed";

export type ManualCheckResult = {
  status: ManualCheckStatus;
  hash: string;
  keywordHits: string[];
  requiresReview: boolean;
  verificationStatus: VerificationStatus;
};

export function isAllowedMonitoringUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ALLOWED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export function normalizeMonitoringText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export async function buildManualCheckResult(input: {
  url: string;
  content: string;
  previousHash: string | null;
  keywords: string[];
}): Promise<ManualCheckResult> {
  if (!isAllowedMonitoringUrl(input.url)) {
    throw new Error("Monitoring URL is not an allowlisted official HTTPS source");
  }

  const content = normalizeMonitoringText(input.content);

  if (!content) {
    throw new Error("Monitoring source content is empty after normalization");
  }

  const hash = createHash("sha256").update(content).digest("hex");
  const keywordHits = input.keywords.filter((keyword) =>
    content.toLocaleLowerCase("es-ES").includes(keyword.toLocaleLowerCase("es-ES")),
  );
  const status: ManualCheckStatus = input.previousHash
    ? input.previousHash === hash
      ? "unchanged"
      : "changed"
    : "baseline";

  return {
    status,
    hash,
    keywordHits,
    requiresReview: status === "changed",
    verificationStatus: status === "changed" ? "needs_review" : "verified",
  };
}
