import * as dbService from "../../DB/dbService.js";
import JobModel from "../../DB/Models/job.model.js";
import CompanyModel from "../../DB/Models/company.model.js";
import ApplicationModel from "../../DB/Models/application.model.js";
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";
import { isUserAuthorizedForCompany } from "../../Modules/Company/helpers/checUsers.js";


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


export const getAllJobs = async (req, res, next) => {
    let { companyId } = req.params; // Extract from URL params
    let { companyName, page = 1, sort = -1 } = req.query; // Extract from query params
    sort = parseInt(sort, 10) === 1 ? 1 : -1; // sort is only 1 or -1

    let filter = { deletedAt: null }; // Default filter for all jobs
    // If `companyId` is provided, filter jobs by it
    if (companyId) {
        filter.companyId = companyId;
    }
    // If `companyName` is provided, find the company and filter by its ID
    else if (companyName) {
        const company = await dbService.findOne({ model: CompanyModel, filter: { companyName } });
        if (!company) return next(new Error("Company not found", { cause: 400 }));
        filter.companyId = company._id;
    }

    // If `companyId` or `companyName` is not provided, return all jobs (no company filter)
    // Fetch jobs with pagination
    const jobs = await JobModel.find(filter)
        .sort({ createdAt: sort })
        .paginate(page); // Using `paginate` method from `jobSchema`

    return res.status(200).json({ success: true, data: jobs });

};


export const filterJobs = async (req, res, next) => {
    let { page = 1, sort = -1,
        workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;

    page = parseInt(page, 10) || 1;
    sort = parseInt(sort, 10) === 1 ? 1 : -1;

    let filter = { deletedAt: null }; // Only fetch non-deleted jobs

    // Apply filters if provided
    if (workingTime) filter.workingTime = workingTime;
    if (jobLocation) filter.jobLocation = jobLocation;
    if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
    if (jobTitle) filter.jobTitle = new RegExp(jobTitle, "i"); // Case-insensitive search
    if (technicalSkills) filter.technicalSkills = { $in: technicalSkills.split(",") }; // Match any skill

    // Fetch filtered jobs with pagination
    const jobs = await JobModel.find(filter)
        .sort({ createdAt: sort })
        .paginate(page);

    return res.status(200).json({ success: true, data: jobs });
};


// Apply to Job
export const applyToJob = async (req, res, next) => {
    const { jobId } = req.params;

    // Check if job exists
    const job = await dbService.findOne({ model: JobModel, filter: { _id: jobId } });
    if (!job) return next(new Error("Job not found", { cause: 400 }));

    // Check if user has already applied to this job
    const application = await dbService.findOne({
        model: ApplicationModel,
        filter: { userId: req.user._id, jobId }
    });
    if (application) return next(new Error("You have already applied to this job", { cause: 400 }));

    // Upload CV
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: `Applications/userId-${req.user._id}/jobId-${jobId}/CV`
    });

    // Save application data
    await dbService.create({
        model: ApplicationModel,
        data: {
            jobId: jobId,
            userId: req.user._id,
            userCV: { secure_url, public_id },
        },
    });

    return res.status(200).json({ success: true, message: "Applied to job successfully" });

};


export const getApplicationsRelatedToJob = async (req, res, next) => {
    const { jobId } = req.params;
    const { page } = req.query;
    let { sort } = req.query;
    sort = parseInt(sort, 10) === 1 ? 1 : -1;

    // Check if job exists
    const job = await dbService.findOne({ model: JobModel, filter: { _id: jobId } });
    if (!job) return next(new Error("Job not found", { cause: 400 }));

    // check if the user is authorized to view applications related to the job
    const company = await dbService.findOne({ model: CompanyModel, filter: { _id: job.companyId } });
    if (!isUserAuthorizedForCompany(company, req.user._id))
        return next(new Error("unauthorized", { cause: 400 }));

    // Fetch applications related to the job usuing populate
    const applications = await ApplicationModel
        .find({ jobId: jobId })
        .populate("userId")
        .sort({ createdAt: sort })
        .paginate(page);

    return res.status(200).json({ success: true, data: applications });
}


export const updateApplicationStatus = async (req, res, next) => {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Fetch application and populate job and company data
    const application = await ApplicationModel.findOne({ _id: applicationId })
        .populate({
            path: "jobId",
            populate: { path: "companyId", select: "createdBy HRs" },
            select: "companyId",
        });

    if (!application) return next(new Error("Application not found", { cause: 400 }));
    if (!application.jobId) return next(new Error("Job not found", { cause: 400 }));
    if (!application.jobId.companyId) return next(new Error("Company not found", { cause: 400 }));

    const company = application.jobId.companyId;

    // Check authorization (only company creator or HRs can update)
    if (!isUserAuthorizedForCompany(company, req.user._id))
        return next(new Error("You are not authorized to update this application", { cause: 400 }));

    // Update application status
    application.status = status;
    await application.save();

    return res.status(200).json({ success: true, message: "Application updated successfully" });

};
