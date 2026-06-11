import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

import { getReminderService } from "@/Backend/reminders/service";

async function run() {
  console.log("Daily Routine worker started. Checking reminders every minute.");

  await getReminderService().sendDueReminders();

  setInterval(async () => {
    try {
      const result = await getReminderService().sendDueReminders();
      if (result.sent > 0) {
        console.log(`Sent ${result.sent} reminder(s).`);
      }
    } catch (error) {
      console.error("Worker reminder check failed", error);
    }
  }, 60_000);
}

void run();
