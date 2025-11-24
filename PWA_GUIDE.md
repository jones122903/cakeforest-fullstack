# PWA (Progressive Web App) Guide - Cake Forest

## What is a PWA?

Your Cake Forest application is now a **Progressive Web App (PWA)**! This means users can:
- 📱 Install the app on their phone/desktop like a native app
- 🚀 Use the app offline
- ⚡ Experience faster load times
- 🔔 Receive push notifications (can be added later)
- 📲 Add to home screen on mobile devices

## Features Implemented

### 1. **Service Worker**
- Automatically caches app resources for offline use
- Provides faster subsequent loads
- Updates automatically when new versions are available

### 2. **Web App Manifest**
- App name: "Cake Forest"
- Custom app icons (192x192 and 512x512)
- Standalone display mode (looks like a native app)
- Theme color: White (#ffffff)

### 3. **Offline Support**
- All static assets (JS, CSS, HTML, images) are cached
- Google Fonts are cached for offline use
- Images are cached for 30 days
- Fonts are cached for 1 year

### 4. **Auto-Update**
- When a new version is deployed, users get a prompt to update
- Updates happen automatically in the background

## How to Test PWA Features

### On Desktop (Chrome/Edge):

1. **Open the app** in Chrome or Edge browser
2. **Look for the install icon** in the address bar (⊕ or install icon)
3. **Click "Install"** to add the app to your desktop
4. The app will open in a standalone window without browser UI

### On Mobile (Android):

1. **Open the app** in Chrome browser
2. **Tap the menu** (three dots)
3. **Select "Add to Home screen"** or "Install app"
4. The app icon will appear on your home screen
5. **Tap the icon** to launch the app like a native app

### On Mobile (iOS):

1. **Open the app** in Safari browser
2. **Tap the Share button** (square with arrow)
3. **Scroll down** and tap "Add to Home Screen"
4. **Tap "Add"** in the top right
5. The app icon will appear on your home screen

## Testing Offline Mode

1. **Open the app** and navigate through a few pages
2. **Open DevTools** (F12 in Chrome)
3. **Go to Network tab**
4. **Select "Offline"** from the throttling dropdown
5. **Refresh the page** - it should still work!

## PWA Configuration Files

### `vite.config.js`
Contains the PWA plugin configuration with:
- Manifest settings
- Service worker configuration
- Caching strategies
- Runtime caching for fonts and images

### `src/main.jsx`
Registers the service worker and handles:
- Update notifications
- Offline ready notifications

### `public/` folder
Contains PWA icons:
- `pwa-192x192.png` - Small icon
- `pwa-512x512.png` - Large icon

## Caching Strategy

### Static Assets
- **Strategy**: Cache First
- **Includes**: JS, CSS, HTML, images, fonts
- **Duration**: Until updated

### Google Fonts
- **Strategy**: Cache First
- **Duration**: 1 year
- **Max Entries**: 10

### Images
- **Strategy**: Cache First
- **Duration**: 30 days
- **Max Entries**: 50

## Building for Production

To build the PWA for production:

```bash
npm run build
```

This will:
1. Generate optimized production files
2. Create the service worker
3. Generate the manifest.json
4. Output everything to the `dist/` folder

To preview the production build:

```bash
npm run preview
```

## Deployment

When deploying your PWA:

1. **HTTPS is required** - PWAs only work on HTTPS (except localhost)
2. Deploy the entire `dist/` folder to your hosting service
3. Ensure your hosting supports:
   - Service workers
   - Proper MIME types for manifest.json
   - HTTPS

### Recommended Hosting Services:
- **Vercel** (easiest for Vite apps)
- **Netlify**
- **Firebase Hosting**
- **GitHub Pages** (with HTTPS)

## Updating Your PWA

When you make changes:

1. Make your code changes
2. Run `npm run build`
3. Deploy the new `dist/` folder
4. Users will automatically get a prompt to update when they visit the app

## Customization

### Changing App Name
Edit `vite.config.js`:
```javascript
manifest: {
  name: 'Your New Name',
  short_name: 'NewName',
  // ...
}
```

### Changing Theme Color
Edit `vite.config.js`:
```javascript
manifest: {
  theme_color: '#your-color',
  background_color: '#your-color',
  // ...
}
```

### Changing Icons
Replace the files in `public/`:
- `pwa-192x192.png`
- `pwa-512x512.png`

Make sure they're square PNG images.

## Troubleshooting

### PWA not installing?
- Check if you're on HTTPS (or localhost)
- Clear browser cache and reload
- Check DevTools > Application > Manifest for errors

### Offline mode not working?
- Check DevTools > Application > Service Workers
- Ensure service worker is activated
- Try unregistering and re-registering the service worker

### Updates not showing?
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Clear service worker cache in DevTools
- Check if service worker is updating in DevTools > Application

## Browser Support

✅ Chrome (Desktop & Mobile)
✅ Edge (Desktop & Mobile)
✅ Safari (iOS 11.3+)
✅ Firefox (Desktop & Mobile)
✅ Samsung Internet
✅ Opera

## Next Steps

Consider adding:
- 🔔 **Push Notifications** - Notify users about new cakes, offers
- 🔄 **Background Sync** - Sync orders when back online
- 📊 **Analytics** - Track PWA installs and usage
- 🎨 **App Shortcuts** - Quick actions from home screen icon
- 📱 **Share Target** - Allow sharing to your app

---

**Your Cake Forest app is now a fully functional PWA! 🎉**

Users can install it, use it offline, and enjoy a native app-like experience.
