# Phase 4.1 Notion Topics Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a server-only, read-only Notion Topics sync that feeds the `/topics` list and detail routes, falls back explicitly to local topic fixtures when sync is unavailable, and keeps all automated tests on mocks and stubs.

**Architecture:** Add a small server-only Notion boundary under `apps/web/lib/`: one config/client module, one topic mapper/loader module, and isolated tests for both. Then switch the `/topics` and `/topics/[id]` routes to consume the typed loader result plus a visible source-state banner, while preserving current local fixtures as the fallback dataset.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, `@notionhq/client`, Tailwind CSS, git

---

### Task 1: Add the Notion SDK and server-only config/client helpers

**Files:**

- Modify: `apps/web/package.json`
- Modify: `package-lock.json`
- Create: `apps/web/lib/notion-client.ts`
- Test: `apps/web/lib/notion-client.test.ts`

- [ ] **Step 1: Install the official Notion SDK**

Run:

```bash
npm install @notionhq/client --workspace web
```

Expected:

- `apps/web/package.json` includes `@notionhq/client`
- `package-lock.json` is updated

- [ ] **Step 2: Write the failing config/client tests**

Create `apps/web/lib/notion-client.test.ts` with:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

const clientMock = vi.fn();

vi.mock("@notionhq/client", () => ({
  Client: clientMock,
}));

describe("notion client config", () => {
  beforeEach(() => {
    clientMock.mockReset();
  });

  it("returns a valid config when both env vars exist", async () => {
    const { getNotionConfig } = await import("./notion-client");

    expect(
      getNotionConfig({
        NOTION_TOKEN: "secret_test_token",
        NOTION_TOPICS_DATA_SOURCE_ID: "12345678-1234-1234-1234-123456789abc",
      })
    ).toEqual({
      token: "secret_test_token",
      topicsDataSourceId: "12345678-1234-1234-1234-123456789abc",
    });
  });

  it("throws a config error when the token is missing", async () => {
    const { NotionConfigError, getNotionConfig } = await import(
      "./notion-client"
    );

    expect(() =>
      getNotionConfig({
        NOTION_TOPICS_DATA_SOURCE_ID: "12345678-1234-1234-1234-123456789abc",
      })
    ).toThrow(NotionConfigError);
  });

  it("throws a config error when the topics data source id is missing", async () => {
    const { NotionConfigError, getNotionConfig } = await import(
      "./notion-client"
    );

    expect(() =>
      getNotionConfig({
        NOTION_TOKEN: "secret_test_token",
      })
    ).toThrow(NotionConfigError);
  });

  it("builds the SDK client from validated config", async () => {
    clientMock.mockReturnValue({ dataSources: { query: vi.fn() } });

    const { createNotionClient } = await import("./notion-client");

    const client = createNotionClient({
      token: "secret_test_token",
      topicsDataSourceId: "12345678-1234-1234-1234-123456789abc",
    });

    expect(clientMock).toHaveBeenCalledWith({
      auth: "secret_test_token",
    });
    expect(client).toEqual({ dataSources: { query: expect.any(Function) } });
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run:

```bash
npm --prefix apps/web test -- notion-client.test.ts
```

Expected:

- FAIL with module-not-found errors for `./notion-client` or missing dependency errors before implementation

- [ ] **Step 4: Write the server-only config/client module**

Create `apps/web/lib/notion-client.ts` with:

```ts
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

type NotionEnv = Partial<
  Record<"NOTION_TOKEN" | "NOTION_TOPICS_DATA_SOURCE_ID", string>
>;

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
      "NOTION_TOPICS_DATA_SOURCE_ID"
    ),
  };
}

export function createNotionClient(config: NotionConfig) {
  return new Client({
    auth: config.token,
  });
}
```

- [ ] **Step 5: Re-run the config/client test**

Run:

```bash
npm --prefix apps/web test -- notion-client.test.ts
```

Expected:

- PASS

- [ ] **Step 6: Commit the SDK and client boundary**

```bash
git add apps/web/package.json package-lock.json apps/web/lib/notion-client.ts apps/web/lib/notion-client.test.ts
git commit -m "build(notion): add server-only notion client"
```

### Task 2: Add the topic mapper and typed loader with explicit fallback states

**Files:**

- Create: `apps/web/lib/notion-topics.ts`
- Test: `apps/web/lib/notion-topics.test.ts`

- [ ] **Step 1: Write the failing mapper/loader tests**

Create `apps/web/lib/notion-topics.test.ts` with:

```ts
import { describe, expect, it, vi } from "vitest";

import { topics as fallbackTopics } from "./mock-data";
import { NotionConfigError } from "./notion-client";
import type { Topic } from "./types";
import { loadTopicsSource, mapNotionTopicPage } from "./notion-topics";

const validTopicPage = {
  object: "page",
  properties: {
    Name: {
      type: "title",
      title: [{ plain_text: "Atmospheric thermodynamics" }],
    },
    "Topic ID": {
      type: "rich_text",
      rich_text: [{ plain_text: "met-01" }],
    },
    Block: {
      type: "select",
      select: { name: "Meteorology and Climatology" },
    },
    "Official Number": {
      type: "number",
      number: 35,
    },
    "Official Text": {
      type: "rich_text",
      rich_text: [{ plain_text: "Exact official wording" }],
    },
    "Short Title": {
      type: "rich_text",
      rich_text: [{ plain_text: "Atmospheric thermodynamics" }],
    },
    Priority: {
      type: "select",
      select: { name: "High" },
    },
    Status: {
      type: "select",
      select: { name: "In progress" },
    },
    Confidence: {
      type: "number",
      number: 3,
    },
    "Source URL": {
      type: "url",
      url: "https://example.com/topic",
    },
    "Retrieved At": {
      type: "date",
      date: { start: "2026-06-22" },
    },
    "Verification Status": {
      type: "select",
      select: { name: "verified" },
    },
    "Next Review": {
      type: "date",
      date: { start: "2026-06-25" },
    },
    Notes: {
      type: "rich_text",
      rich_text: [{ plain_text: "Flashcards started" }],
    },
  },
} as const;

describe("mapNotionTopicPage", () => {
  it("maps a valid Notion row into the internal Topic shape", () => {
    expect(mapNotionTopicPage(validTopicPage)).toEqual<Topic>({
      id: "met-01",
      block: "Meteorology and Climatology",
      officialNumber: "35",
      officialTitle: "Exact official wording",
      normalizedTitle: "Atmospheric thermodynamics",
      status: "in_progress",
      confidence: 3,
      priority: "high",
      nextReviewAt: "2026-06-25",
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
          Status: undefined,
        },
      })
    ).toThrow("Status");
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
      createClient: () => ({
        dataSources: {
          query: vi.fn().mockResolvedValue({
            results: [validTopicPage],
          }),
        },
      }),
    });

    expect(result.sourceState).toBe("live");
    expect(result.message).toBe("Live Notion topic sync is active.");
    expect(result.topics[0]?.id).toBe("met-01");
  });

  it("returns fallback_config when config is missing", async () => {
    const result = await loadTopicsSource({
      env: {},
      fallbackTopics,
    });

    expect(result.sourceState).toBe("fallback_config");
    expect(result.message).toBe(
      "Live Notion sync is not configured. Showing local fallback topic data."
    );
    expect(result.topics).toEqual(fallbackTopics);
  });

  it("returns fallback_error when the query fails", async () => {
    const result = await loadTopicsSource({
      env: {
        NOTION_TOKEN: "secret_test_token",
        NOTION_TOPICS_DATA_SOURCE_ID: "12345678-1234-1234-1234-123456789abc",
      },
      fallbackTopics,
      createClient: () => ({
        dataSources: {
          query: vi.fn().mockRejectedValue(new Error("boom")),
        },
      }),
    });

    expect(result.sourceState).toBe("fallback_error");
    expect(result.message).toBe(
      "Live Notion sync failed. Showing local fallback topic data."
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
      createClient: () => ({
        dataSources: {
          query: vi.fn().mockResolvedValue({
            results: [
              {
                ...validTopicPage,
                properties: {
                  ...validTopicPage.properties,
                  Priority: {
                    type: "select",
                    select: { name: "Urgent" },
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
      })
    ).resolves.toMatchObject({
      sourceState: "fallback_config",
    });
  });

  it("allows direct config errors to stay typed", () => {
    expect(new NotionConfigError("missing")).toBeInstanceOf(Error);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm --prefix apps/web test -- notion-topics.test.ts
```

Expected:

- FAIL because `./notion-topics` does not exist

- [ ] **Step 3: Write the mapper and loader**

Create `apps/web/lib/notion-topics.ts` with:

```ts
import "server-only";

import { isFullPage } from "@notionhq/client";

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
      title: Array<{ plain_text: string }>;
    }
  | {
      type: "rich_text";
      rich_text: Array<{ plain_text: string }>;
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

type LoadTopicsSourceOptions = {
  env?: Partial<
    Record<"NOTION_TOKEN" | "NOTION_TOPICS_DATA_SOURCE_ID", string>
  >;
  fallbackTopics?: Topic[];
  createClient?: (config: NotionConfig) => {
    dataSources: {
      query: (args: { data_source_id: string }) => Promise<{
        results: unknown[];
      }>;
    };
  };
};

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

function getSelectName(
  property: MinimalNotionProperty | undefined,
  propertyName: string
): string {
  if (!property || property.type !== "select" || !property.select?.name) {
    throw new Error(`Missing required select property: ${propertyName}`);
  }

  return property.select.name.trim();
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
  return {
    id: getPlainText(page.properties["Topic ID"], "Topic ID"),
    block: getSelectName(page.properties.Block, "Block"),
    officialNumber: String(
      getNumberValue(page.properties["Official Number"], "Official Number")
    ),
    officialTitle: getPlainText(
      page.properties["Official Text"],
      "Official Text"
    ),
    normalizedTitle: getPlainText(
      page.properties["Short Title"],
      "Short Title"
    ),
    status: normalizeStatus(getSelectName(page.properties.Status, "Status")),
    confidence: getNumberValue(page.properties.Confidence, "Confidence"),
    priority: normalizePriority(
      getSelectName(page.properties.Priority, "Priority")
    ),
    nextReviewAt: getDateStart(page.properties["Next Review"], "Next Review"),
    verificationStatus: normalizeVerificationStatus(
      getSelectName(
        page.properties["Verification Status"],
        "Verification Status"
      )
    ),
    sourceUrl: getUrlValue(page.properties["Source URL"], "Source URL"),
    retrievedAt: getDateStart(page.properties["Retrieved At"], "Retrieved At"),
    notesStatus: getOptionalPlainText(page.properties.Notes),
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
          "Live Notion sync is not configured. Showing local fallback topic data.",
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
      .filter(isFullPage)
      .map((result) => mapNotionTopicPage(result as MinimalNotionTopicPage));

    return {
      topics: mappedTopics,
      sourceState: "live",
      message: "Live Notion topic sync is active.",
    };
  } catch {
    return {
      topics: fallbackTopics,
      sourceState: "fallback_error",
      message: "Live Notion sync failed. Showing local fallback topic data.",
    };
  }
}
```

- [ ] **Step 4: Run the mapper/loader tests**

Run:

```bash
npm --prefix apps/web test -- notion-topics.test.ts
```

Expected:

- PASS

- [ ] **Step 5: Commit the typed topic loader**

```bash
git add apps/web/lib/notion-topics.ts apps/web/lib/notion-topics.test.ts
git commit -m "feat(notion): add topics loader with explicit fallback states"
```

### Task 3: Wire the topics list and detail routes to the shared source loader

**Files:**

- Create: `apps/web/components/source-state-banner.tsx`
- Modify: `apps/web/app/topics/page.tsx`
- Modify: `apps/web/app/topics/[id]/page.tsx`

- [ ] **Step 1: Write the failing route expectations**

Append this fixture coverage to `apps/web/lib/notion-topics.test.ts`:

```ts
import { routeCards } from "./mock-data";

describe("topics route copy", () => {
  it("keeps the topics route card focused on live-capable topic sync", () => {
    expect(
      routeCards.find((card) => card.href === "/topics")?.description
    ).toContain("Live-capable Notion-backed topic checklist");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm --prefix apps/web test -- notion-topics.test.ts
```

Expected:

- FAIL because the `/topics` route card still says mock placeholder text

- [ ] **Step 3: Add the reusable source-state banner**

Create `apps/web/components/source-state-banner.tsx` with:

```tsx
import type { TopicSourceState } from "@/lib/notion-topics";

type SourceStateBannerProps = {
  sourceState: TopicSourceState;
  message: string;
};

const bannerClasses: Record<TopicSourceState, string> = {
  live: "border-emerald-200 bg-emerald-50 text-emerald-950",
  fallback_config: "border-amber-200 bg-amber-50 text-amber-950",
  fallback_error: "border-red-200 bg-red-50 text-red-900",
};

export function SourceStateBanner({
  sourceState,
  message,
}: SourceStateBannerProps) {
  return (
    <section
      className={`rounded-2xl border p-4 text-sm ${bannerClasses[sourceState]}`}
    >
      <p>{message}</p>
    </section>
  );
}
```

- [ ] **Step 4: Switch the topics list route to the async loader**

Replace `apps/web/app/topics/page.tsx` with:

```tsx
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { SourceStateBanner } from "@/components/source-state-banner";
import { loadTopicsSource } from "@/lib/notion-topics";
import { buildBlockSummaries } from "@/lib/topic-progress";

export default async function TopicsPage() {
  const { topics, sourceState, message } = await loadTopicsSource();
  const blockSummaries = buildBlockSummaries(topics);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Topics"
        title="Study checklist"
        description="Phase 4 topic sync prefers one dedicated Notion workspace and falls back to local topic data when live sync is unavailable. Official BOE wording and numbering remain explicitly marked until verified."
      />

      <SourceStateBanner sourceState={sourceState} message={message} />

      <section className="grid gap-4 md:grid-cols-3">
        {blockSummaries.map((summary) => (
          <article
            key={summary.block}
            className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-ink/60">{summary.block}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              {summary.touchedTopics}/{summary.totalTopics}
            </p>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              {summary.examReadyTopics} exam-ready topic
              {summary.examReadyTopics === 1 ? "" : "s"} in this block.
            </p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.id}`}
            className="block rounded-3xl border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-accent">
                  {topic.block}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-ink">
                  {topic.normalizedTitle}
                </h2>
                <p className="text-sm text-ink/70">
                  Official number: {topic.officialNumber}
                </p>
                <p className="text-sm leading-6 text-ink/75">
                  {topic.shortDescription}
                </p>
              </div>
              <dl className="grid gap-3 text-sm text-ink/80 sm:grid-cols-2 lg:min-w-[22rem]">
                <div>
                  <dt className="text-ink/50">Status</dt>
                  <dd>{topic.status}</dd>
                </div>
                <div>
                  <dt className="text-ink/50">Confidence</dt>
                  <dd>{topic.confidence}/5</dd>
                </div>
                <div>
                  <dt className="text-ink/50">Priority</dt>
                  <dd>{topic.priority}</dd>
                </div>
                <div>
                  <dt className="text-ink/50">Next review</dt>
                  <dd>{topic.nextReviewAt}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-ink/50">Verification</dt>
                  <dd>{topic.verificationStatus}</dd>
                </div>
              </dl>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Switch the topic detail route to the shared loader**

Replace `apps/web/app/topics/[id]/page.tsx` with:

```tsx
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { SourceStateBanner } from "@/components/source-state-banner";
import { loadTopicsSource } from "@/lib/notion-topics";

type TopicDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TopicDetailPage({
  params,
}: TopicDetailPageProps) {
  const { id } = await params;
  const { topics, sourceState, message } = await loadTopicsSource();
  const topic = topics.find((entry) => entry.id === id);

  if (!topic) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={topic.block}
        title={topic.normalizedTitle}
        description="Phase 4 topic detail uses the same Notion-first loader as the checklist and keeps fallback behavior explicit when live sync is unavailable."
      />

      <SourceStateBanner sourceState={sourceState} message={message} />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            Official metadata
          </h2>
          <dl className="mt-4 grid gap-4 text-sm text-ink/80">
            <div>
              <dt className="text-ink/50">Official number</dt>
              <dd>{topic.officialNumber}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Official title</dt>
              <dd>{topic.officialTitle}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Source URL</dt>
              <dd>{topic.sourceUrl}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Retrieved at</dt>
              <dd>{topic.retrievedAt}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Verification</dt>
              <dd>{topic.verificationStatus}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            Study state
          </h2>
          <dl className="mt-4 grid gap-4 text-sm text-ink/80">
            <div>
              <dt className="text-ink/50">Status</dt>
              <dd>{topic.status}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Confidence</dt>
              <dd>{topic.confidence}/5</dd>
            </div>
            <div>
              <dt className="text-ink/50">Priority</dt>
              <dd>{topic.priority}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Next review</dt>
              <dd>{topic.nextReviewAt}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Study focus</dt>
              <dd>{topic.studyFocus ?? "No study focus defined yet."}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Notes status</dt>
              <dd>{topic.notesStatus ?? "No notes status defined yet."}</dd>
            </div>
          </dl>
        </article>
      </section>
    </div>
  );
}
```

- [ ] **Step 6: Update the route card copy in `apps/web/lib/mock-data.ts`**

Change the `/topics` route card entry to:

```ts
  {
    href: "/topics",
    title: "Topics",
    description: "Live-capable Notion-backed topic checklist with explicit local fallback.",
  },
```

- [ ] **Step 7: Run the route-focused test and type checks**

Run:

```bash
npm --prefix apps/web test -- notion-topics.test.ts
npm --prefix apps/web run lint
```

Expected:

- the updated test passes
- TypeScript exits cleanly

- [ ] **Step 8: Commit the route integration**

```bash
git add apps/web/components/source-state-banner.tsx apps/web/app/topics/page.tsx 'apps/web/app/topics/[id]/page.tsx' apps/web/lib/mock-data.ts apps/web/lib/notion-topics.test.ts
git commit -m "feat(topics): load checklist and detail routes from notion"
```

### Task 4: Document the Notion setup and fallback behavior

**Files:**

- Modify: `README.md`

- [ ] **Step 1: Add a Notion setup section to the README**

Insert this section after `## Current status` in `README.md`:

```md
## Notion topic sync

Phase 4.1 uses a server-side Notion integration for the `/topics` routes.

Required environment variables:

- `NOTION_TOKEN`
- `NOTION_TOPICS_DATA_SOURCE_ID`

Behavior:

- when both values are configured and the Notion sync succeeds, `/topics` and `/topics/[id]` use live Notion topic data
- when configuration is missing, the app shows local fallback topic data with an explicit warning
- when the sync fails or mapping is invalid, the app shows local fallback topic data with an explicit error

The app does not expose the Notion token to the browser.
```

- [ ] **Step 2: Narrow the current status line if desired**

If you want the status block to reflect the active sub-slice more precisely, update the Phase 4 line in `README.md` to:

```md
Phase 4 active: Notion topics sync.
```

If you prefer to keep the broader wording, leave the existing `Phase 4 active: Notion integration.` line unchanged.

- [ ] **Step 3: Verify the README wording**

Run:

```bash
rg -n "Notion topic sync|NOTION_TOKEN|NOTION_TOPICS_DATA_SOURCE_ID|Phase 4 active" README.md
```

Expected:

- the Notion setup section is present
- the Phase 4 line is either preserved intentionally or narrowed intentionally

- [ ] **Step 4: Commit the documentation update**

```bash
git add README.md
git commit -m "docs(notion): document topics sync setup and fallback"
```

### Task 5: Full verification and status review

**Files:**

- Review only: `apps/web/lib/notion-client.ts`
- Review only: `apps/web/lib/notion-topics.ts`
- Review only: `apps/web/app/topics/page.tsx`
- Review only: `apps/web/app/topics/[id]/page.tsx`
- Review only: `README.md`

- [ ] **Step 1: Run the focused automated verification**

Run:

```bash
npm --prefix apps/web test -- notion-client.test.ts notion-topics.test.ts topic-progress.test.ts
npm --prefix apps/web run lint
```

Expected:

- all listed tests pass
- TypeScript exits cleanly

- [ ] **Step 2: Run a manual status check on the worktree**

Run:

```bash
git status --short
```

Expected:

- only the intended Notion topics sync files remain changed before final staging or all changes are already committed

- [ ] **Step 3: Review the resulting feature state**

Confirm all of the following:

- `/topics` no longer imports `topics` directly from `@/lib/mock-data`
- `/topics/[id]` no longer imports `topics` directly from `@/lib/mock-data`
- live sync success returns `sourceState: "live"`
- missing config returns `sourceState: "fallback_config"`
- sync or mapping failures return `sourceState: "fallback_error"`
- the UI shows explicit source-state messaging in both topic routes
- automated tests use mocks and stubs rather than real Notion calls

- [ ] **Step 4: Create the final integration commit if prior tasks were squashed locally**

If you executed the tasks without intermediate commits, create one final commit instead:

```bash
git add apps/web/package.json package-lock.json apps/web/lib/notion-client.ts apps/web/lib/notion-client.test.ts apps/web/lib/notion-topics.ts apps/web/lib/notion-topics.test.ts apps/web/components/source-state-banner.tsx apps/web/app/topics/page.tsx 'apps/web/app/topics/[id]/page.tsx' apps/web/lib/mock-data.ts README.md
git commit -m "feat(notion): add topics sync with explicit fallback"
```
