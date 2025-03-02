import { Router } from "express";
import asyncHandler from "../../utils/error handling/asyncHandler.js";
import * as jobService from "./job.service.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as jobValidation from "./job.validation.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

router.post(
    "/createJob",
    authentication(),
    allowTo(["User"]),
    validation(jobValidation.createJobSchema),
    asyncHandler(jobService.createJob),
);


export default router;