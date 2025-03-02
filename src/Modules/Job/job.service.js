import * as dbService from "../../DB/dbService.js";
import JobModel from "../../DB/Models/job.model.js";
import CompanyModel from "../../DB/Models/company.model.js";


export const createJob = async (req, res, next) => {
    const { companyId } = req.params;
    // Check if company exists
    const company = await dbService.findOne({ model: CompanyModel, filter: { _id: companyId } });
    if (!company) return next(new Error("Company not found", { cause: 400 }));

    // Check if the user is authorized to create job
    if (company.createdBy.toString() !== req.user._id.toString()
        && !company.HRs.includes(req.user._id)) {
        return next(new Error("You are not authorized to create job for this company", { cause: 400 }));
    }

    const newJob = await dbService.create({
        model: JobModel,
        data: { ...req.body, addedBy: req.user._id, companyId: companyId },
    });

    return res.status(200).json({ success: true, data: newJob });
};


export const updateJob = async (req, res, next) => {
    const { jobId } = req.params;
    // Check if job exists
    const job = await dbService.findOne({ model: JobModel, filter: { _id: jobId } });
    if (!job) return next(new Error("Job not found", { cause: 400 }));

    // Check if the user is authorized to update job
    if (job.addedBy.toString() !== req.user._id.toString()) {
        return next(new Error("You are not authorized to update this job", { cause: 400 }));
    }

    const updatedJob = await dbService.findByIdAndUpdate({
        model: JobModel,
        id: jobId,
        data: { ...req.body, updatedBy: req.user._id },
        options: { new: true, runValidators: true },
    });

    return res.status(200).json({ success: true, data: updatedJob });
};


export const deleteJob = async (req, res, next) => {
    const { companyId, jobId } = req.params;
    // Check if job exists
    const job = await dbService.findOne({
        model: JobModel,
        filter: { _id: jobId },
    });
    if (!job) return next(new Error("Job not found", { cause: 400 }));

    // Check if the user is the HR of the company
    const company = await dbService.findOne({ model: CompanyModel, filter: { _id: companyId } });
    if (!company.HRs.includes(req.user._id)) {
        return next(new Error("You are not authorized to delete this job", { cause: 400 }));
    }

    await dbService.findByIdAndDelete({ model: JobModel, id: jobId });

    return res.status(200).json({ success: true, message: "Job deleted successfully" });
};

// 4. Get all Jobs or a specific one for a specific company.
// - using merge params and optional params
// - use pagination(skip, limit, sort(ex.by createdAt) and total count)
// - user can search for company by it’s name


// export const getAllJobs = async (req, res, next) => {
//     const { companyId } = req.params;
//     // Check if company exists
//     const company = await dbService.findOne({ model: CompanyModel, filter: { _id: companyId } });
//     if (!company) return next(new Error("Company not found", { cause: 400 }));

//     const jobs = await dbService.find({
//         model: JobModel,
//         filter: { companyId: companyId },
//         options: { sort: { createdAt: -1 } },
//     });

//     return res.status(200).json({ success: true, data: jobs });
// };