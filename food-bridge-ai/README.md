# 🌿 FOOD BRIDGE AI – Smart Food Waste Rescue Agent

> **"Rescue Food. Reduce Waste. Feed Lives."**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-166534.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-22C55E.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748.svg)](https://www.prisma.io/)
[![Leaflet](https://img.shields.io/badge/Maps-OpenStreetMap-199900.svg)](https://leafletjs.com/)

---

## 📌 1. Project Overview

**Food Bridge AI** is an intelligent, full-stack food rescue and redistribution platform engineered to solve the commercial food waste paradox. Every day, metric tons of edible meals are discarded by restaurants, banquet halls, hotels, and supermarkets due to unpredictability and dispatch bottlenecks. Meanwhile, community shelters, orphanages, and food pantries struggle to secure consistent daily nutrition.

Food Bridge AI connects commercial food donors directly with verified NGOs, food banks, and volunteer couriers using an automated **4-Factor AI Smart Matching Engine** and **automated collection urgency detection**.

---

## ⚡ 2. Key Architecture & Features

### 🔐 Module 1: Role-Based Authentication & Authorization
- Secure JWT-based authentication with bcrypt password hashing.
- Four customized stakeholder portals:
  - **Food Donor:** Restaurants, hotels, caterers, banquet halls, and supermarkets.
  - **NGO / Food Bank:** Verified shelters, charities, community dining halls.
  - **Volunteer Courier:** Delivery partners operating motorcycles, cars, and vans.
  - **Admin Superuser:** Organization verification, safety audit trail, system analytics.
- **1-Click Hackathon Role Switcher:** Effortlessly switch between all 4 personas on any screen for live demonstrations.

### 🍲 Module 2: Surplus Food Donation Management
- Full CRUD lifecycle: `AVAILABLE` → `REQUESTED` → `APPROVED` → `ASSIGNED` → `PICKED UP` → `DELIVERED` → `EXPIRED`.
- Detailed listings with food category, quantity, preparation timestamp, collection deadline, storage temperature protocol, allergen warnings, and food photos.
- Integrated safety audit checklist on creation.

### 🧠 Module 3: AI Smart Matching Engine
- Multi-factor mathematical scoring model:
  $$\text{Score} = (\text{Distance} \times 35\%) + (\text{Urgency} \times 30\%) + (\text{Quantity Suitability} \times 20\%) + (\text{Receiver Capacity} \times 15\%)$$
- **Distance (35%):** Great-circle Haversine formula calculation.
- **Urgency (30%):** Dynamic priority for imminent perishables.
- **Quantity Suitability (20%):** Matching batch size to receiver absorption capacity.
- **Receiver Capacity (15%):** Prioritizing verified charities with active distribution pipelines.
- Transparent explainable match breakdown for every organization.

### 🤖 Module 4: AI Food Waste Assistant
- Built-in conversational AI assistant trained on food rescue protocols, temperature danger zones (5°C–60°C), shelf-life guidelines, and AI title/description generator.
- Mock engine for local demos + optional zero-latency Gemini LLM connectivity via `GEMINI_API_KEY`.
- Built-in safety refusal: The assistant never certifies food safe from photos alone and advises safe composting if food was abused.

### ⏰ Module 5: Smart Expiry & Dynamic Urgency Detection
- Urgency thresholds:
  - **Normal:** > 12 hours remaining
  - **Medium:** 6 – 12 hours remaining
  - **High:** 2 – 6 hours remaining
  - **Critical:** < 2 hours remaining (pulsating visual indicator)
  - **Expired:** Automatically locked by background scanner to prevent unsafe requests.

### 🗺️ Module 6: Location & Interactive Map Integration
- Fullscreen Leaflet and OpenStreetMap integration.
- Custom SVG pin markers for surplus food (color-coded by urgency), NGOs, and food banks.
- Direct route polyline visualization between kitchen origins and charity dropoff sites.
- Geocoded sample dataset focused on **Maharashtra, India** (Mumbai, Pune, Thane).

### 🛵 Module 7: Volunteer Logistics & Verification
- Dispatch board where volunteers claim pickup assignments.
- Status progression: `ASSIGNED` → `PICKED UP` → `DELIVERED`.
- Verification protocol: photo proof URL and handover notes recorded in database with timestamps.

### 📊 Module 8: Real-Time Analytics & Impact Dashboard
- Responsive Recharts visualizations:
  - 6-month historical food rescue volume (Area chart).
  - Food category distribution (Donut chart).
  - Real-time impact indicators: total kg rescued, estimated meals provided (1 kg ≈ 2.5 meals), and avoided CO₂e methane greenhouse emissions (1 kg ≈ 2.5 kg CO₂e).

### 🔔 Module 9: In-App Notifications
- Notification bell with unread badge counter and popover list.
- Instant alerts on new requests, donor approvals, volunteer dispatches, and delivery confirmations.

### 🛡️ Module 10: Food Safety & Verification
- Mandatory declaration of preparation timestamp, storage temperature, and allergens.
- Admin verification workflow for charitable organizations.
- Immutable audit log tracking every transaction and state change.

---

## 🔑 3. Demo Accounts & Credentials

The database is pre-seeded with realistic fictional data from Maharashtra, India:

| Role | Email | Password | Organization / Entity |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@foodbridge.demo` | `Demo@1234` | System Administrator |
| **Food Donor** | `donor@foodbridge.demo` | `Demo@1234` | Spice Route Bistro (Bandra West, Mumbai) |
| **NGO / Food Bank** | `ngo@foodbridge.demo` | `Demo@1234` | Robin Hood Army - Mumbai Chapter |
| **Volunteer** | `volunteer@foodbridge.demo` | `Demo@1234` | Amit Sharma (Motorcycle, Bandra) |

*Note: All demo accounts feature instant one-click login buttons on the Login page.*

---

## 🚀 4. Local Installation & Setup

### Prerequisites
- Node.js (v18 or higher; v20 LTS recommended)
- npm (v9 or higher)

### Step 1: Install Dependencies
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### Step 2: Database Setup & Seeding
```bash
cd server
# Generate Prisma Client & push SQLite schema
npx prisma db push

# Seed realistic demo data (15 listings, 11 organizations, 5 volunteers)
npx tsx prisma/seed.ts
```

### Step 3: Run the Application
In terminal 1 (Start Backend Server):
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

In terminal 2 (Start React Frontend):
```bash
cd client
npm run dev
# Client starts on http://localhost:5173
```

---

## 🛠️ 5. Technology Stack

- **Frontend:**
  - React 18, TypeScript, Vite
  - Tailwind CSS, Lucide React icons
  - React Router v6, TanStack React Query v5
  - Recharts (Data Visualizations)
  - Leaflet & OpenStreetMap (Geographic Maps)
  - Canvas Confetti
- **Backend:**
  - Node.js, Express.js, TypeScript
  - Prisma ORM (Object-Relational Mapping)
  - SQLite (`dev.db`) database
  - JSON Web Tokens (JWT) & bcryptjs
  - Zod validation schemas
  - Automated background urgency scanner
- **AI Engine:**
  - Rule-Based 4-Factor Smart Matching Engine
  - Pluggable AI Assistant with Gemini 1.5 Flash support

---

## ☁️ 6. Production Database & Firebase Migration Guide

The application architecture isolates all database access in service/repository layers:

### A. Migrating from SQLite to PostgreSQL / Supabase
1. Update `server/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. In `server/.env`, set your connection string:
   ```env
   DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres?schema=public"
   ```
3. Run:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

### B. Migrating to Firebase (Auth, Firestore, Cloud Storage, FCM)
1. **Firebase Authentication:** Replace `auth.controller.ts` token verification with `firebase-admin.auth().verifyIdToken()`.
2. **Cloud Firestore:** The Prisma models map 1:1 to Firestore collections (`users`, `organizations`, `foodDonations`, `donationRequests`, `deliveries`, `notifications`).
3. **Firebase Storage:** Upload food donation images to Firebase Storage bucket and save public download URLs.
4. **Firebase Cloud Messaging (FCM):** Forward notifications to mobile devices when requests are approved or assigned.

---

## 🧪 7. Walkthrough & Demo Testing Instructions

1. **Open Frontend:** Visit `http://localhost:5173`
2. **Explore Public Landing Page:** Review problem statement, impact metrics, and live listings feed.
3. **Test One-Click Login:**
   - Go to `/login` and click **"Food Donor"**.
   - Review incoming requests on `DonorDashboard`. Click **"Approve & Dispatch"**.
   - Click **"Publish Surplus Food"** to add a new batch. Notice AI Auto-Draft fills in realistic culinary descriptions!
4. **Switch to NGO Role:**
   - Tap the top-bar **"Role: DONOR"** badge and select **"NGO / Food Bank"**.
   - Browse `/donations`, click **"View & AI Match"**, and examine the 4-factor scoring breakdown!
   - Click **"Request Food"** to submit a quantity claim.
5. **Switch to Volunteer Role:**
   - Select **"Volunteer"** from the top-bar role selector.
   - On `/volunteer-dashboard`, accept an available mission.
   - Click **"Confirm Food Picked Up"** → then **"Complete & Handover Proof"**.
6. **Open Live Map:** Go to `/map` to see live OpenStreetMap pins with filter toggles and route lines.
7. **Interact with AI Assistant:** Click the floating **"AI Food Rescue Assistant"** button in the bottom right corner to test food safety protocols and listing generators!

---

*Built with care for a hunger-free, waste-free planet.*
