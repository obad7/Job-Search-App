import joi from "joi";
import { generalFaileds } from "../../Middlewares/validation.middleware.js";

export const signUpSchema = joi.object({
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

export const confirmOTPSchema = joi.object({
    email: generalFaileds.email.required(),
    otp: generalFaileds.code.required(),
}).required();

export const signInSchema = joi.object({
    email: generalFaileds.email.required(),
    password: generalFaileds.password.required(),
}).required();