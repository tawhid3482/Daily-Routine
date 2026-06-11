import { getReminderService } from "@/Backend/reminders/service";

const intervalMs = 30_000;

declare global {
  var __dailyRoutineReminderScheduler: NodeJS.Timeout | undefined;
}

async function runReminderCheck() {
  try {
    const result = await getReminderService().sendDueReminders();
    if (result.sent > 0) {
      console.log(`[reminder-scheduler] Sent ${result.sent} reminder(s).`);
    }
  } catch (error) {
    console.error("[reminder-scheduler] Reminder check failed", error);
  }
}

export function ensureReminderScheduler() {
  if (globalThis.__dailyRoutineReminderScheduler) {
    return;
  }

  console.log("[reminder-scheduler] Starting reminder checks every 30 seconds.");

  void runReminderCheck();

  globalThis.__dailyRoutineReminderScheduler = setInterval(() => {
    void runReminderCheck();
  }, intervalMs);
}
