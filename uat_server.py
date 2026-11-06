#!/usr/bin/env python3
"""
Local UAT (User Acceptance Testing) View-Only Web Server for DIDI_Wedding.
Provides:
- High-performance Byte-Range video/audio streaming (HTTP 206) for MP4s and songs.
- View-only safe mock API for /api/config, /api/rsvp, /api/wishes, /api/chat.
- Full access to compiled production frontend and admin dashboard.
- Safe testing without modifying production Hostinger database.
"""

import os
import sys
import json
import re
import shutil
import mimetypes
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Base directory for static files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "src", "main", "resources", "static")

# Sample mock configuration matching current production
MOCK_CONFIG = {
    "BRIDE_NICKNAME": "Chandrika",
    "GROOM_NICKNAME": "Xudong",
    "BRIDE_FULLNAME": "Chandrika Rawat",
    "GROOM_FULLNAME": "Xudong",
    "BRIDE_PARENTS": "Beloved daughter of Mr. & Mrs. Sharma",
    "GROOM_PARENTS": "Beloved son of Mr. & Mrs. Wang",
    "BRIDE_IMAGE": "/couple/final1.jpg",
    "GROOM_IMAGE": "/couple/final2.jpg",
    "VENUE_NAME": "The Club International",
    "VENUE_ADDRESS": "The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)",
    "VENUE_LAT": "28.5134",
    "VENUE_LNG": "77.0275",
    "AKAD_TITLE": "Wedding Ceremony",
    "AKAD_DAY": "Monday",
    "AKAD_DATE": "15 February 2027",
    "AKAD_START": "19:00",
    "AKAD_END": "22:00",
    "TIME_MEHENDI": "10:00 AM",
    "TIME_HALDI": "03:00 PM",
    "TIME_BARAAT": "07:00 PM",
    "TIME_WEDDING": "08:30 PM",
    "MUSIC_URL": "https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3",
    "RSVP_MAX_GUESTS": "10",
    "BANK_ACCOUNTS": "[]",
    "LOVE_STORY": "[]",
    "GALLERY_IMAGES": "[]",
    "TEXT_SALAM_OPENING": "Together with our families, we cordially invite you",
    "TEXT_QUOTE_AR_RUM": "\"Two souls with but a single thought, two hearts that beat as one. In love, kindness, and devotion, we begin our new journey together.\"",
    "TEXT_QUOTE_SOURCE": "A Celebration of Love & Unity",
    "TEXT_INVITATION": "With immense joy and grateful hearts, we invite you to share in our happiness as we unite in marriage under the grand mandap.",
    "TEXT_CLOSING": "Your blessings, presence, and prayers mean everything to us as we begin this beautiful chapter of our lives.",
    "TEXT_SALAM_CLOSING": "With warm regards and heartfelt gratitude,",
    "TEXT_SIGNATURE": "With Love & Gratitude,",
    "TEXT_FAMILY": "Warmly Hosted by Aditya Rawat & Family",
    "CONTACT_EMAIL": "rsvp@chandrikawedsxudong.com"
}

# In-memory mock RSVPs and Wishes for testing
MOCK_RSVPS = [
    {
        "id": 1,
        "name": "Amit Sharma & Family",
        "family": "Sharma Family",
        "guests": 3,
        "status": "ATTENDING",
        "events": "MEHENDI,HALDI,WEDDING",
        "notes": "Looking forward to celebrating with you both!"
    },
    {
        "id": 2,
        "name": "Li Wei & Family",
        "family": "Wang Family",
        "guests": 2,
        "status": "ATTENDING",
        "events": "WEDDING",
        "notes": "Double happiness and safe travels from Beijing!"
    }
]

MOCK_WISHES = [
    {
        "id": 1,
        "name": "Pooja & Rohan",
        "relationship": "Friends",
        "message": "Wishing Chandrika & Xudong a lifetime of endless joy, laughter, and happiness together!",
        "created_at": "2026-11-01 14:20:00"
    },
    {
        "id": 2,
        "name": "Uncle David & Aunt Mei",
        "relationship": "Family",
        "message": "Heartiest congratulations! May your union be filled with double happiness and divine blessings.",
        "created_at": "2026-11-03 09:15:00"
    }
]

class UATRequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Keep console output neat
        sys.stderr.write(f"[UAT {self.address_string()}] {format % args}\n")

    def end_headers_with_cors(self, content_type="application/json"):
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Admin-Key")
        self.send_header("X-UAT-Environment", "View-Only-Local-Sandbox")
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers_with_cors()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # 1. API: /api/config or /api/config/full
        if path in ("/api/config", "/api/config/full"):
            self.send_response(200)
            self.end_headers_with_cors("application/json; charset=utf-8")
            self.wfile.write(json.dumps(MOCK_CONFIG).encode("utf-8"))
            return

        # 2. API: /api/rsvp
        if path == "/api/rsvp":
            self.send_response(200)
            self.end_headers_with_cors("application/json; charset=utf-8")
            self.wfile.write(json.dumps(MOCK_RSVPS).encode("utf-8"))
            return

        # 3. API: /api/rsvp/{token} (Personalized VIP RSVP Token endpoint)
        if path.startswith("/api/rsvp/"):
            token = path.split("/api/rsvp/")[1].strip()
            self.send_response(200)
            self.end_headers_with_cors("application/json; charset=utf-8")
            token_guest = {
                "token": token,
                "name": f"Honored Guest ({token.capitalize()})",
                "family": "Friends & Family",
                "maxGuests": 4,
                "attendingCount": 2,
                "status": "ATTENDING",
                "ceremonies": ["MEHENDI", "HALDI", "WEDDING"],
                "isVip": True
            }
            self.wfile.write(json.dumps(token_guest).encode("utf-8"))
            return

        # 4. API: /api/wishes
        if path == "/api/wishes":
            self.send_response(200)
            self.end_headers_with_cors("application/json; charset=utf-8")
            self.wfile.write(json.dumps(MOCK_WISHES).encode("utf-8"))
            return

        # 5. API: /api/auth/status
        if path == "/api/auth/status":
            self.send_response(200)
            self.end_headers_with_cors("application/json; charset=utf-8")
            self.wfile.write(json.dumps({"authenticated": True, "mode": "uat_view_only"}).encode("utf-8"))
            return

        # 6. Static File Serving (with Range Request support for MP4 video streaming)
        self.serve_static_file(path)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # Read POST body
        content_length = int(self.headers.get("Content-Length", 0))
        body_bytes = self.rfile.read(content_length) if content_length > 0 else b"{}"
        try:
            body = json.loads(body_bytes.decode("utf-8"))
        except Exception:
            body = {}

        # 1. API: /api/chat (AI Chatbot mock reply)
        if path in ("/api/chat", "/api/ai/chat"):
            user_msg = body.get("message", "")
            self.send_response(200)
            self.end_headers_with_cors("application/json; charset=utf-8")
            reply = (
                f"[UAT AI Concierge 🐾✨] Hello! You asked: \"{user_msg}\". "
                f"Chandrika & Xudong's wedding ceremonies take place on 14 & 15 February 2027 at The Club International, Gurugram. "
                f"Mehendi is on Feb 14 at {MOCK_CONFIG['TIME_MEHENDI']}, Haldi on Feb 15 at {MOCK_CONFIG['TIME_HALDI']}, "
                f"Baraat at {MOCK_CONFIG['TIME_BARAAT']}, and the Wedding Ceremony under the Mandap at {MOCK_CONFIG['TIME_WEDDING']}!"
            )
            self.wfile.write(json.dumps({"success": True, "reply": reply}).encode("utf-8"))
            return

        # 2. API: /api/rsvp (Mock safe submission in UAT)
        if path == "/api/rsvp" or path.startswith("/api/rsvp/"):
            self.send_response(200)
            self.end_headers_with_cors("application/json; charset=utf-8")
            resp_data = {
                "success": True,
                "message": "UAT Preview Mode: RSVP submitted successfully to local memory (production database untouched).",
                "entry": body
            }
            self.wfile.write(json.dumps(resp_data).encode("utf-8"))
            return

        # 3. API: /api/wishes (Mock safe wish submission)
        if path == "/api/wishes":
            self.send_response(200)
            self.end_headers_with_cors("application/json; charset=utf-8")
            new_wish = {
                "id": len(MOCK_WISHES) + 1,
                "name": body.get("name", "UAT Guest"),
                "relationship": body.get("relationship", "Guest"),
                "message": body.get("message", "Best wishes from local UAT testing!"),
                "created_at": "Just now"
            }
            MOCK_WISHES.insert(0, new_wish)
            self.wfile.write(json.dumps({"success": True, "wish": new_wish}).encode("utf-8"))
            return

        # 4. API: /api/config (Mock safe config update)
        if path == "/api/config":
            MOCK_CONFIG.update(body)
            self.send_response(200)
            self.end_headers_with_cors("application/json; charset=utf-8")
            self.wfile.write(json.dumps({"success": True, "message": "UAT configuration updated in memory."}).encode("utf-8"))
            return

        # Fallback 404
        self.send_response(404)
        self.end_headers_with_cors("application/json")
        self.wfile.write(json.dumps({"error": "Endpoint not found in UAT mode"}).encode("utf-8"))

    def serve_static_file(self, rel_path):
        rel_path = rel_path.lstrip("/")
        if not rel_path or rel_path == "":
            rel_path = "index.html"

        # Check if file exists in STATIC_DIR or base repo (for large media videos)
        file_path = os.path.normpath(os.path.join(STATIC_DIR, rel_path))

        # Security check: stay inside project
        if not file_path.startswith(STATIC_DIR) and not file_path.startswith(BASE_DIR):
            self.send_error(403, "Access Denied")
            return

        # If file not found in STATIC_DIR, check in base repo directory
        if not os.path.exists(file_path):
            alt_path = os.path.normpath(os.path.join(BASE_DIR, rel_path))
            if os.path.exists(alt_path) and os.path.isfile(alt_path):
                file_path = alt_path

        # If still not found, fallback to index.html (SPA routing)
        if not os.path.exists(file_path) or os.path.isdir(file_path):
            file_path = os.path.join(STATIC_DIR, "index.html")

        file_size = os.path.getsize(file_path)
        content_type, _ = mimetypes.guess_type(file_path)
        if not content_type:
            if file_path.endswith(".js"):
                content_type = "application/javascript"
            elif file_path.endswith(".css"):
                content_type = "text/css"
            elif file_path.endswith(".mp4"):
                content_type = "video/mp4"
            else:
                content_type = "application/octet-stream"

        # Handle HTTP 206 Partial Content (Byte Range requests for MP4 video seeking)
        range_header = self.headers.get("Range")
        if range_header and os.path.isfile(file_path):
            match = re.match(r"bytes=(\d+)-(\d*)", range_header)
            if match:
                start = int(match.group(1))
                end = int(match.group(2)) if match.group(2) else file_size - 1
                if start >= file_size:
                    self.send_error(416, "Requested Range Not Satisfiable")
                    return
                end = min(end, file_size - 1)
                chunk_length = end - start + 1

                self.send_response(206)
                self.send_header("Content-Type", content_type)
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
                self.send_header("Content-Length", str(chunk_length))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("X-UAT-Environment", "View-Only-Local-Sandbox")
                self.end_headers()

                with open(file_path, "rb") as f:
                    f.seek(start)
                    bytes_remaining = chunk_length
                    while bytes_remaining > 0:
                        chunk = f.read(min(bytes_remaining, 64 * 1024))
                        if not chunk:
                            break
                        try:
                            self.wfile.write(chunk)
                        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
                            break
                        bytes_remaining -= len(chunk)
                return

        # Normal full file response (200 OK)
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(file_size))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("X-UAT-Environment", "View-Only-Local-Sandbox")
        self.end_headers()

        with open(file_path, "rb") as f:
            try:
                shutil.copyfileobj(f, self.wfile)
            except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
                pass

def run(port=3000):
    server = ThreadingHTTPServer(("0.0.0.0", port), UATRequestHandler)
    server.daemon_threads = True
    print("=" * 70)
    print(f" [UAT] WEDDING WEBSITE LOCAL VIEW-ONLY ENVIRONMENT IS READY")
    print("=" * 70)
    print(f" Local URL (on this PC):   http://localhost:{port}")
    print(f" Admin Panel (UAT):        http://localhost:{port}/admin.html")
    print(f" Video/Audio Streaming:    ENABLED (HTTP 206 Byte-Range)")
    print(f" Production Database:      PROTECTED (Mock Safe In-Memory Store)")
    print(f" Press Ctrl+C to stop the server.")
    print("=" * 70, flush=True)
    server.serve_forever()

if __name__ == "__main__":
    p = 3000
    if len(sys.argv) > 1:
        try:
            p = int(sys.argv[1])
        except ValueError:
            pass
    run(p)
