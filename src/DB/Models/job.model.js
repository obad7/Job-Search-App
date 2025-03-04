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
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// virtual populate
jobSchema.virtual("company", {
    ref: "Company",
    localField: "companyId",
    foreignField: "_id",
    justOne: true,
});

jobSchema.virtual("application", {
    ref: "Application",
    localField: "_id",
    foreignField: "jobId",
});

// pagination method
jobSchema.query.paginate = async function (page) {
    page = page ? page : 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    // data, currentPage, totalitems, totalPages, itemsPerPage
    const data = await this.skip(skip).limit(limit);
    const totalItems = await this.model.countDocuments(this.getQuery());

    return {
        data,
        totalItems,
        currentPage: Number(page),
        totalPages: Math.ceil(totalItems / limit),
        itemsPerPage: data.length,
    }

};

const JobModel = mongoose.model("Job", jobSchema);

export default JobModel;