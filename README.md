# SLIQUES Admin Portal & API

Admin panel and backend API for SLIQUES Boutique.

## Structure

```
├── admin-portal/    # React admin dashboard (PWA)
├── server/          # Node.js/Express API server
```

## Setup

### Server (API)

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB, ImageKit, and VAPID keys
npm start
```

### Admin Portal

```bash
cd admin-portal
npm install
cp .env.example .env
# Edit .env with your API URL
npm start
```

### Run Both Together

```bash
cd admin-portal
npm run start:all
```

## Environment Variables

### Server (.env)
- `MONGODB_URI` - MongoDB connection string
- `IMAGEKIT_URL_ENDPOINT` - ImageKit URL
- `IMAGEKIT_PUBLIC_KEY` - ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` - ImageKit private key
- `VAPID_PUBLIC_KEY` - Web Push public key
- `VAPID_PRIVATE_KEY` - Web Push private key
- `VAPID_EMAIL` - Contact email for push notifications
- `PORT` - Server port (default: 5000)

### Admin Portal (.env)
- `REACT_APP_API_URL` - API server URL
- `REACT_APP_WS_URL` - WebSocket server URL

## Deployment

### API (Render/Railway/Heroku)
1. Deploy the `server` folder
2. Set environment variables
3. Use `npm start` as start command

### Admin Portal (Vercel/Netlify)
1. Deploy the `admin-portal` folder
2. Set `REACT_APP_API_URL` to your deployed API URL
3. Build command: `npm run build`
4. Output directory: `build`

## Building APK

See [admin-portal/BUILD_APK.md](admin-portal/BUILD_APK.md) for instructions on converting the PWA to an Android APK.
