import mongoose, { Schema, model, Types } from "mongoose";
import * as enumTypes from "../enumTypes.js";

const OTPSchema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: "User", required: true },
        code: { type: String, required: true },
        type: { type: String, enum: Object.values(enumTypes.OTPType) },
        createdAt: { type: Date, default: Date.now, expires: 600 },
    },
    { timestamps: true }
);

const OTPModel = mongoose.model("OTP", OTPSchema);
export default OTPModel;
