# Smart Grocery — Frontend

An **Angular** single-page application for the Smart Grocery platform — a smart grocery list with admin product management, external food database integration, and personal shopping lists.

> **Backend Repository:** [smartGrocery](https://github.com/Ahmedabdelaziz77/smart-grocery)

---

## Tech Stack

| Technology | Version |
|---|---|
| Angular | 20 |
| TypeScript | 5.8 |
| Angular Material | 20 |
| Angular CDK | 20 |
| RxJS | 7.8 |
| SCSS | Styling |

---

## Features

### Authentication
- Login & Signup with form validation
- JWT token management with automatic refresh on 401 responses
- Role-based route guards (`ADMIN` / `USER`)
- Persistent sessions via session storage

### Admin Panel
- **Dashboard** — overview with total products, categories, users, recent imports, and category distribution
- **Product Import** — search the Open Food Facts database, preview results, set estimated prices, and import (single or bulk)
- **Approved Products** — browse, search, filter, and delete approved products with pagination

### User Panel
- **Grocery Browsing** — paginated list of approved products with search & category filtering
- **Product Details** — view full nutritional info (calories, protein, carbs, fat), brand, price, and image
- **Shopping List** — add products, update quantities, remove items, or clear the entire list with live total price calculation

### Architecture
- Feature-based module structure (`auth`, `admin`, `user`)
- Lazy-loaded routes for performance
- HTTP interceptor for automatic token attachment & refresh
- Angular Signals for reactive state management
- Standalone components throughout

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- Backend API running on `http://localhost:8080` (see [backend repo](https://github.com/Ahmedabdelaziz77/smart-grocery))

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
ng serve
```

The application will be available at: **http://localhost:4200**

> Make sure the backend API is running on port `8080` before starting the frontend.

---

## Project Structure

```
src/app/
├── core/                    # Shared core logic
│   ├── guards/              # Auth, guest, and role guards
│   ├── interceptors/        # JWT auth interceptor
│   ├── models/              # TypeScript interfaces
│   └── services/            # API services (auth, product, admin, shopping-list)
├── features/
│   ├── auth/                # Login & signup pages
│   ├── admin/               # Dashboard, product import, approved products
│   └── user/                # Grocery items, product detail, shopping list
├── layout/                  # Shell component (navbar, sidebar)
└── shared/                  # Shared/reusable components
```

---

## Video Demo

