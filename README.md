# ElderSaath

ElderSaath is an elderly healthcare platform connecting elderly parents with their geographically distant children/caregivers. It features a dual-interface system: a highly accessible, mobile-first interface for the elderly, and a comprehensive remote-monitoring dashboard for their family members.

## Core Features (Genuinely Working)

* **Dual Role Architecture:** Users register as either "Elder" or "Family Member".
* **Secure Family Link:** Family members link their account to their parent's account securely via email.
* **Elder Mobile-First UI:** Huge typography, heavy contrast, simple touch targets, and emoji-based visual cues.
* **Daily Health Check Wizard:** A 6-step guided check-in for Elders (Feeling, Sleep, Morning Meds, Vitals, Symptoms, Confirmation) that persists securely to the database.
* **Medication Adherence:** Elders can mark pills as "taken" on a simplified list. Caregivers can remotely add new medicines which instantly appear on the Elder's device.
* **Web Audio Alarm System:** An in-browser `<audio>` oscillator that triggers a massive, full-screen, loud flashing alarm when a medication is due (currently simulated via a "Test Alarm" button).
* **Remote Task Management:** Family can assign custom daily tasks (e.g., "Drink water") which the elder can check off.
* **Cognitive Brain Games:** 4 fully functional, custom-coded React games embedded natively (Memory Match, Tic Tac Toe, Word Scramble, Number Math Puzzle).
* **Health History Timeline:** Family members can view chronological timelines of all logged vitals.
* **Medical Document Vault:** Family members can upload PDFs/Images (base64 encoded into SQLite for the MVP) and retrieve them securely.
* **Care Provider Network:** A simple CRUD directory to store Doctor/Nurse contact info.
* **SOS Geolocation:** A massive SOS button for Elders that captures device GPS coordinates and creates an `EmergencyEvent` in the backend.

## Architecture Stubs (For Future Integration)

* **Photo OCR for BP:** The frontend `input type="file" capture="environment"` successfully opens the native camera and sends the image to `/api/ocr`. Currently, the OCR logic is a mocked stub that simulates processing and returns `138/86`. To make this real, replace the stub with Google Cloud Vision or Tesseract.js.
* **Cron API (`/api/cron`):** Secured via an `Authorization` header, this endpoint acts as a stub to trigger background SMS/Push notifications for missed pills.
* **IoT Push API (`/api/iot/push`):** Secured via a `DEVICE_SECRET_KEY`, this endpoint is ready to accept HTTP POSTs from Bluetooth-enabled BP monitors or Apple Watches.

## Tech Stack & Security

* **Frontend:** Next.js 14 App Router, React, Tailwind CSS
* **Backend:** Next.js Serverless API Routes
* **Database:** SQLite via Prisma ORM
* **Auth:** NextAuth (Credentials Provider)
* **Security Checks Completed:** All API routes (`/api/health`, `/api/medications`, `/api/documents`, `/api/tasks`) enforce authorization by checking the `CaregiverRelationship` table to ensure a child can *only* read/write data for their successfully linked parent. ID manipulation is blocked.

## Deployment & Local Development

1. Install dependencies: `npm install`
2. Run database push: `npx prisma db push`
3. Start the dev server: `npm run dev`
4. The application is PWA-ready with a generated `manifest.json`.

## Recommended 2-Minute Interview Demo Flow

1. Register a new **Elder** (Dad) and a new **Family Member** (Son).
2. Log in as the Son. On the dashboard, type the Dad's email to **Link Parent**.
3. Go to **Manage Medications** and add a new pill (e.g., "Amlodipine, 5mg").
4. Go to **Manage Tasks** and add a task (e.g., "Call your grandson").
5. Log out, and log in as the **Elder**.
6. Show the **Test Alarm** button at the bottom of the home screen to demonstrate the loud, pulsing medication reminder overlay.
7. Click **Health Check**, skip to Step 4, and click **📷 Scan**. Show how the camera opens, simulates extracting BP data, and auto-populates the box.
8. Click into **Brain & Wellness** and play a quick game of *Memory Match*.
9. Hit the red **SOS EMERGENCY** button to trigger the geolocation API.
10. Log back in as the **Child** to show the populated Health History Timeline and Medication Adherence ratio.
