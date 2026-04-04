from playwright.sync_api import sync_playwright
import time

def capture_screenshots():
    with sync_playwright() as p:
        browser = p.chromium.launch(args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        
        # Go to landing page
        page.goto('http://localhost:8080')
        # Wait for any animations to finish
        time.sleep(3)
        page.screenshot(path='public/screenshots/real_landing.png')
        
        # Go to builder or dashboard? 
        # Click on "Get Started" to go to dashboard/auth
        # Or Just directly go to /dashboard or /builder? Let's check routes.
        # For now, let's just save landing.
        
        # Let's try to go to builder if possible
        try:
            page.goto('http://localhost:8080/builder')
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
            
        browser.close()

if __name__ == '__main__':
    capture_screenshots()
