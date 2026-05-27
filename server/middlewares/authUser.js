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
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: 'Logged out successfully' })
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export default authUser;

