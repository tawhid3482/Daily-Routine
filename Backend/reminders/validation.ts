import type { CreateTaskInput, UpdateTaskInput } from "./types";

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function validateCreateTask(input: CreateTaskInput) {
  const title = normalizeText(input.title);
  const note = normalizeText(input.note);
  const time = typeof input.time === "string" ? input.time.trim() : "";
  const active = typeof input.active === "boolean" ? input.active : true;

  if (!title) {
    throw new Error("Task title is required");
  }

  if (!timePattern.test(time)) {
    throw new Error("Reminder time must be in HH:mm format");
  }

  return { title, note, time, active };
}

export function validateUpdateTask(input: UpdateTaskInput) {
  const update: {
    title?: string;
    note?: string;
    time?: string;
    active?: boolean;
  } = {};

  if ("title" in input) {
    const title = normalizeText(input.title);
    if (!title) {
      throw new Error("Task title is required");
    }
    update.title = title;
  }

  if ("note" in input) {
    update.note = normalizeText(input.note);
  }

  if ("time" in input) {
    const time = typeof input.time === "string" ? input.time.trim() : "";
    if (!timePattern.test(time)) {
      throw new Error("Reminder time must be in HH:mm format");
    }
    update.time = time;
  }

  if ("active" in input) {
    update.active = Boolean(input.active);
  }

  return update;
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
