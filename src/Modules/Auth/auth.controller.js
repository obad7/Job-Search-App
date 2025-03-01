import { Router } from "express";
import asyncHandler from "../../utils/error handling/asyncHandler.js";
import * as authService from "./auth.service.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as authValidation from "./auth.validation.js";

const router = Router();

router.post(
    "/register",
    validation(authValidation.registerSchema),
    asyncHandler(authService.register),
);


export default router;