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
const port = process.env.PORT || 4000;
await connectDB();
await connectCloudinary();

//Allow multiple origins (include Vite dev server default ports)
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174']

// Middleware configuration
// Skip JSON body parsing for the Stripe webhook route — it needs the raw Buffer
app.use((req, res, next) => {
    if (req.originalUrl === '/api/order/stripe/webhook') {
        next(); // raw body already handled by express.raw() at route level
    } else {
        express.json()(req, res, next);
    }
});
//app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get('/', (req, res) => res.send("API IS WORKING"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})

