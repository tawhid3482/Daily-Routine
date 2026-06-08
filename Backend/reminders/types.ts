export type RoutineTask = {
  id: string;
  title: string;
  note: string;
  time: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastNotifiedDate?: string;
};

export type CreateTaskInput = {
  title?: unknown;
  note?: unknown;
  time?: unknown;
  active?: unknown;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type ReminderRunResult = {
  checked: number;
  sent: number;
  dueTaskIds: string[];
};
