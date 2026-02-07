# Quick Start Guide - UI Only Mode

## 🚀 One-Minute Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

That's it! No backend, no Zitadel setup needed.

## 🎮 Try These Features

### 1. **Role Toggle**

- Click on your profile name in navbar → "Switch to [ROLE]"
- Or go to Profile page → "Switch to [ROLE]" button
- Toggle between FREELANCER and CLIENT

### 2. **Dashboard**

- See different content based on active role
- FREELANCER: Browse and apply for jobs
- CLIENT: Post new jobs
- All data is dummy data (no persistence)

### 3. **Job Management**

- Search jobs by title, description, skills
- Apply for jobs (no email sent)
- Post jobs (only appears in current session)

### 4. **Theme Toggle**

- Click moon/sun icon in navbar
- Preference saved in localStorage

### 5. **Install as App**

- Click download icon in navbar
- Install as PWA on mobile/desktop

## 📱 Mobile View

- Fully responsive design
- Try on mobile device or browser devtools

## 🌐 Deploy to Vercel in 2 Steps

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for Vercel"
git push origin main

# 2. Go to vercel.com and click "Import Project"
# Select your GitHub repo and deploy
```

No environment variables needed. No backend needed.

## 💾 Persistent Features (localStorage only)

- Theme preference (light/dark)
- That's it! Everything else resets on refresh

## 🔄 Switching Back to Zitadel

See `IMPLEMENTATION-UI-ONLY.md` for instructions.

## 📋 What's Mocked

✅ User Authentication (login/logout)
✅ User Profiles (test-user, john@example.com)
✅ Dashboard Statistics
✅ Job Listings & Applications
✅ User Session Management

All without a single backend call!

## 🐛 Troubleshooting

**"Localhost refused to connect"**

- Make sure you ran `npm run dev`
- Visit http://localhost:5173 (not localhost:3000)

**"Role toggle not working"**

- The app is fully client-side, no persistence
- Refresh page to reset to default role

**"Can't find module X"**

- Run `npm install` again

## 📚 Helpful Files

- `IMPLEMENTATION-UI-ONLY.md` - Technical changes made
- `README-VERCEL.md` - Detailed deployment guide
- `.env.example` - Environment variables (currently unused)
