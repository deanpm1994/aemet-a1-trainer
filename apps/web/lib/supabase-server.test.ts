import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  cookieGetAll: vi.fn(() => []),
  cookieSet: vi.fn(),
  createServerClient: vi.fn((_url: string, _key: string, options: unknown) => ({
    options,
  })),
}));

vi.mock("server-only", () => ({}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: mocks.createServerClient,
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    getAll: mocks.cookieGetAll,
    set: mocks.cookieSet,
  })),
}));

describe("createSupabaseServerClient", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.cookieGetAll.mockReset();
    mocks.cookieGetAll.mockReturnValue([]);
    mocks.cookieSet.mockReset();
    mocks.createServerClient.mockClear();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
  });

  it("ignores cookie write failures during Server Component reads", async () => {
    mocks.cookieSet.mockImplementation(() => {
      throw new Error("Cookies can only be modified in a Server Action or Route Handler.");
    });

    const { createSupabaseServerClient } = await import("./supabase-server");
    const client = (await createSupabaseServerClient()) as unknown as {
      options: {
        cookies: {
          setAll: (
            cookieValues: Array<{
              name: string;
              value: string;
              options: Record<string, unknown>;
            }>,
          ) => void;
        };
      };
    };

    expect(() =>
      client.options.cookies.setAll([
        {
          name: "sb-session",
          value: "refreshed",
          options: {
            path: "/",
          },
        },
      ]),
    ).not.toThrow();
  });
});
