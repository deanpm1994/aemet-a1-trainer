import "server-only";

import { bibliography as defaultFallbackBibliography } from "./mock-data";
import { createNotionClient, NotionConfigError } from "./notion-client";
import type { BibliographyItem, VerificationStatus } from "./types";

export type BibliographySourceState =
  | "live"
  | "fallback_config"
  | "fallback_error";

export type BibliographySourceResult = {
  items: BibliographyItem[];
  sourceState: BibliographySourceState;
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
      type: "number";
      number: number | null;
    }
  | {
      type: "select";
      select: { name: string } | null;
    }
  | {
      type: "multi_select";
      multi_select: ReadonlyArray<{ name: string }>;
    }
  | {
      type: "status";
      status: { name: string } | null;
    }
  | {
      type: "url";
      url: string | null;
    };

type MinimalNotionBibliographyPage = {
  object: string;
  properties: Record<string, MinimalNotionProperty | undefined>;
};

type QueryResponse = {
  results: unknown[];
};

type NotionBibliographyClient = {
  dataSources: {
    query: (args: { data_source_id: string }) => Promise<QueryResponse>;
  };
};

type LoadBibliographySourceOptions = {
  env?: Record<string, string | undefined>;
  fallbackBibliography?: BibliographyItem[];
  createClient?: (config: {
    token: string;
    bibliographyDataSourceId: string;
  }) => NotionBibliographyClient;
};

function isMinimalBibliographyPage(
  value: unknown,
): value is MinimalNotionBibliographyPage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<MinimalNotionBibliographyPage>;

  return candidate.object === "page" && typeof candidate.properties === "object";
}

function getBibliographyConfig(env: Record<string, string | undefined>) {
  const token = env.NOTION_TOKEN?.trim();
  const bibliographyDataSourceId = env.NOTION_BIBLIOGRAPHY_DATA_SOURCE_ID?.trim();

  if (!token) {
    throw new NotionConfigError("Missing required Notion env var: NOTION_TOKEN");
  }

  if (!bibliographyDataSourceId) {
    throw new NotionConfigError(
      "Missing required Notion env var: NOTION_BIBLIOGRAPHY_DATA_SOURCE_ID",
    );
  }

  return {
    token,
    bibliographyDataSourceId,
  };
}

function getProperty(
  properties: Record<string, MinimalNotionProperty | undefined>,
  names: string[],
  label: string,
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
  propertyName: string,
): string {
  if (!property) {
    throw new Error(`Missing required property: ${propertyName}`);
  }

  if (property.type === "title") {
    return property.title.map((part) => part.plain_text).join("").trim();
  }

  if (property.type === "rich_text") {
    return property.rich_text.map((part) => part.plain_text).join("").trim();
  }

  if (property.type === "select" && property.select?.name) {
    return property.select.name.trim();
  }

  if (property.type === "multi_select") {
    const value = property.multi_select
      .map((item) => item.name.trim())
      .filter(Boolean)
      .join(", ");

    if (value) {
      return value;
    }
  }

  if (property.type === "status" && property.status?.name) {
    return property.status.name.trim();
  }

  throw new Error(`Property ${propertyName} is not text-like`);
}

function getOptionalPlainText(
  property: MinimalNotionProperty | undefined,
): string | undefined {
  if (!property) {
    return undefined;
  }

  if (property.type === "title") {
    const value = property.title.map((part) => part.plain_text).join("").trim();
    return value || undefined;
  }

  if (property.type === "rich_text") {
    const value = property.rich_text.map((part) => part.plain_text).join("").trim();
    return value || undefined;
  }

  if (property.type === "select") {
    return property.select?.name?.trim() || undefined;
  }

  if (property.type === "multi_select") {
    const value = property.multi_select
      .map((item) => item.name.trim())
      .filter(Boolean)
      .join(", ");

    return value || undefined;
  }

  if (property.type === "status") {
    return property.status?.name?.trim() || undefined;
  }

  return undefined;
}

function getStringList(
  property: MinimalNotionProperty | undefined,
  propertyName: string,
): string[] {
  if (!property) {
    throw new Error(`Missing required property: ${propertyName}`);
  }

  if (property.type === "multi_select") {
    const values = property.multi_select
      .map((item) => item.name.trim())
      .filter(Boolean);

    if (values.length > 0) {
      return values;
    }
  }

  const textValue = getOptionalPlainText(property);

  if (textValue) {
    return [textValue];
  }

  throw new Error(`Property ${propertyName} is not list-like`);
}

function getNumberValue(
  property: MinimalNotionProperty | undefined,
  propertyName: string,
): number {
  if (!property) {
    throw new Error(`Missing required property: ${propertyName}`);
  }

  if (property.type === "number" && property.number !== null) {
    return property.number;
  }

  const textValue = getOptionalPlainText(property);

  if (!textValue) {
    throw new Error(`Missing required number property: ${propertyName}`);
  }

  const parsed = Number(textValue);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid number property: ${propertyName}`);
  }

  return parsed;
}

function getUrlValue(
  property: MinimalNotionProperty | undefined,
  propertyName: string,
): string {
  if (!property || property.type !== "url" || !property.url) {
    throw new Error(`Missing required URL property: ${propertyName}`);
  }

  return property.url;
}

function toSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseVerificationStatus(value: string): VerificationStatus {
  switch (value.trim()) {
    case "verified":
    case "unverified":
    case "needs_review":
    case "deprecated":
      return value.trim() as VerificationStatus;
    default:
      throw new Error(`Unsupported verification status: ${value}`);
  }
}

function parsePriority(value: string): BibliographyItem["priority"] {
  switch (value.trim().toLowerCase()) {
    case "core":
      return "core";
    case "useful":
      return "useful";
    case "optional":
      return "optional";
    default:
      throw new Error(`Unsupported bibliography priority: ${value}`);
  }
}

function parseSourceType(value: string): BibliographyItem["sourceType"] {
  switch (value.trim().toLowerCase()) {
    case "aemet recommended":
      return "aemet_recommended";
    case "official":
      return "official";
    case "complementary":
      return "complementary";
    default:
      throw new Error(`Unsupported bibliography source type: ${value}`);
  }
}

export function mapNotionBibliographyPage(
  page: MinimalNotionBibliographyPage,
): BibliographyItem {
  const title = getPlainText(
    getProperty(page.properties, ["title", "Name"], "title"),
    "title",
  );
  const year = getNumberValue(
    getProperty(page.properties, ["year", "Year"], "year"),
    "year",
  );

  return {
    id: toSlug(`${title}-${year}`),
    title,
    authors: getPlainText(
      getProperty(page.properties, ["authors", "Authors"], "authors"),
      "authors",
    ),
    year,
    blocks: getStringList(
      getProperty(page.properties, ["block", "Block"], "block"),
      "block",
    ),
    category:
      getOptionalPlainText(
        getProperty(page.properties, ["category", "Category"], "category"),
      ) ?? "Uncategorized",
    priority: parsePriority(
      getPlainText(
        getProperty(page.properties, ["priority", "Priority"], "priority"),
        "priority",
      ),
    ),
    sourceType: parseSourceType(
      getPlainText(
        getProperty(page.properties, ["source_type", "Source Type"], "source_type"),
        "source_type",
      ),
    ),
    sourceUrl: getUrlValue(
      getProperty(page.properties, ["source_url", "Source URL"], "source_url"),
      "source_url",
    ),
    verificationStatus: parseVerificationStatus(
      getPlainText(
        getProperty(
          page.properties,
          ["verification_status", "Verification Status"],
          "verification_status",
        ),
        "verification_status",
      ),
    ),
    notes:
      getOptionalPlainText(
        getProperty(page.properties, ["notes", "Notes"], "notes"),
      ) ?? "",
  };
}

function mapBibliographyPageSafely(
  page: MinimalNotionBibliographyPage,
): BibliographyItem | null {
  try {
    return mapNotionBibliographyPage(page);
  } catch (error) {
    console.warn("[notion-bibliography] skipping invalid row:", error);
    return null;
  }
}

export async function loadBibliographySource(
  options: LoadBibliographySourceOptions = {},
): Promise<BibliographySourceResult> {
  const fallbackBibliography =
    options.fallbackBibliography ?? defaultFallbackBibliography;
  const env = options.env ?? process.env;

  let config: ReturnType<typeof getBibliographyConfig>;

  try {
    config = getBibliographyConfig(env);
  } catch (error) {
    if (error instanceof NotionConfigError) {
      return {
        items: fallbackBibliography,
        sourceState: "fallback_config",
        message: "La sincronización de Notion no está configurada. Mostrando datos locales.",
      };
    }

    throw error;
  }

  const clientFactory = options.createClient ?? createNotionClient;
  const client = clientFactory(config);

  try {
    const mappedItems = (await client.dataSources.query({
      data_source_id: config.bibliographyDataSourceId,
    })).results
      .filter(isMinimalBibliographyPage)
      .map((result) => mapBibliographyPageSafely(result))
      .filter((item): item is BibliographyItem => item !== null);

    return {
      items: mappedItems,
      sourceState: "live",
      message: "Sincronización de bibliografía con Notion activa.",
    };
  } catch {
    return {
      items: fallbackBibliography,
      sourceState: "fallback_error",
      message: "Falló la sincronización con Notion. Mostrando datos locales.",
    };
  }
}
