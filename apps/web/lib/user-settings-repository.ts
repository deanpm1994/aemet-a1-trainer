import type { UserSettings } from "./types";
import {
  buildDefaultUserSettings,
  mapRowToUserSettings,
  mapUserSettingsToRowInput,
  type UserSettingsRow,
} from "./user-settings";

type UserSettingsTableClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{ data: UserSettingsRow | null; error: Error | null }>;
      };
    };
    upsert: (
      values: Record<string, unknown>,
      options: { onConflict: string },
    ) => Promise<{ error: Error | null }>;
  };
};

export async function getUserSettings(client: UserSettingsTableClient, userId: string) {
  const { data, error } = await client
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapRowToUserSettings(data) : buildDefaultUserSettings();
}

export async function saveUserSettings(
  client: UserSettingsTableClient,
  userId: string,
  settings: UserSettings,
) {
  const payload = mapUserSettingsToRowInput(userId, settings);
  const { error } = await client.from("user_settings").upsert(payload, { onConflict: "user_id" });

  if (error) {
    throw error;
  }
}
