import { getReminderService } from "@/Backend/reminders/service";

const intervalMs = 60_000;

declare global {
  var __dailyRoutineReminderScheduler: NodeJS.Timeout | undefined;
}

export function ensureReminderScheduler() {
  if (globalThis.__dailyRoutineReminderScheduler) {
    return;
  }

  globalThis.__dailyRoutineReminderScheduler = setInterval(async () => {
    try {
      await getReminderService().sendDueReminders();
    } catch (error) {
      console.error("Reminder scheduler failed", error);
    }
  }, intervalMs);
}
