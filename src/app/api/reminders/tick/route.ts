import { NextResponse } from "next/server";
import { getReminderService } from "@/Backend/reminders/service";
import { ensureReminderScheduler } from "@/Backend/scheduler/reminder-scheduler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isCronRequest(request: Request) {
  return request.method === "GET";
}

function isAuthorizedCron(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return process.env.NODE_ENV !== "production";
  }

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${cronSecret}`;
}

async function runTick(request: Request) {
  if (isCronRequest(request) && !isAuthorizedCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.VERCEL) {
    ensureReminderScheduler();
  }

  const result = await getReminderService().sendDueReminders();
  return NextResponse.json(result);
}

export async function GET(request: Request) {
  try {
    return await runTick(request);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    return await runTick(request);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
