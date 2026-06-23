import { PageHeader } from "@/components/page-header";
import { SettingsForm } from "@/components/settings-form";
import { SupabaseConfigError, getSupabaseBrowserConfig } from "@/lib/supabase-config";
import { createSupabaseServerClient, getAuthenticatedUserId } from "@/lib/supabase-server";
import { buildDefaultUserSettings } from "@/lib/user-settings";
import { getUserSettings, saveUserSettings } from "@/lib/user-settings-repository";
import type { UserSettings } from "@/lib/types";

function parseNumber(value: FormDataEntryValue | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

type SettingsRepositoryClient = Parameters<typeof getUserSettings>[0];

export default async function SettingsPage() {
  let persistenceAvailable = true;
  let canSave = false;
  let statusMessage = "Sign in required before saved settings can sync to Supabase.";
  let initialSettings = buildDefaultUserSettings();

  try {
    getSupabaseBrowserConfig();

    const userId = await getAuthenticatedUserId();

    if (userId) {
      const client = await createSupabaseServerClient();
      initialSettings = await getUserSettings(client as SettingsRepositoryClient, userId);
      canSave = true;
      statusMessage = "Settings loaded from Supabase. Reminder delivery is still not active.";
    }
  } catch (error) {
    persistenceAvailable = false;
    statusMessage =
      error instanceof SupabaseConfigError
        ? "Supabase settings persistence unavailable until required env vars are configured."
        : "Unable to load saved settings right now.";
  }

  async function saveAction(formData: FormData) {
    "use server";

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Sign in required before saved settings can sync to Supabase.",
      };
    }

    const nextSettings: UserSettings = {
      profile: {
        displayName: String(formData.get("displayName") ?? ""),
        timezone: String(formData.get("timezone") ?? "Europe/Madrid"),
      },
      studyPreferences: {
        studyStartTime: String(formData.get("studyStartTime") ?? "07:30"),
        deepWorkMinutes: parseNumber(formData.get("deepWorkMinutes"), 90),
        practiceMinutes: parseNumber(formData.get("practiceMinutes"), 60),
        reviewMinutes: parseNumber(formData.get("reviewMinutes"), 40),
        workdayStartTime: String(formData.get("workdayStartTime") ?? "12:30"),
        workdayEndTime: String(formData.get("workdayEndTime") ?? "23:00"),
      },
      reminderPreferences: {
        remindersEnabled: formData.get("remindersEnabled") === "on",
        reminderChannel: "in_app" as const,
        morningReminderTime: String(formData.get("morningReminderTime") ?? "") || null,
        eveningReminderTime: String(formData.get("eveningReminderTime") ?? "") || null,
      },
    };

    try {
      const client = await createSupabaseServerClient();
      await saveUserSettings(client as SettingsRepositoryClient, userId, nextSettings);

      return {
        ok: true,
        message: "Settings saved. Notification delivery still pending future phase.",
      };
    } catch {
      return {
        ok: false,
        message: "Could not save settings. Form values remain in place for retry.",
      };
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="Saved study preferences"
        description="Profile, study defaults, and reminder preferences persist per user when a Supabase-authenticated session exists. Reminder delivery is not active yet."
      />
      <SettingsForm
        initialSettings={initialSettings}
        persistenceAvailable={persistenceAvailable}
        canSave={canSave}
        statusMessage={statusMessage}
        onSave={saveAction}
      />
    </div>
  );
}
