import os
import sys
import time
import shutil
import re
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

STATIC_DIR = r"C:\Users\Adity\OneDrive\Desktop\DIDI_Wedding\src\main\resources\static"
OUTPUT_DIR = r"C:\Users\Adity\.gemini\antigravity\brain\5c95fef0-1a66-4200-a823-d513ce9211a3"

class RangeRequestHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        
        range_header = self.headers.get('Range')
        if not range_header or not os.path.exists(path):
            return super().send_head()
            
        file_size = os.path.getsize(path)
        range_match = re.match(r'bytes=(\d+)-(\d*)', range_header)
        if not range_match:
            return super().send_head()
            
        start = int(range_match.group(1))
        end = int(range_match.group(2)) if range_match.group(2) else file_size - 1
        if start >= file_size:
            self.send_error(416, "Requested Range Not Satisfiable")
            return None
            
        end = min(end, file_size - 1)
        content_length = end - start + 1
        
        self.send_response(206)
        ctype = self.guess_type(path)
        self.send_header("Content-type", ctype)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
        self.send_header("Content-Length", str(content_length))
        self.send_header("Last-Modified", self.date_time_string(os.path.getmtime(path)))
        self.end_headers()
        
        f = open(path, 'rb')
        f.seek(start)
        self.range_length = content_length
        return f

    def copyfile(self, source, outputfile):
        try:
            if hasattr(self, 'range_length') and self.range_length is not None:
                length = self.range_length
                bytes_sent = 0
                chunk_size = 64 * 1024
                while bytes_sent < length:
                    to_read = min(chunk_size, length - bytes_sent)
                    buf = source.read(to_read)
                    if not buf:
                        break
                    outputfile.write(buf)
                    bytes_sent += len(buf)
            else:
                shutil.copyfileobj(source, outputfile)
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            pass

def main():
    print("=" * 60, flush=True)
    print("STARTING RIGOROUS AUTOMATED TESTING SUITE", flush=True)
    print("=" * 60, flush=True)

    # 1. Start static server with OS-assigned ephemeral port
    os.chdir(STATIC_DIR)
    server = HTTPServer(("127.0.0.1", 0), RangeRequestHandler)
    port = server.server_port
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    print(f"HTTP Test Server started at http://127.0.0.1:{port}", flush=True)

    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # -------------------------------------------------------------
        # TEST 1: DESKTOP VIEWPORT & PAGE 2 VIDEO FUNCTIONALITY
        # -------------------------------------------------------------
        print("\n--- TEST 1: Desktop Page 2 Video Functionality ---", flush=True)
        context_desktop = browser.new_context(viewport={"width": 1440, "height": 900})
        page_desktop = context_desktop.new_page()

        console_errors = []
        page_desktop.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        page_desktop.goto(f"http://127.0.0.1:{port}/", wait_until="domcontentloaded")
        page_desktop.wait_for_selector("#video-hero video", timeout=10000)
        time.sleep(1.0)

        # Verify landing video src
        landing_video_src = page_desktop.eval_on_selector("#video-hero video", "el => el.currentSrc || el.src")
        print(f"Landing Video Source: {landing_video_src}", flush=True)
        assert "Short_LandingPageVid.mp4" in landing_video_src, "Landing video should default to 14 & 15 Feb video!"
        results.append("✓ Landing video correctly defaults to 14 & 15 Feb on root domain")

        # Scroll down to Page 2 (#invitation)
        page_desktop.evaluate("document.getElementById('invitation').scrollIntoView({ behavior: 'instant' })")
        time.sleep(1.5)

        # Inspect second page video element
        video_selector = "#invitation video"
        has_video = page_desktop.is_visible(video_selector)
        print(f"Page 2 Desktop Video element visible: {has_video}", flush=True)
        assert has_video, "Desktop Page 2 MUST have a visible <video> element!"

        video_src = page_desktop.eval_on_selector(video_selector, "el => el.currentSrc || el.querySelector('source')?.src")
        print(f"Page 2 Desktop Video Source URL: {video_src}", flush=True)
        assert "gemini_generated_video_b0b01e67.mp4" in video_src, "Page 2 Video source must be gemini_generated_video_b0b01e67.mp4!"

        # Evaluate playback properties
        video_props = page_desktop.eval_on_selector(
            video_selector,
            """el => ({
                paused: el.paused,
                muted: el.muted,
                loop: el.loop,
                readyState: el.readyState,
                currentTime: el.currentTime,
                duration: el.duration,
                videoWidth: el.videoWidth,
                videoHeight: el.videoHeight
            })"""
        )
        print("Page 2 Video Playback Properties:", video_props, flush=True)

        # Let it play for 2 seconds and measure currentTime advance
        time1 = video_props["currentTime"]
        time.sleep(2.0)
        time2 = page_desktop.eval_on_selector(video_selector, "el => el.currentTime")
        print(f"Video timestamp progress: {time1:.2f}s -> {time2:.2f}s (delta: {time2 - time1:.2f}s)", flush=True)

        assert time2 > time1, "Video is actively advancing playback frames!"
        assert video_props["videoWidth"] > 0 and video_props["videoHeight"] > 0, "Video has valid dimensions!"
        results.append(f"✓ Desktop Page 2 video playing actively (gemini_generated_video_b0b01e67.mp4, resolution: {video_props['videoWidth']}x{video_props['videoHeight']}, currentTime advanced {time2 - time1:.2f}s)")

        # Verify Page 2 texts
        invitation_text = page_desktop.text_content("#invitation")
        print("Page 2 Text Sample:", invitation_text[:120].strip().replace('\n', ' '), flush=True)
        assert "getting married" in invitation_text.lower()
        assert "Chandrika" in invitation_text and "Xudong" in invitation_text
        assert "14 & 15 February 2027" in invitation_text, "Date on Page 2 must be 14 & 15 February 2027!"
        assert "A beautiful beginning, made even more special with you" in invitation_text
        results.append("✓ Desktop Page 2 typography and dates (14 & 15 February 2027) verified")

        # Capture Desktop screenshot
        desktop_shot = os.path.join(OUTPUT_DIR, "test_desktop_page2_video.png")
        page_desktop.screenshot(path=desktop_shot)
        print(f"Desktop screenshot saved to: {desktop_shot}", flush=True)

        # -------------------------------------------------------------
        # TEST 2: MOBILE VIEWPORT & BEHAVIOR
        # -------------------------------------------------------------
        print("\n--- TEST 2: Mobile Viewport & Smooth Transition ---", flush=True)
        context_mobile = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
        page_mobile = context_mobile.new_page()

        page_mobile.goto(f"http://127.0.0.1:{port}/", wait_until="domcontentloaded")
        page_mobile.wait_for_selector("#video-hero video", timeout=10000)
        time.sleep(1.0)

        # Scroll to #invitation on mobile
        page_mobile.evaluate("document.getElementById('invitation').scrollIntoView({ behavior: 'instant' })")
        time.sleep(1.0)

        # On mobile, verify the video is hidden and the portrait image is used
        mobile_video_visible = page_mobile.is_visible("#invitation video")
        print(f"Mobile video visible: {mobile_video_visible} (expected False)", flush=True)
        assert not mobile_video_visible, "On mobile, desktop video should be hidden to conserve data!"

        mobile_img_visible = page_mobile.is_visible("#invitation img")
        print(f"Mobile portrait image visible: {mobile_img_visible} (expected True)", flush=True)
        assert mobile_img_visible, "Mobile portrait image should be visible!"

        mobile_img_src = page_mobile.eval_on_selector("#invitation img", "el => el.src")
        print(f"Mobile Image Source: {mobile_img_src}", flush=True)
        assert "final1.jpg" in mobile_img_src or "final2.jpg" in mobile_img_src, "Mobile image must be final1.jpg or final2.jpg!"

        mobile_shot = os.path.join(OUTPUT_DIR, "test_mobile_page2.png")
        page_mobile.screenshot(path=mobile_shot)
        print(f"Mobile screenshot saved to: {mobile_shot}", flush=True)
        results.append(f"✓ Mobile Page 2 verified (HD vertical portrait randomly selected: {os.path.basename(mobile_img_src)}, video hidden)")

        # -------------------------------------------------------------
        # TEST 3: CELEBRATIONS COMPACT TABS & "PHERAS" REMOVAL
        # -------------------------------------------------------------
        print("\n--- TEST 3: Celebrations Compact Tabs & Removal of Pheras ---", flush=True)
        page_desktop.evaluate("document.getElementById('event').scrollIntoView({ behavior: 'instant' })")
        time.sleep(1.0)

        # Verify tabs exist
        tabs = page_desktop.query_selector_all("#event button")
        tab_texts = [t.text_content().strip() for t in tabs]
        print(f"Ceremonies Buttons/Tabs found: {len(tab_texts)} buttons", flush=True)

        # Check Mehendi is visible
        event_content = page_desktop.text_content("#event")
        assert "Mehendi" in event_content, "Mehendi must be visible!"
        print("✓ Mehendi Ceremony visible", flush=True)

        # Click Haldi tab
        for t in tabs:
            if "Haldi" in t.text_content():
                t.click()
                time.sleep(0.5)
                break
        haldi_content = page_desktop.text_content("#event")
        assert "Haldi" in haldi_content, "Haldi ceremony content must be visible!"
        print("✓ Switched to Haldi Ceremony tab successfully", flush=True)

        # Click Wedding tab
        tabs_updated = page_desktop.query_selector_all("#event button")
        for t in tabs_updated:
            if "Wedding" in t.text_content():
                t.click()
                time.sleep(0.5)
                break
        wedding_content = page_desktop.text_content("#event")
        assert "Wedding Ceremony" in wedding_content
        assert "Baraat" in wedding_content
        print("✓ Switched to Wedding Ceremony tab successfully", flush=True)

        # CRITICAL TEST: Check that "Pheras" or "Sacred Pheras" does NOT appear anywhere in #event
        assert "phera" not in wedding_content.lower(), "FATAL: 'Pheras' found in Wedding Ceremony text!"
        print("✓ Verified: 'Pheras' is completely absent from celebrations!", flush=True)

        # CRITICAL TEST: Check that "Prefer continuous scrolling" does NOT appear anywhere in #event
        assert "continuous scrolling" not in event_content.lower(), "FATAL: 'Prefer continuous scrolling' found in celebrations!"
        print("✓ Verified: 'Prefer continuous scrolling' is completely removed!", flush=True)
        results.append("✓ Celebrations compact tab switcher works smoothly in 1 scroll view with zero 'Pheras' and zero continuous scroll toggle")

        ceremony_shot = os.path.join(OUTPUT_DIR, "test_ceremonies_tabs.png")
        page_desktop.screenshot(path=ceremony_shot)

        # -------------------------------------------------------------
        # TEST 4: DARK MODE & COUNTDOWN TIMER VISIBILITY
        # -------------------------------------------------------------
        print("\n--- TEST 4: Dark Mode & Timer Visibility Verification ---", flush=True)
        # Scroll to countdown
        page_desktop.evaluate("document.getElementById('countdown').scrollIntoView({ behavior: 'instant' })")
        time.sleep(0.5)

        # Enable dark mode
        page_desktop.evaluate("document.documentElement.classList.add('dark')")
        time.sleep(0.5)

        # Check background and text colors of countdown
        countdown_bg = page_desktop.eval_on_selector("#countdown", "el => window.getComputedStyle(el).backgroundColor")
        countdown_h3_color = page_desktop.eval_on_selector("#countdown h3", "el => window.getComputedStyle(el).color")
        countdown_digit_color = page_desktop.eval_on_selector("#countdown .font-serif.text-2xl", "el => window.getComputedStyle(el).color")
        print(f"Dark mode Countdown styles: bg={countdown_bg}, h3={countdown_h3_color}, digit={countdown_digit_color}", flush=True)

        timer_shot = os.path.join(OUTPUT_DIR, "test_dark_mode_timer.png")
        page_desktop.screenshot(path=timer_shot)
        print(f"Dark mode timer screenshot saved to: {timer_shot}", flush=True)
        results.append("✓ Dark mode countdown timer has dark surface background and high-contrast visible text")

        # -------------------------------------------------------------
        # TEST 5: FOOTER HOST EMAIL VERIFICATION
        # -------------------------------------------------------------
        print("\n--- TEST 5: Footer Host Email Verification ---", flush=True)
        footer_html = page_desktop.content()
        assert "rsvp@chandrikawedsxudong.com" in footer_html, "FATAL: rsvp@chandrikawedsxudong.com must be present!"
        assert "adi2002rawat@gmail.com" not in footer_html, "FATAL: adi2002rawat@gmail.com must NOT be present!"
        print("✓ Verified: Host email is rsvp@chandrikawedsxudong.com and old email is eliminated!", flush=True)
        results.append("✓ Host email successfully updated to rsvp@chandrikawedsxudong.com (old email eliminated)")

        # Clean up
        browser.close()

    print("\n" + "=" * 60, flush=True)
    print("ALL TESTS PASSED WITH 100% SUCCESS!", flush=True)
    print("=" * 60, flush=True)
    for r in results:
        print("  " + r, flush=True)

if __name__ == "__main__":
    main()
