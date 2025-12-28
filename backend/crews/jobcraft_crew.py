from __future__ import annotations

"""CrewAI tasks (kept minimal, router-driven).
We do NOT submit applications. We only prepare materials + checklists.
"""

from dataclasses import dataclass
from backend.core.router import router

SYSTEM_BASE = """You are JobCraft Copilot.
Rules:
- You do NOT submit applications.
- You only prepare materials, checklists, and safe guidance.
- You avoid scraping restricted platforms (LinkedIn/Indeed).
- You localize tone and spelling for Europe/UK when appropriate.
"""

@dataclass
class PacketResult:
    markdown: str

async def build_application_packet(
    provider: str,
    profile_text: str,
    job_title: str,
    company: str,
    job_desc: str,
    country: str | None = None,
) -> PacketResult:
    locale_hint = "Use UK English spelling." if (country or '').upper() in ('GB', 'UK') else "Use clear international English suitable for Europe."

    user = f"""Create a tailored application packet.

{locale_hint}

Candidate profile (raw CV text):
---
{profile_text}
---

Target role:
- Title: {job_title}
- Company: {company}
- Region/Country preference: {country or 'Europe (IT/DE/GB/CH)'}

Job description:
---
{job_desc}
---

Deliverables (Markdown, with headings):
1) Resume bullet rewrites (6–10, impact-focused, quantifiable).
2) Cover letter (<= 1 page).
3) Suggested answers to screening questions (3–6).
4) Submission checklist (fields to double-check; remind user must review and click submit).

Avoid exaggerations or unverifiable claims.
"""
    text = await router.chat(provider, system=SYSTEM_BASE, user=user)
    return PacketResult(markdown=text)
