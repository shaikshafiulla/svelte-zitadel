# Vercel Deployment Guide

## Overview

This SvelteKit app with dummy data is ready for Vercel deployment. Zitadel authentication has been disabled in favor of client-side role management.

## Deployment Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Select your repository
5. Click "Import"

### 3. Configure Environment Variables (Optional)

In Vercel Project Settings → Environment Variables:

- Leave blank for now (app uses dummy data)
- If needed later, add Zitadel credentials

### 4. Deploy

- Click "Deploy"
- Vercel will automatically build and deploy from `main` branch

## Features

✅ **No Backend Required** - All data is mocked client-side
✅ **Role Toggling** - Switch between FREELANCER and CLIENT roles from the UI
✅ **Dummy Profiles** - Pre-populated profile data
✅ **Mock Dashboard** - Browse and manage jobs without API calls
✅ **PWA Ready** - Install as app on mobile/desktop

## Post-Deployment

After deployment, you can:

1. Toggle between FREELANCER and CLIENT roles from the navbar
2. Switch roles from the profile page
3. View dummy dashboard data
4. Create and apply for mock jobs

## To Revert to Zitadel Auth

Uncomment the commented `/* ZITADEL AUTH DISABLED */` sections in:

- `src/routes/auth/login/+page.server.ts`
- `src/routes/auth/callback/+page.server.ts`
- `src/routes/auth/logout/+page.server.ts`
- `src/routes/dashboard/+page.server.ts`
- `src/core/infrastructure/di/container.ts`

## Notes

- The app is fully functional without any backend
- All user data is client-side only (not persisted)
- Logging out simply redirects to home page
- Profile fetches use dummy data instead of API calls
