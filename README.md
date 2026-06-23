# DayNest 🪺

A calm, cozy to-do list & calendar app with Gmail and SMS reminders.

## Features
- 🔐 Google OAuth sign-in
- ✅ Tasks with priority, category, date & time
- 📅 Monthly calendar with dot indicators
- 📧 Gmail notification before events (via Gmail API)
- 📱 SMS reminder (via Twilio)
- 🌙 Warm dark mode
- 💧 Habit & water tracker widgets
- 🎵 Focus mode toggle

## Setup

### 1. Clone & install
```bash
git clone <repo-url>
cd daynest
npm install
```

### 2. Configure environment
```bash
cp .env.local.template .env.local
# Fill in your credentials (see below)
```

### 3. Google Cloud Setup
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → Enable **Gmail API**
3. Create OAuth 2.0 credentials (Web Application)
4. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy `Client ID` and `Client Secret` to `.env.local`

### 4. Twilio Setup (for SMS)
1. Sign up at [twilio.com](https://www.twilio.com)
2. Get a phone number
3. Copy `Account SID`, `Auth Token`, `Phone Number` to `.env.local`

### 5. Run database migration
```bash
npx prisma migrate dev --name init
```

### 6. Start
```bash
npm run dev
# Open http://localhost:3000
```

## Tech Stack
- Next.js 14 (App Router)
- NextAuth.js v5 (Google OAuth)
- Prisma + SQLite
- Gmail API (email reminders)
- Twilio REST API (SMS reminders)
- node-cron (background scheduler)
- Vanilla CSS + Google Fonts
