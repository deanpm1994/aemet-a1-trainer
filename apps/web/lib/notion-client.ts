import "server-only";

import { Client } from "@notionhq/client";

export class NotionConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotionConfigError";
  }
}

export type NotionConfig = {
  token: string;
  topicsDataSourceId: string;
};

type NotionEnv = Record<string, string | undefined>;

function readRequiredValue(value: string | undefined, name: string): string {
  const trimmed = value?.trim();

  if (!trimmed) {
    throw new NotionConfigError(`Missing required Notion env var: ${name}`);
  }

  return trimmed;
}

export function getNotionConfig(env: NotionEnv = process.env): NotionConfig {
  return {
    token: readRequiredValue(env.NOTION_TOKEN, "NOTION_TOKEN"),
    topicsDataSourceId: readRequiredValue(
      env.NOTION_TOPICS_DATA_SOURCE_ID,
      "NOTION_TOPICS_DATA_SOURCE_ID",
    ),
  };
}

export function createNotionClient(config: NotionConfig) {
  return new Client({
    auth: config.token,
  });
}
