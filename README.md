# 🌱 FARM2CITY — Direct Agri-Marketplace Platform

**FARM2CITY** is a highly modern, complete, and responsive full-stack agricultural marketplace that connects rural farmers directly with urban city customers. By eliminating intermediate middlemen, farmers maximize their crop yield returns while customers secure fresh organic produce at highly competitive rates.

---

## 🚀 Key Features & Highlights

1. **Zero-Configuration Offline Fallback Database**:
   - Features a dual-mode database engine. When started, it attempts a Mongoose connection to MongoDB. If MongoDB is offline, it automatically falls back to an in-memory/JSON-file database (`backend/data/offline_db.json`).
2. **Modern Organic Aesthetics**:
   - Responsive design with organic green theme, glassmorphic UI, smooth micro-animations, and Dark/Light Mode.
3. **Advanced Interactivity**:
   - **Speech Recognition Voice Search**: Hands-free voice crop search using HTML5 Web Speech API.
   - **Krishi AI Assistant**: Floating conversational AI assistant for farming tips and app help.
   - **Direct Logistics SVG Tracker**: Visual animated road map tracking shipments from farm to city.
   - **Role-Based Portals**: Separate dashboards for Farmers, Customers, and Admins.
   - **Ledger CSV Exporter & PDF Receipts**: Download Excel statements or print invoices directly.

---

## 🔑 Demo Credentials (Pre-seeded)

Use these credentials to test the role-specific dashboards (password for all is `password123`):

* **Farmer Portal**: `farmer@farm.com` / `password123`
* **Customer Portal**: `customer@city.com` / `password123`
* **Admin Portal**: `admin@admin.com` / `password123`

---

## 🏃‍♂️ Quick Start

```bash
# 1. Install all dependencies for root, backend, and frontend
npm run install:all

# 2. Launch backend (port 5000) and frontend (port 5173) concurrently
npm start
```

* **Frontend Client**: [http://localhost:5173/](http://localhost:5173/)
* **Backend API Server**: [http://localhost:5000/api](http://localhost:5000/api)
