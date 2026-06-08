import { NextResponse } from "next/server";
import { getReminderService } from "@/Backend/reminders/service";

export const runtime = "nodejs";

export async function POST() {
  try {
    const result = await getReminderService().sendDueReminders();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
