import "server-only";

import { buildManualCheckResult, isAllowedMonitoringUrl } from "./monitoring-check";

type Client = { from: (table: string) => any };

export async function runManualMonitoringCheck(input: {
  client: Client;
  sourceId: string;
  url: string;
  keywords: string[];
}): Promise<"baseline" | "unchanged" | "changed"> {
  if (!isAllowedMonitoringUrl(input.url)) throw new Error("Source URL is not allowlisted");

  const previous = await input.client.from("monitoring_snapshots").select("content_hash").eq("source_id", input.sourceId).order("checked_at", { ascending: false }).limit(1).maybeSingle();
  if (previous.error) throw previous.error;

  const response = await fetch(input.url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`Official source returned HTTP ${response.status}`);
  const content = (await response.text()).slice(0, 1_000_000);
  const result = await buildManualCheckResult({ url: input.url, content, previousHash: previous.data?.content_hash ?? null, keywords: input.keywords });

  const snapshot = await input.client.from("monitoring_snapshots").insert({ source_id: input.sourceId, content_hash: result.hash, keyword_hits: result.keywordHits, check_status: result.status }).select("id").single();
  if (snapshot.error) throw snapshot.error;

  if (result.status === "changed") {
    const event = await input.client.from("monitoring_events").insert({ source_id: input.sourceId, snapshot_id: snapshot.data.id, event_type: "generic_change", keyword_hits: result.keywordHits, requires_review: true, verification_status: "needs_review" });
    if (event.error) throw event.error;
  }

  return result.status;
}
