import { ACCESS_TOKEN_SECRET } from "../constants.js";
import connectDB from "../db/db.config.js";
import { UserModel } from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const verifyJWT = async (req, res, next) => {
    try {
        await connectDB()
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET)

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        const user = await UserModel.findById(decoded._id).select("-password -otp -otpExpiry")
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user
        next()
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
}