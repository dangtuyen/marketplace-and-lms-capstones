# 🗺️ vendorHub — System Architecture & API Specification Log

This document provides a comprehensive overview of the technical system coupling architectures, microservices data pathways, database mapping entities, and production-ready Express API contract layer details.

---

## 🏗️ 1. System Architecture Diagram

Below is the clean data lifecycle flow showing how the React Client UI layers communicate simultaneously with the Node.js Express Application Server, the temporary Redis Cart Cache tier, and cloud persistence instances.

+-----------------------------------------------------------------+
|                    1. React Client UI Frontend                  |
|                (Full-Width Native Responsive Layouts)          |
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

### 🔁 Core Technical Interaction Lifecycles:
*   **Decentralized Client Viewport Blocks:** Browser components push file images through Multer memory storage buffers directly to public buckets on **Supabase Storage** via the AWS S3 SDK architecture.
*   **Low-Latency Basket Handshakes:** Incremental cart mutations query **Redis cache strings** with a strict 7-day Time-To-Live (TTL) expiration barrier, shielding the main database cluster from rapid write transactions.
*   **Modern Payment Resilience:** The API creates intent hooks via Stripe’s dynamic `automatic_payment_methods` configuration engine to bypass dashboard validation constraints.

---

## 📄 2. API Endpoint Documentation

### 🔒 Core Authentication Requirements:
Routes tagged with `[🔒 Auth Required]` require a valid JSON Web Token passed inside the HTTP Request Header:
`Authorization: Bearer <your_jwt_token_payload_string>`

---

### 📦 Group A: Products & Inventory Operations

#### 1. [GET] Fetch Public Products Catalog
*   **Endpoint:** `/api/products`
*   **Authentication:** Public Access (No Token Required)
*   **Query Strings Optional Matrix:**
    *   `search`: Filters titles and descriptions with case-insensitive Regex.
    *   `minPrice` / `maxPrice`: Restricts integer valuation borders.
    *   `sort`: Arranges data structures (`newest`, `price_asc`, `price_desc`).
*   **Success Response (200 OK):**
    ```json
    [
      {
        "_id": "64bf2e5e9c036211006f6a23",
        "name": "Samsung A16 Pro Max",
        "price": 350,
        "description": "5G unlocked smartphone with triple lens matrix.",
        "image": "https://[id].supabase.co/storage/v1/object/public/vendorhub-bucket/products/image.png",
        "vendorId": "64bf299e9c036211006f6a11",
        "stripeConnectId": "acct_1NJxTestAccount"
      }
    ]
    ```

#### 2. [POST] Create New Inventory Listing [🔒 Auth Required]
*   **Endpoint:** `/api/products`
*   **Content-Type:** `multipart/form-data`
*   **Payload Requirements (Form-Data):**
    *   `name`: String (Required)
    *   `price`: Number (Required)
    *   `description`: String (Required)
    *   `image`: Binary Image File (Optional)
*   **Success Response (201 Created):**
    ```json
    {
      "message": "Product item listed successfully along with AWS S3 asset image tracking link!",
      "product": { "_id": "64bf2e5e9c036211006f6a23", "name": "Samsung A16 Pro Max", "price": 350 }
    }
    ```

#### 3. [PUT] Mutate Existing Product Properties [🔒 Auth Required]
*   **Endpoint:** `/api/products/:id`
*   **Content-Type:** `multipart/form-data` or `application/json`
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Product description data parameters modified cleanly inside database cluster logs.",
      "product": { "_id": "64bf2e5e9c036211006f6a23", "description": "Updated warranty guidelines." }
    }
    ```

---

### 🛒 Group B: Redis Session Cart Management

#### 1. [GET] Retrieve Cached Shopping Basket [🔒 Auth Required]
*   **Endpoint:** `/api/cart`
*   **Success Response (200 OK):**
    ```json
    {
      "items": [
        { "productId": "64bf2e5e9c036211006f6a23", "name": "Samsung A16 Pro Max", "price": 350, "quantity": 2 }
      ],
      "totalPrice": 700
    }
    ```

#### 2. [POST] Sync Cart State Mutation [🔒 Auth Required]
*   **Endpoint:** `/api/cart`
*   **Payload Schema (JSON):** `{ "productId": "64bf2e5e9c036211006f6a23", "quantity": 3 }`
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Redis cart sync complete.",
      "cart": { "items": [...], "totalPrice": 1050 }
    }
    ```

---

### 💳 Group C: Checkout, Coupons & Invoices

#### 1. [POST] Validate Promo Code [🔒 Auth Required]
*   **Endpoint:** `/api/coupons/validate`
*   **Payload Schema:** `{ "code": "WINTER10" }`
*   **Success Response (200 OK):**
    ```json
    { "message": "Promo coupon value successfully authenticated against ledger limits.", "discountValue": 10 }
    ```

#### 2. [POST] Initialize Secure Stripe Intent [🔒 Auth Required]
*   **Endpoint:** `/api/orders/checkout`
*   **Payload Schema:** `{ "shippingAddress": "123 Main St, New York, NY" }`
*   **Success Response (201 Created):**
    ```json
    {
      "message": "Stripe transaction intent successfully generated.",
      "clientSecret": "pi_3MtwXwLkdIwHu7ix2HgA_secret_xxxxxx",
      "orderId": "64bf2f9f9c036211006f6a99"
    }
    ```

#### 3. [GET] Stream Invoice Document View [🔒 Auth Required]
*   **Endpoint:** `/api/orders/:orderId/invoice`
*   **Note:** Accepts Token via either standard HTTP Header or URL query parameter string (`?token=<jwt_key>`) to prevent cross-origin blank tab instantiation blocks.
*   **Success Response (200 OK):** Returns raw, clean standalone text HTML print layout rendering schemas instantly.