import mongoose from 'mongoose';
import 'dotenv/config';

async function test() {
    console.log("Connecting to:", process.env.MONGODB_URI);
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connection successful!");
        process.exit(0);
    } catch (err) {
        console.error("Connection failed:", err.message);
        process.exit(1);
    }
}

test();
