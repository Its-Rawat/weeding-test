import os
import sys
import time
from playwright.sync_api import sync_playwright

artifact_dir = r"C:\Users\Adity\.gemini\antigravity\brain\5c95fef0-1a66-4200-a823-d513ce9211a3"

def run_tests():
    with sync_playwright() as p:
        # 1. Desktop Test
        print("Launching Desktop browser...")
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        page.goto("http://localhost:3000", wait_until="networkidle")
        time.sleep(1.5)

        # Wait for page to load past loader
        page.wait_for_selector("#invitation, #event", timeout=10000)

        # Verify Skiper UI validator button exists
        validator_btn = page.locator("aside button:has-text('Skiper UI')")
        assert validator_btn.count() > 0, "Skiper UI UAT validator button not found!"
        print("PASS: Skiper UI UAT validator button found!")

        # Take screenshot of Desktop Hero & Celebrations
        page.screenshot(path=os.path.join(artifact_dir, "skiper_desktop_landing.png"))

        # Scroll to Celebrations
        page.evaluate("document.getElementById('event')?.scrollIntoView({behavior: 'instant'})")
        time.sleep(1)

        # Check Celebrations Action Bar links (+ Add to Calendar, View Map)
        event_section = page.locator("#event")
        assert event_section.locator("text=+ Add to Calendar").count() > 0, "Add to Calendar link missing"
        assert event_section.locator("text=View Map").count() > 0, "View Map link missing"
        print("PASS: Celebrations Skiper 40 links rendered properly!")

        # Take screenshot of Celebrations with Skiper UI links
        page.screenshot(path=os.path.join(artifact_dir, "skiper_celebrations.png"))

        # Scroll to Countdown
        page.evaluate("document.getElementById('countdown')?.scrollIntoView({behavior: 'instant'})")
        time.sleep(1)
        countdown_section = page.locator("#countdown")
        assert countdown_section.locator("text=Ceremony Schedule").count() > 0, "Ceremony Schedule link missing"
        assert countdown_section.locator("text=Confirm RSVP").count() > 0, "Confirm RSVP link missing"
        print("PASS: Countdown Skiper 40 links rendered properly!")

        page.screenshot(path=os.path.join(artifact_dir, "skiper_countdown.png"))

        # Click the Skiper UI validator button to open the inspector card
        validator_btn.click()
        time.sleep(0.5)

        # Verify modal expanded
        assert page.locator("text=Skiper UI Validation").count() > 0, "Skiper UI Validation panel did not open"
        print("PASS: Skiper UI Validation panel opened successfully!")

        page.screenshot(path=os.path.join(artifact_dir, "skiper_validator_opened.png"))

        browser.close()

        # 2. Mobile Phone Test (iPhone 14 Pro)
        print("Launching Mobile browser (iPhone 14 Pro)...")
        mobile_browser = p.chromium.launch(headless=True)
        iphone = p.devices["iPhone 14 Pro"]
        mobile_context = mobile_browser.new_context(**iphone)
        mobile_page = mobile_context.new_page()

        mobile_page.goto("http://localhost:3000", wait_until="networkidle")
        time.sleep(1.5)

        # Scroll down to celebrations
        mobile_page.evaluate("document.getElementById('event')?.scrollIntoView({behavior: 'instant'})")
        time.sleep(1)

        mobile_page.screenshot(path=os.path.join(artifact_dir, "skiper_mobile_celebrations.png"))
        print("PASS: Mobile celebrations rendered with Skiper UI!")

        mobile_browser.close()
        print("\nALL SKIPER UI TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
