import express from "express";
import authUser from '../middlewares/authUser.js';
import { authSeller } from '../middlewares/authSeller.js';
import { placeOrderCOD, placeOrderStripe, getOrdersByUser, getAllOrders, verifyStripeSession, stripeWebhook } from "../controller/orderController.js";
const orderRouter = express.Router();

// ⚠️ Webhook MUST use express.raw() — Stripe signature verification needs the raw body buffer
orderRouter.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.post('/user', authUser, getOrdersByUser);
orderRouter.post('/seller', authSeller, getAllOrders);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.get('/stripe/success', verifyStripeSession);
export default orderRouter;