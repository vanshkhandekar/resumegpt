from playwright.sync_api import sync_playwright
import time
import os

def capture_screenshots():
    os.makedirs('public/screenshots', exist_ok=True)
    with sync_playwright() as p:
        # Use system chromium to save time
        executable = '/usr/bin/chromium' if os.path.exists('/usr/bin/chromium') else '/usr/bin/google-chrome'
        browser = p.chromium.launch(executable_path=executable, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        
        # Go to landing page
        page.goto('http://localhost:8080')
        time.sleep(3)
        page.screenshot(path='public/screenshots/real_landing.png')
        
        try:
            page.goto('http://localhost:8080/create')
            time.sleep(3)
            page.screenshot(path='public/screenshots/real_builder.png')
        except Exception as e:
            print("Could not get builder screenshot:", e)
            
        try:
            page.goto('http://localhost:8080/dashboard')
            time.sleep(3)
            page.screenshot(path='public/screenshots/real_dashboard.png')
        except Exception as e:
            print("Could not get dashboard screenshot:", e)

        try:
            page.goto('http://localhost:8080/templates')
            time.sleep(3)
            page.screenshot(path='public/screenshots/real_templates.png')
        except Exception as e:
            print("Could not get templates screenshot:", e)

        try:
            page.goto('http://localhost:8080/admin')
            time.sleep(3)
            page.screenshot(path='public/screenshots/real_admin.png')
        except Exception as e:
            print("Could not get admin screenshot:", e)
            
        browser.close()

if __name__ == '__main__':
    capture_screenshots()
