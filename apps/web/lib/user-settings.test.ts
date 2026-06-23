import { describe, expect, it } from "vitest";

import {
  buildDefaultUserSettings,
  mapRowToUserSettings,
  mapUserSettingsToRowInput,
} from "./user-settings";

describe("user settings defaults", () => {
  it("builds defaults from the candidate study rhythm", () => {
    expect(buildDefaultUserSettings()).toEqual({
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
    });
  });
});

describe("user settings row mapping", () => {
  it("maps a database row into the domain shape", () => {
    expect(
      mapRowToUserSettings({
        user_id: "user-1",
        display_name: "Dean",
        timezone: "Europe/Madrid",
        study_start_time: "08:00",
        deep_work_minutes: 75,
        practice_minutes: 55,
        review_minutes: 35,
        workday_start_time: "12:30",
        workday_end_time: "23:00",
        reminders_enabled: true,
        reminder_channel: "in_app",
        morning_reminder_time: "07:50",
        evening_reminder_time: "23:10",
        created_at: "2026-06-23T07:00:00.000Z",
        updated_at: "2026-06-23T07:30:00.000Z",
      }),
    ).toEqual({
      profile: {
        displayName: "Dean",
        timezone: "Europe/Madrid",
      },
      studyPreferences: {
        studyStartTime: "08:00",
        deepWorkMinutes: 75,
        practiceMinutes: 55,
        reviewMinutes: 35,
        workdayStartTime: "12:30",
        workdayEndTime: "23:00",
      },
      reminderPreferences: {
        remindersEnabled: true,
        reminderChannel: "in_app",
        morningReminderTime: "07:50",
        eveningReminderTime: "23:10",
      },
    });
  });

  it("falls back to defaults when row data is incomplete", () => {
    expect(
      mapRowToUserSettings({
        user_id: "user-1",
        display_name: "",
        timezone: "",
        study_start_time: "bad-time",
        deep_work_minutes: -1,
        practice_minutes: 0,
        review_minutes: 40,
        workday_start_time: "12:30",
        workday_end_time: "23:00",
        reminders_enabled: false,
        reminder_channel: "email",
        morning_reminder_time: null,
        evening_reminder_time: null,
        created_at: "2026-06-23T07:00:00.000Z",
        updated_at: "2026-06-23T07:30:00.000Z",
      }),
    ).toEqual(buildDefaultUserSettings());
  });

  it("maps the domain shape into a row input payload", () => {
    expect(
      mapUserSettingsToRowInput("user-1", {
        profile: {
          displayName: "Dean",
          timezone: "Europe/Madrid",
        },
        studyPreferences: {
          studyStartTime: "08:00",
          deepWorkMinutes: 75,
          practiceMinutes: 55,
          reviewMinutes: 35,
          workdayStartTime: "12:30",
          workdayEndTime: "23:00",
        },
        reminderPreferences: {
          remindersEnabled: true,
          reminderChannel: "in_app",
          morningReminderTime: "07:50",
          eveningReminderTime: "23:10",
        },
      }),
    ).toEqual({
      user_id: "user-1",
      display_name: "Dean",
      timezone: "Europe/Madrid",
      study_start_time: "08:00",
      deep_work_minutes: 75,
      practice_minutes: 55,
      review_minutes: 35,
      workday_start_time: "12:30",
      workday_end_time: "23:00",
      reminders_enabled: true,
      reminder_channel: "in_app",
      morning_reminder_time: "07:50",
      evening_reminder_time: "23:10",
    });
  });
});
