---
title: "Production Postman API Reference & Admin Control"
project: "Chandrika & Xudong Royal Wedding"
environment: "Production (Render) & Localhost"
tags:
  - wedding
  - api
  - postman
  - admin
  - production
  - obsidian
created: 2026-09-11
status: active
---

# 👑 Production Postman API Reference & Admin Control
**Bride Chandrika & Groom Xudong's Royal Wedding Portal**  
*Confidential — Dedicated Guide for Wedding Host & System Admin Aditya*

---

> [!important]
> ### 🌐 Production & Local Base URLs
> - **Production (Render Live)**: `https://weeding-test.onrender.com`
> - **Local Development**: `http://localhost:8080`
> - **Live Public Frontend**: `https://weeding-test.onrender.com`
>
> In Postman, configure `baseUrl` as an environment variable:
> - Production: `https://weeding-test.onrender.com`
> - Localhost: `http://localhost:8080`

> [!key]
> ### 🔑 Admin Security Authentication
> All admin endpoints are protected by your private **Admin Secret Key**:
> ```
> AdityaWeddingAdmin2026
> ```
> *(The server also accepts `AdityaWeddingAdmin2026!#` for backward compatibility)*
>
> **How to pass authentication in Postman**:
> 1. **HTTP Header (Recommended)**:
>    ```http
>    X-Admin-Secret: AdityaWeddingAdmin2026
>    ```
> 2. **URL Query Parameter (Quick Browser Check)**:
>    ```http
>    ?secret=AdityaWeddingAdmin2026
>    ```

---

## 📑 Quick Navigation
- [[#1-check-inspect--read-apis|1. CHECK / INSPECT / READ APIs]]
  - [[#11-service-health-check|1.1 Service Health Check]]
  - [[#12-master-god-view-overview|1.2 Master God-View Overview]]
  - [[#13-extract-all-unused-passes--shareable-links|1.3 Extract All Unused Passes & Shareable Links]]
  - [[#14-inspect-claimed-used-passes--guest-rsvps|1.4 Inspect Claimed / Used Passes & Guest RSVPs]]
  - [[#15-headcount--attendance-statistics|1.5 Headcount & Attendance Statistics]]
  - [[#16-full-raw-manifest-master-list|1.6 Full Raw Manifest Master List]]
  - [[#17-guest-lookup-by-email|1.7 Guest Lookup by Email]]
  - [[#18-wedding-information--venues|1.8 Wedding Information & Venues]]
  - [[#19-wedding-events--ceremony-schedule|1.9 Wedding Events & Ceremony Schedule]]
  - [[#110-guest-wishes--blessings-wall|1.10 Guest Wishes & Blessings Wall]]
- [[#2-update-mutate--manage-apis|2. UPDATE / MUTATE / MANAGE APIs]]
  - [[#21-forge--create-new-vip-pass|2.1 Forge / Create New VIP Pass]]
  - [[#22-update-existing-pass-details|2.2 Update Existing Pass Details]]
  - [[#23-reset-pass-to-unused-state|2.3 Reset Pass to UNUSED State]]
  - [[#24-delete--revoke-user-or-pass|2.4 Delete / Revoke User or Pass (by Email, ID, or Code)]]
  - [[#25-trigger-test-absence-email-notification|2.5 Trigger Test Absence Email Notification]]
  - [[#26-submit-guest--family-rsvp|2.6 Submit Guest / Family RSVP]]
  - [[#27-submit-guest-blessing--wish|2.7 Submit Guest Blessing / Wish]]
- [[#3-api-matrix--summary-table|3. API Matrix & Summary Table]]
- [[#4-one-click-importable-postman-collection-v210|4. One-Click Importable Postman Collection (v2.1.0)]]

---

## 1. CHECK / INSPECT / READ APIs

### 1.1 Service Health Check
Verify that the Spring Boot backend service is running and healthy on Render.

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/health`
- **Auth**: None (Public)
- **cURL**:
  ```bash
  curl -X GET "https://weeding-test.onrender.com/api/health"
  ```
- **Sample Response**:
  ```json
  {
    "status": "UP",
    "service": "didi-wedding-backend",
    "timestamp": 1789136123456
  }
  ```

---

### 1.2 Master God-View Overview
Fetches the complete wedding snapshot in a single payload: real-time headcount vs 100 capacity, all unused passes with tokens, and all registered used passes with family member attendance breakdowns.

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/admin/passes`  *(or `{{baseUrl}}/api/admin/users`)*
- **Auth Header**: `X-Admin-Secret: {{adminSecret}}`
- **Browser URL**: `{{baseUrl}}/api/admin/passes?secret=AdityaWeddingAdmin2026`
- **cURL**:
  ```bash
  curl -X GET "https://weeding-test.onrender.com/api/admin/passes" \
    -H "X-Admin-Secret: AdityaWeddingAdmin2026"
  ```
- **Sample Response**:
  ```json
  {
    "summary": {
      "totalParties": 35,
      "totalAllowedSeats": 118,
      "registeredParties": 4,
      "unusedParties": 31,
      "attendingParties": 3,
      "declinedParties": 1,
      "pendingParties": 0,
      "totalPeopleAttending": 11,
      "totalPeopleNotAttending": 3,
      "totalPeoplePending": 104,
      "confirmedHeadcount": 11,
      "remainingSeats": 89,
      "absentFamilyMembersCount": 1,
      "declinedPartyGuestsCount": 2
    },
    "unusedPasses": [
      {
        "id": 12,
        "invitationCode": "INV-A92B4F",
        "inviteToken": "4b6e80d4f3c7e09...",
        "invitationUrl": "/invite/4b6e80d4f3c7e09...",
        "familyName": "Verma Family",
        "allowedPartySize": 4,
        "side": "Bride's Side (Chandrika)",
        "assignedTable": "Table 2 - Royal Lotus",
        "passSerial": "CX-VIP-112",
        "status": "UNUSED"
      }
    ],
    "usedPasses": [
      {
        "id": 1,
        "invitationCode": "CX-VIP-101",
        "primaryEmail": "rawat.family@example.com",
        "familyName": "Rawat Family",
        "allowedPartySize": 4,
        "confirmedHeadcount": 3,
        "peopleAttending": 3,
        "peopleNotAttending": 1,
        "rsvpStatus": "ATTENDING",
        "attendingMembers": "Vikram Rawat, Sunita Rawat, Ananya Rawat",
        "dietaryDetails": "PURE_VEG",
        "assignedTable": "Table 1 - Royal Lotus",
        "members": [
          {
            "name": "Aditya Rawat",
            "relationship": "Brother",
            "isAttending": false,
            "absenceReason": "Final university exams"
          }
        ]
      }
    ]
  }
  ```

---

### 1.3 Extract All Unused Passes & Shareable Links
Fetches only unassigned passes with their cryptographic tokens and shareable invite links, ready to copy and send to guests via WhatsApp or Email.

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/admin/passes/unused`
- **Auth Header**: `X-Admin-Secret: {{adminSecret}}`
- **cURL**:
  ```bash
  curl -X GET "https://weeding-test.onrender.com/api/admin/passes/unused" \
    -H "X-Admin-Secret: AdityaWeddingAdmin2026"
  ```

---

### 1.4 Inspect Claimed / Used Passes & Guest RSVPs
Fetches all passes already registered by guests, including primary emails, RSVP decisions, dietary choices, allergies, song requests, and family member attendance breakdowns.

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/admin/passes/used`
- **Auth Header**: `X-Admin-Secret: {{adminSecret}}`
- **cURL**:
  ```bash
  curl -X GET "https://weeding-test.onrender.com/api/admin/passes/used" \
    -H "X-Admin-Secret: AdityaWeddingAdmin2026"
  ```

---

### 1.5 Headcount & Attendance Statistics
Returns real-time capacity metrics against the strict 100-person limit.

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/auth/stats`
- **Auth**: None (Public)
- **cURL**:
  ```bash
  curl -X GET "https://weeding-test.onrender.com/api/auth/stats"
  ```

---

### 1.6 Full Raw Manifest Master List
Returns the complete list of all party records currently in the database.

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/auth/master-list`
- **Auth**: None
- **cURL**:
  ```bash
  curl -X GET "https://weeding-test.onrender.com/api/auth/master-list"
  ```

---

### 1.7 Guest Lookup by Email
Look up an invited guest party using their registered email address.

- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/lookup`
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **cURL**:
  ```bash
  curl -X POST "https://weeding-test.onrender.com/api/auth/lookup" \
    -H "Content-Type: application/json" \
    -d '{ "email": "rawat.family@example.com" }'
  ```

---

### 1.8 Wedding Information & Venues
Returns wedding metadata: couple names, dates, venues in Udaipur, countdown target, and hospitality contacts.

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/wedding-info`
- **Auth**: None (Public)
- **cURL**:
  ```bash
  curl -X GET "https://weeding-test.onrender.com/api/wedding-info"
  ```

---

### 1.9 Wedding Events & Ceremony Schedule
Returns the schedule for all 6 traditional wedding ceremonies.

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/events`
- **Auth**: None (Public)
- **cURL**:
  ```bash
  curl -X GET "https://weeding-test.onrender.com/api/events"
  ```

---

### 1.10 Guest Wishes & Blessings Wall
Returns all guest blessings and congratulatory notes posted for Chandrika & Xudong.

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/wishes`
- **Auth**: None (Public)
- **cURL**:
  ```bash
  curl -X GET "https://weeding-test.onrender.com/api/wishes"
  ```

---

## 2. UPDATE / MUTATE / MANAGE APIs

### 2.1 Forge / Create New VIP Pass
Creates a brand new invitation pass programmatically, generating a unique invitation code, raw cryptographic token, and shareable link.

- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/admin/passes/create`
- **Headers**:
  ```http
  Content-Type: application/json
  X-Admin-Secret: {{adminSecret}}
  ```
- **cURL**:
  ```bash
  curl -X POST "https://weeding-test.onrender.com/api/admin/passes/create" \
    -H "Content-Type: application/json" \
    -H "X-Admin-Secret: AdityaWeddingAdmin2026" \
    -d '{
      "familyName": "Kapoor Family",
      "allowedPartySize": 4,
      "side": "Bride'''s Side (Chandrika)",
      "assignedTable": "Table 5 - Rose Garden Terrace"
    }'
  ```

---

### 2.2 Update Existing Pass Details
Update an existing pass's family name, seat quota, table seating, side, confirmed headcount, or RSVP status without recreating the pass.

- **Method**: `PUT`
- **URL**: `{{baseUrl}}/api/admin/passes/{id}`  *(e.g. `{{baseUrl}}/api/admin/passes/1`)*
- **Headers**:
  ```http
  Content-Type: application/json
  X-Admin-Secret: {{adminSecret}}
  ```
- **cURL**:
  ```bash
  curl -X PUT "https://weeding-test.onrender.com/api/admin/passes/1" \
    -H "Content-Type: application/json" \
    -H "X-Admin-Secret: AdityaWeddingAdmin2026" \
    -d '{
      "familyName": "Rawat Family (VIP)",
      "allowedPartySize": 5,
      "assignedTable": "Table 1 - Royal Lotus Head Table",
      "side": "Bride'''s Side (Chandrika)",
      "confirmedHeadcount": 4,
      "rsvpStatus": "ATTENDING"
    }'
  ```

---

### 2.3 Reset Pass to UNUSED State
Resets a registered pass back to `UNUSED` state. Clears out the claimed email, verification codes, login tokens, and RSVP submissions, so the original link can be reused or re-sent to another guest.

- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/admin/passes/{id}/reset`  *(e.g. `{{baseUrl}}/api/admin/passes/1/reset`)*
- **Headers**:
  ```http
  X-Admin-Secret: {{adminSecret}}
  ```
- **cURL**:
  ```bash
  curl -X POST "https://weeding-test.onrender.com/api/admin/passes/1/reset" \
    -H "X-Admin-Secret: AdityaWeddingAdmin2026"
  ```

---

### 2.4 Delete / Revoke User or Pass (by Email, ID, or Code)
Permanently deletes a registered user or invitation pass from the database. All associated family members and RSVP submissions are cleanly removed in a cascade.

> [!tip]
> You can delete a user by **Email**, by numeric **ID**, or by **Invitation Code**!

#### 📍 Style A: In the URL Path (Fastest in Postman)
- **Method**: `DELETE`
- **URL**: `{{baseUrl}}/api/admin/users/{email_or_id}`  *(or `/api/admin/passes/{email_or_id}`)*
- **Headers**:
  ```http
  X-Admin-Secret: {{adminSecret}}
  ```
- **cURL (Delete by Email)**:
  ```bash
  curl -X DELETE "https://weeding-test.onrender.com/api/admin/users/rawat.family@example.com" \
    -H "X-Admin-Secret: AdityaWeddingAdmin2026"
  ```
- **cURL (Delete by ID)**:
  ```bash
  curl -X DELETE "https://weeding-test.onrender.com/api/admin/users/1" \
    -H "X-Admin-Secret: AdityaWeddingAdmin2026"
  ```

#### 📍 Style B: Using JSON Body in Postman
- **Method**: `DELETE`
- **URL**: `{{baseUrl}}/api/admin/users`
- **Headers**:
  ```http
  Content-Type: application/json
  X-Admin-Secret: {{adminSecret}}
  ```
- **Request Body**:
  ```json
  {
    "email": "rawat.family@example.com"
  }
  ```
- **Sample Success Response**:
  ```json
  {
    "success": true,
    "message": "User/Party 'Rawat Family' (ID: 1, Email: rawat.family@example.com) has been permanently deleted.",
    "deletedId": 1,
    "deletedFamilyName": "Rawat Family",
    "deletedEmail": "rawat.family@example.com",
    "deletedInvitationCode": "INV-RAWAT1",
    "deletedPassSerial": "CX-VIP-101"
  }
  ```

---

### 2.5 Trigger Test Absence Email Notification
Dispatches a test absence notification email directly to `adi2002rawat@gmail.com` using the live notification engine.

- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/admin/passes/test-email`
- **Headers**:
  ```http
  X-Admin-Secret: {{adminSecret}}
  ```
- **cURL**:
  ```bash
  curl -X POST "https://weeding-test.onrender.com/api/admin/passes/test-email" \
    -H "X-Admin-Secret: AdityaWeddingAdmin2026"
  ```

---

### 2.6 Submit Guest / Family RSVP
Submits or updates an RSVP for a registered party, including individual member attendance (`isAttending: true/false`), absence reasons, dietary preferences, and song requests.

- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/family-rsvp`
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **cURL**:
  ```bash
  curl -X POST "https://weeding-test.onrender.com/api/auth/family-rsvp" \
    -H "Content-Type: application/json" \
    -d '{
      "primaryEmail": "rawat.family@example.com",
      "rsvpStatus": "ATTENDING",
      "confirmedHeadcount": 3,
      "attendingMembers": "Col. & Mrs. Rawat, Ananya Rawat",
      "dietaryDetails": "PURE_VEG",
      "members": [
        {
          "name": "Col. & Mrs. Rawat",
          "relationship": "Parents",
          "isAttending": true,
          "dietaryPreference": "PURE_VEG"
        },
        {
          "name": "Aditya Rawat",
          "relationship": "Brother",
          "isAttending": false,
          "absenceReason": "Final university exams"
        }
      ]
    }'
  ```

---

### 2.7 Submit Guest Blessing / Wish
Post a heartfelt blessing from a guest for the couple.

- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/wishes`
- **Headers**:
  ```http
  Content-Type: application/json
  ```
- **cURL**:
  ```bash
  curl -X POST "https://weeding-test.onrender.com/api/wishes" \
    -H "Content-Type: application/json" \
    -d '{
      "guestName": "Uncle Rajesh",
      "city": "Dehradun",
      "message": "May your union be blessed with immense love, joy, and peace!",
      "relationship": "Uncle"
    }'
  ```

---

## 3. API Matrix & Summary Table

| Category | Method | Endpoint | Purpose | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **CHECK** | `GET` | `/api/health` | Service uptime and deployment status | None |
| **CHECK** | `GET` | `/api/admin/passes` | Master God-View: metrics + unused + used passes | `X-Admin-Secret` |
| **CHECK** | `GET` | `/api/admin/passes/unused` | All unassigned tokens & direct links | `X-Admin-Secret` |
| **CHECK** | `GET` | `/api/admin/passes/used` | Claimed RSVPs, member attendance & dietary | `X-Admin-Secret` |
| **CHECK** | `GET` | `/api/auth/stats` | Headcount & seat availability against 100 limit | None |
| **CHECK** | `GET` | `/api/auth/master-list` | Full raw party manifest | None |
| **CHECK** | `POST` | `/api/auth/lookup` | Guest profile & pass lookup by email | None |
| **CHECK** | `GET` | `/api/wedding-info` | Wedding dates, venues, countdown, contacts | None |
| **CHECK** | `GET` | `/api/events` | Schedule of 6 ceremonies | None |
| **CHECK** | `GET` | `/api/wishes` | Guest blessings & wishes wall | None |
| **UPDATE** | `POST` | `/api/admin/passes/create` | Programmatically create new VIP pass | `X-Admin-Secret` |
| **UPDATE** | `PUT` | `/api/admin/passes/{id}` | Update pass quota, table, side, RSVP status | `X-Admin-Secret` |
| **UPDATE** | `POST` | `/api/admin/passes/{id}/reset` | Reset pass to UNUSED, clear claimed email | `X-Admin-Secret` |
| **UPDATE** | `DELETE` | `/api/admin/users/{email_or_id}` | **Delete User / Pass by Email, ID, or Code** | `X-Admin-Secret` |
| **UPDATE** | `DELETE` | `/api/admin/users` | **Delete User by JSON body (`{"email": "..."}`)** | `X-Admin-Secret` |
| **UPDATE** | `POST` | `/api/admin/passes/test-email` | Trigger absence alert to adi2002rawat@gmail.com | `X-Admin-Secret` |
| **UPDATE** | `POST` | `/api/auth/family-rsvp` | Submit family RSVP with member attendance | None |
| **UPDATE** | `POST` | `/api/wishes` | Post new blessing for bride & groom | None |

---

## 4. One-Click Importable Postman Collection (v2.1.0)

To import this complete suite directly into Postman:
1. Open **Postman**
2. Click **Import** (top left)
3. Select the **Raw text** tab
4. Paste the JSON below and click **Import**:

```json
{
  "info": {
    "name": "\ud83d\udc51 Chandrika & Xudong Wedding \u2014 Production Admin Suite",
    "description": "Production Ready Postman Collection for Aditya (Wedding Host). Includes Check & Update APIs for both live Render and localhost environments.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://weeding-test.onrender.com",
      "type": "string"
    },
    {
      "key": "adminSecret",
      "value": "AdityaWeddingAdmin2026",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "\ud83d\udd0d CHECK APIs",
      "item": [
        {
          "name": "1. Service Health Check",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/health",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "health"
              ]
            },
            "description": "Verifies that Render deployment is UP and operational."
          }
        },
        {
          "name": "2. Master God-View (All Passes & Headcount)",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "X-Admin-Secret",
                "value": "{{adminSecret}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/admin/passes",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "admin",
                "passes"
              ]
            },
            "description": "Comprehensive summary: remaining seats, unused passes with tokens, and registered RSVPs."
          }
        },
        {
          "name": "3. Get Unused Passes (Tokens & Shareable Links)",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "X-Admin-Secret",
                "value": "{{adminSecret}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/admin/passes/unused",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "admin",
                "passes",
                "unused"
              ]
            },
            "description": "Returns unassigned tokens and URLs ready to send to guests."
          }
        },
        {
          "name": "4. Get Used Passes (Claimed RSVPs & Member Attendance)",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "X-Admin-Secret",
                "value": "{{adminSecret}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/admin/passes/used",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "admin",
                "passes",
                "used"
              ]
            },
            "description": "Returns all registered parties, headcount breakdown, and member absence reasons."
          }
        },
        {
          "name": "5. Headcount & Attendance Statistics",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/auth/stats",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "auth",
                "stats"
              ]
            },
            "description": "Real-time seat calculation against the 100-seat limit."
          }
        },
        {
          "name": "6. Full Raw Manifest List",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/auth/master-list",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "auth",
                "master-list"
              ]
            }
          }
        },
        {
          "name": "7. Lookup Guest by Email",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\\"email\\\": \\\"rawat.family@example.com\\\"\\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/lookup",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "auth",
                "lookup"
              ]
            }
          }
        },
        {
          "name": "8. Wedding Information & Venues",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/wedding-info",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "wedding-info"
              ]
            }
          }
        },
        {
          "name": "9. Wedding Events Schedule",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/events",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "events"
              ]
            }
          }
        },
        {
          "name": "10. Guest Wishes Wall",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/api/wishes",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "wishes"
              ]
            }
          }
        }
      ]
    },
    {
      "name": "\u270f\ufe0f UPDATE & MANAGE APIs",
      "item": [
        {
          "name": "1. Forge New VIP Pass",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "X-Admin-Secret",
                "value": "{{adminSecret}}",
                "type": "text"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\\"familyName\\\": \\\"Kapoor Family\\\",\\n  \\\"allowedPartySize\\\": 4,\\n  \\\"side\\\": \\\"Bride's Side (Chandrika)\\\",\\n  \\\"assignedTable\\\": \\\"Table 5 - Rose Garden Terrace\\\"\\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/admin/passes/create",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "admin",
                "passes",
                "create"
              ]
            },
            "description": "Generates a fresh pass token and shareable URL."
          }
        },
        {
          "name": "2. Update Existing Pass Details",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "X-Admin-Secret",
                "value": "{{adminSecret}}",
                "type": "text"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\\"familyName\\\": \\\"Rawat Family (VIP)\\\",\\n  \\\"allowedPartySize\\\": 5,\\n  \\\"assignedTable\\\": \\\"Table 1 - Royal Lotus Head Table\\\",\\n  \\\"side\\\": \\\"Bride's Side (Chandrika)\\\",\\n  \\\"confirmedHeadcount\\\": 4,\\n  \\\"rsvpStatus\\\": \\\"ATTENDING\\\"\\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/admin/passes/1",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "admin",
                "passes",
                "1"
              ]
            },
            "description": "Updates pass fields like headcount, table, side, and name."
          }
        },
        {
          "name": "3. Reset Pass to UNUSED State",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "X-Admin-Secret",
                "value": "{{adminSecret}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/admin/passes/1/reset",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "admin",
                "passes",
                "1",
                "reset"
              ]
            },
            "description": "Clears claimed email, login tokens, and RSVP so the link can be reused."
          }
        },
        {
          "name": "4. Delete User / Pass (by Email, ID, or Code in URL)",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "X-Admin-Secret",
                "value": "{{adminSecret}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/admin/users/rawat.family@example.com",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "admin",
                "users",
                "rawat.family@example.com"
              ]
            },
            "description": "Permanently deletes a user or pass using Email (e.g. rawat.family@example.com) or numeric ID (e.g. 1) directly in the URL."
          }
        },
        {
          "name": "5. Delete User (by Email in Request Body)",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "X-Admin-Secret",
                "value": "{{adminSecret}}",
                "type": "text"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\\"email\\\": \\\"rawat.family@example.com\\\"\\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/admin/users",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "admin",
                "users"
              ]
            },
            "description": "Deletes a user by passing JSON body with email or ID."
          }
        },
        {
          "name": "6. Test Absence Email Notification",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "X-Admin-Secret",
                "value": "{{adminSecret}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/admin/passes/test-email",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "admin",
                "passes",
                "test-email"
              ]
            },
            "description": "Triggers a test absence alert dispatch to adi2002rawat@gmail.com."
          }
        },
        {
          "name": "7. Submit Guest RSVP",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\\"primaryEmail\\\": \\\"rawat.family@example.com\\\",\\n  \\\"rsvpStatus\\\": \\\"ATTENDING\\\",\\n  \\\"confirmedHeadcount\\\": 3,\\n  \\\"attendingMembers\\\": \\\"Col. & Mrs. Rawat, Ananya Rawat\\\",\\n  \\\"dietaryDetails\\\": \\\"PURE_VEG\\\",\\n  \\\"songRequest\\\": \\\"Gallan Goodiyaan\\\",\\n  \\\"blessingMessage\\\": \\\"Congratulations!\\\",\\n  \\\"members\\\": [\\n    {\\n      \\\"name\\\": \\\"Col. & Mrs. Rawat\\\",\\n      \\\"relationship\\\": \\\"Parents\\\",\\n      \\\"isAttending\\\": true,\\n      \\\"dietaryPreference\\\": \\\"PURE_VEG\\\",\\n      \\\"allergyNotes\\\": \\\"\\\"\\n    },\\n    {\\n      \\\"name\\\": \\\"Aditya Rawat\\\",\\n      \\\"relationship\\\": \\\"Brother\\\",\\n      \\\"isAttending\\\": false,\\n      \\\"absenceReason\\\": \\\"Exams in progress\\\"\\n    }\\n  ]\\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/family-rsvp",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "auth",
                "family-rsvp"
              ]
            }
          }
        },
        {
          "name": "8. Post Guest Wish / Blessing",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\\"guestName\\\": \\\"Uncle Rajesh\\\",\\n  \\\"city\\\": \\\"Dehradun\\\",\\n  \\\"message\\\": \\\"Heartiest congratulations Chandrika & Xudong!\\\",\\n  \\\"relationship\\\": \\\"Uncle\\\"\\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/wishes",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "api",
                "wishes"
              ]
            }
          }
        }
      ]
    }
  ]
}
```
