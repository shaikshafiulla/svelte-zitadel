# PWA Testing & Verification Guide

## Quick Status Check

✅ **Service Worker**: Registered and auto-activated  
✅ **Web App Manifest**: Valid and configured  
✅ **Icons**: Generated (192x192, 512x512, maskable variants)  
✅ **Meta Tags**: Complete PWA support  
✅ **Build**: Optimized with Vercel adapter  
✅ **Offline Support**: Network-first caching strategy  

## Desktop Installation (Chrome/Edge)

### Installation Steps
1. Open the app: `npm run preview`
2. Visit `http://localhost:4173`
3. Click the **Install** button in the address bar
4. Confirm installation
5. App opens in a separate window (standalone mode)

### Verification Checklist
- [ ] Install button appears in address bar
- [ ] App launches without browser chrome
- [ ] App appears in applications list
- [ ] Theme color (#6366f1) shows in window title bar

### Uninstalling
- Right-click app → "Remove from devices"
- Or uninstall like any desktop application

## Mobile Installation (Android Chrome)

### Installation Steps
1. Open Chrome on Android
2. Visit the live app URL
3. Tap **⋮** (menu) at top-right
4. Select "Install app" or "Add to Home screen"
5. Confirm installation
6. App icon appears on home screen

### Verification Checklist
- [ ] Install prompt appears (not banner)
- [ ] App icon shows on home screen
- [ ] App launches full-screen
- [ ] No address bar visible
- [ ] Back button works correctly

## Mobile Installation (iOS/Safari)

### Installation Steps
1. Open Safari on iPhone/iPad
2. Visit the app URL
3. Tap **Share** button (↗️)
4. Scroll and tap "Add to Home Screen"
5. Confirm with "Add"
6. App icon appears on home screen

### Verification Checklist
- [ ] Share menu has "Add to Home Screen" option
- [ ] App icon appears on home screen
- [ ] App launches full-screen
- [ ] Splash screen shows (SoloDev)
- [ ] Status bar styling is correct

## Service Worker Testing

### In DevTools (All Browsers)

**Chrome/Edge:**
1. Open DevTools (`F12`)
2. Go to **Application** tab
3. Click **Service Workers** in sidebar
4. You should see:
   - Service Worker status: "activated and running"
   - Scope: `/`
   - Version: Current build number

**Firefox:**
1. Open DevTools (`F12`)
2. Go to **Storage** tab
3. Expand **Service Workers**
4. Should show entry with status ✓

### Manual Service Worker Test
```javascript
// Open Console and run:
navigator.serviceWorker.controller
// Should return ServiceWorkerContainer object
```

## Cache Storage Testing

### View Cached Assets
1. DevTools → **Application** → **Cache Storage**
2. Expand cache list (should see `cache-[version]`)
3. Should contain:
   - HTML files
   - JavaScript bundles
   - CSS files
   - SVG/PNG icons
   - Manifest.json

### Clear Cache (Useful for Updates)
```javascript
// In Console:
caches.keys().then(names => 
  names.forEach(name => caches.delete(name))
);
// Then hard refresh: Ctrl+Shift+R
```

## Offline Functionality Testing

### Method 1: Offline Mode (Chrome DevTools)
1. Open DevTools → **Network** tab
2. Check **Offline** checkbox
3. Reload page (`Ctrl+R`)
4. Page should load from cache
5. Navigation should work
6. Uncheck **Offline** to go back online

### Method 2: Throttle Network
1. DevTools → **Network** tab
2. Change throttle to "Slow 3G"
3. Observe app handles slow network gracefully

### Method 3: Simulate Server Errors
1. Go to a page and cache it (load normally)
2. Stop the server (`npm run dev` → Ctrl+C)
3. Navigate to different routes
4. Cached routes should load
5. Non-cached routes show "Offline" message

## Lighthouse PWA Audit

### Running the Audit
1. Open app in Chrome
2. DevTools → **Lighthouse** tab
3. Select **PWA** category only
4. Click **Analyze page load**
5. Wait for results (~2 min)

### Expected Results
Should pass all PWA requirements:
- ✓ Installable (Web App Manifest)
- ✓ Service Worker (Offline support)
- ✓ HTTPS ready (required for deployment)
- ✓ Responsive design
- ✓ Splash screen support

### PWA Audits Per Page
Run audit on:
- `/` (home/dashboard)
- `/profile/test-user` (profile)
- Check each page loads offline

## Manifest Validation

### Online Validators
- [Web App Manifest Validator](https://manifest-validator.appspot.com/)
- [PWA Builder](https://www.pwabuilder.com/)

### Manual Check
1. DevTools → **Network** tab
2. Filter: `manifest.json`
3. Click manifest.json
4. Check **Response** tab:
```json
{
  "name": "SoloDev - Freelancer Workspace",
  "short_name": "SoloDev",
  "display": "standalone",
  "icons": [...],
  "start_url": "/"
}
```

## Icon Testing

### Icon Verification
1. DevTools → **Application** → **Icons**
2. Should show both icon variants:
   - `icon-192x192.png` (192×192)
   - `icon-192x192-maskable.png` (with transparent area)
   - `icon-512x512.png` (512×512)
   - `icon-512x512-maskable.png` (with transparent area)

### Maskable Icon Test
1. Install app on Android 12+ phone
2. Go to app settings
3. Long-press app icon
4. Icon should fill entire circle (adaptive)

### Size Verification
```bash
# Check icon dimensions
identify static/icon-*.png

# Expected output:
# icon-192x192.png PNG 192x192 ...
# icon-512x512.png PNG 512x512 ...
```

## Network Test Scenarios

### Scenario 1: Normal Online Usage
1. Start app normally
2. Navigate between pages
3. All data loads from network
4. Cache updates in background

### Scenario 2: Go Offline Mid-Session
1. Load dashboard online
2. Enable Offline in DevTools
3. Try navigating to profile
4. Page should load from cache (if visited)
5. Show offline message (if not visited)

### Scenario 3: Intermittent Connection
1. Enable "Slow 3G" throttling
2. Navigate pages
3. App should still be responsive
4. Images load progressively
5. Cached content loads instantly

### Scenario 4: Return Online
1. Browse with Offline enabled
2. Disable Offline
3. Refresh page
4. New content should fetch from network
5. Cache updates automatically

## Installation Prompt (Optional Feature)

The app can optionally show a custom install prompt:

```javascript
// Listen for install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton(); // Show custom UI
});

// When user clicks install button:
deferredPrompt.prompt();
const choiceResult = await deferredPrompt.userChoice;
console.log(choiceResult.outcome); // 'accepted' or 'dismissed'
```

This could be added to `src/routes/+layout.svelte` for custom UX.

## Performance Metrics

### Check Performance
1. DevTools → **Performance** tab
2. Click **Record**
3. Reload page
4. Stop recording
5. Check metrics:
   - **FCP** (First Contentful Paint): < 1.8s
   - **LCP** (Largest Contentful Paint): < 2.5s
   - **CLS** (Cumulative Layout Shift): < 0.1
   - **TTFB** (Time to First Byte): < 600ms

### Cached Load Performance
1. Load page normally
2. Note load time
3. Go offline (DevTools)
4. Reload page
5. Cached load should be **significantly faster**

## Deployment Verification (Vercel)

Once deployed to Vercel:

1. **HTTPS**: Automatic ✓
2. **Service Worker**: Auto-cached by Vercel
3. **Icons**: Served with correct MIME type
4. **Manifest**: Available at `/manifest.json`

### Test on Vercel
```bash
# Install to Vercel-hosted app
1. Visit your-app.vercel.app
2. Try to install app
3. Works in both Chrome and mobile
4. Test offline functionality
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| No install button | HTTP or not manifest | Deploy to HTTPS (Vercel auto-enables) |
| Service Worker won't register | Syntax error in SW | Check DevTools Console for errors |
| Cache not updating | Version not changed | Hard refresh or clear cache |
| Icons not showing | Wrong path in manifest | Check static/ folder exists |
| Offline broken | SW fetch error | Test network strategy in DevTools |
| App doesn't fullscreen | Display not "standalone" | Check manifest.json display property |

## Browser DevTools Shortcuts

| Browser | Location | Shortcut |
|---------|----------|----------|
| Chrome | Application → Service Workers | F12 |
| Edge | Application → Service Workers | F12 |
| Firefox | Storage → Service Workers | F12 |
| Safari | Develop → Service Workers | Cmd+Option+I |

## Testing Checklist (Complete)

- [ ] Service Worker registers and activates
- [ ] Manifest.json is valid
- [ ] Icons display at 192x192 and 512x512
- [ ] App installs on desktop (Chrome/Edge)
- [ ] App installs on Android (Chrome)
- [ ] App installs on iOS (Safari)
- [ ] App launches in standalone mode
- [ ] Offline mode shows cached content
- [ ] Offline mode shows error gracefully
- [ ] Cache storage visible in DevTools
- [ ] Lighthouse PWA audit passes
- [ ] Theme color shows in chrome
- [ ] App icon appears on home screen
- [ ] Back button works properly
- [ ] All routes load offline (when cached)

## Performance Tips

1. **First Load**: Keep assets small with minification
2. **Subsequent Loads**: Leverage cache for instant loading
3. **Updates**: Version cache for automatic updates
4. **Offline UX**: Show clear offline indicators
5. **Images**: Use modern formats (WebP) when possible

## References

- [MDN: Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web.dev: PWA Basics](https://web.dev/progressive-web-apps/)
- [Google: Installable](https://web.dev/installable-manifest/)
- [SvelteKit: Service Workers Docs](https://kit.svelte.dev/docs/service-workers)
