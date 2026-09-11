# Royal Indian Wedding Website & Digital Invitation Platform ("DIDI_Wedding")

A robust full-stack wedding website and digital invitation platform designed for your sister's wedding in India, inspired by the luxury postcard design of [Appy Couple](https://www.appycouple.com/ping/qwtz1i7n/).

Built with **Spring Boot 3** REST API backend, **React 18** with **Three.js** 3D graphics, **Tailwind CSS**, and **H2 Persistent Database**.

---

## 🌟 Features

### 1. Appy Couple Style Invitation Postcard
- 3-column luxury invitation card layout with gold filigree corner ornaments.
- High-resolution bridal and couple portrait display.
- Host introduction line (*"The Verma & Sharma Families with joyful hearts invite you..."*).
- Event Passcode card (`DIDI2026`) with instant RSVP and digital pass actions.

### 2. Interactive Three.js 3D Experience
- 3D interlocking **Royal Gold and Rose Gold wedding rings** with a sparkling diamond solitaire facet jewel.
- Dynamic particle physics simulation of **floating marigold and rose petals** drifting in 3D space.
- Interactive cursor/mouse tilt parallax and realistic metallic specular lighting.

### 3. Traditional Indian Ceremonies Timeline
Six traditional wedding ceremonies pre-configured with timings, dress codes, Google Maps links, and Google Calendar export buttons:
1. **Ganesh Puja & Mehndi Carnival** (Henna, folk music, live street-food stalls)
2. **Haldi & Phoolon Ki Holi** (Turmeric blessings with fragrant marigold petal shower)
3. **Sangeet & Cocktail Extravaganza** (*Jashn-e-Bahaar*: dance battles, DJ, cocktails)
4. **Baraat & Varmala** (Grand royal entry & sacred garland exchange by Lake Pichola)
5. **Vivah Sanskar (Sacred 7 Phere)** (Vedic vows around the holy agni at lagna muhurat)
6. **Royal Reception & Gala Banquet** (Imperial feast and celebration under the stars)

### 4. Interactive RSVP & Headcount Management
- Response selection: *Joyfully Accept* vs *Regretfully Decline*.
- Headcount tracking for primary guest and plus-ones / family members (1 to 5).
- Event attendance selection (choose which specific ceremonies they are attending).
- Dietary choices: **Pure Vegetarian**, **Jain Vegetarian** (no onion/garlic/root vegetables), and **Non-Vegetarian**.
- Sangeet song recommendations and personal blessings.
- Celebratory colorful **confetti explosion** (`canvas-confetti`) on RSVP submission!

### 5. Personalized Digital Wedding Pass with QR Code
- Generates a royal admission ticket with the guest's name, event passcode, headcount, dates, and venue.
- Generates dynamic QR code for entry verification at the hospitality welcome desk.
- One-click *Print / Save as PDF* button.

### 6. Wishing Well / Digital Blessings Wall
- Guests can post sweet blessings and congratulatory notes directly to the backend database.
- Real-time display on an elegant gold-accented guestbook card wall.

### 7. Travel, Stay & Hospitality Logistics
- Airport (Maharana Pratap Airport - UDR) and Railway (Udaipur City Station - UDZ) transit guides.
- Recommended luxury hotels (*The Oberoi Udaivilas, Trident Udaipur, Radisson Blu*) with wedding discount code `DIDIWED26`.
- 24/7 Family Hospitality desk contact info (Phone & Email).

### 8. Host / Family Admin Dashboard
- Live dashboard accessible via the shield icon in the top navigation.
- Real-time headcount counters (Total Attending, Confirmed RSVPs, Declined, Vegetarian vs Jain breakdown).
- Complete scrollable table of guest responses.
- **Export to CSV** button to easily download the guest list for caterers and hotel reservations.

### 9. Atmospheric Wedding Music Player
- Web Audio API procedural synthesizer playing soothing Indian classical Bansuri (flute) and Tanpura harmonic drone.
- Instant user play/pause audio toggle without external audio stream buffering delays.

---

## 🚀 Quick Start & How to Run

### Method 1: One-Click Launcher (Windows)
Double-click `start_website.bat` inside `C:\Users\Adity\OneDrive\Desktop\DIDI_Wedding`.
It automatically starts both the backend and frontend and launches your browser at `http://127.0.0.1:5173`.

### Method 2: Manual Terminal Commands

#### 1. Start the Spring Boot Backend (Port 8080)
```powershell
cd C:\Users\Adity\OneDrive\Desktop\DIDI_Wedding\backend
java -jar target\didi-wedding-backend-1.0.0.jar
```
*The backend starts at `http://localhost:8080` with persistent database in `../data/weddingdb.mv.db`.*

#### 2. Start the React Frontend (Port 5173)
```powershell
cd C:\Users\Adity\OneDrive\Desktop\DIDI_Wedding\frontend
node node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173
```
*Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.*

---

## 🗄️ Database Configuration (MySQL)

- **Database Engine**: MySQL Server (running locally on port 3306)
- **Database Name**: `wedding`
- **Username**: `root`
- **Driver**: `com.mysql.cj.jdbc.Driver`
- **Auto DDL**: Hibernate `update` mode (automatically generates and manages tables: `wedding_events`, `rsvps`, `guest_wishes`)

---

## ✏️ Customizing for Your Sister's Wedding

1. **Bride & Groom Names / Dates**:
   Edit `backend/src/main/java/com/wedding/didi/controller/WeddingInfoController.java` to set your sister's real name, your brother-in-law's name, and family host names.
2. **Ceremony Itinerary**:
   Edit `backend/src/main/java/com/wedding/didi/config/DataInitializer.java` to change event dates, venues, or timings.
3. **Photos**:
   Replace placeholder image URLs in `frontend/src/components/HeroPostcard.jsx`, `frontend/src/components/CoupleStory.jsx`, and `frontend/src/components/Gallery.jsx` with actual pre-wedding photographs.
