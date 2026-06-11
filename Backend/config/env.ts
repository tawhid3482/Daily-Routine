export type MailConfig = {
  user: string;
  pass: string;
  to: string;
};

export function getMailConfig(): MailConfig {
  const user = process.env.App_user_gamil || process.env.APP_USER_GMAIL || "";
  const pass = (process.env.App_pass || process.env.APP_PASS || "").replace(/\s/g, "");
  const to = process.env.MAIL_TO || user;

  if (!user || !pass) {
    throw new Error("Email credentials are missing in .env");
  }

  return { user, pass, to };
}

export function getAppBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
