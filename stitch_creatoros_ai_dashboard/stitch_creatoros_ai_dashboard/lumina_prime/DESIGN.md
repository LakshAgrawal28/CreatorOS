---
name: Lumina Prime
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#994700'
  on-secondary: '#ffffff'
  secondary-container: '#fb7800'
  on-secondary-container: '#592600'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1c1c'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffdbc8'
  secondary-fixed-dim: '#ffb68b'
  on-secondary-fixed: '#321200'
  on-secondary-fixed-variant: '#753400'
  tertiary-fixed: '#e4e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-label:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-value:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 32px
  gutter: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  max-width-content: 1200px
---

## Brand & Style

This design system embodies the "Billion-dollar AI startup" persona through a blend of **High-End Minimalism** and **Soft Futurism**. It is designed to feel like a high-performance tool that remains calm under pressure, drawing inspiration from the structural clarity of Linear and the fluid, experimental interfaces of Arc.

The aesthetic prioritizes clarity and intentionality. We utilize large amounts of white space (negative space) to reduce cognitive load, paired with sophisticated "glass" surfaces that suggest depth without the clutter of traditional shadows. The emotional response is one of quiet confidence—premium, reliable, and cutting-edge without being loud or aggressive.

## Colors

The palette is anchored by a high-end neutral base. The background uses a sophisticated off-white to reduce eye strain, while cards and primary containers use pure white to pop against the canvas. 

- **Primary Black (#111111):** Used for primary text and high-contrast UI elements to ensure a grounded, authoritative feel.
- **Accent Orange (#FF7A00):** Reserved for critical actions, highlights, and moments of brand personality. It should be used sparingly to maintain the "calm" persona.
- **Glass/Translucency:** Use `rgba(255, 255, 255, 0.7)` with a 20px background blur for sidebars and floating overlays to achieve the futuristic, airy aesthetic.

## Typography

This system uses a three-font hierarchy to distinguish between intent and function.

1.  **Sora (Headings):** Geometric and bold. Used for page titles and section headers to provide a structural, modern "tech" feel.
2.  **Inter (Body):** The workhorse. Chosen for its legendary readability and neutral tone. Used for all long-form text, inputs, and UI descriptions.
3.  **Space Grotesk (Metrics/Data):** A technical, monospaced-adjacent font used exclusively for numerical data, status labels, and small metadata. This reinforces the "AI/Operating System" narrative.

## Layout & Spacing

The layout model follows a **Fluid-Fixed Hybrid**. Content is centered within a 1200px container on desktop, but utilizes fluid margins that expand as the viewport grows.

- **The 8px Rhythm:** All spacing (padding, margins, gaps) must be a multiple of 8px.
- **Generous Gutters:** A 24px gutter is standard between columns to maintain an airy, premium feel.
- **Safe Areas:** On mobile, side margins should never drop below 20px.
- **Reflow:** Components should transition from horizontal stacks to vertical stacks at the 768px (Tablet) breakpoint.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Glassmorphism** rather than heavy drop shadows.

- **Level 0 (Base):** Background (#F6F6F6).
- **Level 1 (Cards):** Pure White (#FFFFFF) with a 1px border (#E5E5E5). This is the primary surface for content.
- **Level 2 (Overlays):** Glass surfaces with `backdrop-filter: blur(20px)` and a very subtle 10% black shadow with a 30px spread.
- **Borders:** Use thin, 1px lines to define shapes. Do not use shadows to separate adjacent cards; use the background/surface contrast.

## Shapes

The design system uses a distinctive **20px radius (rounded-xl)** for all primary containers and cards. This large radius creates a friendly, "OS-like" feel that mimics high-end hardware and modern browser frames.

- **Standard Elements (Buttons, Inputs):** 12px (0.75rem).
- **Primary Cards/Modals:** 20px (1.25rem).
- **Chips/Status Badges:** Fully pill-shaped for immediate visual distinction.

## Components

### Buttons
- **Primary:** #111111 background, white text, 12px radius. Subtle scale-down effect (0.98) on click.
- **Secondary:** Transparent background, 1px #E5E5E5 border, #111111 text.
- **Accent:** #FF7A00 background for high-conversion CTAs.

### Input Fields
- Use a soft gray background (#EDEDED) in their rest state, transitioning to Pure White with a 1px #111111 border on focus. No glowing shadows—only a crisp border change.

### Cards
- Always Pure White. The border should be #E5E5E5. Inside padding is a minimum of 24px to maintain "generous spacing."

### Chips & Tags
- For data-heavy views, use Space Grotesk in all-caps. Success tags use a soft green background with dark green text; Warning tags use amber.

### Navigation
- Sidebar should be glassmorphic (#FFFFFF at 70% opacity + 20px blur). Active states are indicated by a 3px vertical Accent Orange bar on the left edge.