import mongoose from "mongoose";
import * as enumTypes from "../enumTypes.js";

const jobSchema = new mongoose.Schema(
    {
        jobTitle: {
            type: String,
            required: true,
        },
        jobLocation: {
            type: String,
            enum: Object.values(enumTypes.jobLocationType),
        },
        workingTime: {
            type: String,
            enum: Object.values(enumTypes.workingTimeType),
        },
        seniorityLevel: {
            type: String,
            enum: Object.values(enumTypes.seniorityLevelType),
        },
        jobDescription: {
            type: String,
        },
        technicalSkills: {
            type: [String],
        },
        softSkills: {
            type: [String],
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
        },
    },
    { timestamps: true }
);

// virtual populate
jobSchema.virtual("company", {
    ref: "Company",
    localField: "companyId",
    foreignField: "_id",
    justOne: true,
});


const JobModel = mongoose.model("Job", jobSchema);

export default JobModel;