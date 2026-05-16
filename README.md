# 🏎️ Rides by Julius — Luxury Car Dealership

A full-stack premium luxury car dealership platform built with React, Node.js, MongoDB, and Cloudinary.

---

## 📁 Folder Structure

```
rides-by-julius/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── carController.js
│   │   ├── inquiryController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Car.js
│   │   ├── User.js
│   │   └── Inquiry.js
│   ├── routes/
│   │   ├── carRoutes.js
│   │   ├── authRoutes.js
│   │   ├── inquiryRoutes.js
│   │   └── analyticsRoutes.js
│   ├── utils/
│   │   └── cloudinary.js
│   ├── seed.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminLayout.jsx
│   │   │   ├── cars/
│   │   │   │   ├── CarCard.jsx
│   │   │   │   ├── CarFilters.jsx
│   │   │   │   └── InquiryForm.jsx
│   │   │   └── common/
│   │   │       ├── Navbar.jsx
│   │   │       ├── Footer.jsx
│   │   │       └── WhatsAppButton.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminCars.jsx
│   │   │   │   ├── AdminCarForm.jsx
│   │   │   │   └── AdminInquiries.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── InventoryPage.jsx
│   │   │   ├── CarDetailPage.jsx
│   │   │   └── ContactPage.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── package.json
│
├── package.json       ← root monorepo scripts
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

---

### Step 1 — Clone & Install

```bash
git clone <your-repo-url>
cd rides-by-julius

# Install all dependencies at once
npm run install:all
```

Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### Step 2 — Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster.mongodb.net/rides-by-julius
JWT_SECRET=your_random_secret_min_32_chars_long_here
ADMIN_SECRET_KEY=julius_admin_secret_2024
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Get MongoDB URI:**
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the URI and replace `<password>` with your password

**Get Cloudinary credentials:**
1. Go to https://cloudinary.com and sign up
2. Dashboard → Copy Cloud Name, API Key, API Secret

---

### Step 3 — Configure Frontend Environment

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 4 — Seed the Database

```bash
cd backend
node seed.js
```

This creates:
- 6 sample luxury cars with real images
- Admin user: `admin@ridesbyjulius.com` / `Admin@Julius2024`

---

### Step 5 — Run Development Servers

**Option A — Run both together (from root):**
```bash
npm install        # installs concurrently
npm run dev
```

**Option B — Run separately:**
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open: http://localhost:5173
Admin: http://localhost:5173/admin/login

---

## 🔐 Admin Setup

### Register a new admin (via API):
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Julius",
    "email": "julius@ridesbyjulius.com",
    "password": "yourpassword",
    "secretKey": "julius_admin_secret_2024"
  }'
```

The `secretKey` must match `ADMIN_SECRET_KEY` in your `.env`.

---

## 🌐 API Routes

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | No | Admin login |
| POST | `/api/auth/register` | No | Register admin (needs secret key) |
| GET | `/api/auth/me` | Yes | Get current user |

### Cars
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/cars` | No | Get all cars (with filters & pagination) |
| GET | `/api/cars/featured` | No | Get featured cars |
| GET | `/api/cars/brands` | No | Get all brands |
| GET | `/api/cars/:id` | No | Get single car |
| POST | `/api/cars` | Admin | Create car (multipart) |
| PUT | `/api/cars/:id` | Admin | Update car |
| DELETE | `/api/cars/:id` | Admin | Delete car |

#### Query params for GET /api/cars:
```
?search=porsche
&brand=BMW
&bodyType=suv
&condition=new
&minPrice=5000000
&maxPrice=20000000
&sort=price-desc       (newest, oldest, price-asc, price-desc)
&page=1
&limit=12
```

### Inquiries
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/inquiries` | No | Submit inquiry |
| GET | `/api/inquiries` | Admin | Get all inquiries |
| PATCH | `/api/inquiries/:id/status` | Admin | Update status |

### Analytics
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/analytics/dashboard` | Admin | Dashboard stats |

---

## 🗄️ Database Schema

### Car
```js
{
  name, brand, model, year, price, mileage,
  condition: ['new', 'used', 'certified'],
  transmission: ['automatic', 'manual', 'semi-automatic'],
  fuelType: ['petrol', 'diesel', 'electric', 'hybrid'],
  bodyType: ['sedan', 'suv', 'coupe', 'convertible', 'wagon', 'truck', 'van'],
  color, engineSize, horsepower, topSpeed, acceleration,
  description, features: [String],
  images: [{ url, publicId }],
  isFeatured, isAvailable,
  views, inquiries,
  createdAt, updatedAt
}
```

### User (Admin)
```js
{
  name, email, password (bcrypt),
  role: ['admin', 'superadmin'],
  lastLogin, createdAt
}
```

### Inquiry
```js
{
  car (ref), carName, name, email, phone, message,
  type: ['inquiry', 'test_drive'],
  preferredDate,
  status: ['new', 'contacted', 'closed'],
  createdAt
}
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | Gold (#d4a017) |
| Background | #030303 |
| Glass | rgba(255,255,255,0.03) + backdrop-blur |
| Font Display | Cormorant Garamond |
| Font Body | Outfit |
| Font Mono | DM Mono |

---

## 🚀 Deployment

### Backend — Railway / Render

1. Push backend folder to GitHub
2. On Railway: New Project → Deploy from GitHub
3. Add all environment variables from `.env`
4. Railway auto-detects Node.js and runs `npm start`

**Or Render:**
1. New Web Service → Connect GitHub repo
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all env variables

### Frontend — Vercel

1. Push frontend folder to GitHub (or the whole monorepo)
2. On Vercel: New Project → Import from GitHub
3. Set root directory to `frontend`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```
5. Deploy — Vercel auto-detects Vite

### Update CORS after deploy

In `backend/.env` update:
```env
CLIENT_URL=https://your-vercel-app.vercel.app
```

---

## 🔧 Customization

### Change WhatsApp number
Search for `254700000000` in the codebase and replace with your number (include country code, no `+`).

### Change dealership details
- Location, email, phone: `frontend/src/components/common/Footer.jsx`
- WhatsApp CTA: `frontend/src/components/common/WhatsAppButton.jsx`
- Contact page: `frontend/src/pages/ContactPage.jsx`

### Change currency
Search for `KES` / `en-KE` and replace with your locale and currency code.

### Add more car images to seed
Edit `backend/seed.js` and add Cloudinary URLs or Unsplash links to the `images` arrays.

---

## 🛡️ Security Features

- JWT authentication with 7-day expiry
- bcrypt password hashing (12 rounds)
- Rate limiting (100 req/15min per IP)
- Admin-secret-key protected registration
- Protected admin routes (frontend + backend)
- CORS restricted to your client URL
- File size limit: 10MB per image
- File type validation: jpg, jpeg, png, webp only

---

## 📱 Features Summary

### Public Site
- ✅ Cinematic hero section with parallax feel
- ✅ Featured cars carousel
- ✅ Full inventory with search & filters
- ✅ Car detail pages with image gallery
- ✅ Inquiry & test drive booking forms
- ✅ WhatsApp floating button
- ✅ Responsive mobile layout
- ✅ Glassmorphism dark UI
- ✅ Framer Motion animations
- ✅ Gold/black luxury theme

### Admin Dashboard
- ✅ Secure JWT login
- ✅ Dashboard with analytics & charts
- ✅ Add / Edit / Delete cars
- ✅ Multi-image upload via Cloudinary
- ✅ Toggle featured / available status
- ✅ View & manage all inquiries
- ✅ Update inquiry status (new → contacted → closed)
- ✅ WhatsApp reply button per inquiry
- ✅ Brand distribution bar chart
- ✅ Top viewed cars leaderboard

---

## 🐛 Troubleshooting

**MongoDB connection fails:**
- Whitelist your IP in MongoDB Atlas → Network Access → Add IP Address → `0.0.0.0/0`

**Images not uploading:**
- Check Cloudinary credentials in `.env`
- Ensure `rides-by-julius` folder exists or Cloudinary will create it automatically

**CORS errors:**
- Make sure `CLIENT_URL` in backend `.env` exactly matches your frontend URL (no trailing slash)

**Admin login fails:**
- Run `node seed.js` to create the admin user
- Or register via the API with your `ADMIN_SECRET_KEY`
