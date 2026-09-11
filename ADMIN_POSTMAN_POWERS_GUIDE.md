# 👑 Host Admin Superpowers — Postman Guide
**Bride Chandrika & Groom Xudong's Royal Wedding Portal**  
*Confidential — For Wedding Host & Admin Eyes Only*

---

## 🌟 Welcome to Your Admin Command Center

By design, **all Host and Admin icons, buttons, and badges have been completely removed from the public wedding website**. 

No guest or visitor will ever see an admin login button or manifest screen on the site. Instead, **you possess full programmatic "God-Mode" control through Postman** (or any HTTP client/browser) to manage passes, monitor attendance, and generate VIP invitations.

---

## 🔑 Your Secret Key & Security

All admin endpoints are locked behind your private **Admin Secret Key**:

```
AdityaWeddingAdmin2026!#
```

> 📍 **Where it lives**: `backend/src/main/resources/application.properties` (`admin.secret.key`)  
> You can update this string at any time in IntelliJ.

### How to Authorize in Postman:
You have two convenient options:

1. **HTTP Header (Recommended for Postman)**:
   - Header Name: `X-Admin-Secret`
   - Header Value: `AdityaWeddingAdmin2026!#`
2. **URL Query Parameter (Quick Browser Check)**:
   - Simply append `?secret=AdityaWeddingAdmin2026!#` to any admin URL.

---

## ⚡ Your 7 Admin Superpowers

```
                    ┌──────────────────────────────────────────────────┐
                    │            POSTMAN / HOST ADMIN                  │
                    │      (Secret: AdityaWeddingAdmin2026!#)          │
                    └─────────────────────────┬────────────────────────┘
                                              │
         ┌──────────────────┬─────────────────┼──────────────────┬──────────────────┬──────────────────┐
         ▼                  ▼                 ▼                  ▼                  ▼                  ▼
    [Power 1]          [Power 2]         [Power 3]          [Power 4]          [Power 5]          [Power 7]
   Master God View   Unused Passes     Claimed Passes    Create New Pass     Dietary Stats      Absence Alerts
   Full Dashboard    Tokens & Links    Guest RSVPs &     Instant VIP Token   Catering & Head-   Email Dispatch to
   Capacity Gauge    Ready to Send     Table Seating     & Shareable URL     count Breakdown    adi2002rawat@gmail
```

---

### 🛡️ Power 1: The Master "God-View" (Complete Wedding Snapshot)
Fetches everything at once: real-time headcount vs the 100-seat capacity, all unused passes, and all claimed guest RSVPs.

- **Method**: `GET`
- **URL**: `http://localhost:8080/api/admin/passes`
- **Headers**:
  ```http
  X-Admin-Secret: AdityaWeddingAdmin2026!#
  ```
- **Browser Quick Link**:
  ```
  http://localhost:8080/api/admin/passes?secret=AdityaWeddingAdmin2026!#
  ```
- **What You Get in Response**:
  ```json
  {
    "summary": {
      "totalParties": 34,
      "totalAllowedSeats": 116,
      "registeredParties": 3,
      "pendingParties": 31,
      "unusedParties": 2,
      "attendingParties": 3,
      "declinedParties": 0,
      "totalPeopleAttending": 10,
      "totalPeopleNotAttending": 0,
      "totalPeoplePending": 106,
      "absentFamilyMembersCount": 0,
      "declinedPartyGuestsCount": 0,
      "confirmedHeadcount": 10,
      "remainingSeats": 90
    },
    "unusedPasses": [ /* all ready-to-distribute passes */ ],
    "usedPasses": [ /* all registered family RSVPs with peopleAttending, peopleNotAttending, and member breakdowns */ ]
  }
  ```

---

### 🎟️ Power 2: Extract All Unused Passes & Direct Shareable Links
Fetches only the unused, available passes along with their cryptographic tokens and pre-built URLs ready to send to guests.

- **Method**: `GET`
- **URL**: `http://localhost:8080/api/admin/passes/unused`
- **Headers**:
  ```http
  X-Admin-Secret: AdityaWeddingAdmin2026!#
  ```
- **Browser Quick Link**:
  ```
  http://localhost:8080/api/admin/passes/unused?secret=AdityaWeddingAdmin2026!#
  ```
- **Response Example**:
  ```json
  {
    "count": 2,
    "unusedPasses": [
      {
        "id": 7,
        "invitationCode": "INV-CX2026",
        "familyName": "Choudhary Family",
        "allowedPartySize": 4,
        "side": "BRIDE",
        "assignedTable": "Table 1 - Royal Lotus",
        "status": "UNUSED",
        "inviteToken": "demo-invitation-token-12345",
        "directInviteUrl": "http://localhost:5173/invite/demo-invitation-token-12345"
      }
    ]
  }
  ```
- **How to Use**:
  Copy the `directInviteUrl` and send it straight to the guest family via WhatsApp, Telegram, or Email!

---

### 📋 Power 3: Inspect Claimed / Used Passes (Who is Coming?)
Lists all passes that have already been claimed by guests, with their verified emails, RSVP statuses, and table assignments.

- **Method**: `GET`
- **URL**: `http://localhost:8080/api/admin/passes/used`
- **Headers**:
  ```http
  X-Admin-Secret: AdityaWeddingAdmin2026!#
  ```
- **Browser Quick Link**:
  ```
  http://localhost:8080/api/admin/passes/used?secret=AdityaWeddingAdmin2026!#
  ```
- **Response Example**:
  ```json
  {
    "count": 6,
    "usedPasses": [
      {
        "id": 1,
        "invitationCode": "CX-VIP-101",
        "familyName": "Rawat Family",
        "allowedPartySize": 4,
        "primaryEmail": "rawat.family@example.com",
        "primaryGuestName": "Vikram Rawat",
        "side": "BRIDE",
        "assignedTable": "Table 1 - Royal Lotus",
        "rsvpStatus": "ATTENDING",
        "status": "REGISTERED",
        "registeredAt": "2026-09-07T12:00:00"
      }
    ]
  }
  ```

---

### ✍️ Power 4: Forge New VIP Invitation Passes On Demand
Create brand new passes programmatically without touching a database or UI.

- **Method**: `POST`
- **URL**: `http://localhost:8080/api/admin/passes/create`
- **Headers**:
  ```http
  Content-Type: application/json
  X-Admin-Secret: AdityaWeddingAdmin2026!#
  ```
- **Body (raw JSON)**:
  ```json
  {
    "familyName": "Kapoor Family",
    "allowedPartySize": 4,
    "side": "BRIDE",
    "assignedTable": "Table 5 - Rose Garden Terrace"
  }
  ```
- **Response (Instant VIP Token Created!)**:
  ```json
  {
    "success": true,
    "id": 9,
    "invitationCode": "INV-849201",
    "inviteToken": "e7b92f4c81a648bfa2e01...",
    "directInviteUrl": "http://localhost:5173/invite/e7b92f4c81a648bfa2e01...",
    "familyName": "Kapoor Family",
    "allowedPartySize": 4,
    "side": "BRIDE",
    "assignedTable": "Table 5 - Rose Garden Terrace",
    "status": "UNUSED"
  }
  ```

---

### 🥗 Power 5: Catering & Dietary Analytics
Gives catering chefs and event planners exact headcount numbers, dietary split, and side representation.

- **Method**: `GET`
- **URL**: `http://localhost:8080/api/auth/stats`
- **Response Example**:
  ```json
  {
    "totalParties": 8,
    "totalAllowedGuests": 32,
    "registeredParties": 6,
    "unusedParties": 2,
    "confirmedAttendingGuests": 24,
    "declinedGuests": 0,
    "maxCapacity": 100,
    "capacityRemaining": 76,
    "brideSideCount": 4,
    "groomSideCount": 4,
    "dietaryBreakdown": {
      "Pure Vegetarian": 16,
      "Jain Vegetarian": 4,
      "Non-Vegetarian": 4
    }
  }
  ```

---

### 👥 Power 6: Full Raw Manifest & Guest Directory
Fetches the raw list of all 100 invited parties including their structured family members, phone numbers, and song requests.

- **Method**: `GET`
- **URL**: `http://localhost:8080/api/auth/master-list`

---

### 📧 Power 7: Family Absence Alerts & Test Email Dispatch
Whenever a guest marks any member of their family as unable to attend ("Not Coming"), the system automatically dispatches an alert email to **`adi2002rawat@gmail.com`** containing full family information, assigned table, and the person(s) who are absent with their reasons.

You can also trigger an immediate test dispatch from Postman to verify email connectivity:

- **Method**: `POST`
- **URL**: `http://localhost:8080/api/admin/passes/test-email`
- **Headers**:
  ```http
  X-Admin-Secret: AdityaWeddingAdmin2026!#
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Test absence email notification queued for dispatch to adi2002rawat@gmail.com",
    "recipient": "adi2002rawat@gmail.com"
  }
  ```

> 💡 **Live Gmail Delivery Note**:  
> To enable real-world dispatch to your Gmail inbox via Gmail SMTP, simply add your Google App Password to `backend/src/main/resources/application.properties`:
> ```properties
> spring.mail.username=adi2002rawat@gmail.com
> spring.mail.password=YOUR_16_CHAR_GOOGLE_APP_PASSWORD
> ```
> *(Even without SMTP credentials, full structured notifications are always printed and logged to your backend console).*

---

## 🚀 Step-by-Step Postman Setup Guide

### 1. Launch Postman
Open Postman on your desktop or web.

### 2. Create an Environment (Optional but Recommended)
1. In Postman, click **Environments** on the left sidebar.
2. Click **+** (New Environment) and name it: `Wedding Backend Local`.
3. Add two variables:
   - `baseUrl` = `http://localhost:8080`
   - `adminSecret` = `AdityaWeddingAdmin2026!#`
4. Select `Wedding Backend Local` from the environment dropdown in the top right.

### 3. Or Simply Set Collection-Level Header
If you create a Collection named **"Wedding Admin"**:
1. Click the Collection -> Go to the **Headers** tab.
2. Add:
   - **Key**: `X-Admin-Secret`
   - **Value**: `AdityaWeddingAdmin2026!#`
3. Now every request inside this collection will automatically inherit this header!

---

## 📦 Ready-to-Import Postman Collection (JSON)

You don't even have to create the requests manually! Follow these 3 steps:

1. Copy the JSON block below.
2. In Postman, click **Import** (top left).
3. Paste this JSON into the box and click **Import**.

```json
{
  "info": {
    "name": "Chandrika & Xudong Wedding — Admin Superpowers",
    "description": "Exclusive Admin APIs for wedding host Aditya. Secure pass extraction, creation, and RSVP tracking.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Master Overview (God-View)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-Admin-Secret",
            "value": "AdityaWeddingAdmin2026!#",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/admin/passes",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "admin", "passes"]
        },
        "description": "Returns full wedding stats, all unused passes with links, and all registered used passes."
      }
    },
    {
      "name": "2. Get All Unused Passes (Tokens & Links)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-Admin-Secret",
            "value": "AdityaWeddingAdmin2026!#",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/admin/passes/unused",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "admin", "passes", "unused"]
        },
        "description": "Returns available invitation tokens and direct URLs to copy and send to guests."
      }
    },
    {
      "name": "3. Get All Used Passes (RSVPs & Attendance)",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-Admin-Secret",
            "value": "AdityaWeddingAdmin2026!#",
            "type": "text"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/admin/passes/used",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "admin", "passes", "used"]
        },
        "description": "Returns all claimed passes, registered emails, and RSVP confirmation statuses."
      }
    },
    {
      "name": "4. Create New VIP Pass",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "X-Admin-Secret",
            "value": "AdityaWeddingAdmin2026!#",
            "type": "text"
          },
          {
            "key": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"familyName\": \"Kapoor Family\",\n  \"allowedPartySize\": 4,\n  \"side\": \"BRIDE\",\n  \"assignedTable\": \"Table 5 - Rose Garden Terrace\"\n}"
        },
        "url": {
          "raw": "http://localhost:8080/api/admin/passes/create",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "admin", "passes", "create"]
        },
        "description": "Programmatically generates a new invitation code, token, and direct URL."
      }
    },
    {
      "name": "5. Headcount & Dietary Stats",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/api/auth/stats",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "auth", "stats"]
        },
        "description": "Returns total headcount against the 100 capacity and vegetarian/Jain/non-vegetarian breakdown."
      }
    },
    {
      "name": "6. Full Master Manifest List",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/api/auth/master-list",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "auth", "master-list"]
        },
        "description": "Complete list of all guest parties and structured RSVP records."
      }
    }
  ]
}
```

---

## 💬 WhatsApp / Email Invitation Template for Guests

When you fetch an unused link like:
```
http://localhost:5173/invite/demo-invitation-token-12345
```

You can send your guest a royal invitation message like this:

```
🌸 Royal Wedding Invitation 🌸
Chandrika & Xudong
The Oberoi Udaivilas, Udaipur • Nov 28 – 30, 2026

Dear [Family Name / Guest],

We would be deeply honored to celebrate our special day with you! 
Because this is an intimate gathering of 100 cherished guests, 
we have reserved a personalized digital pass for your family:

🎟️ Your Private Wedding Pass & RSVP:
http://localhost:5173/invite/[TOKEN]

Kindly open the link above to confirm your attendance, dietary preferences, 
and receive your Digital Admission Pass.

With love and warm regards,
Chandrika & Xudong
```

---

## 🛠️ Quick Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **`403 Forbidden`** | Missing or incorrect admin secret key | Verify `X-Admin-Secret` header or `?secret=...` parameter matches `AdityaWeddingAdmin2026!#`. |
| **`Unable to connect to remote server`** | Spring Boot backend is not running | Click **Run** or **Restart** on `DidiWeddingBackendApplication` in IntelliJ. |
| **Pass shows `ALREADY_REGISTERED`** | A guest already claimed this token with their email | Use Power 3 (`GET /api/admin/passes/used`) to see which email claimed it, or use Power 4 to create a fresh new pass. |
| **Want to change the Secret Key** | Routine security rotation | Edit `admin.secret.key=...` in `backend/src/main/resources/application.properties` and restart backend. |





