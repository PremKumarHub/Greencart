import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return; // Already connected
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'greencart' });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        // Do NOT call process.exit(1) in serverless — it kills the function
    }
}
export default connectDB;