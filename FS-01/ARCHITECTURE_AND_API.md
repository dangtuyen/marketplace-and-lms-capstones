# 🗺️ vendorHub — System Architecture & API Specification Log

This document provides a comprehensive overview of the technical system coupling architectures, microservices data pathways, database mapping entities, and production-ready Express API contract layer details.

---

## 🏗️ 1. System Architecture Diagram

Below is the clean data lifecycle flow showing how the React Client UI layers communicate simultaneously with the Node.js Express Application Server, the temporary Redis Cart Cache tier, and cloud persistence instances.

```text
       +-----------------------------------------------------------------+

       |                    1. React Client UI Frontend                  |
       |        (Storefront, Vendor Dashboard, Cart & Admin Views)       |
       +-----------------------------------------------------------------+

            |                           |                           |
    (Auth / Product CRUD)      (Cart Sync Stream)           (Stripe Handshake)

            |                           |                           |
            v                           v                           v
+------------------------------------------------------------------------+

|                    2. Node.js Express Back-End API Server              |
|              [ JWT Authentication & Middleware Control Gates ]         |
+------------------------------------------------------------------------+

       |                        |                        |
(Persistent Storage)     (Session Cache Stream)    (Cloud Object Storage API)

       |                        |                        |
       v                        v                        v
+--------------+         +--------------+         +----------------------+

|  MongoDB     |         |  Redis       |         |  Supabase Cloud      |
|  Atlas Core  |         |  Cloud Tier  |         |  Object Storage      |
|  [Database]  |         |  [Cart Data] |         |  [CDN Assets Bucket] |
+--------------+         +--------------+         +----------------------+
       |
       | (Connect Account Clearing Transfers)
       v
+------------------------------------------------------------------------+

|                    3. Stripe Payment Gateway Engine                     |
|           [ Dynamic Connect Split/Standalone Sandbox Intents ]         |
+------------------------------------------------------------------------+
```

### 🔁 Core Technical Interaction Lifecycles:
*   **Decentralized Client Viewport Blocks:** Browser components push file images through Multer memory storage buffers directly to public buckets on **Supabase Storage** via the AWS S3 SDK architecture.
*   **Low-Latency Basket Handshakes:** Incremental cart mutations query **Redis cache strings** with a strict 7-day Time-To-Live (TTL) expiration barrier, shielding the main database cluster from rapid write transactions.
*   **Modern Payment Resilience:** The API creates intent hooks via Stripe’s dynamic `automatic_payment_methods` configuration engine to bypass dashboard validation constraints.
*   **Vendor Order Fulfillment:** Vendors query `GET /api/orders` to view purchases of their `vendorId` items, track 90% net payouts, and advance order states (`placed` -> `packed` -> `shipped` -> `delivered`).

---

## 📄 2. API Endpoint Documentation

### 🔒 Core Authentication Requirements:
Routes tagged with `[🔒 Auth Required]` require a valid JSON Web Token passed inside the HTTP Request Header:
`Authorization: Bearer <your_jwt_token_payload_string>`

---

### 🔐 Group A: Authentication & Onboarding

#### 1. [POST] Register & Login
*   **Endpoints:** `/api/auth/signup` (Register) & `/api/auth/login` (Authenticate)
*   **Payload Schema (JSON):** `{ "name": "Hoa Son", "email": "hoason@gmail.com", "password": "Password123!", "role": "vendor" }`
*   **Success Response (200 / 201):** `{ "token": "eyJhbGciOiJIUzI1Ni...", "user": { "id": "6af9825d96a5a15928cf7f02", "role": "vendor" } }`

---

### 📦 Group B: Products & Inventory Operations

#### 1. [GET] Fetch Products Catalog (Public or Vendor-Scoped)
*   **Endpoint:** `/api/products`
*   **Authentication:** Optional (When authenticated as `vendor`, automatically filters by `vendorId`)
*   **Query Strings Optional Matrix:** `search`, `minPrice`, `maxPrice`, `sort` (`price_asc`, `price_desc`)
*   **Success Response (200 OK):**
    ```json
    [
      {
        "_id": "6af986ba9a1792c1a227deab",
        "name": "Iphone 22",
        "price": 2000,
        "description": "Iphone 22",
        "image": "https://[id].supabase.co/storage/v1/object/public/vendorhub-bucket/products/image.jpg",
        "vendorId": "6af9825d96a5a15928cf7f02",
        "stripeConnectId": "acct_1NJxTestAccount"
      }
    ]
    ```

#### 2. [POST] Create New Inventory Listing [🔒 Auth Required]
*   **Endpoint:** `/api/products` (`multipart/form-data`: `name`, `price`, `description`, `image`)
*   **Success Response (201 Created):**
    ```json
    {
      "message": "Product with cloud image listed successfully!",
      "product": { "_id": "6af986ba9a1792c1a227deab", "name": "Iphone 22", "price": 2000 }
    }
    ```

#### 3. [PUT / DELETE] Update or Remove Product Listing [🔒 Auth Required]
*   **Endpoints:** `PUT /api/products/:id` (`multipart/form-data` or `JSON`) & `DELETE /api/products/:id`
*   **Success Response (200 OK):** `{ "message": "Product specifications updated / purged successfully!" }`

---

### 🛒 Group C: Redis Session Cart Management

#### 1. [GET] Retrieve Cached Shopping Basket [🔒 Auth Required]
*   **Endpoint:** `/api/cart`
*   **Success Response (200 OK):**
    ```json
    {
      "items": [
        { "productId": "6af986ba9a1792c1a227deab", "name": "Iphone 22", "price": 2000, "quantity": 1 }
      ],
      "totalPrice": 2000
    }
    ```

#### 2. [POST] Sync Cart State Mutation [🔒 Auth Required]
*   **Endpoint:** `/api/cart`
*   **Payload Schema (JSON):** `{ "productId": "6af986ba9a1792c1a227deab", "quantity": 2 }`
*   **Success Response (200 OK):** `{ "message": "Redis structural sync complete", "cart": { "items": [...], "totalPrice": 4000 } }`

---

### 💳 Group D: Checkout, Orders, Coupons & Invoices

#### 1. [POST] Validate Promo Code [🔒 Auth Required]
*   **Endpoint:** `/api/coupons/validate` — Payload: `{ "code": "WINTER10" }`
*   **Success Response (200 OK):** `{ "message": "Promo coupon value successfully authenticated.", "discountValue": 10 }`

#### 2. [POST] Initialize Secure Stripe Intent [🔒 Auth Required]
*   **Endpoint:** `/api/orders/checkout` — Payload: `{ "shippingAddress": "37 An Duong Vuong" }`
*   **Success Response (201 Created):**
    ```json
    {
      "message": "Stripe transaction intent successfully generated.",
      "clientSecret": "pi_3MtwXwLkdIwHu7ix2HgA_secret_xxxxxx",
      "orderId": "6af986d59a1792c1a227deb2"
    }
    ```

#### 3. [GET / PUT] Role-Scoped Orders & Fulfillment Status [🔒 Auth Required]
*   **Endpoints:** `GET /api/orders` (Admin: all orders; Vendor: orders containing owned `vendorId` items; Customer: own orders) & `PUT /api/orders/:orderId/status` (`{ "status": "packed" }`)
*   **Success Response (200 OK):** Returns array of `Order` records or updated status (`placed` -> `packed` -> `shipped` -> `delivered`).

#### 4. [GET] Stream Invoice Document & Admin Analytics [🔒 Auth Required]
*   **Endpoints:** `GET /api/orders/:orderId/invoice?token=<jwt_key>` (HTML invoice) & `GET /api/admin/analytics` (Platform sales & 10% commission)
