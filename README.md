# 🛒 vendorHub — Multi-Vendor Marketplace Ecosystem

Welcome to **vendorHub**, a modern, high-performance multi-vendor e-commerce platform built on a scalable Node.js, Express, React, and MongoDB stack. This application leverages specialized technical infrastructures like **Redis Cloud Cache** for secure shopping baskets and **Supabase Object Storage (S3 API Compatible)** for lightning-fast decentralized image handling.

---

## ⚡ Architectural Framework Highlights

*   **Redis Session Cart Cache:** Dynamic quantity increment adjustments synchronize directly over low-latency memory caching buckets, completely bypassing database read/write strain.
*   **Supabase Storage Cluster:** Complete AWS S3 API compatibility allowing instant public assets streaming with automated layout fallbacks via deterministic DiceBear glyphs vector mapping engines.
*   **Stripe Connect Split Payouts:** Fully automated sandbox platform clearing gateways featuring automatic multi-vendor commission deductions (`automatic_payment_methods` adaptive dynamic configurations ready).
*   **Forced Viewport Bounds (No-Scroll Page Grid):** Tailored inline grid template structures restricting catalogs list frames to a strict row matrix per layout canvas view step.

---

## 🏗️ Repository Setup and Local Installation

### 📋 Prerequisites
Ensure you have the following services pre-installed on your development environment setup:
*   [Node.js (v18+)](https://nodejs.org)
*   [MongoDB Atlas Account](https://mongodb.com) or a running Local MongoDB instance.
*   [Redis Cloud Account](https://cloud.redis.io) or a running Local Redis instance.
*   [Stripe Account](https://dashboard.stripe.com)

---

### 💻 Step 1: Back-End Setup (`vendorHubBE`)

1. Move your terminal context window inside the backend module tree wrapper:
   ```bash
   cd vendorHubBE
   ```
2. Download and map the required dependencies and package binaries:
   ```bash
   npm install
   ```
3. Initialize a clean configuration environment file named `.env` inside the `vendorHubBE/` directory switches:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string_uri
   JWT_SECRET=your_secure_jwt_token_secret_hash_key
   REDIS_URL=redis://127.0.0.1:6379

   # SUPABASE OBJECT STORAGE API CREDENTIALS LAYERS
   S3_ENDPOINT=https://supabase.co
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
   cd vendorHubFE
   ```
2. Pull down the target operational components and vector iconography elements bundles:
   ```bash
   npm install
   ```
3. Initialize a clean configuration environment file named `.env` inside the `vendorHubFE/` directory switches:
   ```env
   # STRIPE TERMINAL ACCESS SCHEMAS
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_api_publishable_key
   ```
4. Boot up the local runtime compilation environment server context pipeline:
   ```bash
   npm start
   ```
5. Access the fully responsive viewport layout dashboard using your browser navigation pathways at: `http://localhost:3000`

---

## 🎯 Verification Testing Milestones Workflow

1. **Vendor panel access Onboarding Swaps:** Sign up for an account. Update the role parameter metadata string directly to `vendor` or `admin` in MongoDB Atlas collections to unlock layout dashboard manipulation links inside the main navbar.
2. **Product CRUD Multiplexers:** Go to **Add Product**, select a genuine `.jpg/.png` asset image from your computer storage drives, write your detail descriptions specs, and press upload to verify active stream synchronization to Supabase bucket folders.
3. **Checkout Validation Pipeline:** Populate items in your Redis shopping basket. Navigate to the Checkout summarize sidebar element, submit target destination credentials, and pass the standard Stripe validation test card string payload `4242 4242 4242 4242` alongside a future expiry data sequence (e.g., `12 / 29`) to complete split payments processing validations safely.
