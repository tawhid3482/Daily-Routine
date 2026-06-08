import type { Metadata } from "next";
import "@/Frontend/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Daily Routine Reminder",
    template: "%s | Daily Routine Reminder",
  },
  description:
    "Schedule daily tasks and receive clean email reminders at the right time.",
  applicationName: "Daily Routine Reminder",
  keywords: ["daily routine", "task reminder", "email notification", "productivity"],
  openGraph: {
    title: "Daily Routine Reminder",
    description: "A focused daily routine app with email reminders.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
