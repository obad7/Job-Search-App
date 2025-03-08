import mongoose from "mongoose";
import * as enumTypes from "../enumTypes.js";
import paginationPlugin from "../../utils/Plugins/paginationPlugin.js";

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
// pagination plugin for mongoose
jobSchema.plugin(paginationPlugin);

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

// Delete job and related applications
jobSchema.pre("deleteOne", { document: false, query: true }, async function (next) {
    const job = await this.model.findOne(this.getFilter());
    if (job) {
        const ApplicationModel = mongoose.model("Application");
        await ApplicationModel.deleteMany({ jobId: job._id });
    }
    next();
});

const JobModel = mongoose.model("Job", jobSchema);
export default JobModel;