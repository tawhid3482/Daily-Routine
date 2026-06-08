import { MongoClient, type Collection } from "mongodb";
import type { RoutineTask } from "@/Backend/reminders/types";

const databaseName = "daily_routine";
const collectionName = "routine_tasks";

declare global {
  var __dailyRoutineMongoClientPromise: Promise<MongoClient> | undefined;
}

export type RoutineTaskDocument = Omit<RoutineTask, "id"> & {
  _id: string;
};

export async function getRoutineTaskCollection(): Promise<
  Collection<RoutineTaskDocument>
> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing in .env");
  }

  globalThis.__dailyRoutineMongoClientPromise ??= new MongoClient(databaseUrl, {
    serverSelectionTimeoutMS: 8_000,
  }).connect();
  const client = await globalThis.__dailyRoutineMongoClientPromise;
  return client
    .db(getDatabaseName(databaseUrl))
    .collection<RoutineTaskDocument>(collectionName);
}

function getDatabaseName(databaseUrl: string) {
  try {
    const url = new URL(databaseUrl);
    const pathDatabase = url.pathname.replace("/", "").trim();
    return pathDatabase || databaseName;
  } catch {
    return databaseName;
  }
}

export function taskDocumentToRoutineTask(document: RoutineTaskDocument): RoutineTask {
  const { _id, ...task } = document;
  return {
    ...task,
    id: _id,
  };
}

export function routineTaskToDocument(task: RoutineTask): RoutineTaskDocument {
  const { id, ...document } = task;
  return {
    ...document,
    _id: id,
  };
}
