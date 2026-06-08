import { randomUUID } from "node:crypto";
import {
  getRoutineTaskCollection,
  routineTaskToDocument,
  taskDocumentToRoutineTask,
} from "@/Backend/storage/mongodb";
import type { RoutineTask } from "./types";

export class ReminderRepository {
  async list() {
    const collection = await getRoutineTaskCollection();
    const documents = await collection.find({}).sort({ time: 1 }).toArray();
    return documents.map(taskDocumentToRoutineTask);
  }

  async create(task: Omit<RoutineTask, "id">) {
    const nextTask: RoutineTask = { ...task, id: randomUUID() };
    const collection = await getRoutineTaskCollection();
    await collection.insertOne(routineTaskToDocument(nextTask));
    return nextTask;
  }

  async update(id: string, patch: Partial<RoutineTask>) {
    const collection = await getRoutineTaskCollection();
    const safePatch = { ...patch };
    delete safePatch.id;
    const result = await collection.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...safePatch,
          updatedAt: new Date().toISOString(),
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      throw new Error("Task not found");
    }

    return taskDocumentToRoutineTask(result);
  }

  async markNotified(id: string, date: string) {
    const collection = await getRoutineTaskCollection();
    const result = await collection.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          lastNotifiedDate: date,
          updatedAt: new Date().toISOString(),
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      throw new Error("Task not found");
    }

    return taskDocumentToRoutineTask(result);
  }

  async replace(task: RoutineTask) {
    const collection = await getRoutineTaskCollection();
    const updatedTask = {
      ...task,
      updatedAt: new Date().toISOString(),
    };
    await collection.replaceOne(
      { _id: task.id },
      routineTaskToDocument(updatedTask),
      { upsert: true },
    );
    return updatedTask;
  }

  async delete(id: string) {
    const collection = await getRoutineTaskCollection();
    await collection.deleteOne({ _id: id });
  }
}

let repository: ReminderRepository | undefined;

export function getReminderRepository() {
  repository ??= new ReminderRepository();
  return repository;
}
