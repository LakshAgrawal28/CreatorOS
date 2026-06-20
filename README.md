# 🚀 CreatorOS

### The Ultimate Sponsorship Operating System for Micro-Creators & Brands

CreatorOS is a premium, AI-native SaaS platform connecting micro-creators (1,000 to 5,000+ followers) and sponsors in a secure, automated matchmaking ecosystem. Inspired by dual-portal student & employer services like Unstop, CreatorOS handles everything from Instagram Graph API metric ingestion and pgvector-based semantic matchmaking, to Razorpay Route payment escrowing and Gemini-powered script ideation.

The app's frontend has been polished visual-for-visual to match the clean, professional, high-end minimalist **Lumina Prime** mockup designs (located under `stitch_creatoros_ai_dashboard`).

---

## 📁 Repository Directory Structure

To keep the workspace root clean and uncluttered, all non-essential and developer roadmap documents have been organized into the [files/](file:///c:/Users/LAKSH%20AGRAWAL/Desktop/VSCode/Main%20Projects/CreatorOS/files) directory.

*   `src/app/` — Next.js page routers & API endpoints
    *   `api/auth/` — NextAuth.js OAuth configuration
    *   `api/creator/` — Creator metrics endpoints
    *   `api/sponsors/` — pgvector semantic matching recommendations API
    *   `api/payments/` — Razorpay Route linked account creation & escrow releases
    *   `api/webhooks/` — Razorpay transaction capture webhook listeners
    *   `dashboard/` — Collapsible responsive dashboard layouts & portal page views
*   `src/components/` — High-fidelity reusable UI components (Sidebar, Card, Button)
*   `src/inngest/` — Inngest cron sync workers and clients
*   `src/server/` — Singleton DB connections, auth rules, and Facebook API clients
*   `src/utils/` — Razorpay transfers, Gemini embeddings, and string serialization utilities
*   `prisma/` — Prisma schema models and migrations config
*   `files/` — Relocated developer checklist, roadmaps, and review documents:
    *   [development_roadmap.md](file:///c:/Users/LAKSH%20AGRAWAL/Desktop/VSCode/Main%20Projects/CreatorOS/files/development_roadmap.md) — Comprehensive technical implementation roadmap.
    *   [implementation_plan.md](file:///c:/Users/LAKSH%20AGRAWAL/Desktop/VSCode/Main%20Projects/CreatorOS/files/implementation_plan.md) — Project implementation logs.
    *   [meta_app_review.md](file:///c:/Users/LAKSH%20AGRAWAL/Desktop/VSCode/Main%20Projects/CreatorOS/files/meta_app_review.md) — Documentation for Facebook app review permissions.
    *   [progress.md](file:///c:/Users/LAKSH%20AGRAWAL/Desktop/VSCode/Main%20Projects/CreatorOS/files/progress.md) — Progress updates of previous steps.

---

## 🛠️ Technology Stack
*   **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Material Symbols
*   **Database**: Neon Serverless PostgreSQL with **pgvector** similarity matching
*   **ORM**: Prisma 7 (with `@prisma/adapter-neon` serverless client)
*   **Authentication**: NextAuth.js with Facebook & Credentials login for offline demos
*   **Background Jobs**: Inngest daily crons for automated Meta Graph API metric ingestion
*   **AI Engine**: Google Gemini API (`@google/generative-ai`) for text embeddings (`text-embedding-004`) and storyboard script generation (`gemini-1.5-flash`)
*   **Payments**: Razorpay Route for regional INR-compliant escrow holds and automated payout split transfers to linked merchant accounts

---

## 🏗️ System Architecture

```mermaid
graph TD
    User[Sponsor / Creator] -->|HTTPS Requests| NextJS[Next.js App Router App]
    NextJS -->|OAuth Sign In| NextAuth[NextAuth.js Provider]
    NextAuth -->|Token Exchange| FacebookGraph[Facebook Meta Graph API]
    
    NextJS -->|Queries / Mutations| Prisma[Prisma ORM]
    Prisma -->|Pooled Connections| Neon[Neon Serverless PostgreSQL]
    
    InngestDev[Inngest Background Worker] -->|Triggers Crons| NextJS
    NextJS -->|Queries Stats| FacebookGraph
    
    NextJS -->|Generate Embeddings| Gemini[Google Gemini API]
    NextJS -->|Route Payouts & Escrow| Razorpay[Razorpay API]
```

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Neon Database Connection
DATABASE_URL="postgresql://neondb_owner:npg_xxx@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Facebook OAuth Keys (Requesting Instagram Business scopes)
FACEBOOK_CLIENT_ID="your-fb-app-id"
FACEBOOK_CLIENT_SECRET="your-fb-app-secret"

# Razorpay Route API Keys
RAZORPAY_KEY_ID="rzp_test_xxx"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"

# Gemini API Configuration
GEMINI_API_KEY="AIzaSyxxx"
```

### 3. Database Setup
Enable the pgvector extension and sync the database models:
```bash
# Set up vector extension
node scratch/setup-vector.js

# Sync database models
npx prisma db push
```

### 4. Running E2E Test Suite
To verify database connectivity, vector similarity functions, and escrow payout calculations:
```bash
node scratch/test-suite.js
```

### 5. Running the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in action.

---

## ⚡ Technical Highlights & Fallback Support

- **Demo/Guest Login Fallback**: In `src/app/auth/signin`, users can bypass Facebook OAuth and sign in as a "Guest Creator" or "Guest Sponsor". NextAuth will use a JWT-based session strategy matching the roles in the database.
- **Robust Payment Fallbacks**: In `src/utils/razorpay.ts`, if the credentials for Razorpay in `.env` are empty or invalid, the app automatically transitions to a Sandbox simulation mode, successfully mock-creating orders, capture states, and split releases.
- **Prisma 7 Serverless Database Connection**: In Prisma 7, the `@prisma/adapter-neon` constructor expects a database config object (`{ connectionString }`) instead of a constructed `Pool` instance. Passing a raw `Pool` object will trigger a localhost connection fallback error.
- **Gemini Embeddings & Matchmaking**: Newly generated creator profiles or campaign niches calculate `text-embedding-004` vectors (1536 dimensions) automatically and trigger direct cosine-similarity matching scores in SQL through stored database functions.
