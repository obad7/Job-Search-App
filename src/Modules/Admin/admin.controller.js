
import { Router } from "express";
import asyncHandler from "../../utils/error handling/asyncHandler.js";
import * as adminService from "./admin.service.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as adminValidation from "./admin.validation.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";

const router = Router();

router.patch(
    "/ban_unban_user/:userId",
    authentication(),
    allowTo(["Admin"]),
    validation(adminValidation.banAndUnbanUserSchema),
    asyncHandler(adminService.ban_unban_user),
);

router.patch(
    "/ban_unban_company/:companyId",
    authentication(),
    allowTo(["Admin"]),
    validation(adminValidation.banAndUnbanCompanySchema),
    asyncHandler(adminService.ban_unban_company),
);

export default router;