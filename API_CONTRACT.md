# API Contract: Apni Awaaz Backend & Service Boundaries

**Version:** 1.0.0  
**Target Backend:** FastAPI + LangGraph / MCP Orchestrator  
**Configurable Base URL:** `process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.apniawaaz.in/v1'`  

---

## 1. Overview & Service Boundaries

Apni Awaaz features an explicit client-service architecture. Every domain boundary is defined by a TypeScript interface. In frontend development or disconnected demo mode, calls route through `MockApiClient` which returns deterministic, realistic mock data and logs requests without executing real transactions.

### Service Boundaries:
1. `assistantService`: Natural language intent parsing, voice transcript handling, conversational state machine, action proposal, and confirmation execution.
2. `contactsService`: Trusted family contacts CRUD, relationship tagging, and phone call confirmation requests.
3. `remindersService`: Medication and daily routine reminders CRUD, snoozing, and local notification scheduling.
4. `ridesService`: Ride / Auto Rickshaw estimates (pickup, destination, fare, ETA), booking confirmation, and live driver tracking.
5. `foodService`: Grocery and food catalog items, search, cart calculation, order draft, confirmation, and status tracking.
6. `medicineService`: Pharmacy search, verified medicine details, pack size, prescription check, and safe confirmed reorders.
7. `activityService`: User action audit trail (draft, awaiting_confirmation, submitting, succeeded, failed, cancelled).
8. `settingsService`: Multilingual preferences (Marathi, Hindi, English), dynamic text size, speech speed, high-contrast mode, and family companion links.

---

## 2. API Endpoints Specification

### A. Voice & Assistant Service (`/assistant`)
- **POST `/assistant/converse`**
  - **Request:**
    ```json
    {
      "sessionId": "string",
      "text": "Book an auto to the hospital",
      "language": "hi | mr | en",
      "context": {
        "currentScreen": "home",
        "elderName": "Meera"
      }
    }
    ```
  - **Response:**
    ```json
    {
      "status": "success",
      "message": "Auto booking details prepared",
      "spokenResponse": "मैंने मैक्स अस्पताल के लिए ऑटो का विवरण तैयार कर दिया है। क्या मैं बुक कर दूँ?",
      "action": {
        "type": "book_ride",
        "actionId": "act_ride_12345",
        "lifecycle": "awaiting_confirmation",
        "summary": "Auto to Max Super Speciality Hospital",
        "details": {
          "pickup": "Home (B-42 Green Park)",
          "destination": "Max Super Speciality Hospital",
          "fareEstimate": "₹85 - ₹95",
          "vehicleType": "Auto Rickshaw"
        }
      }
    }
    ```
- **POST `/assistant/confirm-action`**
  - **Request:**
    ```json
    {
      "actionId": "act_ride_12345",
      "confirmed": true,
      "idempotencyKey": "idem_uuid_987"
    }
    ```
  - **Response:**
    ```json
    {
      "status": "succeeded",
      "actionId": "act_ride_12345",
      "result": {
        "bookingId": "bk_auto_9901",
        "driverName": "Ramesh Kumar",
        "vehicleNumber": "DL 1RN 4482",
        "etaMinutes": 4,
        "driverPhone": "+919876543210"
      }
    }
    ```

---

### B. Trusted Contacts Service (`/contacts`)
- **GET `/contacts`**: List trusted contacts with relationship type, phone number, and caregiver status.
- **POST `/contacts`**: Add a new trusted contact.
- **PUT `/contacts/{id}`**: Update existing contact details.
- **DELETE `/contacts/{id}`**: Remove a contact.

---

### C. Reminders Service (`/reminders`)
- **GET `/reminders`**: List upcoming, completed, and snoozed reminders.
- **POST `/reminders`**: Create reminder with title, category (`medicine` | `prayer` | `food` | `family` | `other`), time, repeat pattern.
- **PATCH `/reminders/{id}/status`**: Mark complete (`completed`) or snooze (`snoozed`).
- **DELETE `/reminders/{id}`**: Delete reminder.

---

### D. Mobility / Rides Service (`/rides`)
- **POST `/rides/estimate`**: Retrieve fare estimate and ETA for origin and destination.
- **POST `/rides/book`**: Book cab/auto after explicit confirmation.
- **GET `/rides/{bookingId}`**: Get real-time status of driver and vehicle.
- **POST `/rides/{bookingId}/cancel`**: Cancel an active booking before arrival.

---

### E. Medicine Assistance Service (`/medicines`)
- **GET `/medicines/search?q={query}`**: Search verified catalog for tablets, capsules, or syrups.
- **GET `/medicines/{id}`**: Medicine detail with dosage, pack size, manufacturer, instructions, and pharmacy availability.
- **POST `/medicines/reorder`**: Prepare a prescription reorder draft (requires user confirmation).
- **GET `/medicines/orders/{orderId}`**: Order status and pharmacy verification badge.

---

### F. Food & Grocery Service (`/groceries`)
- **GET `/groceries/items?category={category}`**: Fetch grocery staples (milk, atta, dal, vegetables).
- **POST `/groceries/order`**: Prepare checkout draft with delivery address, total price, and item breakdown.
- **GET `/groceries/orders/{orderId}`**: Delivery status (`confirmed`, `packing`, `dispatched`, `delivered`).

---

### G. User Activity Service (`/activity`)
- **GET `/activity`**: List recent actions with chronological timestamps, category, status badge, and human-readable summary.

---

### H. Settings Service (`/settings`)
- **GET `/settings`**: Retrieve user profile, selected language (`mr`, `hi`, `en`), text scale (`standard`, `large`, `xlarge`), speech speed (`slow`, `normal`, `fast`), high contrast boolean.
- **PUT `/settings`**: Update user accessibility and language preferences.
