import mongoose, { Schema, model, Types } from "mongoose";
import { hash } from "../../utils/hashing/hash.js";
import * as enumTypes from "../enumTypes.js";
import { decrypt } from "../../utils/encryption/encryption.js";
import paginationPlugin from "../../utils/Plugins/paginationPlugin.js";


const userSchema = new Schema(
    {
        firstName: { type: String },
        lastName: { type: String },
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
        deletedAt: { type: Date, default: null },
        bannedAt: { type: Date, default: null },
        updatedBy: { type: Types.ObjectId, ref: "User" },
        changeCredentialTime: { type: Date },

        profilePic: {
            secure_url: { type: String },
            public_id: { type: String },
        },
        coverPic: {
            secure_url: { type: String },
            public_id: { type: String },
        },
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

// Encrypt mobile number
userSchema.post("findOne", function (doc) {
    if (!doc) return;

    if (doc.mobileNumber) {
        doc.mobileNumber = decrypt({
            encrypted: doc.mobileNumber,
            signature: process.env.ENCRYPTION_KEY
        });
    }
});

// Pagination plugin for mongoose
applicationSchema.plugin(paginationPlugin);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;


