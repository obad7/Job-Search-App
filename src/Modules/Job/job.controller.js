import { Router } from "express";
import asyncHandler from "../../utils/error handling/asyncHandler.js";
import * as jobService from "./job.service.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as jobValidation from "./job.validation.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";

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

export default router;