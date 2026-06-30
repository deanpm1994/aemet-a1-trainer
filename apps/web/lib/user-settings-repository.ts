import type { UserSettings } from "./types";
import {
  buildDefaultUserSettings,
  mapRowToUserSettings,
  mapUserSettingsToRowInput,
  type UserSettingsRow,
} from "./user-settings";

type UserSettingsTableClient = {
  from: (table: string) => any;
};

export async function getUserSettings(client: UserSettingsTableClient, userId: string) {
  const query = client
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  const { data, error } = await query;

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
  const upsertQuery = client.from("user_settings").upsert(payload, { onConflict: "user_id" });
  const { error } = await upsertQuery;

  if (error) {
    throw error;
  }
}
