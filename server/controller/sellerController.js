import jwt from 'jsonwebtoken';

// Seller Login
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

            // Hardcoded safe cross-origin settings for Vercel deployment
            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: true,      // Crucial: Must be true for HTTPS (Vercel)
                sameSite: 'none',  // Crucial: Allows frontend domain to store it
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({ success: true, message: "Logged In" });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Check Auth: /api/seller/auth
export const isAuth = async (req, res) => {
    try {
        return res.json({ success: true });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Logout Seller : /api/seller/logout
export const logout = async (req, res) => {
    try {
        // Must clear with the exact same secure cross-site attributes
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        return res.json({ success: true, message: 'Logged out' });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};