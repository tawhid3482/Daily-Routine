import { NextResponse } from "next/server";
import { getReminderService } from "@/Backend/reminders/service";
import { ensureReminderScheduler } from "@/Backend/scheduler/reminder-scheduler";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    ensureReminderScheduler();
    const { id } = await context.params;
    const body = await request.json();
    const task = await getReminderService().updateTask(id, body);
    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    ensureReminderScheduler();
    const { id } = await context.params;
    await getReminderService().deleteTask(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
