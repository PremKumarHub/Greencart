import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from "../configs/nodemailer.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser)
            return res.json({ success: false, message: 'User already exists' })
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            name,
            email,
            password: hashedPassword
        })
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        })
        return res.json({ success: true, message: 'User registered successfully', user: { _id: user._id, email: user.email, name: user.name } })
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });

    }
}
// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid Credentials' })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        })
        return res.json({ success: true, message: 'Login successful', user: { _id: user._id, email: user.email, name: user.name } })
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
// check auth: /api/user/auth
export const isAuth = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        return res.json({ success: true, user })
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/',
        });
        return res.json({ success: true, message: 'Logged out' })
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Subscribe to Newsletter and send confirmation email
export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.json({ success: false, message: 'Please provide a valid email address.' });
        }

        // Check if SMTP credentials are set up
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            return res.json({
                success: false,
                message: 'SMTP configuration missing in server environment. Please configure SMTP_USER and SMTP_PASS in server/.env file.'
            });
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL || `Green Cart <${process.env.SMTP_USER}>`,
            to: email,
            subject: '🎉 Thank you for subscribing to Green Cart!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
                    <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #4CAF50;">
                        <h1 style="color: #4CAF50; margin: 0; font-size: 28px;">Green Cart 🛒</h1>
                        <p style="color: #666; margin-top: 5px;">Fresh Groceries Delivered to Your Doorstep</p>
                    </div>
                    <div style="padding: 20px 0;">
                        <h2 style="color: #333;">Welcome to the Green Cart Family!</h2>
                        <p style="color: #555; line-height: 1.6; font-size: 16px;">
                            Thank you for subscribing to our newsletter! You are now set to receive:
                        </p>
                        <ul style="color: #555; line-height: 1.8; font-size: 15px;">
                            <li>🔥 <strong>Exclusive Daily & Weekly Discounts</strong> on organic groceries</li>
                            <li>🍎 <strong>Fresh Arrivals Alert</strong> straight from local farmers</li>
                            <li>⚡ <strong>Flash Sales & Promo Codes</strong> reserved only for subscribers</li>
                        </ul>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="background-color: #4CAF50; color: white; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
                                Start Shopping Now
                            </a>
                        </div>
                    </div>
                    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888; font-size: 12px;">
                        <p>If you didn't subscribe to Green Cart, you can safely ignore this email.</p>
                        <p>© ${new Date().getFullYear()} Green Cart. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'Thank you for subscribing to Green Cart! Check your inbox for your welcome email.' });
    } catch (error) {
        console.error('Error sending newsletter email:', error.message);
        return res.json({ success: false, message: `Failed to send email: ${error.message}` });
    }
};