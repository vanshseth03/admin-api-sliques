# SLIQUES Admin Portal

Mobile-friendly admin dashboard for managing SLIQUES boutique orders.

## Features

- 📱 **PWA Ready** - Install as app on any device
- 🔔 **Push Notifications** - Get instant alerts for new orders
- 🔄 **Real-time Updates** - Orders sync via WebSocket
- 📊 **Dashboard Stats** - Today's orders, pending, revenue
- 🎯 **Quick Status Updates** - Tap to advance order status
- 📞 **One-tap Contact** - Call or WhatsApp customers

## Setup

### 1. Install dependencies

```bash
cd admin-portal
npm install
```

### 2. Start development server

```bash
npm start
```

The app runs on `http://localhost:3002`

### 3. Building for Production

```bash
npm run build
```

## Converting to APK

### Option 1: PWA Builder (Recommended)
1. Deploy the built app to a hosting service (Netlify, Vercel, etc.)
2. Go to [PWABuilder.com](https://pwabuilder.com)
3. Enter your deployed URL
4. Download Android APK package

### Option 2: Capacitor
1. Install Capacitor: `npm install @capacitor/core @capacitor/cli`
2. Init: `npx cap init`
3. Add Android: `npx cap add android`
4. Build: `npm run build`
5. Sync: `npx cap sync`
6. Open in Android Studio: `npx cap open android`

## Server Requirements

Make sure the backend server is running:

```bash
cd ../server
npm install
npm start
```

## Environment Variables

Create `.env` file:

```
REACT_APP_API_URL=http://your-server-url:5000
REACT_APP_WS_URL=ws://your-server-url:5000
```
