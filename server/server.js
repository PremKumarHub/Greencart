import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoutes.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();

// Initialize connections
connectDB();
connectCloudinary();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://greencart-gamma-brown.vercel.app',
    'https://greencart-dun-tau.vercel.app'
];

// Standard CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Body parser handling with Stripe bypass
app.use((req, res, next) => {
    if (req.originalUrl === '/api/order/stripe/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

app.use(cookieParser());

// Root test route
app.get('/', (req, res) => res.send("API IS WORKING"));

// Feature routes
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// Global Error Handler to stop Vercel from losing CORS headers on 500 crashes
app.use((err, req, res, next) => {
    console.error("Caught server crash:", err.message);
    res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

export default app;