import { beforeEach, describe, expect, it, vi } from "vitest";

const clientMock = vi.fn();

vi.mock("server-only", () => ({}));

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
      }),
    ).toEqual({
      token: "secret_test_token",
      topicsDataSourceId: "12345678-1234-1234-1234-123456789abc",
    });
  });

  it("throws a config error when the token is missing", async () => {
    const { NotionConfigError, getNotionConfig } = await import("./notion-client");

    expect(() =>
      getNotionConfig({
        NOTION_TOPICS_DATA_SOURCE_ID: "12345678-1234-1234-1234-123456789abc",
      }),
    ).toThrow(NotionConfigError);
  });

  it("throws a config error when the topics data source id is missing", async () => {
    const { NotionConfigError, getNotionConfig } = await import("./notion-client");

    expect(() =>
      getNotionConfig({
        NOTION_TOKEN: "secret_test_token",
      }),
    ).toThrow(NotionConfigError);
  });

  it("builds the SDK client from validated config", async () => {
    clientMock.mockReturnValue({ dataSources: { query: vi.fn() } });

    const { createNotionClient } = await import("./notion-client");

    const client = createNotionClient({
      token: "secret_test_token",
    });

    expect(clientMock).toHaveBeenCalledWith({
      auth: "secret_test_token",
    });
    expect(client).toEqual({ dataSources: { query: expect.any(Function) } });
  });
});
