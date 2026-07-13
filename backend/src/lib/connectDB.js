import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const mongouri = process.env.MONGO_URI;

        if (!mongouri) {
            throw new Error("MONGOURI is required");
        }

        const conn = await mongoose.connect(mongouri);

        console.log("MONGODB connected",conn.connection.host);
        

    } catch (error) {
        console.error("MONGODB connection error", error.message);
        process.exit(1)
    }
};

export default connectDB;