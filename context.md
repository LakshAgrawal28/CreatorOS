# CreatorOS ── Technical Context for AI Developers

This document serves as a "Truth Engine" and technical context guide for AI assistants and engineering teams working on the **CreatorOS** codebase. It outlines the Next.js page mappings, role-based navigation structures, design token implementations, and rules for extending the product.

---

## 🏗️ Repository Architecture & Status

CreatorOS is a Next.js App Router project connecting micro-creators with brand sponsors. It implements both a **Facebook/Instagram OAuth** pipeline and a robust **Demo/Credentials Login** fallback.

### App Shell & Core Page Mappings
The page routing is organized inside `src/app/` as follows:

-   **Landing Page**: [src/app/page.tsx](file:///c:/Users/LAKSH%20AGRAWAL/Desktop/VSCode/Main%20Projects/CreatorOS/src/app/page.tsx) — Main marketing presentation aligned with Lumina Prime minimal grid structures.
-   **Dashboard (Main)**: [src/app/dashboard/page.tsx](file:///c:/Users/LAKSH%20AGRAWAL/Desktop/VSCode/Main%20Projects/CreatorOS/src/app/dashboard/page.tsx) — Dual overview layout rendering metric cards (followers, engagement rate, earnings), SVG charts, heatmaps, and deliverables calendars.
-   **Analytics Hub**: [src/app/dashboard/analytics/page.tsx](file:///c:/Users/LAKSH%20AGRAWAL/Desktop/VSCode/Main%20Projects/CreatorOS/src/app/dashboard/analytics/page.tsx) — Detailed page displaying Followers sparklines, Audience Reach, Impressions, cubic follower growth curves, AI Insights summaries, and demographics.
-   **Content Studio (AI Editor)**: [src/app/dashboard/creator/studio/page.tsx](file:///c:/Users/LAKSH%20AGRAWAL/Desktop/VSCode/Main%20Projects/CreatorOS/src/app/dashboard/creator/studio/page.tsx) — Premium 3-pane content editing layout containing input parameter forms, Notion-style text editor canvas, and inline AI suggestions.
-   **Calendar & Pipeline**: [src/app/dashboard/creator/calendar/page.tsx](file:///c:/Users/LAKSH%20AGRAWAL/Desktop/VSCode/Main%20Projects/CreatorOS/src/app/dashboard/creator/calendar/page.tsx) — Combined interactive Month Calendar Grid and Kanban workflow board (Ideas, In Production, Under Review, Scheduled) with quick schedule creator sidebar.
-   **Brand Match Engine (CRM)**: [src/app/dashboard/sponsor/matches/page.tsx](file:///c:/Users/LAKSH%20AGRAWAL/Desktop/VSCode/Main%20Projects/CreatorOS/src/app/dashboard/sponsor/matches/page.tsx) — Dynamic role-based match visualizer:
    -   *For Creators*: Displays Recommended Brands (Boat, Noise, Skillshare) with radial score charts and Outreach Deal tables.
    -   *For Sponsors*: Displays campaign selectors, dynamic pgvector Creator Recommendations, and matched creator CRM pipelines.
-   **AI Assistant**: [src/app/dashboard/assistant/page.tsx](file:///c:/Users/LAKSH%20AGRAWAL/Desktop/VSCode/Main%20Projects/CreatorOS/src/app/dashboard/assistant/page.tsx) — Centered single-column chat view with predefined suggestions row, stat cards inside messages, and floating input bars.
-   **Sponsorship Messages**: [src/app/dashboard/messages/page.tsx](file:///c:/Users/LAKSH%20AGRAWAL/Desktop/VSCode/Main%20Projects/CreatorOS/src/app/dashboard/messages/page.tsx) — Chat rooms with channels list sidebar and WebSocket connectivity status badges.

---

## 🎨 Design Tokens & UI Constraints (Lumina Prime)

The codebase implements a unified design system centered on high-end minimalism and professional layouts.

### 1. Color System
*   `background` / `surface` / `surface-bright`: `#f9f9f9` (Light, calm canvas to reduce eye strain)
*   `surface-container-lowest`: `#ffffff` (Card background, container blocks)
*   `surface-container-low`: `#f3f3f3` (Active sidebar items, hover states, input containers)
*   `primary`: `#000000` (Titles, solid buttons, primary bold text)
*   `on-surface-variant`: `#444748` (Secondary description text, labels)
*   `secondary-container`: `#fb7800` / `#ff7a00` (Accent Orange - highlight indicators, match circles, active icons)
*   `outline-variant`: `#c4c7c7` / `#e5e5e5` (1px clean border separations)

### 2. Fonts Hierarchy
*   **Sora (Headings)**: Bold page titles and header labels.
*   **Inter (Body)**: Default body, description, button, table text.
*   **Space Grotesk (Metrics)**: Data numbers, matching percentages, badges.

### 3. Borders & Shapes
*   `rounded-[20px]` (Primary cards, chat bubbles, calendar grid sections).
*   `rounded-xl` (12px - Buttons, input fields, dropdown select lists).
*   `rounded-full` (Chips, status tags, pill badges).

---

## 🔄 Dynamic State & Data Schemas

### 1. Database models references:
-   **ContentItem** (replaces old `contentDeliverable` references) maps Scheduled deliverables with platform (`Instagram` | `YouTube` | `TikTok` | `Twitter`), format (`Reel` | `Video` | `Story` | `Post`), and status (`Idea` | `Production` | `Review` | `Scheduled`) using the `scheduledAt` field.
-   **CreatorProfile** / **SponsorProfile** handles details for matches.
-   **Match** store cached scores computed via pgvector.

### 2. Fallback Sandbox rules:
If API keys or database adapters fail:
-   `src/utils/razorpay.ts` falls back to simulated capture, release, and order creations.
-   `src/app/dashboard/assistant/page.tsx` renders rich, responsive fallback templates with embedded stats blocks if Gemini is offline.
-   `src/app/dashboard/sponsor/matches/page.tsx` outputs complete mock cards for Boat (92%), Noise (88%), and Skillshare (75%) alongside Red Bull / Notion deal tracking.
