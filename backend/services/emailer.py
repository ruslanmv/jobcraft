from __future__ import annotations

import aiosmtplib
from email.message import EmailMessage
from backend.core.settings import settings

async def send_email(to_email: str, subject: str, body: str):
    if not (settings.SMTP_HOST and settings.SMTP_USERNAME and settings.SMTP_PASSWORD and settings.SMTP_FROM):
        raise RuntimeError('SMTP settings are not configured')

    msg = EmailMessage()
    msg['From'] = settings.SMTP_FROM
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.set_content(body)

    await aiosmtplib.send(
        msg,
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        username=settings.SMTP_USERNAME,
        password=settings.SMTP_PASSWORD,
        start_tls=True,
    )
