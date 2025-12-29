# JobCraft Frontend

A modern, compliance-first job application assistant built with React and Tailwind CSS.

## Features

- **Dashboard**: Overview of job search activities and compliance status
- **Job Discovery**: Connect to compliant ATS boards (Greenhouse, Lever, Ashby)
- **Workbench**: AI-powered application packet builder
- **Tracker**: Manage your application pipeline
- **Settings**: Configure AI providers (OllaBridge, OpenAI, Claude, Gemini, watsonx)

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Lucide React (icons)

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy to Vercel

### Option 1: Deploy from GitHub

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel will auto-detect Vite and use the correct settings
6. Click "Deploy"

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

The `vercel.json` configuration is already set up for proper SPA routing.

## Environment Variables

If you need to configure API endpoints or other environment variables:

1. Create a `.env` file (already in .gitignore)
2. Add your variables:
   ```
   VITE_API_URL=https://your-api.com
   ```
3. Access them in code with `import.meta.env.VITE_API_URL`

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── vercel.json          # Vercel deployment config
```

## Features Included

### Dashboard View
- Activity statistics
- Compliance monitoring
- Safe-zone status

### Discovery View
- ATS board integration
- Job search and filtering
- Country-specific results (IT, DE, GB, CH)

### Workbench View
- AI-powered cover letter generation
- Resume bullet point tailoring
- Screening question preparation
- Pre-submission checklist

### Applications View
- Pipeline management
- Status tracking
- Email digest functionality

### Settings View
- AI provider selection
- OllaBridge connection setup
- Regional preferences

## Compliance

JobCraft is designed with compliance in mind:
- No web scraping
- No automated submissions
- Human-in-the-loop required
- Uses official ATS APIs only

## License

See the main repository for license information.
