import { RoutineDashboard } from "@/Frontend/components/routine-dashboard";
import { getReminderService } from "@/Backend/reminders/service";
import { ensureReminderScheduler } from "@/Backend/scheduler/reminder-scheduler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Home() {
  ensureReminderScheduler();
  try {
    const tasks = await getReminderService().listTasks();
    return <RoutineDashboard initialTasks={tasks} />;
  } catch (error) {
    return (
      <RoutineDashboard
        initialError={(error as Error).message}
        initialTasks={[]}
      />
    );
  }
}
