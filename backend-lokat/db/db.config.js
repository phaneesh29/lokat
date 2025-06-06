import mongoose from "mongoose";
import { MONGODB_URI, DB_NAME } from "../constants.js";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(`${MONGODB_URI}/${DB_NAME}`, {
            bufferCommands: false,
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log(`MongoDB connected !! DB HOST: ${cached.conn.connection.host}`);
        return cached.conn;
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}