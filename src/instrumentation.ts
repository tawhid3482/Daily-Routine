export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.VERCEL) {
    return;
  }

  const { ensureMongoDnsResolution } = await import("@/Backend/storage/dns");
  ensureMongoDnsResolution();

  const { ensureReminderScheduler } = await import(
    "@/Backend/scheduler/reminder-scheduler"
  );
  ensureReminderScheduler();
}
