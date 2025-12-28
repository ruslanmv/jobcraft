"""Safety and compliance utilities.

This project intentionally avoids:
- scraping LinkedIn/Indeed
- automated submissions on restricted platforms
- storing LinkedIn/Indeed cookies/tokens

We support job discovery via compliant sources:
- Company job boards / ATS job board endpoints (Greenhouse/Lever/Ashby)
- User-provided job URLs on allowlisted domains

Human-in-the-loop policy:
- The user reviews materials and clicks Submit.
"""

from __future__ import annotations
from urllib.parse import urlparse

def is_domain_allowed(url: str, allowlist_csv: str) -> bool:
    try:
        host = urlparse(url).netloc.lower()
        if host.startswith('www.'):
            host = host[4:]
        allow = [d.strip().lower() for d in allowlist_csv.split(',') if d.strip()]
        return any(host == d or host.endswith('.' + d) for d in allow)
    except Exception:
        return False

def parse_countries(csv: str) -> list[str]:
    return [c.strip().upper() for c in csv.split(',') if c.strip()]
