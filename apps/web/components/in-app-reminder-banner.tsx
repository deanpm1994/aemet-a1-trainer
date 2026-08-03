"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getBrowserNotificationApi, showBrowserStudyReminder } from "@/lib/browser-notifications";
import { getEligibleReminder, type EligibleReminder } from "@/lib/in-app-reminders";
import type { UserSettings } from "@/lib/types";

type InAppReminderBannerProps = {
  reminderPreferences: UserSettings["reminderPreferences"];
};

function readDismissedReminderKeys() {
  const keys = new Set<string>();

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (key?.startsWith("aemet-reminder:")) {
      keys.add(key);
    }
  }

  return keys;
}

function showBrowserReminderOnce(reminder: EligibleReminder) {
  const notificationKey = `${reminder.dismissalKey}:browser-notified`;

  if (window.localStorage.getItem(notificationKey)) {
    return;
  }

  if (showBrowserStudyReminder(getBrowserNotificationApi(), reminder)) {
    window.localStorage.setItem(notificationKey, "shown");
  }
}

export function InAppReminderBanner({
  reminderPreferences,
}: InAppReminderBannerProps) {
  const [reminder, setReminder] = useState<EligibleReminder | null>(null);

  useEffect(() => {
    function updateReminder() {
      const nextReminder = getEligibleReminder({
        enabled: reminderPreferences.remindersEnabled,
        morning: reminderPreferences.morningReminderTime,
        evening: reminderPreferences.eveningReminderTime,
        now: new Date(),
        dismissed: readDismissedReminderKeys(),
      });

      if (nextReminder) {
        showBrowserReminderOnce(nextReminder);
      }

      setReminder(nextReminder);
    }

    updateReminder();
    const intervalId = window.setInterval(updateReminder, 30_000);

    return () => window.clearInterval(intervalId);
  }, [reminderPreferences]);

  if (!reminder) {
    return null;
  }

  const isMorning = reminder.slot === "morning";

  return (
    <aside
      className="border-b border-accent/20 bg-accent/10"
      aria-label="Recordatorio de estudio en la aplicación"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-ink/80">
          {isMorning
            ? "Es tu hora de estudio. Este recordatorio aparece solo mientras la aplicación está abierta."
            : "Es tu hora de repaso ligero. Este recordatorio aparece solo mientras la aplicación está abierta."}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={reminder.href}
            className="rounded-full bg-ink px-3 py-2 text-sm font-medium text-white"
          >
            {isMorning ? "Ver plan de hoy" : "Abrir repaso"}
          </Link>
          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem(reminder.dismissalKey, "dismissed");
              setReminder(null);
            }}
            className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm text-ink/80"
          >
            Descartar hoy
          </button>
        </div>
      </div>
    </aside>
  );
}
