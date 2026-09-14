# 📘 ElderSaath: Corporate Project Documentation

**Project Name:** ElderSaath (Remote Elderly Healthcare & Monitoring Platform)
**Document Version:** 1.0 (Production Release Candidate)
**Date:** September 2026
**Architecture:** Full-Stack Serverless (Next.js App Router)

---

## 1. Executive Summary
ElderSaath is a dual-interface, full-stack web application designed to bridge the gap between elderly individuals living independently and their remote family caregivers. The platform solves the critical issue of remote health monitoring by providing a highly accessible, specialized interface for seniors, paired with a modern, data-rich analytical dashboard for family members. 

## 2. Technology Stack & Architecture
The application is built using a modern Silicon Valley stack, optimized for rapid iteration, extreme scalability, and edge deployment.

*   **Frontend Framework:** Next.js 14 (App Router, React 19)
*   **Styling Engine:** Tailwind CSS (incorporating modern Glassmorphism & strict WCAG accessibility standards)
*   **Backend / API:** Next.js Serverless Route Handlers (`/api/...`)
*   **Database:** PostgreSQL (Hosted on Neon.tech for serverless connection pooling)
*   **ORM (Object-Relational Mapping):** Prisma ORM
*   **Authentication:** NextAuth.js v5 (JWT-based Credentials Auth with Role-Based Access Control)
*   **CI/CD & Hosting:** GitHub (Source Control) -> Vercel (Continuous Deployment Pipeline)
*   **Specialized Libraries:**
    *   `tesseract.js`: Client-side Optical Character Recognition (OCR)
    *   `bcryptjs`: Cryptographic password hashing
    *   `Web Audio API`: Persistent browser-based alarm systems

---

## 3. Comprehensive Feature Breakdown (A-Z)

### A. Role-Based Access Control (RBAC) Architecture
The system relies on strict middleware and API layer protection, routing users based on three distinct roles:
1.  **ELDER:** Restricted to high-accessibility views. Can only view assigned tasks and submit data.
2.  **CHILD (Family):** SaaS-style dashboard. Can view linked Elder data and assign tasks.
3.  **ADMIN:** Superuser access to platform analytics, user deletion, and system-wide broadcasts.

### B. The Elder Interface (Highly Accessible UI)
Designed specifically for cognitive and visual ease.
*   **Aesthetic:** Massive typography, high-contrast borders, thick skeuomorphic drop-shadows, and large touch targets.
*   **Health Check-in (OCR Integration):** Elders can use their device camera to take a photo of their physical Blood Pressure monitor. Tesseract.js parses the image, uses Regex to find BP/Pulse values, and automatically logs them to the database.
*   **Automated Medication Alarms:** A background client-side polling system that checks Prisma via `/api/medications`. When a scheduled time matches the system clock, it triggers a loud, screen-locking Web Audio alarm that forces the user to log the medication as "TAKEN".
*   **Cognitive Brain Games:** A suite of 6 offline games (including the medically backed Stroop Test and API-driven World Trivia) to promote cognitive wellness.
*   **SOS Emergency Button:** A highly prominent, pulsating red action button designed for one-tap emergency alerts.

### C. The Family Member Dashboard (Premium SaaS UI)
Designed for younger adults, featuring Silicon Valley-grade aesthetics.
*   **Aesthetic:** Glassmorphism (`backdrop-blur`), subtle mesh gradients, tight typography, and floating hover micro-interactions.
*   **Real-Time Vitals Monitoring:** View historical and daily data for SpO2, Heart Rate, Blood Sugar, and Blood Pressure.
*   **Task & Medication Assignment:** Form-driven interfaces to schedule daily tasks and medication regimens that instantly sync to the Elder's device.
*   **Connection Workflow:** Security-first linking. Entering an Elder's email sends a `PENDING` request. The connection is only activated when the Elder manually clicks "Allow Access" on their device.

### D. The Admin Console
A dedicated `/admin` portal protected by encrypted JWT validation.
*   **Platform Analytics:** Live counts of active users, elders, and database connections.
*   **Connection Severing:** Admins can forcibly break `CaregiverRelationship` links.
*   **Global Notice Broadcasting:** Admins can publish `Notice` entries to the database. A `GlobalNotice` React component listens for these and instantly drops a banner onto every user's screen system-wide.

### E. Security Measures
*   **Password Encryption:** All user passwords are salted and hashed using `bcryptjs` before entering the PostgreSQL database.
*   **Session Management:** Stateless JSON Web Tokens (JWT) encrypted via a cryptographically secure `AUTH_SECRET`.
*   **API Route Protection:** Every backend endpoint validates the session token before querying the database, preventing unauthorized data scraping.

---

## 4. Database Schema (Prisma Entity Relationship)
The relational database is fully normalized.
*   **User Table:** The central node. Holds authentication data and role.
*   **CaregiverRelationship:** A junction table linking two Users (Child -> Elder) with an approval `status` ("PENDING" or "ACTIVE").
*   **HealthMeasurement:** Time-series data storing vitals.
*   **Medication & MedicationLog:** 1-to-Many relationship tracking regimens vs. actual adherence.
*   **Task & TaskLog:** Daily chores assigned by the Child.
*   **Notice:** System-wide announcements.
*   **PasswordResetToken:** Time-limited cryptographic strings for account recovery.

---

## 5. Development Lifecycle & CI/CD
1.  **Local Development:** Code is written locally and tested via `npm run dev` with instant Fast Refresh.
2.  **Version Control:** Changes are committed and pushed via Git terminal commands.
3.  **Automated Build:** Vercel webhooks detect GitHub pushes. Vercel automatically installs dependencies, runs TypeScript strict validation, executes `prisma generate` and `prisma db push` to update the Neon PostgreSQL schema, and deploys to the Edge network.

---

## 6. Pending / Future Roadmap (V2.0)
While the MVP is fully functional and production-ready, the following features are slated for future iterations:

1.  **True WebSockets (Socket.io/Pusher):** Upgrading the current polling mechanism (used by alarms and connection requests) to real-time bi-directional WebSockets for 0-latency updates.
2.  **SMS / WhatsApp Integration (Twilio):** Connecting the SOS button to a third-party SMS API to text family members when pressed.
3.  **AI Health Analytics:** Piping historical `HealthMeasurement` data into a Machine Learning model (or LLM) to detect dangerous trends (e.g., gradually rising Blood Pressure) and alert the family automatically.
4.  **OAuth Logins:** Allowing users to sign in with Google or Apple accounts (NextAuth OAuth providers).
5.  **Push Notifications (PWA):** Utilizing Service Workers to send push notifications to mobile devices even when the app is closed.
