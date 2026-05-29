import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Stripe from 'stripe';

export const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, amount: incomingAmount, address } = req.body;
        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" });
        }

        // Compute total from products on server to avoid trusting client amount
        let total = 0;
        for (const it of items) {
            const pid = it.productId || it.product;
            const product = await Product.findById(pid);
            if (!product) return res.json({ success: false, message: 'Product not found' });
            total += (product.offerPrice || 0) * (it.quantity || 0);
        }

        const amount = Math.round((incomingAmount || total) * 100) / 100;
        const finalAmount = Math.round((amount + amount * 0.02) * 100) / 100;

        await Order.create({
            userId,
            items,
            amount: finalAmount,
            address,
            paymentType: "COD",
            isPaid: false
        });

        // Clear user's cart in database
        await User.findByIdAndUpdate(userId, { cartItems: {} });

        res.json({ success: true, message: "Order placed successfully" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, amount: incomingAmount, address } = req.body;
        const {origin} = req.headers;
        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" });
        }
        let productData = [];   

        // Compute total from products on server to avoid trusting client amount
        let total = 0;
        for (const it of items) {
            const pid = it.productId || it.product;
            const product = await Product.findById(pid);
            
            if (!product) return res.json({ success: false, message: 'Product not found' });
            const qty = it.quantity || 1;
            total += (product.offerPrice || product.price || 0) * qty;

            // collect product summary for later use (e.g., Stripe line items)
            productData.push({
                productId: product._id,
                name: product.name,
                price: product.offerPrice || product.price || 0,
                quantity: qty
            });
        }

        const amount = Math.round((incomingAmount || total) * 100) / 100;
        const finalAmount = Math.round((amount + amount * 0.02) * 100) / 100;

        // create order record first so we can attach id to stripe metadata
        const order = await Order.create({
            userId,
            items,
            amount: finalAmount,
            address,
            paymentType: "Online",
            isPaid: false
        });

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        // build Stripe line items (amounts in cents)
        const line_items = productData.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: { name: item.name },
                unit_amount: Math.round((item.price + item.price * 0.02) * 100), // amount in cents
            },
            quantity: item.quantity,
        }));

        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        });

        res.json({ success: true, message: "Order placed successfully", sessionId: session.id, url: session.url });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get Orders by User ID: /api/order/get
export const getOrdersByUser = async (req, res) => {
    try {
        // Use authenticated user id from middleware instead of trusting client body
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.json({ success: false, message: 'User not authenticated' });
        // Return all orders for this user (both COD and Online), regardless of payment flag,
        // so users can see orders placed even if payment confirmation is pending.
        const orders = await Order.find({ userId }).populate("items.productId").populate('address').sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
//Get All Orders (for seller/ admin) : /api/order/user
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.productId").populate('address').sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const verifyStripeSession = async (req, res) => {
    try {
        const { session_id } = req.query;
        if (!session_id) return res.json({ success: false, message: 'Missing session_id' });

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const orderId = session.metadata?.orderId;
        const payment_status = session.payment_status;

        if (!orderId) return res.json({ success: false, message: 'No order metadata' });

        if (payment_status === 'paid') {
            await Order.findByIdAndUpdate(orderId, { isPaid: true });
            
            // Also clear cart here in case webhook is delayed
            const userId = session.metadata?.userId;
            if (userId) {
                await User.findByIdAndUpdate(userId, { cartItems: {} });
            }
            
            return res.json({ success: true, paid: true, orderId });
        }

        return res.json({ success: true, paid: false });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Stripe Webhook: /api/order/stripe/webhook
// IMPORTANT: This route must receive the RAW request body (not parsed JSON)
// so Stripe can verify the signature. Mount it before express.json() in server.js.
export const stripeWebhook = async (req, res) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = req.headers['stripe-signature'];

    if (!webhookSecret) {
        console.error('STRIPE_WEBHOOK_SECRET is not set in .env');
        return res.status(500).send('Webhook secret not configured');
    }

    let event;
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        // req.body must be the raw Buffer here (use express.raw in the route)
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Only process fully paid sessions
        if (session.payment_status !== 'paid') {
            return res.json({ received: true });
        }

        const orderId = session.metadata?.orderId;
        const userId  = session.metadata?.userId;

        try {
            if (orderId) {
                // Mark order as paid
                await Order.findByIdAndUpdate(orderId, { isPaid: true });
                console.log(`Order ${orderId} marked as paid via webhook.`);
            }

            if (userId) {
                // Clear cart after successful payment
                await User.findByIdAndUpdate(userId, { cartItems: {} });
                console.log(`Cart cleared for user ${userId} after payment.`);
            }
        } catch (dbErr) {
            console.error('DB update error in webhook:', dbErr.message);
            // Still return 200 so Stripe doesn't retry unnecessarily
        }
    }

    // Acknowledge receipt to Stripe
    res.json({ received: true });
}