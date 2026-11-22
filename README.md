# Apni Awaaz (अपनी आवाज़ / आपली आवाज)
> **Your Voice, Your Independence**  
> *Android-first voice-assisted mobile application for older adults, individuals benefiting from hyper-accessible interaction, and multigenerational family caregivers.*

---

## 🌟 Overview & Product Vision

**Apni Awaaz** is designed to eliminate the cognitive exhaustion, tiny touch targets, and visual clutter that often isolate older adults from everyday smartphone utility. Using natural Indian voices in **Marathi (मराठी)**, **Hindi (हिन्दी)**, and **English**, Apni Awaaz empowers seniors to complete daily tasks with confidence, dignity, and calm.

The app is **voice-first, but never voice-only**—every audible interaction is mirrored with large-type visuals and tactile touch controls adhering strictly to **WCAG AAA** accessibility standards.

---

## 🎨 Visual Identity & Design System

The application frontend faithfully implements the design system defined in `stitch_apni_awaaz_voice_assistant/apni_awaaz/DESIGN.md` and the 8 provided screen mockups:

- **Colors:**
  - **Canvas & Surfaces:** Anti-glare warm mint `#F7F9F7` / `#e7fefc` that reduces eye fatigue under indoor and sunlight conditions.
  - **Primary Interactive:** Authoritative heritage teal `#075b52` (>8:1 contrast against pure white text).
  - **Readiness & Listening Highlight:** Calming soft mint `#E1F2EB`.
  - **Typography Inks:** High-definition deep slate `#0a1f1e` (>11.5:1 contrast against white surfaces).
  - **Semantic Badges:** `#086054` on `#E1F2EB` (*Ready*), `#875200` on `#FEF3D6` (*Needs Setup*), `#A32329` on `#FDE8E8` (*Alert*).
- **Typography:**
  - **Headings:** Noto Sans (600, 700) for native Devanagari and Latin script clarity.
  - **Body & Labels:** Atkinson Hyperlegible Next / System Sans for maximum glyph disambiguation (e.g., distinguishing `0` vs `O`, `1` vs `l` vs `I`).
  - **Strict Size Floor:** Standard body text never dips below 18px; line height is relaxed at 140–160%.
- **Tactile Touch Bounds:**
  - Minimum hit target: **48×48 dp**; primary action buttons: **56–64 dp**.
  - Central Speak Orb: **172×172 dp** with animated concentric acoustic ripples.
  - Docked Navigation Orb: **72×72 dp**.

---

## 📱 Screen Inventory & Navigation Architecture

The app uses **Expo Router** with a 5-tab docked bottom navigation and specialized sub-routes:

```
app/
├── _layout.tsx                     # Root Layout (SafeArea, ThemeProvider, Toast/Status)
├── (tabs)/
│   ├── _layout.tsx                 # 5-Tab Bar (Aaj, Dawai, Bolein Orb, Parivar, Madad)
│   ├── index.tsx                   # Screen 4: Older Adult Home ("Aaj Ki Dinacharya")
│   ├── medicine.tsx                # Dawai & Daily Reminders Schedule + Reorder
│   ├── voice.tsx                   # Dedicated Full-Screen Voice Engine ("Bolein")
│   ├── family.tsx                  # Parivar: Trusted Contacts & One-Tap Call Confirmation
│   └── help.tsx                    # Madad: Dynamic Text Scaling, Speech Speed, High Contrast
├── login.tsx                       # Screen 1: Elder Mobile Login & Tactile 6-Box OTP
├── signup.tsx                      # Screen 2: Family Sign Up ("Parivaar Saathi Portal")
├── setup.tsx                       # Screen 3: Family Setup & Wispr Flow Routine Generator
├── rides.tsx                       # Auto Rickshaw & Cab Booking Journey
├── groceries.tsx                   # Daily Groceries & Staples Shopping Flow
└── activity.tsx                    # Chronological User Action Audit Trail
```

---

## 🎙️ The 6-State Voice Assistant Engine

The center stage of Apni Awaaz features an explicit, predictable state machine:

1. **State 1: Ready (`ready`)**
   - 172px Giant circular speak anchor with microphone icon.
   - Prompt suggestion card: *“Try saying: Book an auto to the hospital.”*
   - Text dictation fallback toggle for users who prefer typing.
2. **State 2: Listening (`listening`)**
   - Dual-ring acoustic pulsing halo (`#075B52` at 22% and 12% opacity).
   - Live real-time speech transcription card.
   - Large red **Stop & Review** button.
3. **State 3: Processing (`processing`)**
   - Activity indicator and nearby service lookup pill.
4. **State 4: Review Summary (`review`)**
   - Trip/Action preview card with pickup, destination, and fare estimate (`₹85 - ₹95 · Cash or UPI`).
   - Audible readout with pulsing speaker icon (spoken aloud via `Expo Speech`).
   - High-contrast **Confirm & Book**, **Change Details**, and **Cancel** buttons.
5. **State 5: Result Confirmed (`result`)**
   - Success badge, estimated arrival (e.g. *“Arriving in 4 minutes”*), driver details (*Ramesh Kumar · DL 1RN 4482*).
   - Primary **Call Driver** action and **I'm Ready / Go Home** action.
6. **State 6: Recovery Fallback (`recovery`)**
   - Friendly non-blaming recovery: *“I didn’t catch that - Please speak again clearly, or write below.”*
   - Retry microphone trigger + full keyboard input box with send button.

---

## 🛡️ Safety & Consequential Actions Policy

- **No Silent Commitments:** Consequential actions (booking rides, placing orders, initiating phone calls) strictly require user confirmation.
- **Idempotency Protection:** Double-taps and concurrent requests are guarded by idempotency keys to avoid duplicate bookings.
- **Audible Verification:** The assistant reads back the exact order details or phone recipient before execution.
- **Clear Demo Mode Indicators:** When external third-party partner APIs are in demo/prototype mode, a clear safety banner is presented.

---

## 🌐 Multilingual Support (Indic Multi-Script)

Full translation files are provided in `src/i18n/`:
- **Hindi (हिन्दी):** `src/i18n/hi.ts`
- **Marathi (मराठी):** `src/i18n/mr.ts`
- **English:** `src/i18n/en.ts`

The app switches languages dynamically at runtime without requiring an app restart.

---

## ⚙️ Backend Integration Contract

All frontend components communicate through typed interfaces defined in [API_CONTRACT.md](file:///D:/Hackathon/WishperFlow/ApniAwaazApp/API_CONTRACT.md):
- `assistantService`: Natural language intent parsing and action lifecycle.
- `contactsService`: Trusted caregiver management and calling.
- `remindersService`: Daily medicine reminders and local notifications.
- `ridesService`: Auto & cab estimates and driver tracking.
- `foodService`: Grocery catalog and order checkout.
- `medicineService`: Pharmacy catalog, prescription verification, and reorder.
- `activityService`: Chronological user audit trail.

To connect a live FastAPI / LangGraph backend:
```bash
EXPO_PUBLIC_API_BASE_URL=https://api.yourdomain.com/v1
```

---

## 🧪 Testing & Verification

Run the Jest business logic and safety test suite:
```bash
npm test
```
**Results:**
- ✅ 11/11 Unit Tests Passing (Voice intent parsing across languages, cart calculation, idempotency protection, mobile number validation, reminder lifecycle).

Run the TypeScript type checker:
```bash
npm run type-check
```
**Results:**
- ✅ 0 TypeScript errors.

To run the application on Android:
```bash
npm run android
# or
npm run start
```
