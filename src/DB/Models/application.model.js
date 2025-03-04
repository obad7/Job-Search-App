import mongoose from "mongoose";
import * as enumTypes from "../enumTypes.js";
import paginationPlugin from "../../utils/Plugins/paginationPlugin.js";

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
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// apply pagination to the model
applicationSchema.plugin(paginationPlugin);

const ApplicationModel = mongoose.model("Application", applicationSchema);
export default ApplicationModel;