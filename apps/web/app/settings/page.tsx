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
  let statusMessage = "Inicia sesión para sincronizar ajustes guardados con Supabase.";
  let initialSettings = buildDefaultUserSettings();

  try {
    getSupabaseBrowserConfig();

    const userId = await getAuthenticatedUserId();

    if (userId) {
      const client = await createSupabaseServerClient();
      initialSettings = await getUserSettings(client as SettingsRepositoryClient, userId);
      canSave = true;
      statusMessage =
        "Ajustes cargados desde Supabase. Los avisos aparecen solo dentro de la aplicación abierta.";
    }
  } catch (error) {
    persistenceAvailable = false;
    statusMessage =
      error instanceof SupabaseConfigError
        ? "La persistencia de ajustes en Supabase no está disponible hasta configurar las variables requeridas."
        : "No se pudieron cargar los ajustes guardados.";
  }

  async function saveAction(formData: FormData) {
    "use server";

    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Inicia sesión para sincronizar ajustes guardados con Supabase.",
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
        message:
          "Ajustes guardados. Los avisos aparecen solo dentro de la aplicación abierta; las notificaciones quedan pendientes.",
      };
    } catch {
      return {
        ok: false,
        message: "No se pudieron guardar los ajustes. Los valores quedan en el formulario para reintentar.",
      };
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Ajustes"
        title="Preferencias de estudio guardadas"
        description="Perfil, valores de estudio y recordatorios dentro de la aplicación se guardan por usuario con sesión de Supabase. No hay notificaciones ni avisos en segundo plano."
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
