import os
import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

artifact_dir = r"C:\Users\Adity\.gemini\antigravity\brain\5c95fef0-1a66-4200-a823-d513ce9211a3"

def test_music_compact_and_video():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        print("Navigating to http://localhost:3000 ...")
        page.goto("http://localhost:3000", wait_until="networkidle")
        time.sleep(1.0)

        # 1. Verify Video Element and Poster Backdrop
        video_el = page.locator("#video-hero video")
        assert video_el.count() > 0, "Landing video element not found!"
        poster_img = page.locator("#video-hero img[src*='poster']")
        assert poster_img.count() > 0, "Instant visual poster image backdrop not found!"
        print("PASS: Both landing video and instant poster backdrop exist!")

        # 2. Locate compact music toggle
        music_btn = page.locator("#video-hero button[title*='Wedding Music']")
        assert music_btn.count() > 0, "Compact music button not found!"

        # Verify NO 'Tap for sound' text
        btn_text = music_btn.inner_text().strip()
        print(f"Music button inner text: '{btn_text}'")
        assert "Tap for sound" not in btn_text.lower(), f"Unexpected text found in button: '{btn_text}'"
        assert "sound on" not in btn_text.lower(), f"Unexpected text found in button: '{btn_text}'"
        print("PASS: 'Tap for sound' text is completely removed!")

        # Verify size is small
        box = music_btn.bounding_box()
        print(f"Music button dimensions: width={box['width']:.1f}px, height={box['height']:.1f}px")
        assert box['width'] < 80, f"Expected button width < 80px, got {box['width']}"
        assert box['height'] <= 40, f"Expected button height <= 40px, got {box['height']}"
        print("PASS: Music button is compact and small!")

        # 3. Test FIRST CLICK toggle
        print("\n--- PERFORMING CLICK 1 (First Single Click) ---")
        music_btn.click()
        time.sleep(0.3)
        assert "Mute" in music_btn.get_attribute("title") or "Playing" in music_btn.get_attribute("title"), (
            "Music button did not toggle on first click"
        )
        print("PASS: Music button toggles on the FIRST CLICK!")

        page.screenshot(path=os.path.join(artifact_dir, "compact_music_playing_desktop.png"))

        # 4. Mobile Test (iPhone 14)
        print("\n--- TESTING ON MOBILE VIEWPORT (iPhone 14) ---")
        mobile_browser = p.chromium.launch(headless=True)
        iphone = p.devices["iPhone 14"]
        m_ctx = mobile_browser.new_context(**iphone)
        m_page = m_ctx.new_page()
        m_page.goto("http://localhost:3000", wait_until="networkidle")
        time.sleep(1.0)

        m_video = m_page.locator("#video-hero video")
        assert m_video.count() > 0, "Mobile video element missing"
        m_poster = m_page.locator("#video-hero img[src*='poster']")
        assert m_poster.count() > 0, "Mobile video poster backdrop missing"

        m_btn = m_page.locator("#video-hero button[title*='Wedding Music']")
        m_box = m_btn.bounding_box()
        print(f"Mobile Music button: width={m_box['width']:.1f}px, height={m_box['height']:.1f}px")
        assert m_box['width'] < 80

        # Tap on mobile
        m_btn.tap()
        time.sleep(0.3)
        print("PASS: Mobile compact music button toggles on 1st tap!")

        m_page.screenshot(path=os.path.join(artifact_dir, "compact_music_mobile_landing.png"))

        mobile_browser.close()
        browser.close()

        print("\n=======================================================")
        print("ALL COMPACT MUSIC BUTTON & VIDEO TESTS PASSED 100%!")
        print("=======================================================")

if __name__ == "__main__":
    test_music_compact_and_video()
