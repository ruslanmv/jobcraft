# Changelog

All notable changes to JobCraft will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Professional enterprise README with badges and comprehensive documentation
- MIT License file
- Contributing guidelines
- Changelog file

## [1.0.0] - 2025-01-XX

### Added
- **Dashboard View**: Mission control with activity statistics and compliance monitoring
- **Job Discovery**: Integration with Greenhouse, Lever, and Ashby ATS platforms
- **Workbench**: AI-powered application packet builder
  - Cover letter generation
  - Resume bullet point optimization
  - Screening question responses
  - Pre-submission checklist
- **Application Tracker**: Pipeline management with status tracking
- **Settings Panel**: AI provider configuration
- **OllaBridge Integration**: Local AI support for 100% privacy
- **Multi-Provider Support**: OpenAI, Anthropic Claude, Google Gemini, IBM watsonx
- **Country-Specific Filtering**: IT, DE, GB, CH (Europe-first approach)
- **Email Digest**: SMTP-based application summary emails
- **Vercel Deployment**: Frontend deployment configuration
- **Docker Support**: Containerized backend deployment

### Security
- No web scraping (compliance-first approach)
- No automated submissions (human-in-the-loop required)
- Local data storage (SQLite)
- Optional local AI processing (OllaBridge)
- No credential storage for job platforms

### Technical
- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Lucide Icons
- **Backend**: FastAPI, Python 3.11+, SQLite, Pydantic
- **AI Integration**: OllaBridge, OpenAI SDK, Anthropic SDK, Google GenAI
- **Build System**: uv for Python, npm for JavaScript
- **Development Tools**: ESLint, Prettier, Ruff, MyPy

## [0.9.0] - 2024-12-XX (Beta)

### Added
- Initial beta release
- Basic job discovery functionality
- Simple packet generation
- OllaBridge connection modal

### Changed
- Migrated from dark theme to light theme
- Improved UI/UX with modern design

## [0.5.0] - 2024-11-XX (Alpha)

### Added
- Project inception
- Core architecture design
- Prototype development

---

## Version History

- **1.0.0** - First stable release with full feature set
- **0.9.0** - Beta release with core functionality
- **0.5.0** - Alpha prototype

---

## Upgrade Guide

### From 0.9.x to 1.0.0

1. **Update Dependencies**
   ```bash
   make install
   ```

2. **Update Environment Variables**
   - Renamed: `OLLAMA_BASE_URL` → `OLLABRIDGE_BASE_URL`
   - Added: `DEFAULT_COUNTRIES`, `DEFAULT_LOCALE`, `DEFAULT_TIMEZONE`
   - See `.env.example` for full configuration

3. **Database Migration**
   ```bash
   # Backup your database
   cp backend/jobcraft.db backend/jobcraft.db.backup

   # Run migrations (if applicable)
   # No migrations needed for 1.0.0
   ```

4. **Frontend Updates**
   - Clear browser cache
   - New UI may require re-familiarization
   - OllaBridge setup now in Settings panel

---

## Breaking Changes

### 1.0.0
- Environment variable `OLLAMA_BASE_URL` renamed to `OLLABRIDGE_BASE_URL`
- OllaBridge connection modal moved to Settings panel
- API endpoint `/api/packet` changed to `/api/jobcraft/packet`

---

## Deprecation Notices

- **0.9.x**: Support will end 3 months after 1.0.0 release
- **0.5.x**: No longer supported

---

[Unreleased]: https://github.com/ruslanmv/jobcraft/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ruslanmv/jobcraft/releases/tag/v1.0.0
[0.9.0]: https://github.com/ruslanmv/jobcraft/releases/tag/v0.9.0
[0.5.0]: https://github.com/ruslanmv/jobcraft/releases/tag/v0.5.0
