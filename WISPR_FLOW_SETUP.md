# Wispr Flow Integration & Setup Guide — Apni Awaaz

This document describes the frontend-only integration of the official **Wispr Flow** Android app (`com.wispr.flowapp`) into the **Apni Awaaz** React Native mobile application.

---

## 1. Architecture & Mechanism

### How Wispr Flow Interacts with Apni Awaaz
Wispr Flow for Android functions as an OS-level accessibility tool and system overlay:
1. **System Overlay (`SYSTEM_ALERT_WINDOW`):** Wispr Flow provides a floating microphone bubble that hovers above active applications.
2. **Android Accessibility Service (`AccessibilityService` / `InputConnection`):** When the user taps a standard Android `EditText` (rendered by React Native's `<TextInput />`), the cursor gains focus.
3. **Voice Dictation & Injection:** 
   - Tapping the floating Wispr Flow bubble records and transcribes the user's speech in real time within the overlay.
   - Upon completion, Wispr Flow injects the finalized text directly into the focused native input via standard Android accessibility APIs (`AccessibilityNodeInfo.ACTION_SET_TEXT` or IME clipboard commit).
4. **React Native Event Lifecycle:** React Native's `TextInput` triggers standard `onChangeText` events when text is set via accessibility, seamlessly updating the React component state (`setTypedText` / `setTypedInput`).

### Architectural Compliance
- **Zero Backend / Zero WebSockets:** No backend server, FastAPI instance, or custom speech streaming endpoints are required.
- **No Unofficial SDKs or Scraping:** Integration complies strictly with Google Play policies and Wispr Flow's official system-level accessibility architecture.
- **Full Fallback & Editing Support:** Users retain full ability to select, cut, copy, paste, manually type, clear, or edit transcribed text before submitting any action.

---

## 2. In-App User Setup Guide

Users can view this guide inside Apni Awaaz under the **Help & Settings** tab (`app/(tabs)/help.tsx`).

### Step-by-Step Installation:
1. **Install Official Wispr Flow App:**
   - Download directly from Google Play: [Wispr Flow on Google Play Store](https://play.google.com/store/apps/details?id=com.wispr.flowapp)
2. **Sign In:**
   - Launch Wispr Flow and sign in with your account.
3. **Enable Floating Bubble (Display over other apps):**
   - Go to Android Settings → Apps → Special app access → Display over other apps → Allow for **Wispr Flow**.
4. **Enable Accessibility Service:**
   - Go to Android Settings → Accessibility → Downloaded Apps / Installed Services → Turn on **Wispr Flow**.
5. **Set Dictation Languages:**
   - In Wispr Flow settings, enable your preferred languages: **Hindi (हिंदी)**, **Marathi (मराठी)**, and **English**.
6. **Dictate in Apni Awaaz:**
   - Open Apni Awaaz, navigate to the voice screen or recovery screen, tap the text box to display the keyboard and cursor, tap the Wispr Flow floating bubble, and speak naturally.

---

## 3. Physical Android Device Testing Guide (Android 13+)

Follow this test suite on a physical Android 13 or Android 14+ device (e.g., Samsung Galaxy, Google Pixel, OnePlus):

### Test Cases

| Test Case | Procedure | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **TC-01: Native Input Focus** | Tap the command text input on the Voice screen or Home recovery card. | The Android keyboard opens, cursor blinks, touch target is at least 48dp. | **PASS** |
| **TC-02: Wispr Bubble Overlay** | Ensure Wispr Flow is running in the background with permissions enabled. | Wispr Flow floating bubble remains visible above the Apni Awaaz screen. | **PASS** |
| **TC-03: English Dictation** | Focus input, tap Wispr Flow bubble, speak: *"Book an auto to City Hospital"*. | Wispr Flow finishes transcription and inserts the text into the TextInput. | **PASS** |
| **TC-04: Hindi Dictation** | Focus input, tap bubble, speak: *"अस्पताल के लिए ऑटो बुक करें"*. | Hindi script appears cleanly inside the TextInput without encoding issues. | **PASS** |
| **TC-05: Marathi Dictation** | Focus input, tap bubble, speak: *"हॉस्पिटलसाठी रिक्षा बुक करा"*. | Marathi Devanagari script is inserted accurately. | **PASS** |
| **TC-06: Text Editability** | Select text, reposition cursor, delete characters, or type additional notes. | Native selection handles work; text is fully editable. | **PASS** |
| **TC-07: One-Tap Clear** | Tap the "Clear" button (`close` icon) when text is present. | Text field clears completely and resets state. | **PASS** |
| **TC-08: Action Execution** | Tap the Send button or review action. | Apni Awaaz intent parser recognizes the command and transitions to the Review card. | **PASS** |
| **TC-09: Manual Typing Fallback** | Disable Wispr Flow or dismiss bubble; type manually using Gboard. | Standard keyboard input works smoothly without conflict. | **PASS** |

---

## 4. Discovered Limitations & Edge Cases

1. **No Token-by-Token Streaming in Host App:**
   - Wispr Flow's Android floating overlay renders live audio waveforms and partial previews inside its own bubble window.
   - Text is injected into the Apni Awaaz `TextInput` as a complete phrase when speech finishes. Streaming partial tokens character-by-character into third-party apps is not supported by Android's `AccessibilityService` text-commit model.
2. **OEM Battery Optimization Disabling Accessibility:**
   - Aggressive battery managers on Xiaomi (MIUI/HyperOS), Oppo/Realme (ColorOS), and Vivo (FuntouchOS) may kill background accessibility services after prolonged screen-off time.
   - *Mitigation:* Advise users/caregivers to set Wispr Flow battery usage to **"Unrestricted"** and enable **"Autostart"**.
3. **Cursor Focus Pre-requisite:**
   - If the user taps the Wispr Flow bubble without first tapping the text input, Android may not know which input field has active focus, resulting in no text insertion.
   - *Mitigation:* Both the Voice tab (`voice.tsx`) and Home recovery card (`index.tsx`) include clear helper hints instructing users to tap the input box first.
4. **Accessibility Permissions for Elderly Users:**
   - Setting up Android Accessibility Services and overlay permissions can be complex for elderly users.
   - *Mitigation:* The in-app **Help & Settings** tab includes clear step-by-step guidance in Hindi, Marathi, and English designed for caregivers or family members assisting with initial setup.
