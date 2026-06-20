# CreatorOS ── SaaS Implementation Plan

This document outlines the end-to-end implementation plan to transition the CreatorOS mockups into a production-ready, highly-scalable SaaS platform. It leverages **Next.js App Router (React/TypeScript)**, **Neon Serverless PostgreSQL (with pgvector)**, **Prisma ORM**, **Razorpay Route**, **Socket.io with Redis**, and **Meta Graph API (Instagram)**.

## Approach
We will build a modular Next.js application where the frontend strictly implements the **Lumina Prime** design system. The backend will execute serverless API routes connected to a Neon PostgreSQL database. Heavy operations—such as daily Instagram metrics synchronization, vector match calculation, and email outreach—will run asynchronously via background workers (BullMQ/Redis or Inngest). Real-time messaging will run on a clustered WebSocket server using a Redis adapter.

---

## Scope

### In
*   **Core Architecture**: Next.js 14+ App Router, TypeScript, Tailwind CSS, Prisma ORM, and Neon Serverless PostgreSQL.
*   **Authentication & Roles**: NextAuth.js/Clerk supporting Role-Based Access Control (RBAC) for `CREATOR` and `SPONSOR` types, integrated with Facebook Login.
*   **Instagram Data Ingestion**: Background tasks to fetch follower growth, engagement rates, and media insights via the Instagram Graph API.
*   **Semantic Matchmaking**: Database-level vector similarity search using Neon's `pgvector` extension matching Creator Profile metrics and Brand Campaign criteria.
*   **Escrow & Connected Payouts**: Razorpay Route linked account onboarding for creators, payment collections for sponsors, and automatic escrow release.
*   **Real-Time Messaging**: Clustered Socket.io server using Redis Pub/Sub adapter to sync chat across instances.
*   **Frontend Modules**: 8 responsive views (Landing Page, Dashboard, CRM, Content Studio, Calendar, Trend Pulse, Analytics Hub, AI Assistant) dynamically bound to the PostgreSQL state.

### Out
*   **Multi-Platform API Ingestion**: Direct API integrations for TikTok, YouTube, or Twitter/X (initial version uses mock data inputs; production focuses exclusively on Instagram).
*   **Platform Dispute Resolution UI**: Automated legal arbitration (disputes are handled manually via the Razorpay merchant dashboard in V1).
*   **Paid Ad Manager**: Directly buying Instagram/Facebook ads on behalf of sponsors.

---

## Action Items

### 🟩 Step 1: Base Environment & Neon Database Setup
Initialize the Next.js framework, configure Tailwind with Lumina Prime tokens, and connect Prisma to the Neon serverless PostgreSQL instance.
-   [ ] Initialize the Next.js workspace: `npx -y create-next-app@latest ./ --ts --tailwind --app --src-dir --eslint --import-alias "@/*"`
-   [ ] Install Prisma and database clients: `npm install @prisma/client prisma pg dotenv`
-   [ ] Initialize Prisma schema: `npx prisma init`
-   [ ] Enable `pgvector` in the Neon PostgreSQL console or via migration: `CREATE EXTENSION IF NOT EXISTS vector;`
-   [ ] Map Lumina Prime colors, spacing, and fonts (Sora, Inter, Space Grotesk) in `tailwind.config.ts`.
-   [ ] Define database schemas in `prisma/schema.prisma` for `User`, `CreatorProfile`, `SponsorProfile`, `Campaign`, `Match`, `Application`, `ContentItem`, `Message`, and `EscrowTransaction` (matching the roadmap specification).
-   [ ] Run initial database migration: `npx prisma migrate dev --name init_saas_schema`

### 🔑 Step 2: Authentication & Social Account Link
Configure authentication provider and set up Facebook Login to acquire permissions for the Instagram Graph API.
-   [ ] Install auth dependencies: `npm install next-auth`
-   [ ] Setup NextAuth configuration in `src/app/api/auth/[...nextauth]/route.ts`.
-   [ ] Set up Facebook OAuth provider, configuring client credentials, and callback paths.
-   [ ] Configure scopes requesting Instagram and Facebook permissions: `instagram_basic, instagram_manage_insights, pages_show_list, pages_read_engagement`.
-   [ ] Implement backend helper functions to exchange short-lived user tokens for 60-day long-lived access tokens, storing them securely in `CreatorProfile.metaAccessToken`.
-   [ ] Implement middleware routing to block non-authenticated sessions and redirect users based on their role (`Role.CREATOR` vs `Role.SPONSOR`).

### 📊 Step 3: Meta Ingestion & Analytics Pipeline
Create background synchronization workers to pull creator statistics and historical media metrics.
-   [ ] Setup background worker infra using Inngest or BullMQ: `npm install inngest`
-   [ ] Create background function `syncInstagramMetrics` triggered daily or on-demand:
    *   Fetch follower count, biography, and profile media count.
    *   Query details for the last 15 media posts (likes, comments, media URL, timestamp).
    *   Calculate average Engagement Rate: `((likes + comments) / posts) / followers`.
    *   Fetch lifetime audience country and age/gender demographic JSON.
-   [ ] Map ingestion results to update the `CreatorProfile` table in the database.
-   [ ] Create API endpoint `GET /api/creator/metrics` to expose current stats to frontend charts.

### 🧠 Step 4: Embeddings-Based AI Matchmaking Engine
Set up OpenAI/Gemini text embeddings to calculate Match Scores between creators and sponsor campaigns.
-   [ ] Install AI SDK: `npm install @google/generative-ai` or `npm install openai`
-   [ ] Create a utility file `src/utils/embeddings.ts` to transform profile parameters and campaign descriptions into 1536-dimension vectors.
-   [ ] Create database triggers or middleware hooks:
    *   Generate a new profile vector embedding when `CreatorProfile` details (bio, niche, demographics) update.
    *   Generate a new campaign vector embedding when a sponsor creates or updates a `Campaign`.
-   [ ] Write a PostgreSQL database function using Prisma raw query to search and calculate cosine similarity between creator profiles and brand campaigns:
    ```sql
    CREATE OR REPLACE FUNCTION match_creators_to_campaign(campaign_vector vector(1536), min_followers int, max_followers int)
    RETURNS TABLE(creator_id text, score float) AS $$
      SELECT id, (1 - (profileEmbedding <=> campaign_vector)) AS score
      FROM "CreatorProfile"
      WHERE followerCount BETWEEN min_followers AND max_followers
      ORDER BY score DESC;
    $$ LANGUAGE sql;
    ```
-   [ ] Create API endpoint `GET /api/sponsors/matches` returning sorted recommended creators for a given campaign.

### 💳 Step 5: Razorpay Route & Escrow Infrastructure
Build the payment onboarding pipeline for creators and the secure checkout escrow hold for brand sponsors.
-   [ ] Install Razorpay SDK: `npm install razorpay`
-   [ ] Create linked account creation endpoint `POST /api/payments/route/onboard` to register creators as Route partners in Razorpay.
-   [ ] Create Razorpay Webhook handler `src/app/api/webhooks/razorpay/route.ts` to capture payment transactions, updating `EscrowTransaction` statuses.
-   [ ] Create order checkout endpoint `POST /api/payments/escrow/order` to generate a Razorpay Order ID for brand campaign deposits.
-   [ ] Create release endpoint `POST /api/payments/escrow/transfer` to trigger Razorpay Route split transfer releasing funds to the creator's connected bank account minus platform fees.

### 🍱 Step 6: Responsive Layout & Design System Scaffolding
Create the primary layout wrapper, sidebar navigation, and glassmorphic panels conforming to Lumina Prime.
-   [ ] Create global CSS config in `src/app/globals.css` with glassmorphic utility rules (`.glass-panel`, `.card-surface`).
-   [ ] Build global layout component `src/app/dashboard/layout.tsx` incorporating:
    *   Collapsible glassmorphic sidebar menu (`<aside>`).
    *   Top navigation bar (`<header>`) with profile preview, notifications drop-down, and global search bar.
    *   Main viewport canvas (`<main>`) with a maximum width boundary of `1200px`.
-   [ ] Design utility component `<Card>` with `rounded-xl` (`20px`) radius, white background, and custom thin borders.
-   [ ] Design button components supporting `.bg-primary`, `.bg-transparent` (bordered), and `.bg-secondary-container` (Accent Orange) with custom scale animations on click.

### 🏠 Step 7: Landing Page & Main Dashboard
Build the marketing page and the main summary metric interface for creators.
-   [ ] Implement Landing Page (`src/app/page.tsx`) mapping HTML hooks, text animations, and mockup previews.
-   [ ] Implement Dashboard Overview (`src/app/dashboard/page.tsx`) fetching profile stats:
    *   Connect Trend Score gauge, Follower Growth value, and active Brand Opportunities.
    *   Render Weekly Performance SVG chart with linear gradients.
    *   Render Best Posting Times heatmap grid.
    *   Display Top Performing Reel card and Upcoming Posts list.

### 🤝 Step 8: Brand Match CRM & AI Content Studio
Develop the matchmaking board and the script editing workspace.
-   [ ] Build Sponsor Engine (`src/app/dashboard/sponsors/page.tsx`):
    *   Display recommended brand cards with circular SVG match score meters.
    *   Implement CRM deal tracking table (Red Bull, Notion, Casper) showing active stages.
    *   Integrate quick actions floating FAB buttons for tracking deals and generating emails.
-   [ ] Build Content Studio (`src/app/dashboard/studio/page.tsx`):
    *   Implement left tool parameters dashboard (platform, tone, length).
    *   Build interactive rich text content editor canvas.
    *   Implement right sidebar generating AI hook variations and script drafts based on campaign guidelines using Gemini API.

### 📅 Step 9: Content Calendar & Trend Pulse
Build the scheduling grids and multi-platform social tracking screens.
-   [ ] Build Content Calendar (`src/app/dashboard/calendar/page.tsx`):
    *   Render calendar scheduler grid showing content items on their scheduled date.
    *   Build Kanban workflow board columns (Idea, Production, Review, Scheduled) supporting drag-and-drop state changes.
-   [ ] Build Trend Pulse (`src/app/dashboard/trends/page.tsx`):
    *   Display trending topics, hashtags, and audio elements segmented by Instagram, YouTube, TikTok, and Twitter/X.
    *   Add filters to sort trends by date or engagement rate.

### 💬 Step 10: Analytics Hub & Conversational AI Assistant (WebSockets Chat)
Develop deep analytical dashboards, real-time messaging using Socket.io with Redis, and the interactive assistant panel.
-   [ ] Build Analytics Hub (`src/app/dashboard/analytics/page.tsx`):
    *   Render multi-channel growth charts and platform market share graphs.
    *   Display AI-generated content optimization insights cards.
-   [ ] Deploy dedicated WebSocket Node.js server:
    *   Initialize `@socket.io/redis-adapter` linked to a Redis cluster/instance.
    *   Configure JWT authorization inside the Socket.io connection handshake.
    *   Implement WebSocket events for join/leave chat rooms (`room_deal_123`).
-   [ ] Set up write-behind caching queue (using BullMQ) on the WebSocket server to batch write messages to Neon PostgreSQL database, preventing connection pool exhaustion.
-   [ ] Build AI Assistant & Chat Window (`src/app/dashboard/assistant/page.tsx`):
    *   Implement conversational chat viewport connected to the Socket.io gateway.
    *   Build quick prompt cards ("Draft email pitch to Notion", "Analyze engagement drop").
    *   Connect user message streams with LLM processing, passing current profile database stats as context.

### 🧪 Step 11: Meta App Review Prep, Testing & Deployment
Verify application performance, configure Meta App Review components, validate security variables, and roll out.
-   [ ] Write unit tests for the pgvector matching query and the Razorpay Route transfer verification functions.
-   [ ] Audit database access parameters, ensuring creators cannot access other creators' tokens or brand campaign draft databases.
-   [ ] Configure Meta App Review requirements:
    *   Verify Business in the Meta Business Manager Console.
    *   Record walkthrough screencasts showing OAuth login permissions and dashboard data sync.
    *   Implement data deletion request callback endpoint `/api/auth/meta/data-deletion`.
-   [ ] Set up Neon connection string pooling configurations to prevent serverless database connection limits under high load.
-   [ ] Run production compilation check: `npm run build`
-   [ ] Deploy Next.js on Vercel, WebSocket nodes on AWS ECS/Fargate, and map production environment keys for Razorpay, Facebook Client Secret, Redis, and Gemini API keys.
-   [ ] Conduct final end-to-end verification.

---

## Open Questions

1.  **Razorpay KYC Account Verification**: Have you registered a business entity in India? (Razorpay Route splits require a verified merchant account with activated split capabilities).
2.  **Meta Sandbox Users**: Have we added all initial pilot creators to the Meta App Developer Role so they can connect their Instagram handles before App Review is finalized?
3.  **Redis Hosting**: Should we use Upstash Redis (serverless, quick integration) or host a clustered Redis instance on AWS ElastiCache for the Socket.io adapter and BullMQ?
