# AI Resume Studio - Deployment Guide

This guide provides step-by-step instructions for deploying the AI Resume Studio application to Hostinger in the subdirectory `cyberfranky.in/resumegpt`.

---

## Table of Contents

1. [GitHub Setup](#1-github-setup)
2. [Vite Configuration](#2-vite-configuration)
3. [Hostinger Deployment](#3-hostinger-deployment)
4. [Build and Deploy Process](#4-build-and-deploy-process)
5. [Post-Deployment](#5-post-deployment)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. GitHub Setup

### 1.1 Create a GitHub Repository

1. **Navigate to GitHub**: Go to [https://github.com](https://github.com) and log in to your account.

2. **Create New Repository**:
   - Click the **+** icon in the top-right corner → Select **New repository**
   - **Repository name**: `ai-resume-studio` (or your preferred name)
   - **Description**: Optional - e.g., "AI-powered resume builder with ATS scoring"
   - **Visibility**: Choose **Public** or **Private**
   - **Initialize with**: Skip adding README, .gitignore, or license for now
   - Click **Create repository**

### 1.2 Initialize Git in Your Local Project

If you haven't already initialized git in your project:

```bash
# Navigate to your project directory
cd /path/to/ai-resume-studio-main

# Initialize git repository
git init

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/resumegpt.git

# Verify the remote
git remote -v
```

### 1.4 Push Code to GitHub

```bash
# Push code to main branch
git branch -M main
git push -u origin main
```

### 1.5 Branch Management

**Recommended Branch Strategy**:

| Branch | Purpose | When to Use |
|--------|---------|-------------|
| `main` | Production code | Ready for deployment |
| `develop` | Development | Testing new features |
| `feature/*` | New features | Developing specific features |

**Common Commands**:

```bash
# Create and switch to a new branch
git checkout -b feature/new-feature

# Switch to main branch
git checkout main

# Merge feature branch into main
git checkout main
git merge feature/new-feature

# Delete a branch (local)
git branch -d feature/new-feature

# Delete a branch (remote)
git push origin --delete feature/new-feature

# Push a branch to remote
git push -u origin feature/new-feature
```

---

## 2. Vite Configuration

### 2.1 Understanding the Base Configuration

The project is configured to deploy in a subdirectory (`/resumegpt/`) as defined in [`vite.config.ts`](vite.config.ts:8):

```typescript
export default defineConfig(({ mode }) => ({
  base: "/resumegpt/",
  // ... rest of config
}));
```

**What this does**:
- All asset paths will be prefixed with `/resumegpt/`
- JavaScript and CSS files will load from `/resumegpt/assets/`
- The application will be accessible at `yourdomain.com/resumegpt/`

### 2.2 Build Output

When you run `npm run build`, Vite creates optimized production files in the `dist` directory:

```
dist/
├── index.html
├── assets/
│   ├── index-*.js        # Bundled JavaScript
│   ├── index-*.css       # Bundled CSS
│   └── ...
├── .htaccess             # Apache configuration (copied from public/)
└── robots.txt
```

### 2.3 The .htaccess File

The [`public/.htaccess`](public/.htaccess:1) file handles Apache routing for the Single Page Application (SPA):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /resumegpt/
  
  # If the request is not for an existing file, rewrite to index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.+)$ /resumegpt/index.html [L,QSA]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

**Key Points**:
- **RewriteBase**: Sets the base path for URL rewrites to `/resumegpt/`
- **SPA Routing**: All non-file requests are redirected to `index.html` so React Router can handle them
- **Compression**: Gzip compression is enabled for faster loading
- **Caching**: Static assets are cached for improved performance

### 2.4 Canonical URL Configuration

The [`index.html`](index.html:12) file includes the canonical URL:

```html
<link rel="canonical" href="https://cyberfranky.in/resumegpt/" />
```

This helps search engines understand the preferred URL for the page.

---

## 3. Hostinger Deployment

### 3.1 Prerequisites

- A [Hostinger](https://www.hostinger.com/) account with a hosting plan
- A domain name (`cyberfranky.in`) already connected to Hostinger
- GitHub repository with your project code

### 3.2 Connect GitHub to Hostinger

1. **Log in to Hostinger**: Go to [hpanel.hostinger.com](https://hpanel.hostinger.com) and log in.

2. **Navigate to Hosting**: From the dashboard, select **Hosting** → Choose your hosting plan.

3. **Access GitHub Integration**:
   - Scroll down to the **Advanced** section
   - Click **Git** → **GitHub**

4. **Authorize GitHub**:
   - Click **Connect GitHub Account**
   - You'll be redirected to GitHub to authorize Hostinger
   - Click **Authorize** to grant Hostinger access

5. **Select Repository**:
   - After authorization, select your repository from the dropdown
   - Choose the branch to deploy (typically `main`)

### 3.3 Configure Subdirectory Deployment

1. **Installation Location**:
   - In the GitHub integration settings, look for **Directory** or **Root directory**
   - Set it to: `/resumegpt` (or leave empty if configuring separately)

2. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

3. **Deploy Branch**: Select `main`

4. **Click Deploy**: Hostinger will clone the repository and run the build process.

### 3.4 Configure Domain for cyberfranky.in/resumegpt

If your domain is already pointing to Hostinger's servers:

1. **Add Subdirectory to GitHub Deploy**:
   - In Hostinger's Git settings, ensure the deploy path is set to deploy to the `/resumegpt` subdirectory
   - If Hostinger doesn't support subdirectory deployment directly, you may need to:
     - Create a `/resumegpt` folder in your File Manager
     - Deploy to that specific folder

2. **Alternative: Use .htaccess at Root**:
   If deploying to root but want `/resumegpt/` path, create a root `.htaccess`:

   ```apache
   RewriteEngine On
   RewriteRule ^resumegpt/(.*)$ /resumegpt/index.html [L]
   ```

### 3.5 Verify Deployment Settings

| Setting | Value |
|---------|-------|
| Repository | `YOUR_USERNAME/ai-resume-studio` |
| Branch | `main` |
| Build Command | `npm run build` |
| Publish Directory | `dist` |
| Deployment Path | `/resumegpt` |

---

## 4. Build and Deploy Process

### 4.1 Local Build Steps

Before deploying, always test the build locally:

```bash
# Navigate to project directory
cd /path/to/ai-resume-studio-main

# Install dependencies (if not already installed)
npm install

# Run linter to check for errors
npm run lint

# Build the project
npm run build
```

**Expected Output**:
```
vite v5.x.x building for production...
✓ XX modules transformed.
dist/index.html XX.XX KB
dist/assets/index-xxx.js XX.XX KB
...
✓ built in X.XX s
```

### 4.2 Preview Build Locally

Test the built version locally before deploying:

```bash
# Preview the production build
npm run preview
```

This starts a local server (typically on port 4173) with the production build.

### 4.3 Deployment Verification

After deploying to Hostinger:

1. **Wait for Deployment**: GitHub deployment typically takes 2-5 minutes.

2. **Test the URL**: Visit `https://cyberfranky.in/resumegpt/`

3. **Verify**:
   - [ ] Page loads without errors
   - [ ] Navigation works (try different routes)
   - [ ] Assets (CSS, JS, images) load correctly
   - [ ] No 404 errors in console

### 4.4 Manual Deployment via Git

If you prefer manual deployment:

```bash
# Build locally
npm run build

# Using Hostinger CLI or FTP
# Upload contents of /dist folder to /public_html/resumegpt/
```

---

## 5. Post-Deployment

### 5.1 Environment Variables

If your application uses environment variables, you have two options:

**Option A: Define in Hostinger**
1. Go to **Hosting** → **Advanced** → **Environment Variables**
2. Add each variable:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIs...` |
| `VITE_GEMINI_API_KEY` | Gemini AI API key (optional) | `AIzaSy...` |

**Option B: Create .env.production File**
```bash
# Create production environment file
cp .env.example .env.production

# Edit with your values
nano .env.production
```

### 5.2 Supabase Configuration

1. **Get Supabase Credentials**:
   - Go to [supabase.com](https://supabase.com) → Your project → **Settings** → **API**
   - Copy the **Project URL** and **anon public** key

2. **Update Environment Variables**:
   ```bash
   # In your .env file or Hostinger settings
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Configure CORS** (if needed):
   - In Supabase dashboard: **Settings** → **API** → **API Settings**
   - Add your domain to **Allowed Callback URLs**

### 5.3 Custom Domain Verification

**Check DNS Settings**:
1. Go to **Hosting** → **Manage** → **DNS / Nameservers**
2. Ensure your domain points to Hostinger's nameservers

**Verify SSL Certificate**:
- Hostinger provides free SSL via Let's Encrypt
- Check **SSL** section in Hostinger to ensure `cyberfranky.in` has HTTPS

**Check Canonical URL**:
- Verify [`index.html`](index.html:12) has correct canonical URL:
  ```html
  <link rel="canonical" href="https://cyberfranky.in/resumegpt/" />
  ```

### 5.4 Post-Deployment Checklist

- [ ] Site loads at `https://cyberfranky.in/resumegpt/`
- [ ] HTTPS is working (green lock icon)
- [ ] All pages accessible (Home, Dashboard, Templates, etc.)
- [ ] Assets loading correctly (no broken images/CSS/JS)
- [ ] Forms and interactive elements work
- [ ] Supabase connection functional (if configured)
- [ ] Mobile responsive design works

---

## 6. Troubleshooting

### 6.1 Common Issues

#### Issue: 404 Error on Page Refresh

**Cause**: SPA routing not configured correctly on the server.

**Solution**:
- Ensure `.htaccess` file is in the `public` folder and gets copied to `dist`
- Verify the `RewriteBase /resumegpt/` matches your subdirectory
- Contact Hostinger support to enable `mod_rewrite`

#### Issue: Assets Not Loading (Broken CSS/JS)

**Cause**: Incorrect base path or build output location.

**Solution**:
- Verify `vite.config.ts` has `base: "/resumegpt/"`
- Check that publish directory is set to `dist`
- Inspect browser console for 404 errors on assets

#### Issue: Blank Page

**Cause**: JavaScript errors or missing dependencies.

**Solution**:
- Check browser console for errors
- Run `npm run build` locally to see build errors
- Verify all environment variables are set

#### Issue: GitHub Deployment Fails

**Cause**: Build command errors or missing dependencies.

**Solution**:
- Run `npm run build` locally to verify it works
- Check Hostinger deployment logs
- Ensure `package.json` has correct dependencies

### 6.2 Build Command Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Run build again
npm run build
```

### 6.3 Debugging Steps

1. **Check Browser Console**: Press F12 → Console tab for JavaScript errors

2. **Check Network Tab**: Press F12 → Network tab to see failed requests

3. **Verify File Structure**:
   ```bash
   # After build, check dist contents
   ls -la dist/
   ls -la dist/assets/
   ```

4. **Test with curl**:
   ```bash
   curl -I https://cyberfranky.in/resumegpt/
   curl -I https://cyberfranky.in/resumegpt/assets/index-*.js
   ```

### 6.4 Getting Help

- **Hostinger Support**: Available 24/7 via live chat
- **GitHub Issues**: Check [Vite issues](https://github.com/vitejs/vite/issues)
- **React Router**: [React Router Documentation](https://reactrouter.com/)

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Test
npm run test
```

---

## Files Reference

| File | Purpose |
|------|---------|
| [`vite.config.ts`](vite.config.ts:1) | Vite configuration with base path |
| [`public/.htaccess`](public/.htaccess:1) | Apache rewrite rules for SPA |
| [`index.html`](index.html:1) | HTML entry point with canonical URL |
| [`package.json`](package.json:1) | Dependencies and build scripts |

---

**Last Updated**: February 2026
**Version**: 1.0.0
