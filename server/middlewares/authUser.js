import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authUser = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.json({ success: false, message: 'Unauthorized' })
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }

}
export const isAuth = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        // Prevent browser from caching auth state
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        return res.json({ success: true, user })
    }

    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
//Logout user:/api/user/logout
export const logout = async (req, res) => {
    try {
        const cookieOpts = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
        };

        // Aggressively expire the cookie by setting it to empty with a past date
        res.cookie('token', '', { ...cookieOpts, expires: new Date(0) });
        
        // Also clear at common paths for safety
        res.clearCookie('token', { ...cookieOpts, path: '/api' });
        res.clearCookie('token', { ...cookieOpts, path: '/api/user' });

        return res.json({ success: true, message: 'Logged out successfully' })
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export default authUser;

