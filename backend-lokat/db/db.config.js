import mongoose from "mongoose";
import { MONGODB_URI, DB_NAME } from "../constants.js";

let globalWithMongoose = globalThis;
if (!globalWithMongoose._mongooseCache) {
    globalWithMongoose._mongooseCache = { conn: null, promise: null };
}

export default async function connectDB() {
    if (globalWithMongoose._mongooseCache.conn) {
        return globalWithMongoose._mongooseCache.conn;
    }

    if (!globalWithMongoose._mongooseCache.promise) {
        globalWithMongoose._mongooseCache.promise = mongoose.connect(`${MONGODB_URI}/${DB_NAME}`, {
            bufferCommands: false,
            maxPoolSize: 5, // Optional tweak: control pool size for serverless
        });
    }

    try {
        globalWithMongoose._mongooseCache.conn = await globalWithMongoose._mongooseCache.promise;
        console.log(`✅ MongoDB connected: ${globalWithMongoose._mongooseCache.conn.connection.host}`);
        return globalWithMongoose._mongooseCache.conn;
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        throw error;
    }
}
