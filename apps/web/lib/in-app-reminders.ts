export type ReminderSlot = "morning" | "evening";

type ReminderEligibilityInput = {
  enabled: boolean;
  morning: string | null;
  evening: string | null;
  now: Date;
  dismissed: ReadonlySet<string>;
};

export type EligibleReminder = {
  slot: ReminderSlot;
  href: "/dashboard" | "/focus";
  dismissalKey: string;
};

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatLocalTime(date: Date) {
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${hour}:${minute}`;
}

export function getEligibleReminder({
  enabled,
  morning,
  evening,
  now,
  dismissed,
}: ReminderEligibilityInput): EligibleReminder | null {
  if (!enabled) {
    return null;
  }

  const time = formatLocalTime(now);
  const slot: ReminderSlot | null =
    morning === time ? "morning" : evening === time ? "evening" : null;

  if (!slot) {
    return null;
  }

  const dismissalKey = `aemet-reminder:${formatLocalDate(now)}:${slot}`;

  if (dismissed.has(dismissalKey)) {
    return null;
  }

  return {
    slot,
    href: slot === "morning" ? "/dashboard" : "/focus",
    dismissalKey,
  };
}
