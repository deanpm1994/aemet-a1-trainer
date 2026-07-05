import "server-only";

import { topics as defaultFallbackTopics } from "./mock-data";
import {
  createNotionClient,
  getNotionConfig,
  NotionConfigError,
  type NotionConfig,
} from "./notion-client";
import type { Topic } from "./types";

export type TopicSourceState = "live" | "fallback_config" | "fallback_error";

export type TopicSourceResult = {
  topics: Topic[];
  sourceState: TopicSourceState;
  message: string;
};

type MinimalNotionProperty =
  | {
      type: "title";
      title: ReadonlyArray<{ plain_text: string }>;
    }
  | {
      type: "rich_text";
      rich_text: ReadonlyArray<{ plain_text: string }>;
    }
  | {
      type: "select";
      select: { name: string } | null;
    }
  | {
      type: "number";
      number: number | null;
    }
  | {
      type: "url";
      url: string | null;
    }
  | {
      type: "date";
      date: { start: string } | null;
    };

type MinimalNotionTopicPage = {
  object: string;
  properties: Record<string, MinimalNotionProperty | undefined>;
};

function isMinimalTopicPage(value: unknown): value is MinimalNotionTopicPage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<MinimalNotionTopicPage>;

  return (
    candidate.object === "page" && typeof candidate.properties === "object"
  );
}

type QueryResponse = {
  results: unknown[];
};

type NotionTopicsClient = {
  dataSources: {
    query: (args: { data_source_id: string }) => Promise<QueryResponse>;
  };
};

type LoadTopicsSourceOptions = {
  env?: Record<string, string | undefined>;
  fallbackTopics?: Topic[];
  createClient?: (config: NotionConfig) => NotionTopicsClient;
};

function getProperty(
  properties: Record<string, MinimalNotionProperty | undefined>,
  names: string[],
  label: string
): MinimalNotionProperty {
  for (const name of names) {
    const property = properties[name];

    if (property) {
      return property;
    }
  }

  throw new Error(`Missing required property: ${label}`);
}

function getPlainText(
  property: MinimalNotionProperty | undefined,
  propertyName: string
): string {
  if (!property) {
    throw new Error(`Missing required property: ${propertyName}`);
  }

  if (property.type === "title") {
    return property.title
      .map((part) => part.plain_text)
      .join("")
      .trim();
  }

  if (property.type === "rich_text") {
    return property.rich_text
      .map((part) => part.plain_text)
      .join("")
      .trim();
  }

  throw new Error(`Property ${propertyName} is not text-like`);
}

function toSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getOptionalPlainText(
  property: MinimalNotionProperty | undefined
): string | undefined {
  if (!property) {
    return undefined;
  }

  if (property.type === "title") {
    const value = property.title
      .map((part) => part.plain_text)
      .join("")
      .trim();
    return value || undefined;
  }

  if (property.type === "rich_text") {
    const value = property.rich_text
      .map((part) => part.plain_text)
      .join("")
      .trim();
    return value || undefined;
  }

  return undefined;
}

function getSelectName(
  property: MinimalNotionProperty | undefined,
  propertyName: string
): string {
  if (!property) {
    throw new Error(`Missing required property: ${propertyName}`);
  }

  if (property.type === "select" && property.select?.name) {
    return property.select.name.trim();
  }

  const textValue = getOptionalPlainText(property);

  if (textValue) {
    return textValue;
  }

  throw new Error(`Missing required select/text property: ${propertyName}`);
}

function getNumberValue(
  property: MinimalNotionProperty | undefined,
  propertyName: string
): number {
  if (!property || property.type !== "number" || property.number === null) {
    throw new Error(`Missing required number property: ${propertyName}`);
  }

  return property.number;
}

function getOptionalNumberValue(
  property: MinimalNotionProperty | undefined
): number | undefined {
  if (!property) {
    return undefined;
  }

  if (property.type === "number") {
    return property.number ?? undefined;
  }

  const textValue = getOptionalPlainText(property);

  if (!textValue) {
    return undefined;
  }

  const parsed = Number(textValue);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function getUrlValue(
  property: MinimalNotionProperty | undefined,
  propertyName: string
): string {
  if (!property || property.type !== "url" || !property.url) {
    throw new Error(`Missing required URL property: ${propertyName}`);
  }

  return property.url;
}

function getDateStart(
  property: MinimalNotionProperty | undefined,
  propertyName: string
): string {
  if (!property || property.type !== "date" || !property.date?.start) {
    throw new Error(`Missing required date property: ${propertyName}`);
  }

  return property.date.start;
}

function normalizePriority(value: string): Topic["priority"] {
  switch (value.toLowerCase()) {
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    default:
      throw new Error(`Unsupported Priority value: ${value}`);
  }
}

function normalizeStatus(value: string): Topic["status"] {
  switch (value.toLowerCase()) {
    case "not started":
      return "not_started";
    case "in progress":
      return "in_progress";
    case "first pass":
      return "first_pass";
    case "reviewed":
      return "reviewed";
    case "exam-ready":
      return "exam_ready";
    default:
      throw new Error(`Unsupported Status value: ${value}`);
  }
}

function normalizeVerificationStatus(
  value: string
): Topic["verificationStatus"] {
  switch (value.toLowerCase()) {
    case "verified":
      return "verified";
    case "unverified":
      return "unverified";
    case "needs_review":
      return "needs_review";
    case "deprecated":
      return "deprecated";
    default:
      throw new Error(`Unsupported Verification Status value: ${value}`);
  }
}

export function mapNotionTopicPage(page: MinimalNotionTopicPage): Topic {
  const idProperty = getProperty(
    page.properties,
    ["topic_id", "Topic ID", "Name"],
    "topic_id"
  );
  const blockProperty = getProperty(page.properties, ["block", "Block"], "block");
  const officialNumberProperty = getProperty(
    page.properties,
    ["official_number", "Official Number"],
    "official_number"
  );
  const officialTextProperty = getProperty(
    page.properties,
    ["official_text", "Official Text"],
    "official_text"
  );
  const shortTitleProperty = getProperty(
    page.properties,
    ["short_title", "Short Title", "Name"],
    "short_title"
  );
  const priorityProperty = getProperty(
    page.properties,
    ["priority", "Priority"],
    "priority"
  );
  const statusProperty = getProperty(
    page.properties,
    ["status", "Status"],
    "status"
  );
  const sourceUrlProperty = getProperty(
    page.properties,
    ["source_url", "Source URL"],
    "source_url"
  );
  const retrievedAtProperty = getProperty(
    page.properties,
    ["retrieved_at", "Retrieved At"],
    "retrieved_at"
  );
  const verificationStatusProperty = getProperty(
    page.properties,
    ["verification_status", "Verification Status"],
    "verification_status"
  );
  const nextReviewProperty =
    page.properties.next_review_at ?? page.properties["Next Review"];
  const rawId = getOptionalPlainText(idProperty);
  const block = getSelectName(blockProperty, "block");
  const officialNumber =
    officialNumberProperty.type === "number"
      ? String(getNumberValue(officialNumberProperty, "official_number"))
      : getPlainText(officialNumberProperty, "official_number");
  const normalizedTitle = getPlainText(shortTitleProperty, "short_title");
  const fallbackId = toSlug(`${block}-${officialNumber}-${normalizedTitle}`);

  return {
    id: rawId || fallbackId,
    block,
    officialNumber,
    officialTitle: getPlainText(officialTextProperty, "official_text"),
    normalizedTitle,
    status: normalizeStatus(getSelectName(statusProperty, "status")),
    confidence: getOptionalNumberValue(
      page.properties.confidence ?? page.properties.Confidence
    ) ?? 0,
    priority: normalizePriority(getSelectName(priorityProperty, "priority")),
    nextReviewAt:
      nextReviewProperty?.type === "date" && nextReviewProperty.date?.start
        ? getDateStart(nextReviewProperty, "next_review_at")
        : "Pending schedule",
    verificationStatus: normalizeVerificationStatus(
      getSelectName(verificationStatusProperty, "verification_status")
    ),
    sourceUrl: getUrlValue(sourceUrlProperty, "source_url"),
    retrievedAt: getDateStart(retrievedAtProperty, "retrieved_at"),
    notesStatus: getOptionalPlainText(page.properties.notes ?? page.properties.Notes),
  };
}

export async function loadTopicsSource(
  options: LoadTopicsSourceOptions = {}
): Promise<TopicSourceResult> {
  const fallbackTopics = options.fallbackTopics ?? defaultFallbackTopics;
  const env = options.env ?? process.env;

  let config: NotionConfig;

  try {
    config = getNotionConfig(env);
  } catch (error) {
    if (error instanceof NotionConfigError) {
      return {
        topics: fallbackTopics,
        sourceState: "fallback_config",
        message:
          "La sincronización de Notion no está configurada. Mostrando datos locales de temas.",
      };
    }

    throw error;
  }

  const clientFactory = options.createClient ?? createNotionClient;
  const client = clientFactory(config);

  try {
    const response = await client.dataSources.query({
      data_source_id: config.topicsDataSourceId,
    });

    const mappedTopics = response.results
      .filter(isMinimalTopicPage)
      .map((result) => mapNotionTopicPage(result));

    return {
      topics: mappedTopics,
      sourceState: "live",
      message: "Sincronización de temas con Notion activa.",
    };
  } catch {
    return {
      topics: fallbackTopics,
      sourceState: "fallback_error",
      message: "Falló la sincronización con Notion. Mostrando datos locales de temas.",
    };
  }
}
