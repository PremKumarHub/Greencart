import connectDB from "./configs/db.js";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import userRouter from "./routes/userRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import sellerRouter from "./routes/sellerRoutes.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();

// Connect to DB and Cloudinary (non-blocking — don't crash on init failure)
connectDB();
connectCloudinary();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://greencart-gamma-brown.vercel.app',
    process.env.FRONTEND_URL,  // Add your Vercel frontend URL in env vars
].filter(Boolean);

// Middleware
app.use((req, res, next) => {
    if (req.originalUrl === '/api/order/stripe/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.get('/', (req, res) => res.send("API IS WORKING"));

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

export default app;