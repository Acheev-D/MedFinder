# 💊 MedFinder — Real-Time Last-Mile Medicine Availability Network

> **"Help is here, closer than you think."**  
> A zero-friction, demand-driven verification network connecting patients directly with local neighborhood pharmacies in real time.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://medfinder-orpin.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React_18_|_TypeScript_|_Tailwind_CSS-blue?style=for-the-badge&logo=react)](https://github.com/Acheev-D/MedFinder)
[![Build Tool](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)

---

## 📌 The Problem

During medical emergencies or urgent health needs, finding prescribed medicines is a stressful, blind process:
* **The Last-Mile Blindspot:** Patients and caregivers physically travel between 3 to 5 stores in a panic.
* **The Static Database Fallacy:** Over 90% of independent neighborhood pharmacies do not maintain synced cloud databases, rendering static inventory catalog apps outdated and unreliable.
* **Prescription Cost Inflation:** Patients frequently overpay for expensive branded drugs simply because they are unaware of identical, lower-cost generic bio-equivalents.

---

## 💡 The Solution

MedFinder eliminates the need for complex, heavy inventory software by flipping the model into a **Reverse-Demand Real-Time Verification Dispatch**:
[ Patient Searches Medicine ]
│
▼
[ 60-Second Geo-Broadcast Radar (3 km) ]
│
▼
[ Nearby Pharmacist Claims Availability with 1 Tap ]
│
▼
[ 30-Minute Counter Reservation Pass (#4829 PIN) ]
│
▼
[ Secure 4-Digit Counter Handover Verification ]

---

## 🚀 Key Features

### 📱 Patient Mobile Experience
* **Smart Formula Matching & Generic Toggle:** Detects the active chemical salts of branded drugs and suggests verified generic equivalents with a user-controlled opt-in switch.
* **60-Second Low-Anxiety Store Radar:** Replaces stressful timers with a calm, gentle pulsating broadcast querying nearby participating chemists.
* **1-Tap Radius Expansion:** Easily expands search bounds to 8 km if immediate neighborhood stores are out of stock.
* **Just-In-Time (JIT) Verification:** Zero sign-up friction—users can search freely without logging in until the final reservation step.
* **Reassuring Reservation Pass:** Issues a calm, non-stressful timestamp (`Saved at counter until 4:15 PM`), turn-by-turn map directions, and a 4-digit pickup code.

### 🏥 Pharmacist Counter Terminal (Zero-Friction POS)
* **1-Tap Response Cards:** Chemists receive audio-visual pings and claim stock instantly (`Have Exact Brand`, `Have Same Formula`, or `Out of Stock`).
* **Optional Dynamic Price Quoting:** Allows pharmacists to quote an exact counter price without blocking fast responses.
* **Strict 4-Digit PIN Handover:** Eliminates inventory race conditions by requiring the customer's PIN code before marking orders complete.
* **Multi-Request Queue Management:** Live table tracking multiple active reservations while simultaneously accepting fresh incoming customer requests.
* **Offline Excel/CSV Inventory Uploader:** In-browser spreadsheet parser that flags matching stock from uploaded inventory files (`In Uploaded Stock • Shelf A-2`).
* **Collapsible POS Panel:** Smooth drawer toggle to collapse the counter panel and focus on the mobile viewport for presentations.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (Hooks, Context API) |
| **Language** | TypeScript |
| **Styling & Design** | Tailwind CSS (Soft-minimalist healthcare glassmorphism) |
| **Icons & Media** | Lucide React, Vector SVG |
| **Build & Tooling** | Vite, PostCSS, Oxlint |
| **Audio Synthesis** | Native Web Audio API |
| **Deployment & CI/CD** | Vercel, GitHub Actions |

---

## 🏁 Quick Start & Local Development

### Prerequisites
* Node.js (v18.0.0 or later)
* npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repository
git clone [https://github.com/Acheev-D/MedFinder.git](https://github.com/Acheev-D/MedFinder.git)

# 2. Navigate to project directory
cd MedFinder

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
