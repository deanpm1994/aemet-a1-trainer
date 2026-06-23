import type { ReminderChannel, UserSettings } from "./types";

export type UserSettingsRow = {
  user_id: string;
  display_name: string;
  timezone: string;
  study_start_time: string;
  deep_work_minutes: number;
  practice_minutes: number;
  review_minutes: number;
  workday_start_time: string;
  workday_end_time: string;
  reminders_enabled: boolean;
  reminder_channel: string;
  morning_reminder_time: string | null;
  evening_reminder_time: string | null;
  created_at: string;
  updated_at: string;
};

export type UserSettingsRowInput = Omit<UserSettingsRow, "created_at" | "updated_at">;

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function isTime(value: string | null): value is string {
  return typeof value === "string" && TIME_PATTERN.test(value);
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function isReminderChannel(value: string): value is ReminderChannel {
  return value === "in_app";
}

export function buildDefaultUserSettings(): UserSettings {
  return {
    profile: {
      displayName: "",
      timezone: "Europe/Madrid",
    },
    studyPreferences: {
      studyStartTime: "07:30",
      deepWorkMinutes: 90,
      practiceMinutes: 60,
      reviewMinutes: 40,
      workdayStartTime: "12:30",
      workdayEndTime: "23:00",
    },
    reminderPreferences: {
      remindersEnabled: false,
      reminderChannel: "in_app",
      morningReminderTime: "07:20",
      eveningReminderTime: "23:20",
    },
  };
}

export function mapRowToUserSettings(row: UserSettingsRow): UserSettings {
  const defaults = buildDefaultUserSettings();

  if (
    !row.timezone ||
    !isTime(row.study_start_time) ||
    !isPositiveInteger(row.deep_work_minutes) ||
    !isPositiveInteger(row.practice_minutes) ||
    !isPositiveInteger(row.review_minutes) ||
    !isTime(row.workday_start_time) ||
    !isTime(row.workday_end_time) ||
    !isReminderChannel(row.reminder_channel) ||
    (row.morning_reminder_time !== null && !isTime(row.morning_reminder_time)) ||
    (row.evening_reminder_time !== null && !isTime(row.evening_reminder_time))
  ) {
    return defaults;
  }

  return {
    profile: {
      displayName: row.display_name,
      timezone: row.timezone,
    },
    studyPreferences: {
      studyStartTime: row.study_start_time,
      deepWorkMinutes: row.deep_work_minutes,
      practiceMinutes: row.practice_minutes,
      reviewMinutes: row.review_minutes,
      workdayStartTime: row.workday_start_time,
      workdayEndTime: row.workday_end_time,
    },
    reminderPreferences: {
      remindersEnabled: row.reminders_enabled,
      reminderChannel: row.reminder_channel,
      morningReminderTime: row.morning_reminder_time,
      eveningReminderTime: row.evening_reminder_time,
    },
  };
}

export function mapUserSettingsToRowInput(
  userId: string,
  settings: UserSettings,
): UserSettingsRowInput {
  return {
    user_id: userId,
    display_name: settings.profile.displayName,
    timezone: settings.profile.timezone,
    study_start_time: settings.studyPreferences.studyStartTime,
    deep_work_minutes: settings.studyPreferences.deepWorkMinutes,
    practice_minutes: settings.studyPreferences.practiceMinutes,
    review_minutes: settings.studyPreferences.reviewMinutes,
    workday_start_time: settings.studyPreferences.workdayStartTime,
    workday_end_time: settings.studyPreferences.workdayEndTime,
    reminders_enabled: settings.reminderPreferences.remindersEnabled,
    reminder_channel: settings.reminderPreferences.reminderChannel,
    morning_reminder_time: settings.reminderPreferences.morningReminderTime,
    evening_reminder_time: settings.reminderPreferences.eveningReminderTime,
  };
}
