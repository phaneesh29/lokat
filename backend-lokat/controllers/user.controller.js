import connectDB from "../db/db.config.js"
import {AccessModel} from "../models/access.model.js"
import { UserModel } from "../models/user.model.js"
import { getLocationFromCords } from "../utils/getLocation.js"
import { sendEmail } from "../utils/mailer.js"
import bcryptjs from "bcryptjs"

export const registerUser = async (req, res) => {
    try {
        await connectDB()
        const { fullName, email, username, password, latitude, longitude } = req.body

        if (!fullName || !username || !email || !password || !latitude || !longitude) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const existedUser = await UserModel.findOne({ $or: [{ username }, { email }] })

        if (existedUser) {
            return res.status(409).json({ message: "User with email or username already exists" })
        }

        const location = await getLocationFromCords(latitude, longitude)

        const user = await UserModel.create({
            fullName,
            email,
            password,
            username: username.toLowerCase(),
            longitude,
            latitude,
            location
        })

        sendEmail({ email, emailType: "VERIFY", userId: user._id })

        return res.status(201).json({ message: "User registered Successfully" })

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const loginUser = async (req, res) => {
    try {
        await connectDB()
        const { emailOrUsername, password } = req.body

        if (!emailOrUsername) {
            return res.status(400).json({ message: "Username or email is required" })
        }

        const user = await UserModel.findOne({
            $or: [{ username: emailOrUsername }, { email: emailOrUsername }]
        })

        if (!user) {
            return res.status(404).json({ message: "User does not exist" })
        }

        const isPasswordValid = await user.isPasswordCorrect(password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid user credentials" })
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: "Verify this account" })
        }

        const token = user.generateAccessToken()
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000,
        }
        return res.status(200).cookie("token", token, options).json({ message: "User Logged in successfully", token })

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })

    }

}

export const logoutUser = (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000,
        }
        return res.status(200).clearCookie("token", options).json({ message: "User logged Out" })
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })

    }
}

export const getCurrentUser = async (req, res) => {
    try {
        return res.status(200).json({ user: req.user, message: "User fetched successfully" })

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })

    }
}

export const verifyOTP = async (req, res) => {
    try {
        await connectDB()
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await UserModel.findOne({ email }).select("-password")
        if (!user) {
            return res.status(400).json({ message: "Incorrect email" })
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "Already verified" })
        }
        if (Date.now() > user.otpExpiry) {
            return res.status(400).json({ message: "OTP Expired" })
        }

        const isOtpCorrect = await bcryptjs.compare(otp.toString(), user.otp)

        if (!isOtpCorrect) {
            return res.status(400).json({ message: "OTP Invalid" })
        }

        await UserModel.findByIdAndUpdate(user._id, { isVerified: true, otp: null, otpExpiry: null })

        return res.status(200).json({ message: "Account verified successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const resendOTP = async (req, res) => {
    try {
        await connectDB()
        const { email, emailType } = req.body
        if (!email || !emailType) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await UserModel.findOne({ email }).select("-password")
        if (!user) {
            return res.status(400).json({ message: "Incorrect email" })
        }
        if (user.isVerified && emailType == "VERIFY") {
            return res.status(400).json({ message: "OTP is already verified" })
        }
        await sendEmail({ email, emailType, userId: user._id })
        return res.status(200).json({ message: "OTP sent successfully" });


    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const grantAccessController = async (req, res) => {
    try {
        await connectDB()
        const { receiverEmail } = req.body
        const senderEmail = req.user.email
        if (!receiverEmail) {
            return res.status(400).json({ message: "All fields are required" })

        }
        if (receiverEmail === senderEmail) {
            return res.status(400).json({ message: "You can't give access to yourself" });
        }
        const receiver = await UserModel.findOne({ email: receiverEmail }).select("-password -otp -otpExpiry")
        if (!receiver) {
            return res.status(400).json({ message: "Invalid receiver email" })
        }
        const sender = await UserModel.findOne({ email: senderEmail }).select("-password -otp -otpExpiry")
        if (!sender) {
            return res.status(400).json({ message: "Invalid sender email" })
        }

        const existingAccess = await AccessModel.findOne({
            sender: sender._id,
            receiver: receiver._id,
            isValid: true
        });

        if (existingAccess) {
            return res.status(409).json({ message: "Access already granted" });
        }

        const granted = await AccessModel.create({
            sender: sender._id,
            receiver: receiver._id
        })

        return res.status(201).json({ message: "Access granted successfully" })

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })

    }
}

export const getOthersLocationController = async (req, res) => {
    try {
        await connectDB()
        const receiverId = req.user._id
        const accesses = await AccessModel.find({
            receiver: receiverId,
            isValid: true
        }).populate({
            path: "sender",
            select: "username location email latitude longitude isActive isVerified createdAt"
        })

        if (!accesses.length) {
            return res.status(404).json({ message: "No shared locations found" });
        }
        return res.status(200).json({ accesses, message: "fetched Successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })

    }
}

export const whoCanSeeMeController = async (req, res) => {
    try {
        await connectDB()
        const senderId = req.user._id

        const accesses = await AccessModel.find({
            sender: senderId,
            isValid: true
        }).populate({
            path: "receiver",
            select: "username location email isActive isVerified createdAt"
        })

        if (!accesses.length) {
            return res.status(404).json({ message: "No shared locations found" });
        }

        return res.status(200).json({ accesses, message: "fetched Successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })

    }
}

export const updateLocationController = async (req, res) => {
    try {
        await connectDB()
        const { longitude, latitude } = req.body
        if (typeof latitude !== "number" || typeof longitude !== "number") {
            return res.status(400).json({ message: "Please enable Location" });
        }

        const loggedInUser = req.user
        const location = await getLocationFromCords(latitude, longitude, loggedInUser._id)
        const user = await UserModel.findByIdAndUpdate(loggedInUser._id, { latitude, longitude, location }, { new: true })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Location updated" });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}

export const deleteAccessController = async (req, res) => {
    try {
        await connectDB()
        const { accessId } = req.body
        if (!accessId) {
            return res.status(400).json({ message: "AccessId required" });
        }
        const senderID = req.user._id
        const deletedAccess = await AccessModel.findOneAndDelete({ _id: accessId, sender: senderID })
        if (!deletedAccess) {
            return res.status(404).json({ message: "Access not found or not owned by user" });
        }
        return res.status(200).json({ message: "Access deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" })
    }
}