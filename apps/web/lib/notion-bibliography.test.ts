import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { bibliography as fallbackBibliography } from "./mock-data";
import { routeCards } from "./mock-data";
import type { BibliographyItem } from "./types";
import {
  loadBibliographySource,
  mapNotionBibliographyPage,
} from "./notion-bibliography";

const validBibliographyPage = {
  object: "page",
  properties: {
    title: {
      type: "title",
      title: [{ plain_text: "Atmospheric Science: An Introductory Survey" }],
    },
    authors: {
      type: "rich_text",
      rich_text: [{ plain_text: "Wallace, J. M.; Hobbs, P. V." }],
    },
    year: {
      type: "rich_text",
      rich_text: [{ plain_text: "2006" }],
    },
    block: {
      type: "rich_text",
      rich_text: [{ plain_text: "Meteorology and Climatology" }],
    },
    category: {
      type: "rich_text",
      rich_text: [{ plain_text: "General" }],
    },
    priority: {
      type: "rich_text",
      rich_text: [{ plain_text: "Core" }],
    },
    source_type: {
      type: "rich_text",
      rich_text: [{ plain_text: "AEMET recommended" }],
    },
    source_url: {
      type: "url",
      url: "https://example.com/resources.pdf",
    },
    verification_status: {
      type: "rich_text",
      rich_text: [{ plain_text: "verified" }],
    },
    notes: {
      type: "rich_text",
      rich_text: [{ plain_text: "General atmospheric science reference." }],
    },
  },
} as const;

describe("mapNotionBibliographyPage", () => {
  it("maps a csv-style Notion row into the internal BibliographyItem shape", () => {
    expect(mapNotionBibliographyPage(validBibliographyPage)).toEqual<BibliographyItem>({
      id: "atmospheric-science-an-introductory-survey-2006",
      title: "Atmospheric Science: An Introductory Survey",
      authors: "Wallace, J. M.; Hobbs, P. V.",
      year: 2006,
      blocks: ["Meteorology and Climatology"],
      category: "General",
      priority: "core",
      sourceType: "aemet_recommended",
      sourceUrl: "https://example.com/resources.pdf",
      verificationStatus: "verified",
      notes: "General atmospheric science reference.",
    });
  });
});

describe("loadBibliographySource", () => {
  it("returns live bibliography when config and query succeed", async () => {
    const result = await loadBibliographySource({
      env: {
        NOTION_TOKEN: "secret_test_token",
        NOTION_BIBLIOGRAPHY_DATA_SOURCE_ID:
          "12345678-1234-1234-1234-123456789abc",
      },
      fallbackBibliography,
      createClient: () => ({
        dataSources: {
          query: vi.fn().mockResolvedValue({
            results: [validBibliographyPage],
          }),
        },
      }),
    });

    expect(result.sourceState).toBe("live");
    expect(result.items[0]?.id).toBe("atmospheric-science-an-introductory-survey-2006");
  });

  it("returns fallback_config when bibliography config is missing", async () => {
    const result = await loadBibliographySource({
      env: {},
      fallbackBibliography,
    });

    expect(result.sourceState).toBe("fallback_config");
    expect(result.items).toEqual(fallbackBibliography);
  });

  it("keeps repeated source urls without treating them as an error", async () => {
    const result = await loadBibliographySource({
      env: {
        NOTION_TOKEN: "secret_test_token",
        NOTION_BIBLIOGRAPHY_DATA_SOURCE_ID:
          "12345678-1234-1234-1234-123456789abc",
      },
      fallbackBibliography,
      createClient: () => ({
        dataSources: {
          query: vi.fn().mockResolvedValue({
            results: [
              validBibliographyPage,
              {
                ...validBibliographyPage,
                properties: {
                  ...validBibliographyPage.properties,
                  title: {
                    type: "title",
                    title: [{ plain_text: "Physics of the Atmosphere and Climate" }],
                  },
                  year: {
                    type: "rich_text",
                    rich_text: [{ plain_text: "2012" }],
                  },
                },
              },
            ],
          }),
        },
      }),
    });

    expect(result.sourceState).toBe("live");
    expect(result.items).toHaveLength(2);
    expect(result.items[0]?.sourceUrl).toBe(result.items[1]?.sourceUrl);
  });
});

describe("resources route card", () => {
  it("adds a Resources route card that points to /resources", () => {
    expect(routeCards.find((card) => card.href === "/resources")?.title).toBe("Resources");
  });
});
