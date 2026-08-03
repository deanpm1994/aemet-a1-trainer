import type { EligibleReminder } from "./in-app-reminders";

export type BrowserNotificationPermission = NotificationPermission | "unsupported";

export type BrowserNotificationApi = {
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  show: (title: string, options: NotificationOptions) => void;
};

export function getBrowserNotificationApi(): BrowserNotificationApi | null {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }

  const BrowserNotification = window.Notification;

  return {
    permission: BrowserNotification.permission,
    requestPermission: () => BrowserNotification.requestPermission(),
    show: (title, options) => {
      new BrowserNotification(title, options);
    },
  };
}

export function getBrowserNotificationPermission(
  notificationApi: BrowserNotificationApi | null,
): BrowserNotificationPermission {
  return notificationApi?.permission ?? "unsupported";
}

export async function requestBrowserNotificationPermission(
  notificationApi: BrowserNotificationApi | null,
): Promise<BrowserNotificationPermission> {
  if (!notificationApi) {
    return "unsupported";
  }

  if (notificationApi.permission !== "default") {
    return notificationApi.permission;
  }

  try {
    return await notificationApi.requestPermission();
  } catch {
    return notificationApi.permission;
  }
}

export function showBrowserStudyReminder(
  notificationApi: BrowserNotificationApi | null,
  reminder: EligibleReminder,
): boolean {
  if (!notificationApi || notificationApi.permission !== "granted") {
    return false;
  }

  const isMorning = reminder.slot === "morning";

  try {
    notificationApi.show("AEMET A1 Trainer", {
      body: isMorning
        ? "Es tu hora de estudio. Abre el plan de hoy."
        : "Es tu hora de repaso ligero. Abre el repaso.",
      icon: "/icon.svg",
      tag: reminder.dismissalKey,
    });
  } catch {
    return false;
  }

  return true;
}
