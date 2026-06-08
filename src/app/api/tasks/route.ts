import { NextResponse } from "next/server";
import { getReminderService } from "@/Backend/reminders/service";
import { ensureReminderScheduler } from "@/Backend/scheduler/reminder-scheduler";

export const runtime = "nodejs";

export async function GET() {
  try {
    ensureReminderScheduler();
    const tasks = await getReminderService().listTasks();
    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    ensureReminderScheduler();
    const body = await request.json();
    const task = await getReminderService().createTask(body);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
