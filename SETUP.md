# Kosovo Build Hub - Setup & Deployment Guide

## Overview

This is a full-stack listing platform with authentication, role-based access (Admin/Agent/Client), and WhatsApp integration. The frontend is built with React + Vite, and the backend is Node.js + Express + MongoDB.

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router v6
- TanStack Query
- React Hook Form + Zod validation

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB (with Mongoose)
- JWT Authentication
- bcrypt for password hashing

---

## Prerequisites

- Node.js v18+ (or Bun)
- MongoDB Atlas account (or local MongoDB)
- Git

---

## Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install
# or with bun:
bun install
```

### 2. Environment Configuration

Create a `.env` file in the `server/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# MongoDB Connection String from Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kosovo-build-hub?retryWrites=true&w=majority

# JWT Secret - Generate a strong random string
JWT_SECRET=your_very_secure_random_string_here_minimum_32_characters

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Create MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create a database user (Database Access)
4. Add IP address to Network Access
5. Copy the connection string into `.env`

### 4. Seed Sample Data

```bash
npm run seed
# or with bun:
bun run seed
```

This creates:
- 1 Admin user (admin@kosovobuild.com / Admin123)
- 2 Agent users
- 2 Client users
- 9 sample listings (3 Parcels, 3 Contractors, 3 Materials)

### 5. Start Backend Server

```bash
npm run dev
# or:
bun run dev
```

Server runs on `http://localhost:5000`

---

## Frontend Setup

### 1. Install Dependencies

```bash
npm install
# or with bun:
bun install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

The default is already set to `http://localhost:5000` for local development.

### 3. Start Development Server

```bash
npm run dev
# or:
bun run dev
```

App runs on `http://localhost:5173`

---

## Usage

### Admin Account (for testing)

**Login Credentials:**
- Email: `admin@kosovobuild.com`
- Password: `Admin123`

**Access:** http://localhost:5173/admin/dashboard

**Features:**
- View all users and statistics
- Approve agent accounts
- Change user roles
- Delete users

### Agent Account (for testing)

**Login Credentials:**
- Email: `agent1@kosovobuild.com`
- Password: `Agent123`

**Access:** http://localhost:5173/agent/dashboard

**Features:**
- Create/edit/delete listings
- View analytics (views, inquiries)
- Track listing performance

### Client Account (for testing)

**Login Credentials:**
- Email: `client1@kosovobuild.com`
- Password: `Client123`

**Features:**
- Browse all listings
- View listing details
- Contact agents via WhatsApp

---

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Listings (Public)

- `GET /api/listings` - Get all listings (with filters & pagination)
- `GET /api/listings/:id` - Get single listing
- `PATCH /api/listings/:id/inquiries` - Track inquiry click

### Listings (Agent Only)

- `POST /api/listings` - Create listing (agent must be approved)
- `PATCH /api/listings/:id` - Update own listing
- `DELETE /api/listings/:id` - Delete own listing

### Agent Analytics

- `GET /api/agent/my-listings` - Get agent's listings
- `GET /api/agent/stats` - Get agent statistics

### Admin Only

- `GET /api/admin/users` - Get all users (paginated)
- `PATCH /api/admin/users/:id/approve` - Approve user
- `PATCH /api/admin/users/:id/role` - Change user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get platform statistics

---

## Features Implemented

✅ **Authentication**
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin/Agent/Client)
- User approval workflow

✅ **Listings Management**
- Create, read, update, delete listings
- Three listing types: Parcels, Contractors, Materials
- Polymorphic schema for flexible data modeling
- View and inquiry tracking

✅ **Admin Panel**
- User management dashboard
- User approval system
- Role assignment
- Platform statistics and analytics

✅ **Agent Dashboard**
- Personal listing management
- Performance analytics (views, inquiries)
- Quick listing creation
- Listing edit/delete functionality

✅ **WhatsApp Integration**
- Pre-filled messages with listing details
- Agent WhatsApp number in listings
- Floating WhatsApp button on detail pages
- Inquiry tracking on message click

✅ **Responsive Design**
- Mobile-friendly UI
- Tailwind CSS responsive classes
- shadcn/ui components

---

## Deployment

### Backend Deployment (Heroku / Railway)

**Option 1: Heroku**

```bash
# Install Heroku CLI, then:
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```

**Option 2: Railway.app**

1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Add MongoDB Atlas URI as environment variable
4. Deploy

### Frontend Deployment (Vercel / Netlify)

**Option 1: Vercel**

```bash
npm install -g vercel
vercel
# Follow prompts, set VITE_API_URL to your deployed backend
```

**Option 2: Netlify**

```bash
npm run build
# Drag dist/ folder to Netlify
```

Set `VITE_API_URL` environment variable to your backend URL.

---

## Common Issues & Troubleshooting

### "Cannot GET /api/auth/login"

- Backend server not running on port 5000
- Check `FRONTEND_URL` in backend `.env`

### "Token not provided" when accessing admin panel

- Make sure you're logged in (check localStorage for `auth_token`)
- Token might be expired - log out and log back in

### Listings not showing

- MongoDB connection failed - check `MONGODB_URI` in `.env`
- Run seed script: `npm run seed`
- Check if listing type is "active" in database

### WhatsApp button not working

- Agent doesn't have `whatsappNumber` set in database
- Try editing listing in agent dashboard to add WhatsApp number

### CORS errors

- Backend `FRONTEND_URL` doesn't match frontend origin
- Update `.env` with correct frontend URL

---

## Database Schema

### User Collection

```typescript
{
  email: string (unique)
  password: string (hashed)
  fullName: string
  role: "Admin" | "Agent" | "Client"
  companyName?: string
  whatsappNumber?: string (for agents)
  isApproved: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Listing Collection

```typescript
{
  userId: ObjectId (ref: User)
  title: string
  description?: string
  image?: string
  location: string
  price: number
  type: "Parcel" | "Contractor" | "Material"
  status: "active" | "inactive" | "deleted"
  views: number
  inquiries: number
  
  // Parcel fields
  area?: number
  parcelType?: "Industriale" | "Rezidenciale" | "Komerciale"
  
  // Contractor fields
  specialty?: string
  rating?: number
  projects?: number
  
  // Material fields
  category?: string
  supplier?: string
  unit?: string
  
  createdAt: Date
  updatedAt: Date
}
```

---

## Next Steps / Future Enhancements

- [ ] Email notifications for inquiries
- [ ] Payment integration for premium listings
- [ ] Image upload to Cloudinary
- [ ] Advanced analytics dashboard
- [ ] Favorites/saved listings for clients
- [ ] Messaging history between agents and clients
- [ ] Search filters with autocomplete
- [ ] User profile pages
- [ ] Ratings and reviews system
- [ ] Email verification
- [ ] Two-factor authentication

---

## Support

For issues or questions, check:
1. Backend logs on terminal
2. Browser console (F12)
3. Network tab in DevTools
4. MongoDB Atlas connection status

---

## License

MIT License - Feel free to modify and distribute.
