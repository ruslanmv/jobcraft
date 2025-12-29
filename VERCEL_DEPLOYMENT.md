# 🚀 Deploying JobCraft Frontend to Vercel

This guide will help you deploy the JobCraft frontend to Vercel.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier is fine)
- JobCraft repository on GitHub

## 🎯 Deployment Methods

### Method 1: Using Vercel Dashboard (Recommended for First-Time)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "Add New..." → "Project"**

3. **Import your GitHub repository**
   - Select `ruslanmv/jobcraft`
   - Click "Import"

4. **Configure Project Settings**

   This is the **critical step** - Vercel needs to know your frontend is in a subdirectory:

   - **Framework Preset:** Vite
   - **Root Directory:** Leave as `.` (root)
   - **Build Command:** `cd frontend && npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `cd frontend && npm install`

   Or simply:

   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` ← Set this to point to the frontend folder
   - **Build Command:** `npm run build` (leave default)
   - **Output Directory:** `dist` (leave default)
   - **Install Command:** `npm install` (leave default)

   **The second option (setting Root Directory to `frontend`) is simpler!**

5. **Click "Deploy"**

   Vercel will:
   - Clone your repository
   - Install dependencies
   - Build your frontend
   - Deploy to a URL like `https://jobcraft.vercel.app`

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to the project root
cd /path/to/jobcraft

# Deploy (first time will ask questions)
vercel

# When prompted:
# - Set up and deploy? Yes
# - Which scope? (choose your account)
# - Link to existing project? No
# - Project name? jobcraft
# - In which directory is your code located? ./frontend
# - Want to override settings? Yes
#   - Build Command: npm run build
#   - Output Directory: dist
#   - Development Command: npm run dev

# For production deployment
vercel --prod
```

### Method 3: Using the vercel.json (Current Setup)

The repository includes a `vercel.json` at the root that tells Vercel how to build:

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install"
}
```

Just connect your GitHub repo to Vercel and it should work automatically!

## 🔧 Vercel Configuration

### Environment Variables (Optional)

If your frontend needs environment variables:

1. Go to **Project Settings** → **Environment Variables**
2. Add variables:
   ```
   VITE_API_URL=https://your-backend-api.com
   VITE_APP_NAME=JobCraft
   ```
3. Redeploy

### Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

## ✅ Verifying Deployment

After deployment, check:

1. **Build Logs** - Should show:
   ```
   ✓ building for production...
   ✓ built in XXXms
   ```

2. **Deployment URL** - Visit the URL and verify:
   - Dashboard loads correctly
   - Navigation works
   - Styling is correct (Tailwind CSS)
   - Icons appear (Lucide React)

3. **Browser Console** - Check for errors:
   - Open DevTools (F12)
   - Check Console tab
   - Should have no errors

## 🐛 Troubleshooting

### Error: "No Next.js version detected"

**Cause:** Vercel is auto-detecting the wrong framework.

**Solution:**
1. Go to **Project Settings** → **General**
2. Set **Root Directory** to `frontend`
3. Or use the `vercel.json` at the root (already included)
4. Redeploy

### Error: "Build failed"

**Cause:** Usually missing dependencies or build errors.

**Solution:**
1. Check Build Logs in Vercel dashboard
2. Test build locally first:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
3. If local build works, check Vercel Node.js version matches yours

### Error: "404 on page refresh"

**Cause:** SPA routing not configured.

**Solution:**
The `vercel.json` includes rewrites for SPA routing. Make sure it's at the root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Error: "Blank page after deployment"

**Cause:** Usually a path or asset loading issue.

**Solution:**
1. Check browser console for errors
2. Verify `vite.config.js` has correct base path:
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/' // Should be '/' for Vercel
   })
   ```

## 📊 Deployment Settings Summary

| Setting | Value |
|---------|-------|
| **Framework** | Vite |
| **Root Directory** | `frontend` OR `.` (with custom commands) |
| **Build Command** | `npm run build` OR `cd frontend && npm run build` |
| **Output Directory** | `dist` OR `frontend/dist` |
| **Install Command** | `npm install` OR `cd frontend && npm install` |
| **Node Version** | 18.x (auto-detected) |

## 🔄 Continuous Deployment

After initial setup:

1. **Push to GitHub** → Automatic deployment
2. **Preview Deployments** → Every PR gets a preview URL
3. **Production Deployments** → Merges to `main` deploy to production
4. **Rollback** → One-click rollback in Vercel dashboard

## 📱 Mobile Testing

Vercel provides mobile preview:

1. Open deployment URL on mobile
2. Or use Vercel mobile app
3. Test responsive design

## 🎯 Performance Optimization

Vercel automatically provides:

- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Compression (gzip/brotli)
- ✅ HTTP/2 & HTTP/3
- ✅ Edge caching
- ✅ Image optimization (if using Vercel Image)

## 📞 Support

- **Vercel Status:** https://www.vercel-status.com/
- **Vercel Docs:** https://vercel.com/docs
- **JobCraft Issues:** https://github.com/ruslanmv/jobcraft/issues

---

**Last Updated:** January 2025

**Tested With:**
- Vercel CLI: 33.0.0
- Node.js: 18.x, 20.x
- npm: 9.x, 10.x
