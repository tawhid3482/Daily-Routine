# Daily Routine Reminder

Daily task reminder web app built with Next.js. You can create tasks with a time, and the backend sends a Gmail reminder when the task is due.

## Folder Structure

```txt
Backend/
  config/       environment config
  mail/         Gmail mail sender
  reminders/    task model, validation, repository, service
  scheduler/    reminder interval scheduler
  storage/      MongoDB connection
  worker.ts     optional standalone reminder worker

Frontend/
  components/   UI components
  styles/       global CSS

src/app/
  page.tsx      Next.js page wrapper
  api/          Next.js API route wrappers
```

`src/app` must stay there because Next.js App Router uses that folder for pages and API routes. The actual UI code is in `Frontend/`, and the actual backend logic is in `Backend/`.

## Environment

Create `.env.local` (recommended) or `.env` in the project root with:

```env
App_user_gamil=yourgmail@gmail.com
App_pass=your_gmail_app_password
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/daily_routine
```

Optional:

```env
MAIL_TO=receiver@gmail.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
REMINDER_TIMEZONE=Asia/Dhaka
```

Set `REMINDER_TIMEZONE` if the server runs in a different timezone than you (for example UTC hosting with Bangladesh time).

If `MAIL_TO` is not set, reminders are sent to `App_user_gamil`.

## Run The Project

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

Optional standalone reminder worker:

```bash
npm run worker
```

The app starts a local reminder scheduler when running on your machine (`npm run dev` / `npm start`).

## Deploy on Vercel

Vercel is serverless — `setInterval` does not keep running in the background. Reminders are sent when something calls `/api/reminders/tick` every minute.

**Hobby (free) plan:** Vercel blocks per-minute cron (`* * * * *`). Do **not** add that to `vercel.json` on Hobby — `vercel --prod` will fail. Use the free external cron option below instead.

**Pro plan:** rename `vercel.cron.pro.example.json` to `vercel.json` to use built-in Vercel cron.

### Vercel environment variables

Add these in the Vercel project settings:

```env
App_user_gamil=yourgmail@gmail.com
App_pass=your_gmail_app_password
DATABASE_URL=mongodb+srv://...
MAIL_TO=receiver@gmail.com
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
REMINDER_TIMEZONE=Asia/Dhaka
CRON_SECRET=any-long-random-string
```

**Important**

- `REMINDER_TIMEZONE` — Vercel servers use UTC. Set this to your local timezone (e.g. `Asia/Dhaka` for Bangladesh), otherwise reminders fire at the wrong time.
- `CRON_SECRET` — protects the cron endpoint. Vercel may auto-add this after the first deploy with `vercel.json` crons.
- MongoDB Atlas → Network Access → allow `0.0.0.0/0` so Vercel can connect.

### Free cron on Hobby plan (recommended)

Use [cron-job.org](https://cron-job.org) (or similar) to call your app every minute:

- **URL:** `https://your-app.vercel.app/api/reminders/tick`
- **Method:** `GET`
- **Header:** `Authorization: Bearer YOUR_CRON_SECRET`
- **Interval:** every 1 minute

After changing env vars, redeploy the project.
