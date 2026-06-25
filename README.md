# DayNest - Calm To-Do & Calendar App 🪺

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748.svg)](https://www.prisma.io/)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-v5-purple.svg)](https://authjs.dev/)

A calm, cozy to-do list and calendar app designed to feel like a warm journal. Sign in with your Google account, create tasks with dates and times, and receive gentle reminders via **Gmail** and **SMS** when events are due.

---

## 🚀 Live Demo

You can access the live web deployment here:
**👉 [https://daynest-nest.vercel.app](https://daynest-nest.vercel.app)**

---

## ✨ Features

- **🪺 Cozy Aesthetic**: Warm ivory palette, Playfair Display serif titles, paper texture background, soft shadows, and smooth animations — designed to feel like a journal.
- **🔐 Google OAuth Sign-In**: Secure authentication via NextAuth.js v5 with Google provider, requesting Gmail API scope for email notifications.
- **📅 Full Calendar View**: Monthly calendar grid with sage-green dot indicators on days with tasks. Tap any day to view and manage its tasks.
- **✅ Rich Task Creation**: Add tasks with title, notes, date, time, priority (Low/Medium/High), and category (Personal, Work, Health, Study, Home).
- **📧 Gmail Email Reminders**: Sends a styled reminder email via the Gmail API using your own authenticated OAuth token — 15 minutes before task time.
- **📱 SMS Reminders via Twilio**: Sends an SMS notification to your registered phone number before tasks are due.
- **⏰ Background Scheduler**: `node-cron` job runs every minute server-side to check for upcoming tasks and fire notifications automatically.
- **📊 Progress Ring**: Animated SVG progress ring on the home screen showing how many tasks you've completed today.
- **🌙 Warm Dark Mode**: One-tap theme toggle with a cozy dark palette. Accent color customization with 5 swatches.
- **💧 Habit & Water Tracker**: Quick-tap widgets for daily habit streaks, water intake, and focus music mode.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Auth**: NextAuth.js v5 (Google OAuth 2.0 + Gmail API scope)
- **Database**: Prisma ORM + SQLite (local) / PostgreSQL (production)
- **Email**: Gmail REST API (sends via user's own Google account)
- **SMS**: Twilio REST API (no SDK — pure fetch)
- **Scheduler**: node-cron (runs inside Next.js instrumentation hook)
- **Styles**: Vanilla CSS (custom design system, Google Fonts — Playfair Display + Nunito)

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/shriyanshthanneeru2407-dotcom/DayNest.git
cd DayNest
npm install
```

### 2. Configure environment variables
```bash
cp .env.local.template .env.local
# Fill in your credentials (see below)
```

### 3. Google Cloud Setup (for Gmail + OAuth)
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → Enable **Gmail API**
3. Create **OAuth 2.0 credentials** (Web Application type)
4. Add Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy `Client ID` and `Client Secret` to `.env.local`

### 4. Twilio Setup (for SMS)
1. Sign up at [twilio.com](https://www.twilio.com)
2. Get a phone number from the console
3. Copy `Account SID`, `Auth Token`, and your Twilio phone number to `.env.local`

### 5. Run database migration
```bash
npx prisma migrate dev --name init
```

### 6. Start the app
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 File Structure

```
daynest/
│
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   │   ├── tasks/route.ts                # GET + POST tasks
│   │   ├── tasks/[id]/route.ts           # PATCH + DELETE task
│   │   └── profile/route.ts             # Update user settings
│   ├── today/page.tsx                   # Home screen (greeting, progress, widgets)
│   ├── tasks/page.tsx                   # All tasks with category filter
│   ├── calendar/page.tsx               # Monthly calendar + day view
│   ├── settings/page.tsx               # Theme, phone, notifications
│   └── login/page.tsx                  # Google sign-in page
├── components/
│   ├── TaskCard.tsx                    # Task row with checkbox, tags, delete
│   ├── AddTaskModal.tsx                # Bottom sheet task creation form
│   ├── ProgressRing.tsx                # Animated SVG completion ring
│   ├── BottomNav.tsx                   # 4-tab bottom navigation
│   └── PhoneBanner.tsx                 # SMS onboarding prompt
├── lib/
│   ├── auth.ts                         # NextAuth config (Google + Prisma adapter)
│   ├── prisma.ts                       # Prisma client singleton
│   ├── gmail.ts                        # Gmail API email sender
│   ├── twilio.ts                       # Twilio REST SMS sender
│   └── scheduler.ts                    # node-cron notification job
├── hooks/
│   └── useTasks.ts                     # React hook for task CRUD
├── prisma/
│   └── schema.prisma                   # DB schema (User, Task, NextAuth models)
├── .env.local.template                 # Environment variable template
├── instrumentation.ts                  # Next.js hook to start scheduler
└── vercel.json                         # Vercel deployment config
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
