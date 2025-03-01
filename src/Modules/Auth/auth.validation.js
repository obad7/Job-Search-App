import joi from "joi";
import { generalFaileds } from "../../Middlewares/validation.middleware.js";

export const registerSchema = joi.object({
    firstName: generalFaileds.firstName.required(),
    lastName: generalFaileds.lastName.required(),
    email: generalFaileds.email.required(),
    password: generalFaileds.password.required(),
    confirmPassword: generalFaileds.confirmPassword.required(),
    role: generalFaileds.role,
    gender: generalFaileds.gender,
    mobileNumber: generalFaileds.mobileNumber,
    DOB: generalFaileds.DOB,
}).required();