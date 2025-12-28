# JobCraft Copilot (OllaBridge-first)

JobCraft is a **human-in-the-loop** job application copilot designed to stay inside the **safe zone**:

- ✅ No LinkedIn/Indeed scraping
- ✅ No automated submissions on restricted platforms
- ✅ No storing LinkedIn/Indeed cookies/tokens

## What’s new (OllaBridge-first)

JobCraft can use **your PC** as the default LLM provider via **OllaBridge**.

1) Start OllaBridge on your PC:
- `ollabridge start` (or `ollabridge start --share` if you’re tunneling)

2) Set in `.env`:
- `OLLABRIDGE_BASE_URL=http://localhost:11435`
- `OLLABRIDGE_API_KEY=...`

3) Run JobCraft:
- `make dev`

The UI includes a “Connect OllaBridge” modal that can **test** `/health` via the backend.

## Regions (Europe-first)

Defaults:
- Italy (IT), Germany (DE), United Kingdom (GB), Switzerland (CH)

Change in `.env`:
- `DEFAULT_COUNTRIES=IT,DE,GB,CH`
- `DEFAULT_LOCALE=en-GB`
- `DEFAULT_TIMEZONE=Europe/Rome`

## Quickstart

```bash
./create_jobcraft.sh
cd jobcraft
cp .env.example .env
# paste your OLLABRIDGE_API_KEY
make install
make dev
````

* UI: [http://localhost:5173](http://localhost:5173)
* API: [http://localhost:8000](http://localhost:8000)

## Compliant discovery connectors

* Greenhouse: `/api/discover/greenhouse/{board_token}`
* Lever: `/api/discover/lever/{company_slug}`

## Tracker + digest

* Track jobs: `POST /api/tracker/jobs`
* List tracked: `GET /api/tracker/jobs`
* Email digest: `POST /api/digest/email?to_email=you@example.com` (SMTP config required)

## Human-in-the-loop browser assist (ATS allowlist only)

* `POST /api/assist/open` with `url` (opens browser, no auto-submit)

## License

Choose a license that matches your distribution goals (MIT/Apache-2.0).
