# 🛒 vendorHub — Multi-Vendor Marketplace Ecosystem

Welcome to **vendorHub**, a modern, high-performance multi-vendor e-commerce platform built on a scalable Node.js, Express, React, and MongoDB stack. This application leverages specialized technical infrastructures like **Redis Cloud Cache** for secure shopping baskets and **Supabase Object Storage (S3 API Compatible)** for lightning-fast decentralized image handling.

---

## ⚡ Architectural Framework Highlights

* **Redis Session Cart Cache:** Dynamic quantity increment adjustments synchronize directly over low-latency memory caching buckets, completely bypassing database read/write strain.
* **Supabase Storage Cluster:** Complete AWS S3 API compatibility allowing instant public assets streaming with automated layout fallbacks via deterministic DiceBear glyphs vector mapping engines.
* **Stripe Connect Split Payouts:** Fully automated sandbox platform clearing gateways featuring automatic multi-vendor commission deductions (`automatic_payment_methods` adaptive dynamic configurations ready).
* **Vendor Store Dashboard & Order Fulfillment:** Dedicated vendor workspace displaying gross sales revenue, 90% net payouts, active listings, and real-time order fulfillment controls (`Pack` -> `Ship` -> `Deliver` + PDF Invoice).
* **Forced Viewport Bounds (No-Scroll Page Grid):** Tailored inline grid template structures restricting catalogs list frames to a strict row matrix per layout canvas view step.

---

## 📂 Project Structure

```text
FS-01/
├── vendorHubBE/
│   ├── controllers/        # Product & business logic controllers
│   ├── middleware/         # JWT authentication, RBAC & Supabase S3 upload handlers
│   ├── models/             # MongoDB schemas (User, Product, Order, Coupon)
│   ├── routes/             # Auth, Products, Cart/Orders (Stripe) & Admin analytics routes
│   ├── tests/              # Automated Backend Unit & API Tests (node:test + Supertest)
│   ├── redisClient.js      # Redis Cloud / local cache client
│   └── server.js           # Express application entry point
├── vendorHubFE/
│   ├── src/
│   │   ├── pages/          # Products, ProductDetail, Cart, Login, SignUp, VendorDashboard, AddProduct, ManageProducts, Admin
│   │   ├── App.js          # Global state routing, Navbar & 2-hour session timeout guard
│   │   └── index.css       # Global design tokens & responsive layout rules
│   └── tests/              # Automated Frontend Component Unit Tests (Jest + React Testing Library)
└── screenshots/            # Verified UI, Stripe Checkout, Vendor Dashboard & Admin Captures
```

---

## 🏗️ Repository Setup and Local Installation

### Clone the Repository
```bash
git clone https://github.com
cd marketplace-and-lms-capstones
```

### 📋 Prerequisites
Ensure you have the following services pre-installed on your development environment setup:
* [Node.js (v18+)](https://nodejs.org)
* [MongoDB Atlas Account](https://mongodb.com) or a running Local MongoDB instance.
* [Redis Cloud Account](https://redis.io) or a running Local Redis instance.
* [Stripe Account](https://stripe.com)

---

### 💻 Step 1: Back-End Setup (`vendorHubBE`)

1. Move your terminal context window inside the backend module tree wrapper:
   ```bash
   cd FS-01/vendorHubBE
   ```
2. Download and map the required dependencies and package binaries:
   ```bash
   npm install
   ```
3. Initialize a clean configuration environment file named `.env` inside the `vendorHubBE/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb.net_atlas_connection_string_uri
   JWT_SECRET=your_secure_jwt_token_secret_hash_key
   REDIS_URL=your_redis.io_connection_string_uri

   # SUPABASE OBJECT STORAGE API CREDENTIALS LAYERS
   S3_ENDPOINT=your_supabase.co_url
   S3_BUCKET_NAME=vendorhub-bucket
   S3_ACCESS_KEY=your_supabase_s3_access_key_token
   S3_SECRET_KEY=your_supabase_s3_secret_access_token
   S3_REGION=ap-southeast-1

   # STRIPE TERMINAL ACCESS SCHEMAS
   STRIPE_SECRET_KEY=your_stripe_api_secret_test_key
   PLATFORM_COMMISSION_FEE=10
   ```
4. Fire up the development environment cluster connection instance pipelines:
   ```bash
   npm run dev
   ```

---

### 💻 Step 2: Front-End UI Setup (`vendorHubFE`)

1. Open a new discrete terminal screen block and head over to the client dashboard asset tree branches:
   ```bash
   cd FS-01/vendorHubFE
   ```
2. Pull down the target operational components and vector iconography elements bundles:
   ```bash
   npm install
   ```
3. Initialize a clean configuration environment file named `.env` inside the `vendorHubFE/` directory:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:5000
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_api_publishable_key
   ```
4. Boot up the local runtime compilation environment server context pipeline:
   ```bash
   npm start
   ```
5. Access the fully responsive viewport layout dashboard using your browser navigation pathways at: `http://localhost:3000`

---

## ✅ Automated Unit & Integration Testing

### 1. Running Backend Unit Tests (`node:test` + `Supertest`)
Ensure **MongoDB** and **Redis** are running, then execute the backend API test suite from `vendorHubBE/`:

```bash
cd FS-01/vendorHubBE
npm test
```

### 2. Running Frontend Component Tests (`Jest` + `React Testing Library`)
Execute the frontend component and UI test suite from `vendorHubFE/`:

```bash
cd FS-01/vendorHubFE
npm test
```

---

## 🎯 Verification Testing Milestones Workflow

1. **Vendor Panel Access Onboarding:** Sign up for an account with the `vendor` role (or update the role parameter to `vendor` or `admin` in MongoDB Atlas) to unlock **Dashboard**, **+ Add Product**, and **Manage Product** links inside the main navbar.
2. **Product CRUD & S3 Storage:** Go to **Add Product**, select a genuine `.jpg/.png` asset image from your computer, enter product details, and submit to verify upload synchronization to Supabase S3 storage.
3. **Checkout Validation Pipeline:** Add items to your Redis shopping basket, proceed to Checkout, enter a shipping address, and complete payment using the Stripe test card `4242 4242 4242 4242` with any future expiry date (e.g., `12 / 29`).
4. **Vendor Store Dashboard & Order Fulfillment:** Log in as the vendor, open **Dashboard**, and verify gross sales, 90% net payout calculations, order status transitions (`Pack`, `Ship`, `Deliver`), and PDF invoice generation.
