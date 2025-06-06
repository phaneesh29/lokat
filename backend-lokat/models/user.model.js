import mongoose, { Schema, model } from "mongoose"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET } from "../constants.js"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,

    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    latitude: {
        type: Number,
        required: [true, "Please enable location"]
    },
    longitude: {
        type: Number,
        required: [true, "Please enable location"]
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    location: {
        type: String,
        defalut: ""
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        default: ""
    },
    otpExpiry: {
        type: Date
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcryptjs.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id, }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })
}

export const UserModel = mongoose.models.User || model("User", userSchema)