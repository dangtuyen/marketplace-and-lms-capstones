# 🚀 Full-Stack MERN Capstone Projects (`FS-01` & `FS-03`)

This repository contains two complete full-stack web applications built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). Both projects are organized into clear, self-contained subfolders (`FS-01` and `FS-03`) with full source code, automated/manual QA test reports, and application screenshots while preserving complete Git commit history.

---

## 📂 Project Structure

```text
marketplace-and-lms-capstones/
├── FS-01/                                   # Capstone 1: NexMall Multi-Vendor Marketplace
│   ├── backend/                             # Express REST API, Auth, RBAC, Products & Orders
│   ├── frontend/                            # React Storefront, Cart, Vendor & Admin Dashboards
│   ├── tests/                               # API & Functional Test Cases / QA Reports
│   ├── screenshots/                         # UI & Feature Verification Screenshots
│   └── README.md                            # FS-01 Setup & Documentation
│
├── FS-03/                                   # Capstone 2: EduStream Live Learning & VOD LMS
│   ├── backend/
│   │   ├── features/                        # Auth, Courses, LiveKit WebRTC, Quizzes, Revenue
│   │   ├── middleware/                      # JWT Authentication & Role Authorization
│   │   ├── workers/                         # BullMQ + FFmpeg Asynchronous HLS Transcoding
│   │   └── server.js                        # Backend Entry Point
│   ├── frontend/
│   │   └── src/features/                    # Auth, Course Catalog, HLS Player, Live Room, Quizzes
│   ├── tests/
│   │   └── EduStream_LMS_Test_Results.xlsx  # Complete 20/20 QA Test Execution Report
│   ├── screenshots/                         # UI, Live Class, Revenue Chart & PDF Certificate Captures
│   └── README.md                            # FS-03 Setup & Documentation
│
└── README.md                                # Repository Overview & Structure (this file)
```

---

## 📦 Subfolder Overview

| Subfolder | Project Name | Key Features | Test & Proof Artifacts |
| :--- | :--- | :--- | :--- |
| **`FS-01/`** | **NexMall Marketplace** | Multi-vendor storefront, RBAC (Customer/Vendor/Admin), shopping cart, inventory & order management | `FS-01/tests/` & `FS-01/screenshots/` |
| **`FS-03/`** | **EduStream LMS** | Adaptive HLS video streaming (FFmpeg + BullMQ), LiveKit WebRTC live classes & chat, auto-graded quizzes, PDF certificates, sandbox payments & revenue ledger | `FS-03/tests/EduStream_LMS_Test_Results.xlsx` & `FS-03/screenshots/` |

---

## 📸 Screenshots & Verification

* **`FS-01/screenshots/`** — Contains captures of the NexMall storefront, product catalog, cart checkout, and vendor/admin management dashboards.
* **`FS-03/screenshots/`** — Contains captures of the EduStream course catalog, HLS video player, WebRTC live classroom with real-time chat, auto-graded quiz results, generated A4 PDF certificate, and instructor revenue ledger.

---

## 🛠️ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/dangtuyen/marketplace-and-lms-capstones.git
cd marketplace-and-lms-capstones

# 2. Run FS-01 (NexMall)
cd FS-01/vendorHubBE && npm install && npm run dev
cd FS-01/vendorHubFE && npm install && npm start

# 3. Run FS-03 (EduStream LMS)
cd FS-03/backend && npm install && npm run dev
cd FS-03/frontend && npm install && npm run dev
```
