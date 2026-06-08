import nodemailer from "nodemailer";
import { getAppBaseUrl, getMailConfig } from "@/Backend/config/env";
import type { RoutineTask } from "@/Backend/reminders/types";

export class Mailer {
  async sendReminder(task: RoutineTask) {
    const config = getMailConfig();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    await transporter.sendMail({
      from: `"Daily Routine" <${config.user}>`,
      to: config.to,
      subject: `Reminder: ${task.title}`,
      html: this.renderReminderHtml(task),
      text: `${task.title}\n\n${task.note || "It is time for this task."}\n\nOpen: ${getAppBaseUrl()}`,
    });
  }

  private renderReminderHtml(task: RoutineTask) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1d2424;">
        <div style="background: #226b55; color: white; padding: 22px 24px; border-radius: 8px 8px 0 0;">
          <p style="margin: 0; font-size: 13px; letter-spacing: .08em; text-transform: uppercase;">Daily Routine</p>
          <h1 style="margin: 8px 0 0; font-size: 26px;">${escapeHtml(task.title)}</h1>
        </div>
        <div style="background: #fff; border: 1px solid #dce2dc; border-top: 0; padding: 24px; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 16px; color: #64706d;">Scheduled time: <strong>${task.time}</strong></p>
          <p style="font-size: 16px; line-height: 1.6;">${escapeHtml(task.note || "It is time to complete this task.")}</p>
          <a href="${getAppBaseUrl()}" style="display: inline-block; margin-top: 14px; background: #226b55; color: #fff; padding: 12px 16px; border-radius: 6px; text-decoration: none;">Open routine</a>
        </div>
      </div>
    `;
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let mailer: Mailer | undefined;

export function getMailer() {
  mailer ??= new Mailer();
  return mailer;
}
