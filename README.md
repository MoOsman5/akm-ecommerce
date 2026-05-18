# AKM E-Commerce Platform

A full-stack e-commerce platform for the **AKM** clothing brand, featuring a customer storefront and admin dashboard.

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | Next.js 14, React 18, TailwindCSS 3, TypeScript, Zustand |
| Backend  | NestJS 10, MongoDB, Mongoose, JWT, Swagger |
| Images   | Cloudinary (URLs stored in DB)          |

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a remote URI)

### 1. Backend
```bash
cd akm-backend
cp .env.example .env      # Edit with your MongoDB URI & Cloudinary keys
npm install
npm run seed               # Seed demo data
npm run start:dev          # http://localhost:5000
```

**Swagger docs:** http://localhost:5000/api/docs

### 2. Frontend
```bash
cd akm-frontend
cp .env.local.example .env.local   # Set API URL
npm install
npm run dev                # http://localhost:3000
```

---

## Demo Credentials

| Role     | Email              | Password   |
|----------|--------------------|------------|
| Admin    | admin@akm.com      | Admin123!  |
| Customer | customer@akm.com   | User123!   |

---

## Project Structure

```
AKM ecommerce/
├── akm-backend/           # NestJS API
│   └── src/
│       ├── auth/          # JWT authentication
│       ├── users/         # User management
│       ├── products/      # Product CRUD + variants
│       ├── categories/    # Category CRUD
│       ├── cart/          # Cart management
│       ├── orders/        # Order lifecycle
│       ├── coupons/       # Discount codes
│       ├── admin/         # Dashboard + banners
│       ├── upload/        # Cloudinary integration
│       ├── seed/          # Database seeder
│       └── common/        # Guards, decorators
├── akm-frontend/          # Next.js App
│   └── src/
│       ├── app/
│       │   ├── (store)/   # Customer pages
│       │   ├── admin/     # Admin dashboard
│       │   ├── auth/      # Login/Register
│       │   └── account/   # User account
│       ├── components/    # Reusable UI
│       ├── store/         # Zustand stores
│       └── lib/           # API client
├── shared/                # Shared types
└── docs/                  # Documentation
```

---

## API Endpoints

### Auth
| Method | Endpoint           | Description     |
|--------|-------------------|-----------------|
| POST   | /api/auth/register | Register user  |
| POST   | /api/auth/login    | Login          |
| GET    | /api/auth/profile  | Get profile    |

### Products
| Method | Endpoint                    | Description       |
|--------|----------------------------|--------------------|
| GET    | /api/products              | List (paginated)   |
| GET    | /api/products/featured     | Featured products  |
| GET    | /api/products/new-arrivals | New arrivals       |
| GET    | /api/products/:slug        | Get by slug        |
| POST   | /api/products              | Create (admin)     |
| PATCH  | /api/products/:id          | Update (admin)     |
| DELETE | /api/products/:id          | Delete (admin)     |

### Categories
| Method | Endpoint              | Description    |
|--------|-----------------------|----------------|
| GET    | /api/categories       | Active list    |
| GET    | /api/categories/all   | All (admin)    |
| POST   | /api/categories       | Create (admin) |
| PATCH  | /api/categories/:id   | Update (admin) |
| DELETE | /api/categories/:id   | Delete (admin) |

### Cart
| Method | Endpoint              | Description    |
|--------|-----------------------|----------------|
| GET    | /api/cart              | Get cart       |
| POST   | /api/cart/items        | Add item       |
| PATCH  | /api/cart/items/:id    | Update qty     |
| DELETE | /api/cart/items/:id    | Remove item    |
| DELETE | /api/cart              | Clear cart     |

### Orders
| Method | Endpoint                 | Description      |
|--------|--------------------------|------------------|
| POST   | /api/orders              | Place order      |
| GET    | /api/orders/my-orders    | My orders        |
| GET    | /api/orders              | All orders (admin)|
| GET    | /api/orders/:id          | Order detail     |
| PATCH  | /api/orders/:id/status   | Update status    |
| PATCH  | /api/orders/:id/cancel   | Cancel           |

### Coupons
| Method | Endpoint              | Description    |
|--------|-----------------------|----------------|
| POST   | /api/coupons/validate | Validate code  |
| GET    | /api/coupons          | All (admin)    |
| POST   | /api/coupons          | Create (admin) |
| PATCH  | /api/coupons/:id      | Update (admin) |
| DELETE | /api/coupons/:id      | Delete (admin) |

### Admin
| Method | Endpoint                  | Description       |
|--------|---------------------------|-------------------|
| GET    | /api/admin/dashboard      | Analytics data    |
| GET    | /api/admin/banners        | List banners      |
| POST   | /api/admin/banners        | Create banner     |
| PATCH  | /api/admin/banners/:id    | Update banner     |
| DELETE | /api/admin/banners/:id    | Delete banner     |

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/akm-ecommerce
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import project in Vercel → set root to `akm-frontend`
3. Add `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

### Backend
- **Railway/Render**: Deploy `akm-backend` folder
- **Docker**: Add a Dockerfile and deploy to any container service
- Set all env variables in the platform settings
