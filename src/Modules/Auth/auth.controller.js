import { Router } from "express";
import asyncHandler from "../../utils/error handling/asyncHandler.js";
import * as authService from "./auth.service.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as authValidation from "./auth.validation.js";

const router = Router();

router.post(
    "/signUp",
    validation(authValidation.signUpSchema),
    asyncHandler(authService.signUp),
);

router.patch(
    "/confirmOTP",
    validation(authValidation.confirmOTPSchema),
    asyncHandler(authService.confirmOTP),
);

router.post(
    "/signIn",
    validation(authValidation.signInSchema),
    asyncHandler(authService.signIn),
);


export default router;