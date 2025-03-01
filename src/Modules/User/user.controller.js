import { Router } from "express";
import asyncHandler from "../../utils/error handling/asyncHandler.js";
import * as userService from "./user.service.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as userValidation from "./user.validation.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";

const router = Router();

router.patch(
    "/updateProfile",
    authentication(),
    allowTo(["User"]),
    validation(userValidation.updateProfileSchema),
    asyncHandler(userService.updateProfile),
);

export default router;