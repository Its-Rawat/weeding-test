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

class RangeHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)
    def log_message(self, *args): pass

server = HTTPServer(('127.0.0.1', 0), RangeHandler)
port = server.server_port
threading.Thread(target=server.serve_forever, daemon=True).start()
print(f"Test server running on port {port}", flush=True)

test_devices = [
    {"name": "iPhone SE (Small Phone)", "width": 375, "height": 667},
    {"name": "iPhone 14 (Standard iPhone)", "width": 390, "height": 844},
    {"name": "iPhone 14 Pro (Dynamic Island)", "width": 393, "height": 852},
    {"name": "iPhone 14 Pro Max (Large Phone)", "width": 430, "height": 932},
    {"name": "Samsung Galaxy S20 (Android)", "width": 360, "height": 800},
    {"name": "Google Pixel 7 (Android Tall)", "width": 412, "height": 915},
    {"name": "Foldable Cover (Narrow)", "width": 344, "height": 760},
]

summary_results = []

with sync_playwright() as p:
    browser = p.chromium.launch()

    for dev in test_devices:
        name = dev["name"]
        w = dev["width"]
        h = dev["height"]
        print(f"\n=======================================================", flush=True)
        print(f"TESTING DEVICE: {name} ({w} x {h})", flush=True)
        print(f"=======================================================", flush=True)

        context = browser.new_context(
            viewport={"width": w, "height": h},
            is_mobile=True,
            has_touch=True,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()
        page.goto(f"http://127.0.0.1:{port}/")
        page.wait_for_selector("#video-hero")
        page.wait_for_timeout(400)

        # 1. Verify Page 1 initial state
        hero_initial_top = page.eval_on_selector("#video-hero", "el => el.getBoundingClientRect().top")
        inv_initial_top = page.eval_on_selector("#invitation", "el => el.getBoundingClientRect().top")
        print(f"1. Initial: Page 1 top={hero_initial_top}, Page 2 top={inv_initial_top}", flush=True)
        assert hero_initial_top == 0, f"Page 1 should start at top 0!"

        # 2. Test Chevron Click Transition
        page.click("#video-hero button[title='Scroll to explore website']")
        page.wait_for_timeout(900)

        inv_top_after_chevron = page.eval_on_selector("#invitation", "el => el.getBoundingClientRect().top")
        hero_bottom_after_chevron = page.eval_on_selector("#video-hero", "el => el.getBoundingClientRect().bottom")
        print(f"2. After Chevron Click: Page 2 top={inv_top_after_chevron:.2f}px, Page 1 bottom={hero_bottom_after_chevron:.2f}px", flush=True)
        
        # Check alignment: Page 2 top is <= 1px, Page 1 bottom is <= 0px
        assert abs(inv_top_after_chevron) <= 2.0, f"Page 2 top should be aligned at 0, got {inv_top_after_chevron}"
        assert hero_bottom_after_chevron <= 1.0, f"Page 1 bottom should be off-screen, got {hero_bottom_after_chevron}"

        screenshot_file = os.path.join(OUTPUT_DIR, f"test_perfect_align_{re.sub(r'[^a-zA-Z0-9]', '_', name)}.png")
        page.screenshot(path=screenshot_file)
        print(f"   Screenshot saved: {os.path.basename(screenshot_file)}", flush=True)

        # 3. Test Scroll Back Up to Page 1
        page.evaluate("() => window.scrollTo({ top: 0, behavior: 'smooth' })")
        page.wait_for_timeout(900)
        hero_top_back = page.eval_on_selector("#video-hero", "el => el.getBoundingClientRect().top")
        print(f"3. After Return to Top: Page 1 top={hero_top_back:.2f}px", flush=True)
        assert abs(hero_top_back) <= 2.0, f"Page 1 should be at top 0, got {hero_top_back}"

        # 4. Test Touch Swipe (simulate thumb swipe up 120px)
        page.evaluate("""() => {
            const target = document.getElementById('video-hero');
            target.dispatchEvent(new TouchEvent('touchstart', {
                touches: [new Touch({ identifier: 1, target: target, clientX: 200, clientY: 500 })]
            }));
            target.dispatchEvent(new TouchEvent('touchend', {
                changedTouches: [new Touch({ identifier: 1, target: target, clientX: 200, clientY: 380 })]
            }));
        }""")
        page.wait_for_timeout(1000)

        inv_top_after_swipe = page.eval_on_selector("#invitation", "el => el.getBoundingClientRect().top")
        hero_bottom_after_swipe = page.eval_on_selector("#video-hero", "el => el.getBoundingClientRect().bottom")
        print(f"4. After Touch Swipe: Page 2 top={inv_top_after_swipe:.2f}px, Page 1 bottom={hero_bottom_after_swipe:.2f}px", flush=True)
        assert abs(inv_top_after_swipe) <= 2.0, f"Page 2 should be aligned at 0 after swipe, got {inv_top_after_swipe}"
        assert hero_bottom_after_swipe <= 1.0, f"Page 1 should be completely hidden after swipe, got {hero_bottom_after_swipe}"

        # 5. Test Partial Settle Guard (user stops halfway at 200px)
        page.evaluate("() => window.scrollTo({ top: 0 })")
        page.wait_for_timeout(400)
        page.evaluate("() => window.scrollTo({ top: 220 })")
        # Trigger settle timer
        page.wait_for_timeout(700)

        inv_top_after_settle = page.eval_on_selector("#invitation", "el => el.getBoundingClientRect().top")
        hero_bottom_after_settle = page.eval_on_selector("#video-hero", "el => el.getBoundingClientRect().bottom")
        print(f"5. After Partial Drag (220px) Settle Guard: Page 2 top={inv_top_after_settle:.2f}px, Page 1 bottom={hero_bottom_after_settle:.2f}px", flush=True)
        assert abs(inv_top_after_settle) <= 2.0, f"Settle guard should pull Page 2 to top, got {inv_top_after_settle}"

        # 6. Test Free Scrolling into Lower Sections (Celebrations, Melodies, RSVP)
        page.evaluate("() => { const el = document.getElementById('event'); if (el) el.scrollIntoView(); }")
        page.wait_for_timeout(600)
        event_visible = page.eval_on_selector("#event", "el => el.getBoundingClientRect().top < window.innerHeight")
        print(f"6. Free Scrolling past Page 2 into Celebrations: visible={event_visible}", flush=True)
        assert event_visible, "Celebrations section should be reachable and visible!"

        summary_results.append(f"✓ {name} ({w}x{h}): 100% Perfect Transition & Zero First-Page Leakage")
        context.close()

    browser.close()

server.shutdown()

print("\n" + "=" * 60, flush=True)
print("COMPREHENSIVE MULTI-DEVICE TEST SUITE RESULTS:", flush=True)
print("=" * 60, flush=True)
for r in summary_results:
    print(r, flush=True)
print("ALL TESTS PASSED WITH 100% SUCCESS!", flush=True)
