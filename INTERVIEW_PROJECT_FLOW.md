# Green Cart (Groceryatnxtdoor) - Complete Interview Preparation Master Guide

This document contains **everything** you need to confidently talk about this project in your interview tomorrow: architecture, feature flows, database design, advanced engineering decisions, verbal scripts, and top technical interview Q&As.

---

## 🌟 1. Project Overview & Elevator Pitches

### 30-Second Elevator Pitch
> *"Green Cart is a full-stack MERN grocery e-commerce web application. Customers can browse organic groceries, search products in real-time, manage a persistent shopping cart, select delivery addresses, subscribe to newsletters via SMTP email notifications, and checkout using Cash-on-Delivery or Stripe. Sellers get a dedicated admin portal to upload product images via Cloudinary, control inventory stock levels, and fulfill orders."*

### 2-Minute Architectural Pitch
> *"The project is architected as a decoupled client-server web application. The frontend is built with React 19 and Vite using Tailwind CSS for UI styling. State management—such as cart state, search queries, and user sessions—is centralized using React Context. The backend is an Express 5 REST API running on Node.js connected to MongoDB via Mongoose.*
>
> *For security, authentication uses JWT tokens stored inside HTTP-Only, Secure, SameSite cookies to protect against XSS attacks. Media uploads are offloaded to Cloudinary using Multer middleware. Payments support both Cash-on-Delivery and Stripe online payments, including a custom raw-body Express middleware bypass for Stripe Webhook signature verification. We also implemented Nodemailer with SMTP server integration to send styled HTML welcome emails when users subscribe to the newsletter."*

---

## 🛠️ 2. Technology Stack & Key Libraries

| Layer | Technology / Library | Why it was chosen |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Fast HMR, component reusability, and modern hooks |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive design, utility-first styling, rich UI icons |
| **Notifications**| React Hot Toast | Smooth, customizable asynchronous feedback toasts |
| **Backend** | Node.js + Express 5 | High performance asynchronous API framework |
| **Database** | MongoDB + Mongoose | Flexible NoSQL schema for JSON-like documents |
| **Auth** | JWT + `bcryptjs` + Cookie-Parser | Secure stateless token auth with HTTP-Only cookies |
| **File Storage**| Cloudinary + Multer | Cloud image hosting & automatic image optimization |
| **Payments** | Stripe API (`stripe`) | Secure payment gateway & webhooks for online orders |
| **Email (SMTP)**| Nodemailer | Transactional email delivery over SMTP |

---

## 🔄 3. Core Feature Flows (Step-by-Step)

### A. Authentication & Session Management
1. **User Register / Login**: Frontend posts credentials to `/api/user/register` or `/api/user/login`.
2. Password is hashed using `bcryptjs` (10 salt rounds).
3. Backend signs a JSON Web Token (JWT) containing `userId`.
4. Token is attached to the HTTP response as an `httpOnly`, `secure`, `sameSite: 'none'` cookie named `token`.
5. **Session Check**: On page refresh, `AppContex` calls `GET /api/user/is-auth` which validates the cookie via `authUser` middleware.
6. **Seller Auth**: Separate authentication route (`/api/seller/login`) issues a separate `sellerToken` cookie for administrative isolation.

### B. Shopping Cart & Database Sync
1. **Local State**: Adding items in `ProductDetails` updates `cartItems` state object immediately in React Context (`{ [productId]: quantity }`).
2. **Database Synchronization**: Whenever a logged-in user modifies their cart, `AppContex` automatically sends an asynchronous POST to `/api/cart/update`.
3. **Backend Clean-Up**: The `cartController` validates quantities, strips zero/invalid values, and updates the `cartItems` map directly inside the MongoDB `User` document.

### C. Checkout & Order Processing (COD & Stripe)
1. **Cart & Address**: User reviews total (subtotal + 2% tax), selects a saved address or adds a new shipping address (`AddAdress.jsx`).
2. **Payment Choice**:
   - **Cash on Delivery (COD)**: Sends order items to `/api/order/cod`. Backend re-calculates exact item prices from DB, creates an `Order` document with `status: 'Order Placed'`, and clears the user's MongoDB cart.
   - **Stripe Online Payment**: Posts order to `/api/order/stripe`. Backend creates a pending `Order` record, constructs a Stripe Checkout Session with line items, and returns the Stripe checkout URL to redirect the user.
3. **Webhook Verification**: On successful payment, Stripe triggers `POST /api/order/stripe/webhook` (bypassing standard JSON body parsers for raw buffer validation). The backend marks `isPaid: true` and clears the cart.

### D. SMTP Newsletter Email Subscription
1. User enters their email in the `NewsLetter.jsx` component and submits.
2. Request hits `POST /api/user/subscribe`.
3. Server validates email format and checks SMTP credentials (`SMTP_USER`, `SMTP_PASS`, `SMTP_HOST`, `SMTP_PORT`).
4. **Nodemailer Transporter** sends a custom-styled HTML email ("*🎉 Thank you for subscribing to Green Cart!*") over SMTP (Port 465 SSL or Port 587 STARTTLS).
5. Frontend shows a success toast notification.

### E. Seller Admin Dashboard
1. Seller logs into `/seller` dashboard using seller credentials.
2. **Add Product**: Fills name, description, price, offer price, category, and uploads up to 4 images.
3. **Multer & Cloudinary**: Backend processes image files with `multer`, uploads them to Cloudinary CDN, receives secure image URLs, and saves the new `Product` document.
4. **Stock & Order Management**: Seller can toggle product `inStock` boolean in real time and view all incoming customer orders.

---

## 🗄️ 4. Database Schema Design (MongoDB)

```
┌─────────────────────────┐          ┌───────────────────────────┐
│          User           │          │          Address          │
├─────────────────────────┤          ├───────────────────────────┤
│ _id: ObjectId           │          │ _id: ObjectId             │
│ name: String            │          │ userId: String (Ref User) │
│ email: String           │          │ firstname, lastname       │
│ password: String (hash) │          │ street, city, state, zip  │
│ cartItems: Object       │          │ phone: String             │
└─────────────────────────┘          └───────────────────────────┘
            │                                      │
            └──────────────────┬───────────────────┘
                               ▼
                   ┌───────────────────────┐
                   │         Order         │
                   ├───────────────────────┤
                   │ _id: ObjectId         │
                   │ userId: String        │
                   │ items: Array          │
                   │ amount: Number        │
                   │ address: Object       │
                   │ status: String        │
                   │ paymentType: COD/Stripe│
                   │ isPaid: Boolean       │
                   └───────────────────────┘
```

---

## 💡 5. Smart Engineering & Architectural Decisions

When asked *"What challenges did you face and how did you solve them?"*, use these 3 examples:

1. **CORS & HTTP-Only Cookie Cross-Origin Issue**:
   - *Problem*: Cookies were blocked when deploying frontend and backend to separate Vercel domains.
   - *Solution*: Set `credentials: true` in CORS config, explicitly whitelisted allowed origin domains, and configured cookies with `sameSite: 'none'` and `secure: true`.

2. **Stripe Raw Webhook Middleware Bypass**:
   - *Problem*: Express `express.json()` pre-parsed request bodies, causing Stripe's cryptographic signature verification (`stripe.webhooks.constructEvent`) to fail.
   - *Solution*: Created a conditional middleware in `server.js` that skips `express.json()` processing specifically for `/api/order/stripe/webhook` so raw request buffers are preserved.

3. **Production SMTP Configuration on Serverless (Vercel)**:
   - *Problem*: Serverless host timeouts when connecting via SMTP port 587 (STARTTLS).
   - *Solution*: Built a dynamic Nodemailer transporter in `nodemailer.js` that automatically switches between SSL (Port 465, `secure: true`) and STARTTLS (Port 587), with environment variable checks.

---

## ❓ 6. Top 10 Technical Interview Questions & Answers

#### Q1: How did you handle state management across the app?
> *"We used React Context API (`AppContex.jsx`). It centralizes user auth, cart state, product list, search queries, and axios instances, preventing prop-drilling across deeply nested components."*

#### Q2: Why did you use HTTP-Only cookies instead of storing JWT in localStorage?
> *"Storing tokens in `localStorage` makes them accessible to JavaScript, leaving the app vulnerable to XSS (Cross-Site Scripting). HTTP-Only cookies cannot be accessed via JS (`document.cookie`), making authentication significantly more secure."*

#### Q3: How does the shopping cart stay in sync between guest and logged-in users?
> *"For guest users, the cart lives in React state. Once a user logs in, any local cart changes trigger an asynchronous API call (`POST /api/cart/update`) to sync the cart map into the user's document in MongoDB."*

#### Q4: How does Stripe payment processing work in your app?
> *"When a user checks out, the backend calculates the order total from database prices (to prevent client-side price tampering) and creates a Stripe Checkout session. Upon payment completion, Stripe triggers a webhook event on our server to mark the order as paid."*

#### Q5: How are product images stored and optimized?
> *"Images are uploaded via `multer` memory storage and sent directly to Cloudinary. Cloudinary provides secure HTTPS URLs, automatic image optimization, and CDN delivery."*

#### Q6: How is the SMTP email service set up?
> *"We integrated `nodemailer` connected to an SMTP server (like Gmail App Passwords or Brevo). When users enter their email in the newsletter component, the server constructs a custom HTML welcome template and dispatches it over SMTP."*

#### Q7: How do you prevent price tampering during checkout?
> *"We never trust price values sent from the frontend. In `orderController.js`, the server fetches the actual product prices from MongoDB using the product IDs, calculates subtotal + 2% tax on the backend, and sends the verified amount to Stripe or COD."*

#### Q8: How did you separate user and seller areas?
> *"We created separate routes and layouts (`SellerLayout.jsx`). Seller authentication uses a dedicated `sellerToken` cookie and isolated routes (`/api/seller/*`), keeping customer and admin responsibilities modular."*

#### Q9: What is the purpose of `express.json()` conditional middleware in your server?
> *"Stripe webhooks require the raw unparsed request body to verify cryptographic signatures. We added custom middleware in `server.js` to skip `express.json()` parsing exclusively for the Stripe webhook route."*

#### Q10: How do you handle production environment variables?
> *"Environment variables like DB connection strings, JWT secrets, Stripe keys, and SMTP credentials are defined in `.env` locally and configured under Vercel Project Settings for production deployment."*

---

## 🎯 Quick Revision Summary Checklist

- [x] **Frontend Entry**: `client/src/App.jsx`
- [x] **Global Context**: `client/src/context/AppContex.jsx`
- [x] **Newsletter Component**: `client/src/assets/NewsLetter.jsx`
- [x] **Server Entry**: `server/server.js`
- [x] **Nodemailer Config**: `server/configs/nodemailer.js`
- [x] **User Auth & Subscription Controller**: `server/controller/userController.js`
- [x] **Cart Controller**: `server/controller/cartController.js`
- [x] **Orders & Stripe Controller**: `server/controller/orderController.js`
- [x] **Products & Cloudinary Controller**: `server/controller/productcontroller.js`

Good luck with your interview tomorrow! 🚀 You've got this!