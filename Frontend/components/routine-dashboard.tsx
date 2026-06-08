"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  Plus,
  Power,
  RefreshCw,
  Trash2,
} from "lucide-react";
import type { RoutineTask } from "@/Backend/reminders/types";
import styles from "./routine-dashboard.module.css";

type Props = {
  initialError?: string;
  initialTasks: RoutineTask[];
};

type FormState = {
  title: string;
  note: string;
  time: string;
};

const initialForm: FormState = {
  title: "",
  note: "",
  time: "09:00",
};

export function RoutineDashboard({ initialError, initialTasks }: Props) {
  const [tasks, setTasks] = useState(initialTasks);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState(
    initialError
      ? `MongoDB connection issue: ${initialError}`
      : "Ready to remind you by email.",
  );
  const [isPending, startTransition] = useTransition();

  const nextTask = useMemo(
    () => tasks.filter((task) => task.active).sort((a, b) => a.time.localeCompare(b.time))[0],
    [tasks],
  );

  const activeCount = tasks.filter((task) => task.active).length;

  function submitTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not create task");
        setTasks((current) => [...current, data.task].sort(sortByTime));
        setForm(initialForm);
        setMessage("Task saved. Email reminder scheduler is active.");
      } catch (error) {
        setMessage((error as Error).message);
      }
    });
  }

  function toggleTask(task: RoutineTask) {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/tasks/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: !task.active }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not update task");
        setTasks((current) =>
          current.map((item) => (item.id === task.id ? data.task : item)).sort(sortByTime),
        );
        setMessage(data.task.active ? "Reminder turned on." : "Reminder paused.");
      } catch (error) {
        setMessage((error as Error).message);
      }
    });
  }

  function deleteTask(id: string) {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not delete task");
        setTasks((current) => current.filter((task) => task.id !== id));
        setMessage("Task removed.");
      } catch (error) {
        setMessage((error as Error).message);
      }
    });
  }

  function runCheck() {
    startTransition(async () => {
      try {
        const response = await fetch("/api/reminders/tick", { method: "POST" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not run reminder check");
        setMessage(`Checked ${data.checked} task(s). Sent ${data.sent} email(s).`);
      } catch (error) {
        setMessage((error as Error).message);
      }
    });
  }

  return (
    <main className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.kicker}>
            <CalendarClock size={18} />
            Daily Routine Reminder
          </div>
          <h1>Plan the day, get the email exactly when it matters.</h1>
          <p>
            Add daily tasks with a time. The backend checks every minute and sends a Gmail
            reminder once per task per day.
          </p>
        </div>

        <div className={styles.statusPanel}>
          <div>
            <span>Active</span>
            <strong>{activeCount}</strong>
          </div>
          <div>
            <span>Next</span>
            <strong>{nextTask ? nextTask.time : "--:--"}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>Gmail</strong>
          </div>
        </div>
      </section>

      <section className={styles.workspace}>
        {initialError ? (
          <div className={styles.alertPanel}>
            <strong>MongoDB connection needs attention</strong>
            <span>
              Check `DATABASE_URL`, Atlas network access, and whether your machine can resolve the
              MongoDB SRV host. The UI is loaded, but tasks cannot save until MongoDB connects.
            </span>
          </div>
        ) : null}

        <form className={styles.formPanel} onSubmit={submitTask}>
          <div className={styles.panelTitle}>
            <Bell size={20} />
            <h2>New reminder</h2>
          </div>

          <label>
            Task name
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Morning workout"
              required
            />
          </label>

          <label>
            Reminder time
            <input
              value={form.time}
              onChange={(event) => setForm({ ...form, time: event.target.value })}
              type="time"
              required
            />
          </label>

          <label>
            Note
            <textarea
              value={form.note}
              onChange={(event) => setForm({ ...form, note: event.target.value })}
              placeholder="Short context for the email"
              rows={5}
            />
          </label>

          <button className={styles.primaryButton} disabled={isPending}>
            {isPending ? <Loader2 className={styles.spin} size={18} /> : <Plus size={18} />}
            Add reminder
          </button>
        </form>

        <div className={styles.listPanel}>
          <div className={styles.listHeader}>
            <div>
              <div className={styles.panelTitle}>
                <Clock3 size={20} />
                <h2>Today&apos;s routine</h2>
              </div>
              <p>{message}</p>
            </div>
            <button className={styles.iconButton} onClick={runCheck} disabled={isPending} title="Run check now">
              <RefreshCw size={18} />
            </button>
          </div>

          <div className={styles.taskList}>
            {tasks.length === 0 ? (
              <div className={styles.emptyState}>
                <Mail size={28} />
                <strong>No reminders yet</strong>
                <span>Create your first daily reminder from the form.</span>
              </div>
            ) : (
              tasks.map((task) => (
                <article className={styles.taskItem} key={task.id}>
                  <div className={styles.timeBadge}>{task.time}</div>
                  <div className={styles.taskBody}>
                    <div className={styles.taskTopline}>
                      <h3>{task.title}</h3>
                      {task.lastNotifiedDate ? (
                        <span className={styles.sentBadge}>
                          <CheckCircle2 size={14} />
                          {task.lastNotifiedDate}
                        </span>
                      ) : null}
                    </div>
                    <p>{task.note || "No note added."}</p>
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={task.active ? styles.activeButton : styles.mutedButton}
                      onClick={() => toggleTask(task)}
                      title={task.active ? "Pause reminder" : "Start reminder"}
                      type="button"
                    >
                      <Power size={16} />
                    </button>
                    <button
                      className={styles.dangerButton}
                      onClick={() => deleteTask(task.id)}
                      title="Delete reminder"
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function sortByTime(a: RoutineTask, b: RoutineTask) {
  return a.time.localeCompare(b.time);
}
