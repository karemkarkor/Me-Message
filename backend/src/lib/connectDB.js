import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error("MONGO_URI is required");
        }

        const conn = await mongoose.connect(mongoUri);

        console.log("MONGODB connected",conn.connection.host);
        

    } catch (error) {
        console.error("MONGODB connection error", error.message);
        process.exit(1)
    }
};

export default connectDB;