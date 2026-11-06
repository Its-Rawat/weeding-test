import os
import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

artifact_dir = r"C:\Users\Adity\.gemini\antigravity\brain\5c95fef0-1a66-4200-a823-d513ce9211a3"

def test_card_stack():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        print("Navigating to http://localhost:3000 ...")
        page.goto("http://localhost:3000", wait_until="networkidle")
        time.sleep(1.0)

        # Scroll to #photo-music
        page.evaluate("document.getElementById('photo-music')?.scrollIntoView({behavior: 'instant'})")
        time.sleep(1.0)

        section = page.locator("#photo-music")
        assert section.count() > 0, "#photo-music section not found"

        # Verify new title and badge
        assert section.locator("text=Captured Moments").count() > 0, "'Captured Moments' badge not found"
        assert section.locator("text=Moments in Love").count() > 0, "'Moments in Love' title not found"
        print("PASS: Section header correctly shows 'Captured Moments' & 'Moments in Love'!")

        # Verify cards exist
        cards = section.locator("div.sticky")
        card_count = cards.count()
        print(f"Skiper 16 stacked cards found: {card_count}")
        assert card_count >= 5, f"Expected at least 5 cards, got {card_count}"

        # Verify Chapters are present
        assert section.locator("text=Chapter 01 • The Beginning").count() > 0, "Chapter 1 missing"
        assert section.locator("text=The Proposal").count() > 0, "The Proposal card missing"
        assert section.locator("text=Ring Reveal").count() > 0, "Ring Reveal card missing"

        # Take desktop screenshot of the card stack
        page.screenshot(path=os.path.join(artifact_dir, "skiper16_card_stack_desktop.png"))
        print("PASS: Desktop card stack screenshot captured!")

        # Test scrolling down through cards to trigger sticky stacking
        page.evaluate("window.scrollBy(0, 400)")
        time.sleep(0.5)
        page.screenshot(path=os.path.join(artifact_dir, "skiper16_card_stack_scrolled.png"))

        # Mobile Phone Test (iPhone 14)
        print("\n--- TESTING ON MOBILE VIEWPORT (iPhone 14) ---")
        mobile_browser = p.chromium.launch(headless=True)
        iphone = p.devices["iPhone 14"]
        m_ctx = mobile_browser.new_context(**iphone)
        m_page = m_ctx.new_page()
        m_page.goto("http://localhost:3000", wait_until="networkidle")
        time.sleep(1.0)

        m_page.evaluate("document.getElementById('photo-music')?.scrollIntoView({behavior: 'instant'})")
        time.sleep(1.0)

        m_section = m_page.locator("#photo-music")
        assert m_section.locator("text=Moments in Love").count() > 0

        m_page.screenshot(path=os.path.join(artifact_dir, "skiper16_card_stack_mobile.png"))
        print("PASS: Mobile card stack screenshot captured!")

        mobile_browser.close()
        browser.close()

        print("\n=======================================================")
        print("ALL SKIPER 16 PHOTO CARD STACK TESTS PASSED 100%!")
        print("=======================================================")

if __name__ == "__main__":
    test_card_stack()
