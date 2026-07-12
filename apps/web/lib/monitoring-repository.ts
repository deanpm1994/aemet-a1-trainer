import type { MonitoringEvent, MonitoringSource } from "./types";

type Client = { from: (table: string) => any };

const defaultSources = [
  { key: "aemet-a1", name: "AEMET Grupo A1 acceso libre", url: "https://www.aemet.es/es/empleo_y_becas/empleo_publico/oposiciones/grupo_a1/acceso_libre", sourceType: "aemet" },
  { key: "boe-search", name: "BOE búsqueda", url: "https://www.boe.es/buscar/", sourceType: "boe" },
];

export async function ensureMonitoringSources(client: Client, userId: string): Promise<void> {
  const { error } = await client.from("monitoring_sources").upsert(defaultSources.map((source) => ({ id: `${userId}:${source.key}`, user_id: userId, name: source.name, url: source.url, source_type: source.sourceType, keywords: ["Cuerpo Superior de Meteorólogos del Estado", "convocatoria", "plantilla"], verification_status: "verified" })), { onConflict: "id" });
  if (error) throw error;
}

export async function getMonitoringSources(client: Client, userId: string): Promise<MonitoringSource[]> {
  const { data, error } = await client.from("monitoring_sources").select("*").eq("user_id", userId).order("name");
  if (error) throw error;
  return (data ?? []).map((row: any) => ({ id: row.id, name: row.name, url: row.url, sourceType: row.source_type, keywords: row.keywords, checkFrequency: "manual", lastCheckedAt: "", lastChangeAt: "", status: "manual_only", notes: "", verificationStatus: row.verification_status, lastVerifiedAt: "", verifiedBy: "", expectedSignals: [] }));
}

export async function getMonitoringEvents(client: Client, userId: string): Promise<MonitoringEvent[]> {
  const { data, error } = await client.from("monitoring_events").select("*, monitoring_sources!inner(user_id,url)").eq("monitoring_sources.user_id", userId).order("detected_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row: any) => ({ id: row.id, sourceId: row.source_id, detectedAt: row.detected_at, eventType: row.event_type, title: "Cambio detectado: requiere revisión", url: row.monitoring_sources.url, summary: row.keyword_hits.length ? `Coincidencias: ${row.keyword_hits.join(", ")}` : "Cambio de contenido detectado.", confidence: 1, requiresReview: row.requires_review, resolved: row.resolved, verificationStatus: row.verification_status }));
}
