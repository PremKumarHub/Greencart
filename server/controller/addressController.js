
import Address from "../models/Address.js";

// Add address: /api/address/add
export const addAddress = async (req, res) => {
    try {
        const {
            userId,
            address,
            street,
            city,
            state,
            zip,
            zipcode,
            country,
            phone,
            firstName,
            lastName,
            firstname,
            lastname,
            email
        } = req.body;

        const payload = {
            userId,
            firstname: firstName || firstname || '',
            lastname: lastName || lastname || '',
            email: email || '',
            street: street || address || '',
            city: city || '',
            state: state || '',
            zip: zip || zipcode || '',
            country: country || '',
            phone: phone || ''
        };

        await Address.create(payload);
        res.json({ success: true, message: "Address added successfully" })
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get address: /api/address/get
export const getAddress = async (req, res) => {
    try {
        const { userId } = req.body
        const address = await Address.find({ userId })
        res.json({ success: true, address })
    }
    catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}