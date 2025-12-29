# Security Policy

## 🔒 Our Commitment to Security

JobCraft takes security and user privacy seriously. As a compliance-first application, we are committed to:

- 🛡️ Protecting user data
- 🔐 Maintaining platform compliance
- 🚫 Preventing misuse of our tools
- ✅ Transparent security practices

## 🎯 Supported Versions

We provide security updates for the following versions:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 1.0.x   | ✅ Yes             | Active |
| 0.9.x   | ⚠️ Limited (3 mo) | Beta   |
| < 0.9   | ❌ No              | EOL    |

**Note:** We recommend always using the latest stable version.

## 🐛 Reporting a Vulnerability

### How to Report

If you discover a security vulnerability in JobCraft, please report it responsibly:

1. **DO NOT** open a public GitHub issue
2. **DO** email us at: **security@jobcraft.example.com** (replace with actual email)
3. **DO** include as much detail as possible

### What to Include

Your report should include:

- **Description**: Clear description of the vulnerability
- **Impact**: What could an attacker accomplish?
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Proof of Concept**: If applicable, include PoC code
- **Suggested Fix**: If you have ideas on how to fix it
- **Environment**: OS, Python version, Node version, etc.

### Response Timeline

- **Initial Response**: Within 48 hours
- **Severity Assessment**: Within 1 week
- **Fix Development**: Depends on severity
  - Critical: 1-7 days
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next release cycle

### Disclosure Policy

- We follow **responsible disclosure** practices
- We will credit researchers (unless you prefer anonymity)
- We will coordinate public disclosure after a fix is available
- Typical embargo period: 90 days

## 🎁 Bug Bounty Program

Currently, we do not offer a formal bug bounty program. However:

- ⭐ You will be credited in our Hall of Fame
- 📢 Public recognition in release notes
- 🎁 Swag for significant findings (coming soon)

## 🔐 Security Best Practices for Users

### For Local Installation

1. **Never share your API keys**
   - Keep `.env` file secure
   - Don't commit `.env` to version control
   - Rotate keys regularly

2. **Use OllaBridge for maximum privacy**
   - Run AI locally on your computer
   - No data leaves your machine
   - Full control over your information

3. **Keep dependencies updated**
   ```bash
   # Backend
   uv pip install --upgrade -e ".[dev]"

   # Frontend
   npm update
   ```

4. **Use strong SMTP credentials**
   - Use app-specific passwords
   - Enable 2FA on email accounts
   - Don't use your primary email password

### For Deployment

1. **Secure environment variables**
   - Use Vercel environment variables (not in code)
   - Use secrets management for production
   - Never log sensitive data

2. **Enable HTTPS**
   - Always use HTTPS in production
   - Vercel provides SSL by default

3. **Database security**
   - Use encrypted connections
   - Regular backups
   - Principle of least privilege

## 🚫 What We Don't Consider Security Issues

To avoid confusion, the following are **NOT** considered security vulnerabilities:

### Expected Behavior

- **Human-in-the-loop requirement**: This is by design, not a limitation
- **No automated submissions**: This is intentional for compliance
- **No scraping capabilities**: This is our core principle
- **Local data storage**: SQLite is used intentionally

### Out of Scope

- Social engineering attacks
- Attacks requiring physical access
- DDoS attacks
- Issues in third-party dependencies (report to those projects)

## 🛡️ Security Features

### Current Security Measures

✅ **No Credential Storage**
- We never store LinkedIn, Indeed, or job platform credentials
- OAuth tokens are not collected

✅ **Local Data Storage**
- SQLite database stored locally
- No cloud sync without explicit user action

✅ **API Key Security**
- Keys stored in environment variables
- Not included in version control
- Encrypted in production

✅ **Compliance by Design**
- No web scraping code
- No automation of restricted platforms
- All job discovery uses official APIs

✅ **Privacy-First AI**
- OllaBridge support for 100% local AI
- Optional cloud providers clearly marked
- User choice in data processing

### Planned Security Enhancements

🔄 **v1.1**
- [ ] End-to-end encryption for email digests
- [ ] API rate limiting
- [ ] Session management improvements

🔄 **v1.2**
- [ ] Two-factor authentication for self-hosted instances
- [ ] Audit logging
- [ ] Enhanced CSP headers

## 📚 Security Resources

### External Dependencies

We regularly monitor security advisories for:

- **Python packages**: via GitHub Dependabot
- **npm packages**: via npm audit
- **Docker base images**: official Python and Node images

### Security Scanning

- **GitHub Advanced Security**: Enabled
- **Dependabot**: Automated dependency updates
- **CodeQL**: Code scanning for vulnerabilities

### Third-Party Integrations

We only integrate with:
- ✅ Official ATS APIs (Greenhouse, Lever, Ashby)
- ✅ Reputable AI providers (OpenAI, Anthropic, Google)
- ✅ Standard email protocols (SMTP)

We **NEVER** integrate with:
- ❌ Unofficial scraping services
- ❌ Credential-stealing tools
- ❌ Automation bots

## 🤝 Security Acknowledgments

We thank the following security researchers for responsible disclosure:

<!-- Hall of Fame will be listed here -->

*No vulnerabilities reported yet. Be the first!*

## 📞 Contact

- **Security Issues**: security@jobcraft.example.com
- **General Questions**: [GitHub Issues](https://github.com/ruslanmv/jobcraft/issues)
- **Privacy Concerns**: privacy@jobcraft.example.com

---

**Last Updated**: January 2025

**Policy Version**: 1.0.0

---

*JobCraft is committed to maintaining the highest security and privacy standards for our users.*
