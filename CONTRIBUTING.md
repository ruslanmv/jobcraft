# Contributing to JobCraft

First off, thank you for considering contributing to JobCraft! It's people like you that make JobCraft such a great tool for job seekers worldwide.

## 🌟 Code of Conduct

By participating in this project, you are expected to uphold our values of:
- **Compliance First**: All features must respect platform Terms of Service
- **Privacy First**: User data should remain under user control
- **Accessibility**: Features should be usable by everyone
- **Transparency**: Clear documentation and honest communication

## 🎯 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Use this template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 11, macOS 14, Ubuntu 22.04]
 - Python Version: [e.g. 3.11.5]
 - Node Version: [e.g. 18.17.0]
 - Browser: [e.g. Chrome 120, Firefox 121]

**Additional context**
Add any other context about the problem here.
```

### 💡 Suggesting Features

Feature requests are welcome! Before suggesting a feature:

1. **Check if it aligns with our principles:**
   - Does it maintain compliance?
   - Does it respect privacy?
   - Does it require human-in-the-loop?

2. **Use this template:**

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions.

**Mockups (optional)**
If applicable, add mockups or wireframes.

**Additional context**
Add any other context or screenshots about the feature request.
```

### 🔧 Pull Requests

#### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/jobcraft.git
   cd jobcraft
   ```

2. **Set up your development environment**
   ```bash
   # Backend
   cd backend
   uv venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   uv pip install -e ".[dev]"

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

#### Development Workflow

**Backend (Python/FastAPI)**

```bash
# Run tests
pytest

# Run linter
ruff check .

# Format code
ruff format .

# Type checking
mypy backend/
```

**Frontend (React/Vite)**

```bash
# Run dev server
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

#### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "Add OllaBridge connection retry logic"
git commit -m "Fix: Greenhouse API pagination issue"
git commit -m "Docs: Update installation instructions for Windows"

# Bad
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "wip"
```

**Format:**
- **feat:** A new feature
- **fix:** A bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, etc.)
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks

#### Pull Request Process

1. **Update documentation** if you've changed APIs or added features
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update CHANGELOG.md** with your changes
5. **Create the PR** with a clear title and description

**PR Template:**

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have tested this locally
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] All tests pass locally

## Compliance Check
- [ ] This change maintains platform compliance (no scraping, no automation)
- [ ] This change respects user privacy
- [ ] This change requires human-in-the-loop

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Related Issues
Closes #(issue number)
```

## 📋 Style Guides

### Python Style Guide

- Follow [PEP 8](https://peps.python.org/pep-0008/)
- Use type hints for all function signatures
- Maximum line length: 120 characters
- Use `ruff` for linting and formatting

```python
# Good
def generate_cover_letter(
    job_title: str,
    company: str,
    cv_text: str,
    provider: str = "ollabridge"
) -> str:
    """Generate a tailored cover letter.

    Args:
        job_title: The position title
        company: Company name
        cv_text: Resume/CV content
        provider: AI provider to use

    Returns:
        Generated cover letter text
    """
    # Implementation
    pass
```

### JavaScript/React Style Guide

- Use functional components with hooks
- Use TypeScript when possible
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use 2 spaces for indentation
- Use descriptive variable names

```javascript
// Good
const JobCard = ({ job, onTrack }) => {
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = async () => {
    setIsTracking(true);
    await onTrack(job);
    setIsTracking(false);
  };

  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <button onClick={handleTrack} disabled={isTracking}>
        {isTracking ? 'Tracking...' : 'Track Job'}
      </button>
    </div>
  );
};
```

### Documentation Style Guide

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Update README.md for user-facing changes
- Add inline comments for complex logic

## 🧪 Testing Guidelines

### Backend Tests

```python
# tests/test_discovery.py
import pytest
from backend.discovery import GreenhouseConnector

def test_greenhouse_fetch_jobs():
    """Test fetching jobs from Greenhouse API."""
    connector = GreenhouseConnector()
    jobs = connector.fetch_jobs("stripe", countries=["IT", "DE"])

    assert len(jobs) > 0
    assert jobs[0].title
    assert jobs[0].company == "Stripe"
```

### Frontend Tests

```javascript
// src/__tests__/JobCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import JobCard from '../components/JobCard';

test('renders job title and track button', () => {
  const mockJob = {
    title: 'Senior Engineer',
    company: 'TechCorp'
  };

  render(<JobCard job={mockJob} />);

  expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
  expect(screen.getByText('Track Job')).toBeInTheDocument();
});
```

## 🚀 Release Process

1. **Version Bump**: Update version in `pyproject.toml` and `package.json`
2. **CHANGELOG**: Update CHANGELOG.md with new features, fixes, and breaking changes
3. **Tag**: Create a git tag: `git tag -a v1.1.0 -m "Release v1.1.0"`
4. **Push**: `git push origin main --tags`
5. **GitHub Release**: Create a release on GitHub with release notes

## 🆘 Getting Help

- **Discord:** [Join our Discord](https://discord.gg/jobcraft) (coming soon)
- **GitHub Discussions:** [Ask questions](https://github.com/ruslanmv/jobcraft/discussions)
- **Stack Overflow:** Tag your question with `jobcraft`

## 🏆 Recognition

Contributors will be recognized in:
- README.md Contributors section
- Release notes
- Our Hall of Fame (coming soon)

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making JobCraft better! 🙏**
