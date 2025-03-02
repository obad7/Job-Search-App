import { Router } from "express";
import asyncHandler from "../../utils/error handling/asyncHandler.js";
import * as companyService from "./company.service.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as companyValidation from "./company.validation.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";

const router = Router();

router.post(
    "/createCompany",
    authentication(),
    allowTo(["User"]),
    validation(companyValidation.createCompanySchema),
    asyncHandler(companyService.createCompany),
);

router.patch(
    "/updateCompany/:companyId",
    authentication(),
    allowTo(["User"]),
    validation(companyValidation.updateCompanySchema),
    asyncHandler(companyService.updateCompany),
);

router.patch(
    "/softDeleteCompany/:companyId",
    authentication(),
    allowTo(["User", "Admin"]),
    validation(companyValidation.softDeleteCompanySchema),
    asyncHandler(companyService.softDeleteCompany),
);

export default router;