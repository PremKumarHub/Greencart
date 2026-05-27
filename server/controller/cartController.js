

import User from "../models/User.js";

// Update User cart: /api/cart/update
export const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartItems: incomingCart } = req.body || {};

        const user = await User.findById(userId);
        const existingCart = user?.cartItems || {};

        // If client sent an incoming cart, treat it as authoritative (replace),
        // otherwise keep existing server cart.
        let merged = { ...existingCart };
        if (incomingCart && typeof incomingCart === 'object') {
            merged = {};
            for (const [prodId, qty] of Object.entries(incomingCart)) {
                const incomingQty = Math.max(0, Number(qty) || 0);
                if (incomingQty <= 0) continue;
                merged[prodId] = Math.min(incomingQty, 999);
            }
        }

        // ensure no zero/invalid entries remain
        for (const k of Object.keys(merged)) {
            if (!merged[k] || Number(merged[k]) <= 0) delete merged[k];
        }

        user.cartItems = merged;
        await user.save();
        res.json({ success: true, message: "Cart updated successfully", cartItems: merged });
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
