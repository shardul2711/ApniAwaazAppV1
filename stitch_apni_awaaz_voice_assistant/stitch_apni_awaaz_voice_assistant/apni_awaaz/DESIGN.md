---
name: Apni Awaaz
colors:
  surface: '#e7fefc'
  surface-dim: '#c8dfdc'
  surface-bright: '#e7fefc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e1f8f6'
  surface-container: '#dcf2f0'
  surface-container-high: '#d6edeb'
  surface-container-highest: '#d0e7e5'
  on-surface: '#0a1f1e'
  on-surface-variant: '#3f4947'
  inverse-surface: '#203433'
  inverse-on-surface: '#dff5f3'
  outline: '#6f7977'
  outline-variant: '#bec9c6'
  surface-tint: '#1f6960'
  primary: '#00423b'
  on-primary: '#ffffff'
  primary-container: '#075b52'
  on-primary-container: '#8bd0c5'
  inverse-primary: '#8ed3c8'
  secondary: '#52625c'
  on-secondary: '#ffffff'
  secondary-container: '#d5e6df'
  on-secondary-container: '#586862'
  tertiary: '#553200'
  on-tertiary: '#ffffff'
  tertiary-container: '#744600'
  on-tertiary-container: '#fcb562'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aaf0e3'
  primary-fixed-dim: '#8ed3c8'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#d5e6df'
  secondary-fixed-dim: '#b9cac4'
  on-secondary-fixed: '#101e1a'
  on-secondary-fixed-variant: '#3b4a45'
  tertiary-fixed: '#ffddba'
  tertiary-fixed-dim: '#ffb866'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#673d00'
  background: '#e7fefc'
  on-background: '#0a1f1e'
  surface-variant: '#d0e7e5'
typography:
  headline-xl:
    fontFamily: Noto Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-xl-mobile:
    fontFamily: Noto Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Noto Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Noto Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Noto Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 32px
  body-xl:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 34px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  label-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  margin: 1.25rem
  margin-md: 2rem
  margin-lg: 3rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 1.75rem
  space-xl: 2.5rem
---

## Brand & Style

This design system delivers a calm, dignified, and hyper-accessible voice-first digital environment tailored for older Indian adults and their multigenerational families. Recognizing age-related changes in vision, motor control, and cognitive load, the aesthetic shuns modern low-contrast micro-interactions, decorative clutter, and ephemeral design trends. Instead, it prioritizes clarity, physical obviousness, and deep respect.

The visual style blends **Modern Hyper-Accessible Minimalism** with subtle **Tactile Grounding**. Surfaces are warm, clean, and spacious, evoking the quiet dependability of an experienced household companion. Key traits include:
- **Calm & Unhurried:** Generous breathing room, rhythmic layouts, and zero visually frantic elements.
- **High Contrast & Legible:** Crisp, prominent boundaries, deep teal typography on soft ivory backdrops, and no reliance on color alone to communicate state.
- **Effortless Tactility:** Extra-large touch targets (minimum 48–56px), physically unmistakable button affordances, and unmistakable circular voice anchors.

## Colors

The palette balances traditional Indian domestic warmth with clinical-grade visual accessibility, exceeding WCAG AAA standards for critical controls and body text.

- **Canvas Background (`#F7F9F7`):** Warm off-white with a gentle mint undertone that eliminates harsh glare on mobile screens under direct sunlight or indoor lighting.
- **Surfaces (`#FFFFFF`):** Pure white container surfaces that lift cards, sheets, and setup modules distinctly off the pale canvas.
- **Primary Interactive (`#075B52`):** A deep, authoritative heritage teal used for primary actions, audio visualizer states, and the hero voice trigger button. Contrasted against `#FFFFFF` text (exceeding 8:1 contrast ratio).
- **Listening & Selection Surface (`#E1F2EB`):** A comforting, soft mint tint indicating selected cards, active listening modes, and positive readiness states.
- **Typography Tiers:**
  - *Primary Headings & Body (`#172B2A`):* Deep slate ink providing crisp 11.5:1 contrast against pure white cards.
  - *Secondary Copy & Captions (`#465B57`):* Grounded sage ink, never dropping below 5:1 contrast against surface backgrounds.
- **Input Borders (`#728783`):** High-definition boundaries ensuring form controls remain easily discernible for low-vision eyes.
- **Semantic Badges & Alerts:**
  - *Ready / Active:* `#086054` on `#E1F2EB` mint pill.
  - *Needs Setup / Attention:* `#875200` deep ochre on `#FEF3D6` warm cream pill.
  - *Error / Alert:* `#A32329` deep crimson on `#FDE8E8` soft rose surface.

## Typography

Typography prioritizes extreme character differentiation and effortless readability. The system marries **Noto Sans** for robust multi-script Indian language compatibility and structural headline clarity with **Atkinson Hyperlegible Next** for maximum glyph disambiguation in body text, numerical readouts, and interaction labels.

Rules for typographic implementation:
- **Strict Size Floor:** Standard body text never dips below 18px. Sub-captions must never drop below 16px.
- **Generous Leading:** Line height is intentionally relaxed (140%–160%) to prevent line-skipping during vocal feedback readouts and manual scanning.
- **High Letter Differentiation:** Crucial for older eyes differentiating similar characters (e.g., `0`/`O`, `1`/`l`/`I`). Atkinson Hyperlegible Next is mandated for all input values, time intervals, and helper copy.
- **No Light Weights:** Font weights strictly range between 400 (Regular), 500 (Medium), 600 (Semi-Bold), and 700 (Bold) to preserve stroke contrast across varying device displays.

## Layout & Spacing

The layout model uses a single-column-first, fluid container grid designed to avoid cognitive exhaustion. Rather than packing density into dense grids, content breathes in distinct vertical narrative chunks.

- **Touch Bounds & Safe Tap Areas:** Every interactive module must respect an absolute minimum physical hit target of 48x48px, with voice triggers and primary navigation controls scaling to 56–72px.
- **Mobile First (Single Column):** Default layout on mobile (under 600px) adheres to a 1-column stack with 1.25rem (20px) outer margins, ensuring thumb reachability without accidental mis-taps.
- **Tablet / Co-Pilot Mode (600px - 1024px):** Form reflows into a guided 2-column split (Task list on left, voice configuration / preview on right) with 1.5rem gutters.
- **Element Spacing Rhythms:** Component interior padding uses `space-md` (1.25rem) to `space-lg` (1.75rem) to maintain generous physical separation between toggles, icons, and text labels.

## Elevation & Depth

Visual hierarchy rejects hyper-deep floating dropshadows, which can cause visual blurring and cognitive confusion for aging users. Instead, elevation uses **Tonal Layering** accompanied by **Subtle Defining Outlines** and **Soft Ambient Lift**.

- **Level 0 (App Canvas):** `#F7F9F7` flat, matte surface.
- **Level 1 (Cards, Modules & Form Surfaces):** `#FFFFFF` surface bounded by a crisp 1px solid border (`#E5ECE8`). Layered with an ambient, diffused shadow: `0px 4px 16px rgba(23, 43, 42, 0.05)`.
- **Level 2 (Active Cards & In-Focus Items):** Tinted `#E1F2EB` surface bounded by a prominent 2px solid border in `#075B52`.
- **Level 3 (Voice Action Button & Sticky Controls):** Sits high on the z-axis with a distinct physical shadow: `0px 6px 20px rgba(7, 91, 82, 0.24)`, signaling that it is always ready to receive touch or speech input.
- **Listening State Depth:** When voice capture is active, the circular trigger emits an expanding dual-ring ripple using concentric 2px solid rings (`#075B52` at 30% and 15% opacity), reinforcing that the system is actively processing sound.

## Shapes

The shape system leverages **Level 2 (Rounded)** architecture to create an approachable, organic, and friendly feel without being overly stylized or childlike.

- **Containers & Task Cards:** Rounded corners with `rounded-lg` (1rem / 16px) soften boundaries while providing structured visual anchors.
- **Form Inputs & Action Buttons:** Styled with `0.5rem` (8px) to `0.75rem` (12px) radiuses, retaining a predictable rectangular affordance for interactive buttons.
- **Voice Trigger Button:** Perfectly circular (`border-radius: 9999px`) to distinguish it unambiguously from rectangular form submissions and standard tasks.
- **Status Badges & Chips:** Curvature matches `border-radius: 9999px` (full pill), creating distinct visual capsules that cannot be mistaken for editable input fields.

## Components

### 1. The Central Voice Trigger (Apni Awaaz Orb)
- **Geometry & Size:** A prominent 72x72px (mobile) to 80x80px (tablet) floating circle positioned centrally at the thumb zone or docked in the persistent bottom navigation bar.
- **Style:** Background `#075B52` with an oversized white microphone icon (32px).
- **States:**
  - *Idle:* Deep teal circle with subtle shadow. Clear text pill below reading: "Daba kar bolein" (Tap to speak).
  - *Listening:* Shifts to `#086054`, pulsing with an outer `#E1F2EB` acoustic halo.
  - *Processing:* Displays an animated 3-dot undulating transcription wave in `#FFFFFF`.

### 2. Action Buttons
- **Primary:** Full-width or auto-scaled to minimum 56px height. Filled with `#075B52`, typography in `#FFFFFF` (18px Semi-Bold). Border-radius of 12px. Pressed state deepens to `#043B35`.
- **Secondary / Cancel:** Minimum 52px height. Surface `#FFFFFF` with a 2px outline in `#075B52` and text in `#075B52`.
- **Destructive:** Surface `#FDE8E8` with 1.5px outline in `#A32329`, text `#A32329`.

### 3. Task Cards
- **Structure:** Encapsulated white containers with 20px internal padding.
- **States:**
  - *Default:* Background `#FFFFFF`, 1px solid border `#E5ECE8`.
  - *Active / Selected:* Background `#E1F2EB`, 2px solid border `#075B52`. Accompanied by a bold green checkmark indicator in the top-right corner.
- **Content:** Task title in 20px Bold `#172B2A`, recurring time/trigger in 18px Medium `#465B57` paired with high-contrast functional icons (e.g., medicine bottle, prayer bell, water reminder).

### 4. Status Badges
- **Metrics:** Height 34px, pill-shaped, horizontal padding 14px, font Atkinson Hyperlegible Next 16px Semi-Bold.
- **Ready State:** `#086054` label on `#E1F2EB` surface, accompanied by a check icon.
- **Needs Setup State:** `#875200` label on `#FEF3D6` surface, accompanied by an alert circle icon.

### 5. Form Inputs & Voice Fill Fields
- **Metrics:** Minimum height 56px with 16px horizontal padding.
- **Appearance:** Background `#FFFFFF`, 2px solid border `#728783`. Typography 18px Regular `#172B2A`.
- **Active Focus:** Border changes to 2px solid `#075B52` with a 4px soft teal focus ring.
- **Integrated Voice Fill:** Every input features an inline secondary mic button on the right edge, allowing users to speak values (e.g., times, names) directly into the field.

### 6. Radio Controls & Switches
- **Radio Buttons:** 28px diameter with a 3px border in `#728783`. Selected state features an active center dot in `#075B52` (14px diameter) with an outer `#075B52` ring.
- **Toggle Switches:** Oversized (60px width x 36px height) with a 28px sliding thumb. Clear physical labels "ON" and "OFF" embedded directly inside the track for immediate comprehension.