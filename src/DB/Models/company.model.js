import mongoose, { Schema } from "mongoose";
import * as enumTypes from "../enumTypes.js";
const companySchema = new Schema({
    companyName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    industry: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    numberOfEmployees: {
        type: String,
        required: true,
        enum: Object.values(enumTypes.numberOfEmployeesType),
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    logo: {
        secure_url: { type: String },
        public_id: { type: String },
    },
    coverPic: {
        secure_url: { type: String },
        public_id: { type: String },
    },
    HRs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    bannedAt: {
        type: Date,
        default: null,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    legalAttachment: {
        secure_url: { type: String },
        public_id: { type: String },
    },
    approvedByAdmin: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true,
    }
);

const Company = mongoose.model('Company', companySchema);

export default Company;