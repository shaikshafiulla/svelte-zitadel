# PWA (Progressive Web App) Setup Guide

SoloDev is fully configured as a Progressive Web App. This document outlines the PWA capabilities and configuration.

## What is a PWA?

A Progressive Web App (PWA) is a web application that uses modern web capabilities to deliver app-like user experiences. It works on any platform that uses a standards-compliant browser.

## PWA Features Enabled

### 1. **Service Worker**
- **Location**: `src/service-worker.ts`
- **Features**:
  - Offline-first caching strategy
  - Network-first fallback to cache
  - Asset precaching on install
  - Automatic cache cleanup on activation
  - Graceful offline error handling

### 2. **Web App Manifest**
- **Location**: `static/manifest.json`
- **Includes**:
  - App name, short name, and description
  - Standalone display mode (no browser UI)
  - Theme and background colors
  - App icons (192x192 and 512x512)
  - Maskable icons for adaptive display
  - App shortcuts for quick access
  - Screenshot metadata

### 3. **Meta Tags**
- **Location**: `src/app.html`
- **Configuration**:
  - Theme color for browser chrome
  - Viewport settings for responsive design
  - Apple PWA support for iOS
  - Mobile web app capability flags
  - Open Graph tags for social sharing
  - Preconnect directives for performance

### 4. **Icons**
- **192x192 icon**: For app home screen
- **512x512 icon**: For splash screens
- **Maskable variants**: Adaptive icons for Android 12+
- **Location**: `static/icon-*.png`

## Installation Methods

### Desktop (Chrome, Edge, Opera)
1. Visit the site in a supported browser
2. Click the "Install" button in the address bar
3. Click "Install" in the dialog
4. App will appear on your desktop

### Mobile (Android)
1. Open the site in Chrome
2. Tap the menu (⋮)
3. Select "Install app" or "Add to Home screen"
4. Confirm installation
5. App will appear on your home screen

### Mobile (iOS)
1. Open the site in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"
5. App will appear on your home screen

## Offline Functionality

The service worker implements a network-first strategy:

1. **Static Assets**: Always served from cache if available
2. **Dynamic Content**: 
   - Tries network first
   - Falls back to cached version if offline
   - Shows offline message if neither available

## Caching Strategy

```
Request → Network → Success?
         ↓         ↓ Yes
         Yes     Cache It & Return
         ↓         ↓
      No?      Return
         ↓
      Cache → Found?
              ↓ Yes
              Return
              ↓ No
         Return Offline Message
```

## Configuration Details

### Manifest Properties

```json
{
  "display": "standalone",      // Full-screen, app-like experience
  "orientation": "portrait-primary", // Lock to portrait orientation
  "background_color": "#ffffff", // Splash screen background
  "theme_color": "#6366f1",     // Browser chrome color
  "categories": ["business", "productivity"]
}
```

### Service Worker Cache

- **Cache Name**: `cache-{version}` (versioned for updates)
- **Precached Assets**: All built files + static files
- **Network Timeout**: Immediate fallback to cache

## Browser Support

| Browser | Desktop | Mobile | Version |
|---------|---------|--------|---------|
| Chrome | ✅ | ✅ | 40+ |
| Edge | ✅ | ✅ | 79+ |
| Firefox | ✅ | ⚠️ Limited | 92+ |
| Safari | ❌ | ⚠️ Limited | 14+ (iOS 14.4+) |
| Opera | ✅ | ✅ | 27+ |

## Testing the PWA

### Lighthouse Audit
```bash
# In Chrome DevTools
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select PWA category
4. Click "Analyze page load"
```

### Service Worker Testing
```bash
1. Open DevTools → Application tab
2. Click "Service Workers"
3. Verify service worker is "activated and running"
4. Check "Cache Storage" for precached assets
```

### Offline Testing
```bash
1. Open DevTools → Network tab
2. Enable "Offline" checkbox
3. Reload page
4. App should continue functioning with cached content
```

## Build Verification

The PWA is configured to build correctly with the Vercel adapter:

```bash
npm run build

# Expected output:
# ✓ 3816 modules transformed (client)
# ✓ 2 modules transformed (service worker)
# ✓ built in X.XXs (server-side rendering)
# ✓ built in X.XXs (total)
```

## Deployment Considerations

When deploying to Vercel:

1. **HTTPS is automatically enabled** - Required for service workers
2. **Service worker is automatically cached** - By Vercel edge
3. **Manifest is served correctly** - With proper MIME types
4. **Icons are accessible** - From static folder

## Future Enhancements

Potential PWA features to add:

- [ ] Installation prompts with custom UI
- [ ] Periodic background sync for data updates
- [ ] Push notifications
- [ ] Share target API for share functionality
- [ ] Web app shortcuts customization
- [ ] Splash screen image optimization
- [ ] Update notifications for new versions

## Troubleshooting

### App not installable
- Check: HTTPS enabled (required)
- Check: Manifest is valid JSON
- Check: Icons are accessible and correct size
- Check: Service worker is registered

### Service worker not updating
- Clear browser cache: Settings → Clear browsing data
- Uninstall and reinstall app
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Offline not working
- Check: Service worker is "activated and running"
- Check: Browse to different route to test caching
- Check: Check DevTools Console for errors

## Resources

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev - PWA Checklist](https://web.dev/pwa-checklist/)
- [Google - PWA Documentation](https://developers.google.com/web/progressive-web-apps)
- [SvelteKit - Service Workers](https://kit.svelte.dev/docs/service-workers)
