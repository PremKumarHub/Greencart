# 🛒 Greencart - Modern Grocery E-commerce Platform

Greencart is a comprehensive, full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application designed for the grocery industry. It features a modern, responsive user interface, secure authentication, product management, and integrated payment systems.

## 🌟 Key Features

- **Responsive Design**: Mobile-first, stylish UI with glassmorphism effects and modern navigation.
- **Categorized Shopping**: Browse groceries by categories like Organic Veggies, Fresh Fruits, Dairy, etc.
- **Advanced Search**: Search for products with real-time filtering.
- **Shopping Cart**: Full cart functionality with persistent storage and item count tracking.
- **Secure Authentication**: JWT-based authentication with cookie storage and high-security password hashing.
- **User Dashboard**: Manage delivery addresses and track orders.
- **Seller Panel**: Dedicated interface for sellers to manage products and view orders.
- **Payment Integration**: Stripe payment gateway integration with webhook support.
- **Image Management**: Integrated with Cloudinary for fast and reliable product image storage.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Routing**: React Router Dom 7
- **Notifications**: React Hot Toast
- **API Client**: Axios

### Backend
- **Platform**: Node.js / Express 5
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT) & Bcryptjs
- **File Uploads**: Multer & Cloudinary SDK
- **Payment**: Stripe API
- **Deployment**: Vercel ready

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB database (local or Atlas)
- Cloudinary account (for images)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Groceryatnxtdoor
   ```

2. **Setup the Server**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add the following:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

3. **Setup the Client**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd server
   npm run server
   ```

2. **Start Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```

## 📂 Project Structure

```text
Groceryatnxtdoor/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── assets/         # Images, icons, and SVGs
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state management
│   │   └── Pages/          # Main application screens
│   └── ...
└── server/                 # Express Backend
    ├── controller/         # API business logic
    ├── models/             # Database schemas
    ├── routes/             # API endpoint definitions
    ├── configs/            # Config for DB, Cloudinary, etc.
    └── middlewares/        # Custom Express middlewares
```

