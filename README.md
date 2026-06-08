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

Your `.env` should include:

```env
App_user_gamil=yourgmail@gmail.com
App_pass=your_gmail_app_password
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/daily_routine
```

Optional:

```env
MAIL_TO=receiver@gmail.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

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

The app also starts a reminder scheduler when the website/API is running.
