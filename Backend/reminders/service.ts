import { getMailer } from "@/Backend/mail/mailer";
import { getReminderRepository } from "./repository";
import { isTaskDue, toLocalDateKey, toLocalTimeKey } from "./time";
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
    const update = validateUpdateTask(input);
    if (update.time !== undefined) {
      return this.repository.update(id, {
        ...update,
        lastNotifiedDate: undefined,
      });
    }
    return this.repository.update(id, update);
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
        isTaskDue(task.time, currentTime) &&
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

let service: ReminderService | undefined;

export function getReminderService() {
  service ??= new ReminderService();
  return service;
}
