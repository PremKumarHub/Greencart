# Groceryatnxtdoor Project Documentation

This document is a complete, beginner-friendly guide for the Groceryatnxtdoor project. It explains what the app does, how it is structured, how to run it locally, and how to explain it confidently in interviews.

---

## 1. Project Overview

Groceryatnxtdoor is a full-stack grocery e-commerce project built with the MERN stack.

It allows users to:
- browse grocery products
- search and filter products by category
- add items to a cart
- place orders using COD or Stripe
- save delivery addresses
- subscribe to a newsletter

It also includes a seller/admin area where sellers can:
- log in securely
- add products
- upload product images
- manage stock availability
- view incoming orders

This project is a great example of a real-world full-stack application with authentication, cart logic, payments, file upload, and protected routes.

---

## 2. What This Project Is About

Think of this project as a mini online grocery store.

The app is divided into two main parts:
- Frontend: a React app for customers and sellers
- Backend: an Express server connected to MongoDB

The system handles:
- user registration and login
- product listing and details
- cart operations
- checkout and order creation
- seller management
- image storage through Cloudinary
- email notifications

---

## 3. Main Features

### Customer Features
- Home page with banners and featured products
- Product listing page
- Category-based product pages
- Product detail page
- Shopping cart with quantity controls
- User authentication with protected routes
- Address management
- Order history
- COD and Stripe-based checkout
- Newsletter subscription with email confirmation

### Seller Features
- Seller login
- Product upload form
- Image upload support
- Stock toggle for products
- Order viewing dashboard

---

## 4. Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- React Hot Toast
- Tailwind CSS

### Backend
- Node.js
- Express 5
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- Cloudinary for image storage
- Stripe for payments
- Nodemailer for emails

---

## 5. Project Structure

```text
Groceryatnxtdoor/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── Pages/           # Pages like Home, Cart, Orders, ProductDetails
│   │   ├── context/         # Global context for app state
│   │   └── assets/          # Images and static UI assets
│   └── package.json
├── server/                  # Express backend
│   ├── controller/          # Business logic for users, orders, products, cart
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── configs/             # DB, Cloudinary, multer, nodemailer setup
│   └── server.js            # Main server entry file
└── README.md
```

---

## 6. How the App Works

### User Flow
1. User opens the website.
2. User browses products from the home page or product pages.
3. User adds products to the cart.
4. User logs in or registers if needed.
5. User selects an address and places an order.
6. The backend creates an order and updates the database.
7. If Stripe is used, the customer is redirected to a payment session.
8. The order is confirmed and shown in the orders page.

### Seller Flow
1. Seller logs in.
2. Seller uploads a new product with images.
3. Backend uploads the images to Cloudinary.
4. Product is stored in MongoDB.
5. Seller can view customer orders and update stock.

---

## 7. Backend Architecture

The backend is built in Express and is organized by feature.

### Main backend folders
- controller/: contains logic for user registration, auth, cart, orders, products, seller actions
- models/: defines the MongoDB structure
- routes/: exposes API endpoints
- configs/: handles database connection, cloudinary setup, multer, and nodemailer

### Main server entry
The main server is located in [server/server.js](server/server.js).

It:
- connects to MongoDB
- connects to Cloudinary
- sets up CORS and cookies
- mounts all route files
- handles errors gracefully

---

## 8. Frontend Architecture

The frontend uses React with a global context provider.

### Core frontend files
- [client/src/App.jsx](client/src/App.jsx): main app router and page layout
- [client/src/context/AppContex.jsx](client/src/context/AppContex.jsx): shared state for user, products, cart, search, and seller status
- [client/src/Pages/Home.jsx](client/src/Pages/Home.jsx): landing page
- [client/src/Pages/Cart.jsx](client/src/Pages/Cart.jsx): cart and checkout UI
- [client/src/Pages/MyOrders.jsx](client/src/Pages/MyOrders.jsx): order history page
- [client/src/Pages/seller/AddProduct.jsx](client/src/Pages/seller/AddProduct.jsx): seller product upload page

### State Management
The app uses React Context instead of a heavy external state library. This keeps the app simple and makes it easier to share data across components.

The context stores:
- logged-in user
- seller state
- cart items
- product list
- search term
- auth loading status

---

## 9. Database Design

The app uses MongoDB with Mongoose schemas.

### Main Models
- User: stores name, email, password hash, and cart items
- Product: stores product details, price, images, category, and stock status
- Address: stores delivery address information for each user
- Order: stores items, amount, address, status, payment type, and payment status

### Relationships
- A user can have many addresses.
- A user can place many orders.
- An order contains multiple products.
- Each product can appear in many orders.

---

## 10. Authentication and Security

The project uses JWT-based authentication.

### How auth works
1. User logs in.
2. The server creates a JWT.
3. The token is stored in an HTTP-only cookie.
4. The frontend sends the cookie with future requests.
5. Protected routes verify the token.

### Why this is good
- avoids storing sensitive tokens in plain JavaScript storage
- improves protection against XSS-related token theft
- works well for a real-world web app

---

## 11. Payment and Order Flow

### COD Flow
- user adds items to cart
- user places order with COD
- server recalculates the total from the database
- order is saved
- cart is cleared

### Stripe Flow
- user selects Stripe checkout
- server creates a Stripe checkout session
- user completes payment on Stripe
- Stripe sends a webhook to the backend
- backend confirms payment and updates the order

This is a strong interview topic because it shows real backend logic and integration with third-party services.

---

## 12. File Upload and Media Handling

Product images are uploaded using Multer and then sent to Cloudinary.

### Why this matters
- images are stored outside the server filesystem
- the app can serve media faster and more reliably
- the project demonstrates cloud-based media handling

---

## 13. Email and Newsletter Flow

The app includes a newsletter subscription feature.

When a user subscribes:
- the backend validates the email
- a mail transporter is created
- a confirmation email is sent through Nodemailer

This shows integration with SMTP and real user communication features.

---

## 14. Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB running or available through MongoDB Atlas
- Cloudinary account
- Stripe account
- SMTP email setup

### 1. Clone the project
```bash
git clone <your-repo-url>
cd Groceryatnxtdoor
```

### 2. Install backend dependencies
```bash
cd server
npm install
```

### 3. Create backend environment file
Create a file named .env inside the server folder with values like:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SENDER_EMAIL=your_sender_email
CLIENT_URL=http://localhost:5173
```

### 4. Install frontend dependencies
```bash
cd ../client
npm install
```

### 5. Create frontend environment file
Create a file named .env inside the client folder:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=₹
```

### 6. Run the app
```bash
cd ../server
npm run server
```

In another terminal:
```bash
cd ../client
npm run dev
```

---

## 15. Important API Endpoints

### User APIs
- POST /api/user/register
- POST /api/user/login
- GET /api/user/is-auth
- POST /api/user/logout
- POST /api/user/subscribe

### Product APIs
- GET /api/product/list
- GET /api/product/:id
- POST /api/product/add

### Cart APIs
- POST /api/cart/update

### Address APIs
- POST /api/address/add
- POST /api/address/get

### Order APIs
- POST /api/order/cod
- POST /api/order/stripe
- GET /api/order/get
- GET /api/order/user
- POST /api/order/stripe/webhook

---

## 16. Interview Preparation Notes

If you are asked, “Tell me about your project,” you can say:

> I built a full-stack grocery e-commerce application using the MERN stack. The app allows customers to browse products, add them to a cart, save addresses, and place orders using COD or Stripe. On the backend, I implemented authentication using JWT and cookies, connected MongoDB through Mongoose, uploaded product images to Cloudinary, and handled order and payment workflows. I also built a seller dashboard for product and order management.

### Good technical talking points
- full-stack architecture
- React Context for state management
- protected routes and JWT cookies
- MongoDB models and REST APIs
- Stripe payment integration
- Cloudinary image upload
- email notifications through Nodemailer

### Common interview questions

#### Q1. Why did you use React Context?
Because it keeps shared app state such as cart, user authentication, and product data in one place without heavy prop drilling.

#### Q2. Why are JWTs stored in cookies?
Cookies help keep tokens out of client-side JavaScript access and improve security.

#### Q3. How did you prevent price tampering?
The server recalculates the product total from the database before creating the order instead of trusting the frontend amount.

#### Q4. What is the role of Stripe webhooks?
Webhooks confirm successful payment and allow the backend to update the order and clear the cart.

#### Q5. What is the seller dashboard for?
It gives sellers a simple way to add products, manage image uploads, toggle stock, and view orders.

---

## 17. What a Beginner Should Learn From This Project

If you are new to development, this project teaches you:
- how frontend and backend connect
- how REST APIs work
- how MongoDB documents are structured
- how authentication works in real applications
- how third-party services like Stripe and Cloudinary are integrated
- how to organize a medium-sized project in a professional way

---

## 18. Final Summary

Groceryatnxtdoor is a strong portfolio project because it combines many important features found in real-world applications:
- user auth
- product management
- cart handling
- orders and checkout
- payments
- file uploads
- admin/seller functionality

It is not just a demo project. It shows how a modern web application is built from the frontend UI to the backend database and third-party integrations.

│   ├── MyOrders.jsx (Real-time order timeline tracking, status badges)
│   ├── Loading.jsx (Stripe checkout redirect spinner / order completion poll)
│   │
│   └── Seller Portal (/seller)
│       ├── SellerLogin.jsx (Seller credentials form)
│       └── SellerLayout.jsx (Seller sidebar navigation)
│           ├── AddProduct.jsx (Multi-file uploader, dynamic pricing & description array)
│           ├── ProductList.jsx (Inventory table with live stock toggle switch)
│           └── Orders.jsx (Customer order fulfillment list with address details)
│
└── Footer.jsx (Brand info, quick links, copyright notices)
```

---

## 🔄 6. Core Technical Workflows (Step-by-Step)

### A. Persistent Cart Synchronization (State ➔ DB)
```
User clicks "Add to Cart"
       │
       ▼
1. AppContext updates local `cartItems` state immediately (Optimistic UI)
       │
       ▼
2. `isLocalChange` flag set to `true`
       │
       ▼
3. useEffect hook detects `isLocalChange && user`
       │
       ▼
4. Asynchronous POST request sent to `/api/cart/update` with updated `cartItems`
       │
       ▼
5. Backend sanitizes map (deletes 0-qty items) and saves to MongoDB User document
```

### B. Secure Stripe Checkout & Webhook Pipeline
```
User selects "Stripe Payment" in Cart.jsx
       │
       ▼
1. POST `/api/order/stripe` with items and addressId
       │
       ▼
2. Backend queries MongoDB for actual product prices (Server-Side Calculation)
       │
       ▼
3. Creates pending `Order` document in MongoDB
       │
       ▼
4. Constructs Stripe Checkout Session with `orderId` and `userId` in metadata
       │
       ▼
5. User redirected to Stripe secure payment page
       │
       ├─────────────────────────────────────────┐
       ▼                                         ▼
User completes payment                    Stripe fires Webhook
       │                                         │
       ▼                                         ▼
Redirected to `/loader?next=my-orders`    POST `/api/order/stripe/webhook`
       │                                         │
       ▼                                         ▼
Calls `/api/order/stripe/verify`          Bypasses JSON parser for raw buffer
       │                                         │
       ▼                                         ▼
Marks `isPaid: true` & clears DB cart     Verifies signature, marks `isPaid: true` & clears DB cart
```

---

## ⚡ 7. Advanced Engineering Challenges & Custom Solutions

### Challenge 1: Stripe Webhook Cryptographic Verification vs. `express.json()`
- **Problem**: `stripe.webhooks.constructEvent()` requires the **raw, unparsed request buffer**. Standard Express `app.use(express.json())` mutates `req.body` into a JavaScript object, breaking Stripe's signature verification (`StripeSignatureVerificationError`).
- **Solution**: Implemented middleware branching in `server.js`:
  ```javascript
  app.use((req, res, next) => {
      if (req.originalUrl === '/api/order/stripe/webhook') {
          next(); // Skip JSON parsing for raw webhook buffer
      } else {
          express.json()(req, res, next);
      }
  });
  ```

### Challenge 2: Cross-Domain HTTP-Only Cookie Blocking on Vercel
- **Problem**: Deploying React frontend (`greencart-gamma-brown.vercel.app`) and Express backend (`greencart-backend.vercel.app`) on different subdomains caused browsers to reject auth cookies due to SameSite policies.
- **Solution**: Configured explicit credentials handling across CORS and cookie settings:
  ```javascript
  // CORS Configuration
  app.use(cors({
      origin: ['https://greencart-gamma-brown.vercel.app', 'http://localhost:5173'],
      credentials: true
  }));

  // Cookie Issuance
  res.cookie('token', token, {
      httpOnly: true,
      secure: true,      // Requires HTTPS
      sameSite: 'none',  // Cross-site cookie transmission
      path: '/'
  });
  ```

### Challenge 3: Price Tampering via Client Requests
- **Problem**: Malicious users could alter request payloads (e.g., changing product price from `$49.99` to `$0.01` before calling checkout).
- **Solution**: Total amounts are strictly recalculated on the backend in `orderController.js` by querying MongoDB for the canonical product offer prices before creating Stripe sessions or COD orders.

### Challenge 4: Serverless Function Crashes & Port Switching for SMTP
- **Problem**: Standard SMTP port 587 (STARTTLS) can trigger connection timeouts on serverless container environments (Vercel). Furthermore, `process.exit(1)` in DB connection errors crashes Vercel instances.
- **Solution**: Built an adaptive transporter in `server/configs/nodemailer.js` that checks port type dynamically (port 465 SSL vs 587 STARTTLS) and handled DB connection errors gracefully without terminating the process.

---

## 🔒 8. Security & Authentication Blueprint

1. **Token Security**: JWT tokens stored exclusively in `HTTP-Only` cookies. JavaScript cannot access `document.cookie`, neutralizing Cross-Site Scripting (XSS) token theft.
2. **Password Salting**: `bcryptjs` salt rounds set to `10`, preventing rainbow table attacks.
3. **Role Separation**: Dedicated seller authentication middleware (`authSeller.js`) that validates a distinct `sellerToken` cookie against environment variables.
4. **Cache Suppression**: The `/api/user/is-auth` endpoint forces `Cache-Control: no-store, no-cache, must-revalidate` response headers to prevent browsers or CDNs from returning stale user auth states on back-button navigation.

---

## ❓ 9. Top 15 Technical Interview Questions & Answers

#### Q1: Why React 19 and Vite over traditional Create React App?
> *"Vite provides instantaneous HMR (Hot Module Replacement) using native ES modules during development and uses Rollup for optimized production builds. React 19 offers improved rendering performance and cleaner hook integrations."*

#### Q2: How is state managed in Green Cart, and why not Redux?
> *"State is managed via React Context (`AppContext.jsx`). For an e-commerce application of this scale, React Context provides clean central management of user auth, cart state, and product catalogs without the boilerplate overhead of Redux Toolkit."*

#### Q3: Why use HTTP-Only cookies for JWT instead of localStorage?
> *"Tokens stored in `localStorage` are vulnerable to XSS attacks. HTTP-Only cookies cannot be read by JavaScript code (`document.cookie`), adding a robust layer of protection against client-side script exploitation."*

#### Q4: How do you handle cross-origin cookie sharing between frontend and backend?
> *"We enable `credentials: true` in Axios requests (`axios.defaults.withCredentials = true`) and backend CORS settings. The JWT cookies are signed with `sameSite: 'none'` and `secure: true` over HTTPS."*

#### Q5: How do you prevent price tampering during checkout?
> *"We never trust the order total sent from the frontend. The server fetches product IDs, queries MongoDB for canonical prices, calculates subtotal + 2% tax on the backend, and passes the calculated total to Stripe or COD."*

#### Q6: How does the app handle Stripe webhooks in Express?
> *"Stripe webhooks verify requests using raw body signatures. We created custom middleware in `server.js` to skip `express.json()` exclusively for `/api/order/stripe/webhook` so the raw request buffer remains intact for `stripe.webhooks.constructEvent()`."*

#### Q7: How does cart synchronization work for both guests and logged-in users?
> *"For guest users, cart state remains in React memory. When a user logs in, local cart changes set an `isLocalChange` flag that triggers an asynchronous sync request (`POST /api/cart/update`) to save the cart map into the user's MongoDB document."*

#### Q8: How are image uploads processed?
> *"Images uploaded by sellers pass through Multer middleware, which forwards files to Cloudinary CDN. Cloudinary returns HTTPS URLs which are stored in the `images` array of the MongoDB Product schema."*

#### Q9: How do you handle serverless deployment quirks (e.g., Vercel)?
> *"In serverless functions, database connections must be reused across invocations using `mongoose.connection.readyState >= 1`. Also, process exit calls (`process.exit(1)`) are avoided to prevent killing serverless instances."*

#### Q10: How does the Nodemailer newsletter feature work?
> *"The backend uses Nodemailer with SMTP transport configuration. Upon user subscription, the server validates the email and dispatches a styled HTML welcome email with dynamic client redirect links."*

#### Q11: How do you separate Customer and Seller access?
> *"We use isolated routing (`/seller`), distinct middleware (`authSeller` vs `authUser`), and separate JWT cookies (`sellerToken` vs `token`)."*

#### Q12: How are cart totals calculated on the frontend?
> *"In `AppContext.jsx`, `getCartAmount()` iterates over the `cartItems` map `{ productId: quantity }`, matches products from the global `products` array by ID, and sums `offerPrice * quantity` rounded down to 2 decimal places."*

#### Q13: What happens if a Stripe Webhook call is delayed or missed?
> *"We implemented a fallback verification route (`GET /api/order/stripe/verify`). When the user lands on the success redirect page (`/loader?next=my-orders`), the client polls `verifyStripeSession` to confirm payment and clear the cart even if the webhook was delayed."*

#### Q14: Why did you use NoSQL (MongoDB) over SQL (PostgreSQL) for this project?
> *"MongoDB's document model matches our JSON data structures naturally. Storing cart items as a dynamic map inside the User document eliminates complex multi-table joins while keeping product catalogs flexible for dynamic attributes."*

#### Q15: How do you optimize search and category filtering in React?
> *"Products are fetched once on initial mount and cached in context state. Filtering by search query (`searchQuery`) or category is computed client-side using JavaScript `.filter()` array methods, resulting in instantaneous UI responses."*

---

## 🎯 10. Quick Interview Cheat Sheet

- **Frontend Entry**: `client/src/App.jsx`
- **Global Context**: `client/src/context/AppContex.jsx`
- **Backend Entry**: `server/server.js`
- **Database Schemas**: `server/models/` (`User.js`, `Product.js`, `Address.js`, `Order.js`)
- **Middlewares**: `server/middlewares/` (`authUser.js`, `authSeller.js`)
- **Stripe & Webhook Logic**: `server/controller/orderController.js`
- **Image Pipeline**: `server/configs/multer.js` + `server/configs/cloudinary.js`
- **SMTP Transporter**: `server/configs/nodemailer.js`

---
*Good luck with your interview! You have a complete, robust, full-stack application with production-level engineering decisions.* 🚀
