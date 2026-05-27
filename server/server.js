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

connectDB();
connectCloudinary();

// Updated flexible allowed origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://greencart-gamma-brown.vercel.app',
    'https://greencart-dun-tau.vercel.app', // Your current active client link
];

// Middleware
app.use((req, res, next) => {
    if (req.originalUrl === '/api/order/stripe/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

app.use(cookieParser());

// 1. Explicitly intercept and respond to browser Pre-flight OPTIONS checks first!
app.options('*', (req, res) => {
    const origin = req.headers.origin;
    // Automatically match ANY vercel deployment URL of yours or your local servers
    if (origin && (allowedOrigins.includes(origin) || origin.includes('vercel.app'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204); // Instant clean response for the browser pre-flight check
});

// 2. Updated dynamic CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        // Dynamically allow if it matches the explicit list OR contains vercel.app
        if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
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