import mongoose from "mongoose";
import * as enumTypes from "../enumTypes.js";

const jobSchema = new mongoose.Schema(
    {
        jobTitle: {
            type: String,
            required: true,
            trim: true,
        },
        jobLocation: {
            type: String,
            enum: Object.values(enumTypes.jobLocationType),
            required: true,
        },
        workingTime: {
            type: String,
            enum: Object.values(enumTypes.workingTimeType),
            required: true,
        },
        seniorityLevel: {
            type: String,
            enum: Object.values(enumTypes.seniorityLevelType),
            required: true,
        },
        jobDescription: {
            type: String,
            required: true,
            trim: true,
        },
        technicalSkills: {
            type: [String],
            required: true,
        },
        softSkills: {
            type: [String],
            required: true,
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        closed: {
            type: Boolean,
            default: false,
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
    },
    { timestamps: true }
);

const JobModel = mongoose.model("JobModel", jobSchema);

export default JobModel;