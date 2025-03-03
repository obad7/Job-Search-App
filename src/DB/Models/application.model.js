import mongoose from "mongoose";
import * as enumTypes from "../enumTypes.js";

const applicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userCV: {
            secure_url: { type: String },
            public_id: { type: String },
        },
        status: {
            type: String,
            enum: Object.values(enumTypes.applicationStatusType),
            default: enumTypes.applicationStatusType.pending,
        },
    },
    { timestamps: true }
);

const ApplicationModel = mongoose.model("Application", applicationSchema);
export default ApplicationModel;