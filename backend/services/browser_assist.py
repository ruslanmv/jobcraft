from __future__ import annotations

"""Human-in-the-loop browser helper (ATS allowlist only).
- No auto-submit
- Only opens allowlisted job/app pages
"""

from playwright.async_api import async_playwright
from playwright_stealth import stealth_async
from backend.core.settings import settings
from backend.core.safety import is_domain_allowed

async def open_in_browser(url: str) -> str:
    if not is_domain_allowed(url, settings.ALLOWLIST_JOB_DOMAINS):
        raise ValueError('Domain not allowlisted for browser assist')

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})
        await stealth_async(page)
        await page.goto(url)
        return 'opened'
