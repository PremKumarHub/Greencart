import js from 'jsonwebtoken';
export const authSeller = (req, res, next) => {
    const { sellerToken } = req.cookies;
    if (!sellerToken) {
        return res.json({ success: false, message: 'not authorised' });
    }
    try {
        const decodedToken = js.verify(sellerToken, process.env.JWT_SECRET);
        if (decodedToken.email === process.env.SELLER_EMAIL) {
            req.seller = decodedToken;
            next();
        }
        else {
            return res.json({ success: false, message: 'not authorised' });
        }
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }

}