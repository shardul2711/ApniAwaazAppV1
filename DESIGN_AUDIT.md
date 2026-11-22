# Design Audit & Frontend Architecture Plan: Apni Awaaz

**Product:** Apni Awaaz (अपनी आवाज़ / आपली आवाज)  
**Tagline:** Your Voice, Your Independence  
**Target Audience:** Older Indian adults, individuals benefiting from hyper-accessible voice-first interaction, and their multigenerational family caregivers.  
**Languages:** Marathi (मराठी), Hindi (हिन्दी), English  
**Design Reference Source:** `stitch_apni_awaaz_voice_assistant/stitch_apni_awaaz_voice_assistant/`  

---

## 1. Assets Found & Their Paths

All assets are located under the directory `stitch_apni_awaaz_voice_assistant/stitch_apni_awaaz_voice_assistant/`:

| Directory / File Path | Type | Contents & Purpose |
|-----------------------|------|-------------------|
| `apni_awaaz/DESIGN.md` | Design System Spec | Color palette (hex codes), Typography scales (Noto Sans + Atkinson Hyperlegible Next), Spacing, Elevation & Depth tokens, Shape definitions, and Component anatomy. |
| `screen_1_log_in_verification_1/code.html` + `screen.png` | HTML Mockup + Export PNG | Screen 1 (Variant 1): Log In & Verification — Mobile number entry (+91) with speech input button, 6-digit tactile OTP inputs, voice call code option, error banner, and trust indicators. |
| `screen_1_log_in_verification_2/code.html` + `screen.png` | HTML Mockup + Export PNG | Screen 1 (Variant 2): Log In & Verification — Refined layout with step indicators and voice guide quick trigger. |
| `screen_2_sign_up_1/code.html` + `screen.png` | HTML Mockup + Export PNG | Screen 2 (Variant 1): Family Sign Up ("Parivaar Saathi Portal") — Full name with mic input, mobile number, 4-digit verification code, setup preview card. |
| `screen_2_sign_up_2/code.html` + `screen.png` | HTML Mockup + Export PNG | Screen 2 (Variant 2): Family Sign Up — Alternative layout for caregiver onboarding. |
| `screen_3_family_setup_1/code.html` + `screen.png` | HTML Mockup + Export PNG | Screen 3 (Variant 1): Family Setup / Companion Mode Configuration — Elder's profile (preferred name, spoken language English/Hindi/Marathi, trusted contact), Action capability toggles (Book a ride, Order groceries, Medicine refill, Save contact, Call family) with tactile ON/OFF switches and status badges, and Wispr Flow custom routine generator. |
| `screen_3_family_setup_2/code.html` + `screen.png` | HTML Mockup + Export PNG | Screen 3 (Variant 2): Streamlined Family Setup. |
| `screen_4_older_adult_home_1/code.html` + `screen.png` | HTML Mockup + Export PNG | Screen 4 (Variant 1): Older Adult Home Screen ("Aaj Ki Dinacharya") — Full interactive 6-state voice assistant engine (1. Ready, 2. Listening, 3. Processing, 4. Review, 5. Result, 6. Recovery/Fallback), central 172px circular speak anchor, family quick dial, and bottom navigation bar. |
| `screen_4_older_adult_home_2/code.html` + `screen.png` | HTML Mockup + Export PNG | Screen 4 (Variant 2): Clean Home Screen in Devanagari Hindi ("नमस्ते, मीरा", 172px mic anchor, family dial anchor, bottom navigation). |

---

## 2. Screens Identified

From the design references and the product scope, the application is organized into the following screens and interaction flows:

1. **Onboarding & Welcome Flow:**
   - Welcome & Value Proposition ("Apni Awaaz - Your Voice, Your Independence").
   - Multi-language Selection (Marathi मराठी, Hindi हिन्दी, English) with native script representation.
   - Accessibility Configuration (Standard / Large / Extra Large text; Slow / Normal / Fast speech speed; High Contrast mode toggle).
   - In-context Permissions Education (Microphone, Notifications, Contacts, Location).
2. **Authentication Flow (Screen 1 & Screen 2):**
   - Elder / Family Member Mobile Login (+91 phone input with inline voice dictation).
   - OTP Verification with visual focus, auto-fill affordance, countdown timer, resend, and accessible "Get code via phone call".
   - Caregiver / Family Portal Sign Up ("Parivaar Saathi").
3. **Family Setup & Companion Mode Configuration (Screen 3):**
   - Elder profile personalization (Preferred name, spoken language, primary trusted contact).
   - Capability toggles with tactile ON/OFF switches (Ride booking, Grocery ordering, Medicine refill, Contact saving, Family calling).
   - Custom routine generator with voice prompt preview ("Wispr Flow voice").
4. **Older Adult Home Screen ("Aaj Ki Dinacharya" / Screen 4):**
   - Header with status indicators, language toggle, and caregiver pill.
   - Friendly greeting ("Hello, Meera" / "नमस्ते, मीरा").
   - 172px Hero Voice Anchor ("Speak" / "बोलें" / "बोला").
   - Quick action prompt suggestions ("Try saying: Book an auto to the hospital").
   - Persistent Emergency / Family Direct Call ("Call Family: Ananya").
   - 5-tab Bottom Navigation (Aaj / Dawai / Bolein / Parivar / Madad).
5. **Voice Assistant Experience (Screen 4 Center Stage):**
   - State 1: **Ready** (invitation to speak, 172px orb, text fallback toggle).
   - State 2: **Listening** (pulsing concentric acoustic ripple rings, live transcription readout, stop button).
   - State 3: **Processing** (spinning audio activity indicator, context explanation, skip to review option).
   - State 4: **Review** (spoken aloud readout, trip/action details card, fare/price estimates, Confirm & Book primary CTA, Change/Cancel options).
   - State 5: **Result / Success** (success checkmark badge, driver/order confirmation, Call Driver / Call Pharmacy action, return home).
   - State 6: **Recovery / Fallback** ("I didn’t catch that", retry voice button, physical text input box with send button).
6. **Task & Commerce Mobility Flows:**
   - **Reminders & Dawai (दवाई):** Medication alerts, upcoming/completed tasks, voice reminder creation, snooze/dismiss actions.
   - **Ride Booking (Book an Auto / Cab):** Pickup/destination selection, fare estimates, vehicle types (Auto Rickshaw, Cab), ride confirmation, driver details.
   - **Food & Groceries (किराना):** Catalog browsing/search, quantity counters, cart review, delivery address, order confirmation.
   - **Medicine Assistance (दवाइयाँ):** Medicine search, dosage form, pack size, prescription upload/status, pharmacy confirmation.
   - **Trusted Contacts & Calling (परिवार):** Large-touch contact rows, relationship labels, one-tap voice call confirmation flow.
7. **Settings & Help (मदद):**
   - Dynamic text size adjuster (Standard, Large, Extra Large).
   - Speech speed adjuster (Slow, Normal, Fast).
   - High contrast mode toggle.
   - Language switcher.
   - Privacy, Permissions, and "How to use Apni Awaaz" audio guide.

---

## 3. Extracted Design Tokens

### A. Colors (WCAG AAA Compliant Palette)
```json
{
  "canvas": "#F7F9F7",
  "surface": "#e7fefc",
  "surfaceContainerLowest": "#ffffff",
  "surfaceContainerLow": "#e1f8f6",
  "surfaceContainer": "#dcf2f0",
  "surfaceContainerHigh": "#d6edeb",
  "surfaceContainerHighest": "#d0e7e5",
  "onSurface": "#0a1f1e",
  "onSurfaceVariant": "#3f4947",
  "primary": "#00423b",
  "primaryContainer": "#075b52",
  "onPrimary": "#ffffff",
  "onPrimaryContainer": "#8bd0c5",
  "primaryFixed": "#aaf0e3",
  "onPrimaryFixed": "#00201c",
  "secondary": "#52625c",
  "onSecondary": "#ffffff",
  "secondaryContainer": "#d5e6df",
  "onSecondaryContainer": "#586862",
  "tertiary": "#553200",
  "tertiaryContainer": "#744600",
  "onTertiaryContainer": "#fcb562",
  "tertiaryFixed": "#ffddba",
  "error": "#ba1a1a",
  "errorContainer": "#ffdad6",
  "onErrorContainer": "#93000a",
  "outline": "#6f7977",
  "outlineVariant": "#bec9c6",
  "listeningHighlight": "#E1F2EB",
  "borderDefault": "#E5ECE8",
  "inputBorder": "#728783"
}
```

### B. Typography
- **Headings Font:** `Noto Sans` (Weights: 600 Semi-Bold, 700 Bold) — optimal for multi-script Indic readability (Devanagari & Latin).
- **Body & Labels Font:** `Atkinson Hyperlegible Next` / System Sans — maximum glyph disambiguation (differentiating `0`/`O`, `1`/`l`/`I`).
- **Scale:**
  - `headlineXl`: 36px (Line Height: 48px, Weight: 700)
  - `headlineLg`: 28px (Line Height: 38px, Weight: 700)
  - `headlineMd`: 22px (Line Height: 32px, Weight: 600)
  - `bodyXl`: 22px (Line Height: 34px, Weight: 500)
  - `bodyLg`: 20px (Line Height: 32px, Weight: 400)
  - `bodyMd`: 18px (Line Height: 28px, Weight: 400) - *Strict floor for body text*
  - `labelLg`: 18px (Line Height: 26px, Weight: 600)
  - `labelMd`: 16px (Line Height: 24px, Weight: 600) - *Floor for labels/captions*

### C. Spacing & Hit Targets
- Minimum touch target: `48x48dp` (primary action buttons scale to `56dp–64dp`, Hero voice orb is `172x172dp`, bottom dock orb is `72x72dp`).
- Outer Margin: `20dp` (1.25rem).
- Space XS: `8dp`, Space SM: `12dp`, Space MD: `20dp`, Space LG: `28dp`, Space XL: `40dp`.

### D. Radii (Shape System)
- `sm`: `4dp`
- `DEFAULT`: `8dp`
- `md`: `12dp` (Input fields, secondary cards)
- `lg`: `16dp` (Task cards, modals, primary surfaces)
- `xl`: `24dp` (Preview sheets)
- `full`: `9999dp` (Orb buttons, status badges, switch pills)

### E. Elevation & Shadows
- **Level 1 (Surfaces & Cards):** Ambient lift `0px 4px 16px rgba(23, 43, 42, 0.05)`, 1px border `#E5ECE8`.
- **Level 2 (Active/Selected Card):** `#E1F2EB` surface, 2px border `#075B52`.
- **Level 3 (Voice Action Orb):** Elevation `0px 6px 20px rgba(7, 91, 82, 0.28)`, active ripple rings at 30% and 15% opacity.

---

## 4. Missing or Ambiguous Design Details & Resolutions

1. **Food/Grocery & Medicine Specialized Screens in Stitch Folder:**
   - *Observation:* The Stitch folder has mockups for Login/Verification (Screens 1), Sign Up (Screen 2), Family Setup (Screen 3), and Older Adult Home + Voice State Machine (Screen 4). Detailed screens for Medicine, Grocery, Rides, and Reminders are specified in the Product Requirements document.
   - *Resolution:* Seamlessly extend the exact design system tokens, typography scales, card layouts, and 2-step confirmation dialogues from Screen 4 and `DESIGN.md` into dedicated sub-screens for Medicine, Groceries, Cab Booking, Reminders, and Contacts.
2. **Audio / Speech Engine:**
   - *Observation:* In live production, speech-to-text and text-to-speech would connect to backend APIs (FastAPI + Indic Whisper/Sarvam/Google TTS).
   - *Resolution:* Implement a modular `SpeechProvider` adapter interface (`startListening`, `stopListening`, `speak`, `stopSpeaking`). Include Expo Speech for real TTS voice playback in English and Hindi, plus a responsive simulation engine with typed fallback so the entire state machine can be tested interactively on any device or emulator.
3. **Data Persistence & State Management:**
   - *Observation:* Elders require state to persist across app launches (chosen language, text size, saved family contacts, medicine schedules).
   - *Resolution:* Use a lightweight `Zustand` store paired with `AsyncStorage` and `expo-secure-store` for sensitive settings, with preloaded realistic mock data in Demo Mode.

---

## 5. Implementation Roadmap (Phases 1 to 5)

- **Phase 1: Foundation & Infrastructure**
  - Initialize clean Expo React Native project with TypeScript.
  - Set up design tokens, color palette, typography scales, and accessibility theme provider.
  - Implement Localization (Marathi, Hindi, English).
  - Configure navigation structure and service contracts.
- **Phase 2: Core Experience**
  - Implement Onboarding, Language Selection, and Accessibility settings preview.
  - Build Screen 1 (Login & OTP), Screen 2 (Caregiver Signup), and Screen 3 (Family Setup).
  - Build Screen 4 (Elder Home) with 172px central voice orb, greeting, prompt suggestions, and bottom nav.
  - Implement the full 6-state Voice Assistant state machine (Ready -> Listening -> Processing -> Review -> Result -> Recovery) with voice synthesis and typed fallback.
- **Phase 3: Daily Tasks (Reminders, Contacts, Activity)**
  - Implement Reminders & Dawai (दवाई) schedule with local notification triggers.
  - Implement Trusted Contacts & One-Tap Call Confirmation.
  - Implement Activity History log with action status badges.
- **Phase 4: Commerce & Mobility Flows**
  - Implement Cab / Auto Rickshaw booking flow with fare preview and driver result.
  - Implement Medicine Refill & Pharmacy verification flow with strict confirmation safety.
  - Implement Grocery & Food order flow with cart quantity adjustments and total calculation.
  - Provide deterministic Mock API client conforming to `API_CONTRACT.md`.
- **Phase 5: Polish, Validation & Testing**
  - Unit tests for cart calculations, reminder validation, and confirmation logic.
  - Verify accessibility labels, contrast ratios, and touch target sizes.
  - Full TypeScript check, linting, and verification.
