# Jiya-Portfolio

> Modern, dark futuristic portfolio website for **Jiya Baghel** — B.Tech Computer Science student specializing in Artificial Intelligence and Machine Learning at Symbiosis Institute of Technology, Nagpur.

---

## ✨ Features

- **Dark Futuristic Aesthetic**: Obsidian backgrounds, subtle ambient glows, glassmorphic panels, and responsive UI built with Tailwind CSS.
- **Dynamic Content Architecture**: Zero hardcoded personal details in frontend JSX. All portfolio data is loaded dynamically from `/api/portfolio`.
- **Honest & Verified Credentials**:
  - Academic background at Symbiosis Institute of Technology, Nagpur.
  - Semester CGPA: 7.5 explicitly noted as a semester academic record.
  - 10 Featured projects across AI/ML, Software, Embedded Systems, and Hackathons.
  - Ongoing project (*CA Workease*) clearly labeled as **In Progress**.
  - Leadership roles: Organising Secretary (Event Management), Co-coordinator of Competitive Club, National-level Dancer, Gold Medal in Dodgeball, and SIH contender.
- **Visitor Telemetry & Resend Email Alerts**:
  - Automatically captures visitor technical telemetry (IP address, city, region, country, ISP, device type, browser, referrer, timestamp).
  - Automatically dispatches transactional HTML alerts via **Resend** directly to `jiyab623@gmail.com`.
  - Built-in 15-minute session debouncing to prevent inbox flooding on rapid reloads.
- **Interactive Contact Form**:
  - Full server-side validation & RFC-standard email verification.
  - Mandatory data consent checkbox explaining data transmission to `jiyab623@gmail.com`.
  - Anti-spam honeypot bot trap.
- **Private Admin & Analytics Dashboard**:
  - Protected by passcode (`jiya2026`, configurable via `ADMIN_PASSCODE`).
  - View real-time visitor logs with IP addresses, geographic distribution, and device metrics.
  - Access submitted contact messages inbox.
  - Built-in "Test Resend Dispatch" button to verify email delivery.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React icons
- **Backend**: Node.js, Express, tsx
- **Email Delivery**: Resend SDK (`@resend/node`)
- **Testing**: `node:test` + `tsx --test`
- **Build & Bundler**: Vite 8

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Jiya2006/Jiya-Portfolio.git
cd Jiya-Portfolio
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set your Resend API key and settings in `.env`:
```env
# Get your free key at https://resend.com/api-keys
RESEND_API_KEY="re_123456789..."

# Target email to receive visitor tracking and contact messages
NOTIFICATION_EMAIL="jiyab623@gmail.com"

# Admin passcode to unlock private analytics
ADMIN_PASSCODE="jiya2026"
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 4. Run Tests & Validation
```bash
# Run unit tests
npx tsx --test src/utils/portfolio-logic.test.ts

# Run type-check & lint
npm run lint

# Build production bundle
npm run build
```

---

## 📤 Pushing to GitHub (`Jiya-Portfolio`)

To link and push this codebase to your GitHub account (`https://github.com/Jiya2006/Jiya-Portfolio`):

```bash
# 1. Create a new repository named 'Jiya-Portfolio' on GitHub (github.com/new)
# 2. Add the remote URL:
git remote add origin https://github.com/Jiya2006/Jiya-Portfolio.git

# 3. Push to main:
git branch -M main
git push -u origin main
```

---

## 🔒 Privacy & Data Ethics

In accordance with strict ethical standards:
- Normal site visits do **not** identify a visitor's name or personal email.
- Geolocation is determined at the approximate city/region level from IP address.
- Visitor's name and contact email are only collected when voluntarily submitted through the Contact Form.
- All stored visitor records can be reviewed exclusively via the authenticated Admin Telemetry dashboard.
