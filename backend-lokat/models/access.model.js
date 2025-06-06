import mongoose, { Schema, model } from "mongoose"

const accessSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    isValid: {
        type: Boolean,
        default: true
    },
    sharedAt: {
        type: Date,
        default: Date.now,
    }

}, { timestamps: true })

export const AccessModel = mongoose.models.Access || model("Access", accessSchema)