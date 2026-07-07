import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { routeCards } from "./i18n";
import { topics as fallbackTopics } from "./mock-data";
import { NotionConfigError } from "./notion-client";
import type { Topic } from "./types";
import { loadTopicsSource, mapNotionTopicPage } from "./notion-topics";

const validTopicPage = {
  object: "page",
  properties: {
    topic_id: {
      type: "title",
      title: [{ plain_text: "MAT-35" }],
    },
    block: {
      type: "rich_text",
      rich_text: [{ plain_text: "Meteorology and Climatology" }],
    },
    official_number: {
      type: "rich_text",
      rich_text: [{ plain_text: "35" }],
    },
    official_text: {
      type: "rich_text",
      rich_text: [{ plain_text: "Exact official wording" }],
    },
    short_title: {
      type: "rich_text",
      rich_text: [{ plain_text: "Atmospheric thermodynamics" }],
    },
    priority: {
      type: "rich_text",
      rich_text: [{ plain_text: "High" }],
    },
    status: {
      type: "rich_text",
      rich_text: [{ plain_text: "In progress" }],
    },
    confidence: {
      type: "rich_text",
      rich_text: [{ plain_text: "3" }],
    },
    source_url: {
      type: "url",
      url: "https://example.com/topic",
    },
    retrieved_at: {
      type: "date",
      date: { start: "2026-06-22" },
    },
    verification_status: {
      type: "rich_text",
      rich_text: [{ plain_text: "verified" }],
    },
    next_review_at: {
      type: "rich_text",
      rich_text: [{ plain_text: "" }],
    },
    notes: {
      type: "rich_text",
      rich_text: [{ plain_text: "Flashcards started" }],
    },
  },
} as const;

describe("mapNotionTopicPage", () => {
  it("maps a valid Notion row into the internal Topic shape", () => {
    expect(mapNotionTopicPage(validTopicPage)).toEqual<Topic>({
      id: "MAT-35",
      block: "Meteorology and Climatology",
      officialNumber: "35",
      officialTitle: "Exact official wording",
      normalizedTitle: "Atmospheric thermodynamics",
      status: "in_progress",
      confidence: 3,
      priority: "high",
      nextReviewAt: "Pending schedule",
      verificationStatus: "verified",
      sourceUrl: "https://example.com/topic",
      retrievedAt: "2026-06-22",
      notesStatus: "Flashcards started",
    });
  });

  it("throws when a required property is missing", () => {
    expect(() =>
      mapNotionTopicPage({
        ...validTopicPage,
        properties: {
          ...validTopicPage.properties,
          block: undefined,
        },
      }),
    ).toThrow("block");
  });

  it("builds a stable fallback id when topic_id is blank", () => {
    expect(
      mapNotionTopicPage({
        ...validTopicPage,
        properties: {
          ...validTopicPage.properties,
          topic_id: {
            type: "title",
            title: [{ plain_text: "" }],
          },
        },
      }).id,
    ).toBe("meteorology-and-climatology-35-atmospheric-thermodynamics");
  });
});

describe("loadTopicsSource", () => {
  it("returns live topics when config and query both succeed", async () => {
    const result = await loadTopicsSource({
      env: {
        NOTION_TOKEN: "secret_test_token",
        NOTION_TOPICS_DATA_SOURCE_ID: "12345678-1234-1234-1234-123456789abc",
      },
      fallbackTopics,
      officialSubsetLoader: () => ({ ok: false, issues: [] }),
      createClient: () => ({
        dataSources: {
          query: vi.fn().mockResolvedValue({
            results: [validTopicPage],
          }),
        },
      }),
    });

    expect(result.sourceState).toBe("live");
    expect(result.message).toBe("Sincronización de temas con Notion activa.");
    expect(result.topics[0]?.id).toBe("MAT-35");
  });

  it("returns fallback_config when config is missing", async () => {
    const result = await loadTopicsSource({
      env: {},
      fallbackTopics,
      officialSubsetLoader: () => ({ ok: false, issues: [] }),
    });

    expect(result.sourceState).toBe("fallback_config");
    expect(result.message).toBe(
      "La sincronización de Notion no está configurada. Mostrando datos locales de temas.",
    );
    expect(result.topics).toEqual(fallbackTopics);
  });

  it("prefers imported verified syllabus subset topics before fallback topics", async () => {
    const result = await loadTopicsSource({
      env: {},
      fallbackTopics: [],
    });

    expect(result.sourceState).toBe("fallback_config");
    expect(result.topics[0]?.sourceUrl).toBe(
      "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1292",
    );
    expect(result.topics).toHaveLength(39);
    expect(
      result.topics
        .filter((topic) => topic.block === "Physics")
        .map((topic) => topic.officialNumber),
    ).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
    ]);
  });

  it("returns fallback_error when the query fails", async () => {
    const result = await loadTopicsSource({
      env: {
        NOTION_TOKEN: "secret_test_token",
        NOTION_TOPICS_DATA_SOURCE_ID: "12345678-1234-1234-1234-123456789abc",
      },
      fallbackTopics,
      officialSubsetLoader: () => ({ ok: false, issues: [] }),
      createClient: () => ({
        dataSources: {
          query: vi.fn().mockRejectedValue(new Error("boom")),
        },
      }),
    });

    expect(result.sourceState).toBe("fallback_error");
    expect(result.message).toBe(
      "Falló la sincronización con Notion. Mostrando datos locales de temas.",
    );
    expect(result.topics).toEqual(fallbackTopics);
  });

  it("returns fallback_error when mapping fails", async () => {
    const result = await loadTopicsSource({
      env: {
        NOTION_TOKEN: "secret_test_token",
        NOTION_TOPICS_DATA_SOURCE_ID: "12345678-1234-1234-1234-123456789abc",
      },
      fallbackTopics,
      officialSubsetLoader: () => ({ ok: false, issues: [] }),
      createClient: () => ({
        dataSources: {
          query: vi.fn().mockResolvedValue({
            results: [
              {
                ...validTopicPage,
                properties: {
                  ...validTopicPage.properties,
                  priority: {
                    type: "rich_text",
                    rich_text: [{ plain_text: "Urgent" }],
                  },
                },
              },
            ],
          }),
        },
      }),
    });

    expect(result.sourceState).toBe("fallback_error");
    expect(result.topics).toEqual(fallbackTopics);
  });

  it("does not swallow config validation failures inside the mapper", async () => {
    await expect(
      loadTopicsSource({
        env: {
          NOTION_TOKEN: "",
          NOTION_TOPICS_DATA_SOURCE_ID: "12345678-1234-1234-1234-123456789abc",
        },
        fallbackTopics,
        officialSubsetLoader: () => ({ ok: false, issues: [] }),
      }),
    ).resolves.toMatchObject({
      sourceState: "fallback_config",
    });
  });

  it("allows direct config errors to stay typed", () => {
    expect(new NotionConfigError("missing")).toBeInstanceOf(Error);
  });
});

describe("topics route copy", () => {
  it("keeps the topics route card focused on live-capable topic sync", () => {
    expect(routeCards("en").find((card) => card.href === "/topics")?.description).toContain(
      "Live-capable Notion-backed topic checklist",
    );
  });
});
