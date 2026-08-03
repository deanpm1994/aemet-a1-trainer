"use client";

import { useEffect, useState } from "react";

import {
  getBrowserNotificationApi,
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
  type BrowserNotificationPermission,
} from "@/lib/browser-notifications";
import type { UserSettings } from "@/lib/types";

type SaveResult = {
  ok: boolean;
  message: string;
};

type SettingsFormProps = {
  initialSettings: UserSettings;
  persistenceAvailable: boolean;
  canSave: boolean;
  statusMessage: string;
  onSave: (formData: FormData) => Promise<SaveResult>;
};

export function SettingsForm({
  initialSettings,
  persistenceAvailable,
  canSave,
  statusMessage,
  onSave,
}: SettingsFormProps) {
  const [message, setMessage] = useState(statusMessage);
  const [isSaving, setIsSaving] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<BrowserNotificationPermission>("unsupported");

  useEffect(() => {
    setNotificationPermission(getBrowserNotificationPermission(getBrowserNotificationApi()));
  }, []);

  const browserNotificationDetail = {
    unsupported: "Este navegador no admite notificaciones del sistema.",
    default: "Puedes permitir avisos del navegador mientras la aplicación está abierta.",
    granted: "Los avisos del navegador están permitidos para esta aplicación.",
    denied: "Los avisos están bloqueados. Puedes cambiarlos desde los ajustes del navegador.",
  }[notificationPermission];

  return (
    <form
      className="space-y-8"
      action={async (formData) => {
        setIsSaving(true);
        const result = await onSave(formData);
        setMessage(result.message);
        setIsSaving(false);
      }}
    >
      <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight text-ink">Perfil</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-ink/80">
            <span>Nombre visible</span>
            <input
              name="displayName"
              defaultValue={initialSettings.profile.displayName}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Zona horaria</span>
            <input
              name="timezone"
              defaultValue={initialSettings.profile.timezone}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight text-ink">Preferencias de estudio</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2 text-sm text-ink/80">
            <span>Hora de inicio de estudio</span>
            <input
              name="studyStartTime"
              defaultValue={initialSettings.studyPreferences.studyStartTime}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Minutos de trabajo profundo</span>
            <input
              name="deepWorkMinutes"
              type="number"
              defaultValue={initialSettings.studyPreferences.deepWorkMinutes}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Minutos de práctica</span>
            <input
              name="practiceMinutes"
              type="number"
              defaultValue={initialSettings.studyPreferences.practiceMinutes}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Minutos de revisión</span>
            <input
              name="reviewMinutes"
              type="number"
              defaultValue={initialSettings.studyPreferences.reviewMinutes}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Inicio de jornada laboral</span>
            <input
              name="workdayStartTime"
              defaultValue={initialSettings.studyPreferences.workdayStartTime}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Fin de jornada laboral</span>
            <input
              name="workdayEndTime"
              defaultValue={initialSettings.studyPreferences.workdayEndTime}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Preferencias de recordatorios</h2>
          <p className="text-sm leading-6 text-ink/70">
            Con la aplicación abierta, los recordatorios configurados muestran un aviso en la franja guardada. Si permites los avisos del navegador, también se mostrará una notificación del sistema. No hay avisos en segundo plano.
          </p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-sm text-ink/80">
            <input
              name="remindersEnabled"
              type="checkbox"
              defaultChecked={initialSettings.reminderPreferences.remindersEnabled}
            />
            <span>Activar recordatorios dentro de la aplicación</span>
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Canal de recordatorio</span>
            <input
              name="reminderChannel"
              defaultValue={initialSettings.reminderPreferences.reminderChannel}
              readOnly
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Hora del recordatorio de mañana</span>
            <input
              name="morningReminderTime"
              defaultValue={initialSettings.reminderPreferences.morningReminderTime ?? ""}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Hora del recordatorio de noche</span>
            <input
              name="eveningReminderTime"
              defaultValue={initialSettings.reminderPreferences.eveningReminderTime ?? ""}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
        </div>
        <div className="mt-4 rounded-2xl border border-ink/10 bg-surface p-4 text-sm text-ink/80">
          <p>{browserNotificationDetail}</p>
          <button
            type="button"
            disabled={notificationPermission !== "default"}
            onClick={async () => {
              setNotificationPermission(
                await requestBrowserNotificationPermission(getBrowserNotificationApi()),
              );
            }}
            className="mt-3 rounded-full border border-ink/20 bg-white px-4 py-2 font-medium text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            Permitir avisos del navegador
          </button>
        </div>
      </section>

      <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <p className="text-sm text-ink/70">{message}</p>
        <button
          type="submit"
          disabled={!persistenceAvailable || !canSave || isSaving}
          className="mt-4 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-ink/40"
        >
          {isSaving ? "Guardando..." : "Guardar ajustes"}
        </button>
      </div>
    </form>
  );
}
