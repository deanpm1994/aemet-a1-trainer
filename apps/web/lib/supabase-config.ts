export class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

type SupabaseEnv = Record<string, string | undefined>;

function readRequiredValue(value: string | undefined, name: string): string {
  const trimmed = value?.trim();

  if (!trimmed) {
    throw new SupabaseConfigError(`Missing required Supabase env var: ${name}`);
  }

  return trimmed;
}

export function getSupabaseBrowserConfig(env: SupabaseEnv = process.env) {
  return {
    url: readRequiredValue(env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    publishableKey: readRequiredValue(
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    ),
  };
}

export function getSupabaseServerConfig(env: SupabaseEnv = process.env) {
  return {
    url: readRequiredValue(env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    secretKey: readRequiredValue(env.SUPABASE_SECRET_KEY, "SUPABASE_SECRET_KEY"),
  };
}
