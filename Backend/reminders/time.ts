const defaultTimeZone = process.env.REMINDER_TIMEZONE?.trim() || undefined;

export function getReminderTimeZone() {
  return defaultTimeZone;
}

export function toLocalDateKey(date: Date, timeZone = defaultTimeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    ...(timeZone ? { timeZone } : {}),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function toLocalTimeKey(date: Date, timeZone = defaultTimeZone) {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    ...(timeZone ? { timeZone } : {}),
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return formatted.replace(/^24:/, "00:");
}

export function isTaskDue(taskTime: string, currentTime: string) {
  return timeToMinutes(taskTime) <= timeToMinutes(currentTime);
}

function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}
