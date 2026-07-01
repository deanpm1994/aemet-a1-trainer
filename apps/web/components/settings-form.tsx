"use client";

import { useState } from "react";

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
        <h2 className="text-xl font-semibold tracking-tight text-ink">Profile</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-ink/80">
            <span>Display name</span>
            <input
              name="displayName"
              defaultValue={initialSettings.profile.displayName}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Timezone</span>
            <input
              name="timezone"
              defaultValue={initialSettings.profile.timezone}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight text-ink">Study preferences</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2 text-sm text-ink/80">
            <span>Study start time</span>
            <input
              name="studyStartTime"
              defaultValue={initialSettings.studyPreferences.studyStartTime}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Deep work minutes</span>
            <input
              name="deepWorkMinutes"
              type="number"
              defaultValue={initialSettings.studyPreferences.deepWorkMinutes}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Practice minutes</span>
            <input
              name="practiceMinutes"
              type="number"
              defaultValue={initialSettings.studyPreferences.practiceMinutes}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Review minutes</span>
            <input
              name="reviewMinutes"
              type="number"
              defaultValue={initialSettings.studyPreferences.reviewMinutes}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Workday start time</span>
            <input
              name="workdayStartTime"
              defaultValue={initialSettings.studyPreferences.workdayStartTime}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Workday end time</span>
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
          <h2 className="text-xl font-semibold tracking-tight text-ink">Reminder preferences</h2>
          <p className="text-sm leading-6 text-ink/70">
            Preferences save for a future notification phase. Browser notifications are not active yet.
          </p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-sm text-ink/80">
            <input
              name="remindersEnabled"
              type="checkbox"
              defaultChecked={initialSettings.reminderPreferences.remindersEnabled}
            />
            <span>Enable saved reminder preferences</span>
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Reminder channel</span>
            <input
              name="reminderChannel"
              defaultValue={initialSettings.reminderPreferences.reminderChannel}
              readOnly
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Morning reminder time</span>
            <input
              name="morningReminderTime"
              defaultValue={initialSettings.reminderPreferences.morningReminderTime ?? ""}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
          <label className="space-y-2 text-sm text-ink/80">
            <span>Evening reminder time</span>
            <input
              name="eveningReminderTime"
              defaultValue={initialSettings.reminderPreferences.eveningReminderTime ?? ""}
              className="w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3"
            />
          </label>
        </div>
      </section>

      <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <p className="text-sm text-ink/70">{message}</p>
        <button
          type="submit"
          disabled={!persistenceAvailable || !canSave || isSaving}
          className="mt-4 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-ink/40"
        >
          {isSaving ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}
