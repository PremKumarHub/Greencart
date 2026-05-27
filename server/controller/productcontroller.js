import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        return response;
    } catch (error) {
        console.log("Cloudinary upload failed: ", error);
        return null;
    }
}

//add product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData)
        const images = req.files

        let imageUrl = await Promise.all(images.map(async (image) => {
            const result = await uploadOnCloudinary(image.path)
            return result ? result.secure_url : null
        }))

        imageUrl = imageUrl.filter(url => url !== null)
        if (imageUrl.length === 0 && images.length > 0) {
            throw new Error("Image upload to Cloudinary failed.")
        }

        await Product.create({
            ...productData,
            images: imageUrl
        })
        res.status(200).json({ success: true, message: "Product added successfully" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }

}
// Get product: /api/product/add    
export const productList = async (req, res) => {
    try {
        const products = await Product.find()
        res.json({ success: true, products })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }

}

//Get_single product: /api/product/list
export const productById = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        res.json({ success: true, product })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }

}

//Change product instock: /api/product/change-stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        const product = await Product.findByIdAndUpdate(
            id,
            { inStock },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Stock status updated successfully", product });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }

}
