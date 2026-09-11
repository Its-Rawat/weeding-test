# Add Secure Invitation-Based Authentication & RSVP System

I already have an existing wedding invitation website/application. I want you to **add a secure invitation-based authentication and RSVP system to my existing application**.

## IMPORTANT

- Do NOT rebuild the existing website from scratch.
- Do NOT unnecessarily change the existing UI, design, animations, 3D scene, colors, typography, or existing pages.
- First inspect the existing project structure and understand the current frontend/backend architecture.
- Reuse the existing technologies, components, styling system, routing, and database architecture wherever possible.
- Only add or modify what is required for this authentication/invitation functionality.
- The system must be designed for a real wedding invitation, where every invited family/group receives a unique invitation pass.
- The implementation must be secure and prevent the same invitation from being registered multiple times.
- The system must be mobile-friendly because guests will primarily access it through their phones.

---

# 1. Overall User Flow

When someone opens the wedding website for the first time:

```text
Open Website
      ↓
Invitation Authentication Page
      ↓
Enter Email OR Open Unique Invitation Link / Scan QR
      ↓
Validate Invitation
      ↓
First-time Registration
      ↓
Associate Email with Invitation
      ↓
Add Family Members / Number of Guests
      ↓
Save RSVP
      ↓
Access Wedding Website
```

The public wedding content should NOT be accessible before the guest has successfully authenticated.

The first screen should essentially be an **Invitation/Login screen**.

---

# 2. Invitation Pass System

I want an admin to be able to generate unique invitation passes.

Each invitation pass represents one invited person/family/group.

Each pass must have a unique identifier/token.

Example:

```text
Invitation ID:
INV-8F3K92

Secure Token:
random unique non-guessable token

Invitation URL:
https://example.com/invite/<secure-token>
```

The exact URL structure can be decided based on the existing application's routing architecture.

Each invitation should also be convertible into a QR code containing its unique invitation URL.

Example:

```text
QR Code
   ↓
https://example.com/invite/abcXYZ123...
```

---

# 3. Single-Use Invitation Rule

This is one of the most important requirements.

Every invitation pass must be usable for **first-time registration only**.

Example:

```text
Invitation A
     ↓
Guest opens unique invitation link
     ↓
Invitation is valid and unused
     ↓
Guest registers with email
     ↓
Invitation becomes REGISTERED/USED
```

After that:

```text
Same invitation link
        ↓
Someone tries to open/register again
        ↓
DO NOT allow registration
        ↓
Show:
"This invitation has already been registered."
```

The invitation must NOT become reusable simply because someone:

- opens the link again
- scans the QR code again
- uses another browser
- uses another device
- uses another email address

The server/database must be the final authority.

Do NOT rely only on frontend/localStorage/sessionStorage/cookies to enforce this.

The invitation's registration status must be stored in the database.

---

# 4. Email Association

When the invitation is used for the first time, ask the invitee for their email address.

For example:

```text
You have been invited to the wedding ❤️

Invitation verified.

Enter your email address:
[________________________]

[Continue]
```

The email entered during the first registration must be permanently associated with that invitation.

Database relationship should conceptually be:

```text
Invitation
    ↓
Registered Guest
    ↓
Email Address
```

Example:

```text
Invitation ID: INV-8F3K92
Email: guest@example.com
Status: REGISTERED
Registered At: timestamp
```

Once the email is associated with the invitation, it must not be possible to register the same invitation using a different email.

---

# 5. Email Login

I also want guests to be able to return to the website later using their registered email address.

The login flow should be:

```text
Enter Email
     ↓
Check whether email is associated with a valid registered invitation
     ↓
If yes → authenticate guest
     ↓
Open wedding website
```

Do NOT allow arbitrary emails to enter the wedding website.

Only emails that have previously been associated with a valid invitation should be allowed.

Prefer a secure passwordless authentication mechanism such as:

```text
Email
   ↓
One-Time Password (OTP) / Magic Link
   ↓
Verification
   ↓
Authenticated Session
```

If implementing OTP/magic-link authentication is outside the current project's capabilities, clearly explain what backend/email-service configuration is required instead of implementing an insecure fake authentication mechanism.

---

# 6. Invitation Link Authentication

There should also be a flow where the guest does not need to manually enter an invitation code.

The invitation card/pass will contain a unique QR code.

Example:

```text
Wedding Invitation Card
        ↓
      QR Code
        ↓
Scan with phone
        ↓
Unique invitation URL opens
        ↓
Server validates invitation
        ↓
Registration/Login
```

The URL should contain a secure, non-guessable token.

Do NOT expose predictable sequential IDs such as:

```text
/invite/1
/invite/2
/invite/3
```

Instead use a cryptographically secure random token.

---

# 7. First-Time Registration

For a new invitation:

```text
Guest opens invitation
        ↓
Validate invitation
        ↓
Invitation is unused
        ↓
Ask for email
        ↓
Verify email
        ↓
Create guest account/registration
        ↓
Mark invitation as used
```

The database operation that marks the invitation as used must be atomic/transactional so that two simultaneous requests cannot both register the same invitation.

For example:

```text
Invitation status:

UNUSED
   ↓
REGISTERED
```

There should never be a situation where:

```text
Request A → registers
Request B → also registers
```

because both requests arrived at approximately the same time.

Use proper database constraints and/or transactions to enforce this.

---

# 8. Family Member / Guest Count

After successful registration, the primary invitee should be able to specify who is coming with them.

For example:

```text
Welcome ❤️

How many people are attending the wedding with you?

Primary Invitee:
[ Rahul Sharma ]

Family Members / Guests:

1. Rahul Sharma
2. Priya Sharma
3. Amit Sharma
4. Neha Sharma
5. Rohan Sharma

Total Guests: 5

[Confirm RSVP]
```

The system should store the individual guest/family members where practical.

Do not store only:

```text
guest_count = 5
```

Prefer storing individual members:

```text
Primary Guest
    ↓
Family/Guest Members
    ├── Member 1
    ├── Member 2
    ├── Member 3
    ├── Member 4
    └── Member 5
```

The primary invitee should be included in the total count.

---

# 9. RSVP Information

The registration should maintain information such as:

```text
Invitation
- invitation_id
- secure_token
- status
- created_at
- registered_at

Guest / Registration
- guest_id
- invitation_id
- email
- email_verified
- registered_at
- last_login_at

Family Members
- member_id
- guest_id
- name
- relationship (optional)
- attending
- created_at
```

You may modify the schema according to the existing project's database conventions.

---

# 10. RSVP Changes

After registration, the primary invitee should be able to return later and update their RSVP/family information.

Example:

```text
5 people registered

Rahul
Priya
Amit
Neha
Rohan
```

They should be able to update this later if necessary.

However:

**Updating RSVP information must NOT reset or reuse the invitation token.**

The invitation remains permanently associated with the original registered email/account.

---

# 11. Security Requirements

Please treat this as a real authentication system.

### Never rely on:

```text
localStorage
sessionStorage
frontend flags
hidden fields
JavaScript-only validation
```

for invitation security.

All important validation must happen on the server.

Implement:

### Secure invitation tokens

Use a cryptographically secure random token.

Do not use:

```text
1
2
3
INV001
INV002
```

as the actual security token.

### Token storage

If possible, store a secure hash of the invitation token in the database rather than storing the raw token.

### Single-use protection

The server must enforce:

```text
UNUSED → REGISTERED
```

and prevent:

```text
REGISTERED → REGISTERED AGAIN
```

### Email uniqueness

The system must prevent the same invitation from being associated with another email.

### Authentication

Do not create fake authentication merely by checking whether an email exists in the frontend.

Use proper server-side authentication/session handling.

### Authorization

A guest must only be able to view/update their own registration and family members.

For example:

```text
Guest A
   ↓
Can access Guest A's RSVP

Guest B
   ↓
Cannot access Guest A's RSVP
```

---

# 12. Admin Panel

If the existing application does not already have an admin panel, create a simple protected admin section.

The admin should be able to:

```text
Create Invitation
       ↓
Generate secure token
       ↓
Generate invitation URL
       ↓
Generate QR Code
       ↓
Download/print invitation pass
```

The admin should also be able to see:

```text
Invitation ID
Guest Name
Email
Registration Status
Number of Guests
Registration Date
```

Example dashboard:

```text
--------------------------------------------------
Wedding Invitations
--------------------------------------------------

ID          Email             Guests    Status
INV001      abc@gmail.com     4         Registered
INV002      xyz@gmail.com     2         Registered
INV003      --                --        Unused
INV004      pqr@gmail.com     5         Registered

Total Invitations: 100
Registered: 72
Unused: 28
Total Attendees: 287
--------------------------------------------------
```

Also provide filtering/search by:

- invitation ID
- email
- guest name
- registration status

---

# 13. QR Code

Each invitation should have a QR code generated from the unique invitation URL.

For example:

```text
https://example.com/invite/<secure-token>
```

The QR code should be downloadable by the admin so it can be printed on physical wedding invitation cards/passes.

If the project already has a suitable QR-code library, reuse it.

Otherwise recommend an appropriate library compatible with the current stack.

---

# 14. Important Edge Cases

Handle these cases properly:

### Case 1 — Unused invitation

```text
Guest opens link
→ Valid
→ Allow registration
```

### Case 2 — Already registered invitation

```text
Guest opens same link
→ Already registered
→ Do not create another account
```

Show a friendly message such as:

> This invitation has already been registered. Please sign in using your registered email address.

### Case 3 — Wrong email

If an invitation is already associated with:

```text
abc@gmail.com
```

and someone attempts to authenticate using:

```text
xyz@gmail.com
```

do not allow them to take ownership of the invitation.

### Case 4 — Same QR scanned multiple times

The QR code can technically be scanned multiple times, but after registration it must lead to the login/authentication flow rather than creating another registration.

### Case 5 — Same invitation opened on another phone

It must still remain associated with the original registered account.

### Case 6 — Two people registering simultaneously

Use database-level atomicity/transaction/unique constraints to prevent duplicate registration.

### Case 7 — Invalid token

Show:

> This invitation link is invalid or no longer available.

Do not expose database information.

### Case 8 — Guest opens invitation link after already registering

Instead of showing registration again:

```text
Invitation already registered.
Please continue with your registered email.
```

---

# 15. Suggested Database Relationships

Design the database approximately like:

```text
                    ┌─────────────────┐
                    │   INVITATIONS   │
                    ├─────────────────┤
                    │ id              │
                    │ token_hash      │
                    │ status          │
                    │ created_at      │
                    │ registered_at   │
                    └────────┬────────┘
                             │
                             │ 1 : 1
                             ↓
                    ┌─────────────────┐
                    │     GUESTS      │
                    ├─────────────────┤
                    │ id              │
                    │ invitation_id   │
                    │ email           │
                    │ email_verified  │
                    │ created_at      │
                    └────────┬────────┘
                             │
                             │ 1 : N
                             ↓
                    ┌─────────────────┐
                    │ FAMILY_MEMBERS  │
                    ├─────────────────┤
                    │ id              │
                    │ guest_id        │
                    │ name            │
                    │ relationship    │
                    │ attending       │
                    └─────────────────┘
```

Adapt this to the existing database technology.

---

# 16. Frontend Routes

Adapt routes according to the existing application.

Conceptually:

```text
/login
/invite/:token
/register
/rsvp
/wedding
/admin
/admin/invitations
```

The actual route names can be different.

The important requirement is:

```text
Unauthenticated user
        ↓
Cannot access /wedding
        ↓
Must authenticate first
```

---

# 17. Wedding Website Access

After successful authentication:

```text
Login
 ↓
Authenticated Session
 ↓
Wedding Website
```

The existing wedding website should remain exactly as much as possible.

Do not force guests to authenticate again while navigating between pages.

Use a secure session mechanism appropriate for the existing backend.

---

# 18. UX

The login/invitation screen should feel like part of the wedding invitation rather than a generic corporate login page.

For example:

```text
        🌸

      You're Invited

          ❤️

   [ Enter your email ]

       [ Continue ]

   ───────── OR ─────────

   Scan your invitation
       QR code

        🌸
```

However, keep the existing application's visual design and 3D experience wherever possible.

The authentication UI should match the existing wedding theme.

---

# 19. Backend API Requirements

Create the necessary APIs based on the existing backend.

Conceptually:

```text
POST /api/invitations/validate

POST /api/invitations/register

POST /api/auth/request-otp

POST /api/auth/verify-otp

GET /api/me

GET /api/me/rsvp

PUT /api/me/rsvp

GET /api/admin/invitations

POST /api/admin/invitations

GET /api/admin/invitations/:id
```

These are conceptual examples. Use the project's existing API conventions.

---

# 20. Do Not Break Existing Application

Before making changes:

1. Inspect the entire project structure.
2. Identify:
   - frontend framework
   - backend framework
   - database
   - authentication mechanism, if any
   - routing
   - environment configuration
   - existing API structure
3. Determine the minimum changes required.
4. Reuse existing dependencies wherever possible.
5. Do not introduce unnecessary frameworks.
6. Do not duplicate existing functionality.
7. Preserve all existing wedding website functionality.

---

# 21. Environment Variables

Any secrets/configuration must be stored in environment variables.

For example:

```text
DATABASE_URL=
AUTH_SECRET=
EMAIL_PROVIDER_API_KEY=
BASE_URL=
```

Never hardcode:

- API keys
- database passwords
- authentication secrets
- email credentials

into frontend code or source control.

---

# 22. Final Deliverables

After implementing the functionality, provide me with:

### A. Files changed

List every file created/modified.

### B. Database changes

Provide the exact schema/migrations required.

### C. Environment variables

List every required environment variable.

### D. Installation commands

Tell me exactly which packages need to be installed.

### E. How authentication works

Give me a concise flow diagram.

### F. How to create an invitation

Explain how I can create a new invitation and generate its QR code.

### G. How to test

Give me a test checklist covering:

- new invitation
- first registration
- duplicate registration
- wrong email
- QR code
- returning login
- family members
- RSVP update
- simultaneous registration
- invalid invitation
- unauthorized access
- admin functionality

### H. Security review

Before finishing, review the implementation specifically for:

- token reuse
- duplicate registration
- IDOR
- unauthorized RSVP access
- email/account takeover
- race conditions
- client-side-only validation
- exposed secrets
- insecure authentication
- predictable invitation tokens

Fix any issues you identify.

---

# MOST IMPORTANT BUSINESS RULE

The fundamental rule of this system is:

```text
ONE INVITATION
       ↓
ONE FIRST-TIME REGISTRATION
       ↓
ONE VERIFIED EMAIL
       ↓
ONE GUEST/FAMILY REGISTRATION
```

The invitation token is effectively a **single-use registration credential**.

Once consumed:

```text
Invitation Token
      ↓
      USED
      ↓
Cannot be claimed by another person
```

The original registered guest can continue to log in later using their verified email/account and manage their RSVP/family members.

Do not implement this as a simple frontend form. It must be enforced by the backend and database.

First inspect my existing project and explain the proposed architecture and files you will modify. Then implement the functionality while preserving my existing wedding website.