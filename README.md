# Digital Wedding Invitation – Spring Boot 3 Edition
### For Chandrika & Xudong

A digital wedding invitation web application built with **Spring Boot 3**, **Java 21+**, **Spring Data JPA**, and a luxury responsive frontend.

---

## Features

- **Interactive Envelope Opening Experience**:
  - Personalized to guest name via query param (e.g. `http://localhost:8080/?to=John+Doe`).
  - Automatic romantic background music trigger upon envelope open.
  - Smooth 3D/fade entrance animation.
- **Hero & Live Countdown**:
  - Luxury typography with *Cormorant Garamond* and *Outfit* fonts.
  - Real-time countdown timer to the wedding ceremony.
- **Couple Profile**:
  - Profiles for **Chandrika** and **Xudong** with portrait imagery, parent details, and social links.
  - Blessing quote celebrating their union.
- **Love Story Timeline**:
  - Milestones of Chandrika and Xudong's romantic journey.
- **Event Schedule & Calendar Integration**:
  - Ceremony and Reception details.
  - One-click **Google Calendar** integration and **Apple/Outlook (.ics)** calendar download.
  - Interactive Google Maps embed + 1-click address copy.
- **Photo Gallery**:
  - Responsive masonry grid with fullscreen lightbox viewer, keyboard navigation (Left/Right/Escape).
- **Interactive RSVP**:
  - Attending / Tentative / Regrets status toggle.
  - Guest headcount (+ / - counter).
  - Personal note to couple.
  - Real-time RSVP headcount badge and live guest list.
- **Wishes Guestbook**:
  - Message submission form and paginated list of heartfelt blessings.
- **Gift Registry & Blessings**:
  - Bank transfer details with 1-click account number copy.
  - Physical gift delivery address with 1-click copy.
- **Floating Controls & Theme**:
  - Bottom navigation pill with smooth scrolling links.
  - Dark Mode and Light Mode with instant toggle and local storage persistence.
  - Floating romantic petal animation.
- **Admin Management & QR Generator**:
  - Protected admin portal at `/admin` (Default password: `P@ssw0rd`).
  - View, search, filter, inline-edit, single-delete, and bulk-delete RSVPs and Wishes.
  - Real-time response statistics (Attending headcount, Tentative, Regrets).
  - Edit all couple details, dates, venues, story, gallery, and bank accounts.
  - Export RSVPs and Wishes to formatted CSV files.
  - Standalone QR Code Generator at `/qrcode` with couple monogram `C & X` in center for personalized guest links.

---

## Getting Started

### Prerequisites
- **Java 21 or higher** (tested with Java 24)
- **Apache Maven 3.8+** (or Maven wrapper)

### Running the Application

You can run the application directly using Maven:

```bash
mvn spring-boot:run
```

Or run the pre-built standalone executable JAR:

```bash
java -jar target/wedding-invitation-1.0.0.jar
```

Once started, open your browser and navigate to:
- **Main Invitation**: [http://localhost:8080](http://localhost:8080)
- **Personalized Invitation**: [http://localhost:8080/?to=VIP+Guest](http://localhost:8080/?to=VIP+Guest)
- **Admin Dashboard**: [http://localhost:8080/admin](http://localhost:8080/admin) (Password: `P@ssw0rd`)
- **QR Code Generator**: [http://localhost:8080/qrcode](http://localhost:8080/qrcode)

---

## Building from Source

To compile and package into an executable JAR:

```bash
mvn clean package
```

The resulting JAR will be generated in `target/wedding-invitation-1.0.0.jar`.

To modify the frontend:
1. Navigate to the `frontend/` directory.
2. Run `npm run build`. The production bundle automatically compiles directly into `src/main/resources/static/`.

---

## Architecture & REST API

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/config` | GET | Fetch public wedding settings | No |
| `/api/config/full` | GET | Fetch all settings (including Telegram tokens) | Admin Cookie |
| `/api/config` | POST | Update settings | Admin Cookie |
| `/api/rsvp` | GET | List all guest RSVPs | No |
| `/api/rsvp` | POST | Submit or update an RSVP | No |
| `/api/rsvp/stats` | GET | Summary attendance statistics | No |
| `/api/wishes` | GET | List all guestbook wishes | No |
| `/api/wishes` | POST | Submit or update a wish | No |
| `/api/admin` | POST | Admin actions (edit/delete RSVP or wish) | Admin Cookie |
| `/api/auth/login` | POST | Admin login (`{"credential": "..."}`) | No |
| `/api/auth/logout` | POST | Admin logout | No |
| `/api/auth/status` | GET | Check admin login status | No |
| `/api/export-rsvp` | GET | Download RSVPs as CSV | No |
| `/api/export-wishes` | GET | Download Wishes as CSV | No |

---

## Database

The application uses an embedded, file-persisted **H2 Database** stored at:
`./database/weddingdb`

All configurations, RSVPs, and wishes are stored securely and persist automatically across server restarts.
