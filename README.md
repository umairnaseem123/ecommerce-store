# Food Store: Multi-Restaurant Ordering Platform

A full-stack MERN web app where customers browse several restaurants, order food, and track orders, while restaurant managers and an admin run the stores from their own dashboards.

**Live demo:** [PASTE VERCEL LINK HERE]

## Features

- Browse multiple restaurants with menus split into categories
- Cart and checkout for customers
- Separate role-based access: customer, restaurant manager, admin
- Manager dashboard to manage menu items and orders
- Admin panel to oversee all stores
- Seed script that creates demo stores, products and logins

## Tech Stack

- **Frontend:** React, [Tailwind / CSS: jo use hua wo likho]
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Deployment:** Vercel

## Screenshots

[Agar screenshots hain to yahan lagao: ![Home](docs/home.png)]

## Demo Logins

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@foodstore.com | Admin@123 |
| Manager (Burger Lab) | manager1@foodstore.com | Manager@123 |
| Customer | customer@foodstore.com | Customer@123 |

## Run Locally

```bash
# 1. Backend
cd backend
npm install
# create a .env file with your MongoDB connection string and other variables
node seed.js      # fills the database with demo data
npm run dev

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Project Structure

```
ecommerce-store/
├── backend/    Express API, models, seed.js
└── frontend/   React app (images in public/images)
```

## Author

Umair, built during the Auspify internship.
