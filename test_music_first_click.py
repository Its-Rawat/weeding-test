import os
import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

artifact_dir = r"C:\Users\Adity\.gemini\antigravity\brain\5c95fef0-1a66-4200-a823-d513ce9211a3"

def test_music_button():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        print("Navigating to http://localhost:3000 ...")
        page.goto("http://localhost:3000", wait_until="networkidle")
        time.sleep(1.0)

        # Locate music toggle on the video landing page
        music_btn = page.locator("#video-hero button[title*='Wedding Music'], #video-hero button:has-text('Sound')")
        assert music_btn.count() > 0, "Music button on video landing page not found!"

        initial_text = music_btn.inner_text().strip()
        print(f"Initial music button text: '{initial_text}'")
        assert "Tap for Sound" in initial_text, f"Expected initial text to be 'Tap for Sound', got '{initial_text}'"

        # Take screenshot of Initial Paused State
        page.screenshot(path=os.path.join(artifact_dir, "music_button_initial_state.png"))

        # CLICK 1: SINGLE CLICK
        print("\n--- PERFORMING CLICK 1 (First Single Click) ---")
        music_btn.click()
        time.sleep(0.3)

        after_click1_text = music_btn.inner_text().strip()
        print(f"After CLICK 1 text: '{after_click1_text}'")
        assert "Sound On" in after_click1_text, (
            f"FAILED: Music button did NOT toggle on first click! Expected 'Sound On', got '{after_click1_text}'"
        )
        print("PASS: Music button IMMEDIATELY toggled to 'Sound On' on the FIRST click!")

        # Verify equalizer waveform bars are rendered
        waveform_bars = music_btn.locator("div.flex div.rounded-full")
        bar_count = waveform_bars.count()
        print(f"Skiper 25 waveform equalizer bars found: {bar_count}")
        assert bar_count == 5, f"Expected 5 waveform bars, found {bar_count}"

        # Take screenshot of Active Playing State with Equalizer
        page.screenshot(path=os.path.join(artifact_dir, "music_button_playing_state.png"))

        # CLICK 2: TOGGLE OFF
        print("\n--- PERFORMING CLICK 2 (Pause) ---")
        music_btn.click()
        time.sleep(0.3)
        after_click2_text = music_btn.inner_text().strip()
        print(f"After CLICK 2 text: '{after_click2_text}'")
        assert "Tap for Sound" in after_click2_text, (
            f"FAILED: Expected pause to return 'Tap for Sound', got '{after_click2_text}'"
        )
        print("PASS: Music button paused cleanly on click 2!")

        # CLICK 3: TOGGLE ON AGAIN
        print("\n--- PERFORMING CLICK 3 (Resume) ---")
        music_btn.click()
        time.sleep(0.3)
        after_click3_text = music_btn.inner_text().strip()
        print(f"After CLICK 3 text: '{after_click3_text}'")
        assert "Sound On" in after_click3_text, (
            f"FAILED: Expected resume to return 'Sound On', got '{after_click3_text}'"
        )
        print("PASS: Music button resumed cleanly on click 3!")

        # Mobile viewport test
        print("\n--- TESTING ON MOBILE VIEWPORT (iPhone 14) ---")
        mobile_browser = p.chromium.launch(headless=True)
        iphone = p.devices["iPhone 14"]
        m_ctx = mobile_browser.new_context(**iphone)
        m_page = m_ctx.new_page()
        m_page.goto("http://localhost:3000", wait_until="networkidle")
        time.sleep(1.0)

        m_btn = m_page.locator("#video-hero button[title*='Wedding Music'], #video-hero button:has-text('Sound')")
        assert m_btn.count() > 0, "Mobile music button not found"

        m_initial = m_btn.inner_text().strip()
        print(f"Mobile Initial: '{m_initial}'")
        assert "Tap for Sound" in m_initial

        # Tap on mobile
        m_btn.tap()
        time.sleep(0.3)
        m_after = m_btn.inner_text().strip()
        print(f"Mobile after 1st tap: '{m_after}'")
        assert "Sound On" in m_after, f"Mobile failed to toggle on 1st tap: got '{m_after}'"
        print("PASS: Mobile music button toggles on the VERY FIRST TAP!")

        m_page.screenshot(path=os.path.join(artifact_dir, "music_button_mobile_playing.png"))

        mobile_browser.close()
        browser.close()

        print("\n=======================================================")
        print("ALL MUSIC BUTTON FIRST-CLICK TESTS PASSED 100%!")
        print("=======================================================")

if __name__ == "__main__":
    test_music_button()
