<<<<<<< HEAD
# SLIQUES - Premium Tailoring Boutique

A contemporary boutique offering stylish, comfortable & elegant outfit designs for everyday confidence and special moments. Built with React and Tailwind CSS.

## 📦 Repositories

| Repository | URL |
|------------|-----|
| **Main Website** | https://github.com/vanshseth03/sliques |
| **Admin API** | https://github.com/vanshseth03/admin-api-sliques |

## 🎨 Brand Overview

- **Brand Name:** SLIQUES
- **Tagline:** Contemporary Boutique, Crafted with Care
- **Service Area:** Raj Nagar Extension (exclusively)
- **Primary Font:** Playfair Display (headings/logo)
- **Secondary Font:** Inter (body/UI)

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Deep Charcoal | `#111317` | Primary text, buttons |
| Soft Ivory | `#FBF9F6` | Background |
| Muted Gold | `#B58E52` | Accent, highlights |
| Wine/Burgundy | `#6D1B2E` | Bridal category, urgent tags |

## ✨ Features

### Customer-Facing
- **Home Page** - Hero with brand wordmark, CTAs, trust badges
- **Services Page** - Three categories: Everyday & Office, Premium Ethnic, Bridal & Heavy Work
- **Outfit Customizer** - Step-by-step design studio with:
  - Base outfit selection
  - Neck design selection + custom upload (Complimentary Neckline Personalization)
  - Fabric, sleeve, length options
  - Add-ons selection
  - Live price calculator
  - Download/WhatsApp summary
- **Booking System** - With slot management and business rules enforcement
- **Order Tracking** - Status progress visualization
- **FAQ & Policies** - Comprehensive information

### Admin Dashboard
- Daily booking counts with visual indicators
- Revenue overview
- Order management with status updates
- CSV export functionality
- Filter by date, status, booking type

## 📋 Business Rules (Enforced in UI)

| Rule | Value |
|------|-------|
| Max Normal Bookings/Day | 4 |
| Max Urgent Bookings/Day | 2 |
| Urgent Minimum Notice | 36 hours |
| Urgent Surcharge | +30% |
| Advance Payment | 30% |

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone or navigate to project directory
cd sliques-boutique

# Install dependencies
npm install

# Start development server
npm start
```

The app will run at `http://localhost:3000`

### Build for Production

```bash
# Create production build
npm run build

# The build folder is ready to be deployed
```

## 📁 Project Structure

```
sliques-boutique/
├── public/
│   ├── index.html
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── Logo.js
│   │   ├── TrustBadges.js
│   │   ├── ServiceCard.js
│   │   └── DatePicker.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Services.js
│   │   ├── Customizer.js
│   │   ├── Booking.js
│   │   ├── OrderTracking.js
│   │   ├── FAQ.js
│   │   ├── Admin.js
│   │   └── Contact.js
│   ├── context/
│   │   ├── BookingContext.js
│   │   └── AdminContext.js
│   ├── data/
│   │   ├── services.js
│   │   ├── bookings.js
│   │   └── customizer.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# API Endpoints (for production)
REACT_APP_API_URL=https://api.sliques.in

# WhatsApp Business Number
REACT_APP_WHATSAPP_NUMBER=919310282351

# Payment Gateway (if integrating)
REACT_APP_RAZORPAY_KEY=your_razorpay_key
```

## 📱 Responsive Breakpoints

- Mobile: 360px - 420px (primary design target)
- Tablet: 768px
- Desktop: 1024px+

## 🧪 QA Checklist

### Pages & Navigation
- [ ] All pages render correctly on mobile (360-420px)
- [ ] All pages render correctly on desktop
- [ ] Navigation works on all pages
- [ ] Mobile menu opens/closes properly
- [ ] All links navigate correctly

### Business Rules
- [ ] Service area notice visible in header
- [ ] Service area notice visible in footer
- [ ] Service area notice visible during checkout
- [ ] Max 4 normal bookings shown per day
- [ ] Max 2 urgent bookings shown per day
- [ ] Urgent option disabled when not available
- [ ] 36-hour minimum for urgent enforced
- [ ] +30% urgent surcharge calculated correctly
- [ ] Booking slots disabled when limit reached
- [ ] Polite message shown when slots unavailable

### Customizer
- [ ] Step navigation works
- [ ] All options selectable
- [ ] Custom neck design upload works (JPG/PNG/SVG)
- [ ] "Complimentary Neckline Personalization" label visible
- [ ] Live price updates correctly
- [ ] Urgent surcharge applies when selected
- [ ] Download summary works
- [ ] WhatsApp share works

### Booking Flow
- [ ] Service selection works
- [ ] Date picker shows available slots
- [ ] Time slot selection works
- [ ] Tailor at doorstep option available
- [ ] Customer details form validates
- [ ] Measurements form works
- [ ] Terms checkboxes required
- [ ] Advance amount shows correctly (30%)
- [ ] Booking confirmation displays

### Trust Badges
- [ ] Free pickup & delivery badge visible
- [ ] Free alteration badge visible
- [ ] Tailor at doorstep badge visible

### Admin Dashboard
- [ ] Stats display correctly
- [ ] Orders list loads
- [ ] Status can be changed
- [ ] CSV export works
- [ ] Filters work correctly

## 🖼️ Asset Recommendations

### Logo Concept
- Playfair Display wordmark "SLIQUES"
- Subtle gold (#B58E52) underline
- Clean, minimal design

### Hero Image
Recommended: Calm studio photograph featuring:
- Stitched salwar suit on mannequin
- Ivory/cream backdrop
- Soft, diffused lighting
- Premium, editorial aesthetic

### Service Images
Professional photographs of:
- Finished garments on hangers/mannequins
- Detail shots of stitching
- Fabric textures

## 🔌 API Integration Points

The frontend uses mock data. For production, integrate with:

### Endpoints Needed
```
POST /api/bookings - Create booking
GET  /api/bookings/:id - Get booking by ID
GET  /api/bookings/availability/:date - Check slot availability
PATCH /api/bookings/:id/status - Update status (admin)
GET  /api/admin/bookings - List all bookings (admin)
GET  /api/admin/stats - Dashboard stats (admin)
```

### Webhook Events (for notifications)
- booking.created
- status.updated (cutting, stitching, trial_ready, ready)

## 📞 Support

For questions or issues:
- WhatsApp: +91 93102 82351
- Email: hello@sliques.in

## 📄 License

Private - All rights reserved © 2026 SLIQUES Boutique
=======
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
>>>>>>> bcbfd2babc52391f4596b58a3859559ee223f6ee
