import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseBrowserConfig } from "./supabase-config";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const config = getSupabaseBrowserConfig();

  return createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookieValues) {
        cookieValues.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

export async function getAuthenticatedUserId() {
  const client = await createSupabaseServerClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  return user?.id ?? null;
}
