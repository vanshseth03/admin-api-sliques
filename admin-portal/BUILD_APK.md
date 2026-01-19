# Building APK from Admin Portal PWA

There are two ways to convert your PWA to an Android APK:

## Option 1: PWABuilder (Easiest - No coding required)

### Steps:
1. **Deploy your admin portal** to a public URL (e.g., Vercel, Netlify, or your server)
   ```bash
   cd admin-portal
   npm run build
   # Deploy the 'build' folder to your hosting
   ```

2. **Go to PWABuilder**: https://www.pwabuilder.com/

3. **Enter your deployed URL** and click "Start"

4. **PWABuilder will analyze your PWA** and show a report

5. **Click "Package for stores"** → Select "Android"

6. **Download the APK** or AAB (Android App Bundle)

7. **Install on your phone**:
   - Transfer the APK to your Android device
   - Enable "Install from unknown sources" in Settings
   - Open the APK to install

---

## Option 2: Capacitor (More control)

### Prerequisites:
- Android Studio installed
- Java JDK 11+

### Steps:

1. **Install Capacitor**:
   ```bash
   cd admin-portal
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "Sliques Admin" "com.sliques.admin"
   ```

2. **Build your React app**:
   ```bash
   npm run build
   ```

3. **Update capacitor.config.json**:
   ```json
   {
     "appId": "com.sliques.admin",
     "appName": "Sliques Admin",
     "webDir": "build",
     "server": {
       "androidScheme": "https"
     }
   }
   ```

4. **Add Android platform**:
   ```bash
   npx cap add android
   npx cap sync
   ```

5. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

6. **Build APK in Android Studio**:
   - Go to Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK will be in: `android/app/build/outputs/apk/debug/`

7. **For release APK** (signed):
   - Build → Generate Signed Bundle / APK
   - Create a keystore if you don't have one
   - Select APK and sign

---

## Option 3: Bubblewrap (Google's official tool)

### Steps:
1. **Install Bubblewrap**:
   ```bash
   npm install -g @anthropic/bubblewrap-cli
   ```

2. **Initialize project**:
   ```bash
   bubblewrap init --manifest=https://your-deployed-url.com/manifest.json
   ```

3. **Build APK**:
   ```bash
   bubblewrap build
   ```

---

## Quick Notes:

### For Testing:
- Use the debug APK from any method
- Enable "Install from unknown sources" on your phone

### For Play Store:
- You need a signed release APK or AAB
- You'll need a Google Play Developer account ($25 one-time fee)
- Use AAB format for Play Store submissions

### App Icons:
Make sure your `public/manifest.json` has proper icons:
```json
{
  "icons": [
    { "src": "/logo192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/logo512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## Recommended: PWABuilder for Quick APK

For your use case (admin-only app), PWABuilder is the fastest way:

1. Deploy admin-portal to Vercel:
   ```bash
   npm install -g vercel
   cd admin-portal
   npm run build
   vercel deploy
   ```

2. Go to https://www.pwabuilder.com/
3. Enter your Vercel URL
4. Download APK
5. Install on your phone

The APK will work just like a native app with:
- ✅ Push notifications
- ✅ Offline capability (service worker)
- ✅ App icon on home screen
- ✅ Full screen experience
