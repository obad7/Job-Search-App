import mongoose, { Schema, model, Types } from "mongoose";
import { hash } from "../../utils/hashing/hash.js";
import * as enumTypes from "../enumTypes.js";

const OTPSchema = new Schema(
    {
        code: { type: String, required: true },
        type: { type: String, enum: Object.values(enumTypes.OTPType) },
        createdAt: { type: Date, default: Date.now, expires: 600 }, // 10 min expiry
    },
    { _id: false } // Prevents MongoDB from creating a separate ID for each OTP
);

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },

        provider: {
            type: String,
            enum: Object.values(enumTypes.providersTypes),
            default: enumTypes.providersTypes.System,
        },
        gender: {
            type: String,
            enum: Object.values(enumTypes.genderType),
            default: enumTypes.genderType.Male,
        },
        role: {
            type: String,
            enum: Object.values(enumTypes.roleType),
            default: enumTypes.roleType.User,
        },

        DOB: { type: Date },
        mobileNumber: { type: String },
        isConfirmed: { type: Boolean, default: false },
        deletedAt: { type: Date },
        bannedAt: { type: Date },
        updatedBy: { type: Types.ObjectId, ref: "User" },
        changeCredentialTime: { type: Date },

        profilePic: { type: String },
        coverPic: { type: String },

        OTP: [OTPSchema],
    },
    { timestamps: true }
);

// Virtual field for userName
userSchema.virtual("userName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        this.password = hash({ plainText: this.password });
    }
    next();
});

// Indexing for performance
userSchema.index({ email: 1 }, { unique: true });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

