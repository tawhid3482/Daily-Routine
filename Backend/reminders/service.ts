import { getMailer } from "@/Backend/mail/mailer";
import { getReminderRepository } from "./repository";
import type {
  CreateTaskInput,
  ReminderRunResult,
  UpdateTaskInput,
} from "./types";
import { validateCreateTask, validateUpdateTask } from "./validation";

export class ReminderService {
  constructor(
    private readonly repository = getReminderRepository(),
    private readonly mailer = getMailer(),
  ) {}

  async listTasks() {
    return this.repository.list();
  }

  async createTask(input: CreateTaskInput) {
    const task = validateCreateTask(input);
    const now = new Date().toISOString();
    return this.repository.create({
      ...task,
      createdAt: now,
      updatedAt: now,
    });
  }

  async updateTask(id: string, input: UpdateTaskInput) {
    return this.repository.update(id, validateUpdateTask(input));
  }

  async deleteTask(id: string) {
    await this.repository.delete(id);
  }

  async sendDueReminders(now = new Date()): Promise<ReminderRunResult> {
    const tasks = await this.repository.list();
    const today = toLocalDateKey(now);
    const currentTime = toLocalTimeKey(now);
    const dueTasks = tasks.filter(
      (task) =>
        task.active &&
        task.time <= currentTime &&
        task.lastNotifiedDate !== today,
    );

    let sent = 0;
    for (const task of dueTasks) {
      await this.mailer.sendReminder(task);
      await this.repository.markNotified(task.id, today);
      sent += 1;
    }

    return {
      checked: tasks.length,
      sent,
      dueTaskIds: dueTasks.map((task) => task.id),
    };
  }
}

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toLocalTimeKey(date: Date) {
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${hour}:${minute}`;
}

let service: ReminderService | undefined;

export function getReminderService() {
  service ??= new ReminderService();
  return service;
}
