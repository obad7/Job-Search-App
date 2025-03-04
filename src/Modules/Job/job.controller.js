import { Router } from "express";
import asyncHandler from "../../utils/error handling/asyncHandler.js";
import * as jobService from "./job.service.js";
import { validation, validatePDFUpload } from "../../Middlewares/validation.middleware.js";
import * as jobValidation from "./job.validation.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
import { uploadOnCloud } from "../../utils/file uploading/multerCloud.js";

const router = Router({ mergeParams: true });

// mergeParams
// company/:companyId/job/createJob
router.post(
    "/createJob",
    authentication(),
    allowTo(["User"]),
    validation(jobValidation.createJobSchema),
    asyncHandler(jobService.createJob),
);

router.patch(
    "/updateJob/:jobId",
    authentication(),
    allowTo(["User"]),
    validation(jobValidation.updateJobSchema),
    asyncHandler(jobService.updateJob),
);

// mergeParams
// company/:companyId/job/deleteJob/:jobId
router.delete(
    "/deleteJob/:jobId",
    authentication(),
    allowTo(["User"]),
    validation(jobValidation.deleteJobSchema),
    asyncHandler(jobService.deleteJob),
);

// mergeParams
// use this if u want to search company ID: company/:companyId/job/getAllJob
// use this if u want to search company name: /job/getAllJob
router.get(
    "/getAllJobs",
    authentication(),
    allowTo(["User", "Admin"]),
    asyncHandler(jobService.getAllJobs),
);

router.get(
    "/filterJobs",
    authentication(),
    allowTo(["User", "Admin"]),
    asyncHandler(jobService.filterJobs)
);

router.post(
    "/applyToJob/:jobId",
    authentication(),
    allowTo(["User"]),
    validation(jobValidation.applyToJobSchema),
    uploadOnCloud().single("CV"),
    validatePDFUpload, // middleware to validate PDF
    asyncHandler(jobService.applyToJob),
);

router.get(
    "/getApplications/:jobId",
    authentication(),
    allowTo(["User"]),
    validation(jobValidation.getApplicationsSchema),
    asyncHandler(jobService.getApplicationsRelatedToJob),
);

router.patch(
    "/:jobId/updateApplicationStatus/:applicationId",
    authentication(),
    allowTo(["User"]),
    validation(jobValidation.updateApplicationSchema),
    asyncHandler(jobService.updateApplicationStatus),
);

export default router;