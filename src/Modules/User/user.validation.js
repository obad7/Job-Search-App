import joi from "joi";
import { generalFaileds } from "../../Middlewares/validation.middleware.js";

export const updateProfileSchema = joi.object({
    firstName: generalFaileds.firstName,
    lastName: generalFaileds.lastName,
    gender: generalFaileds.gender,
    DOB: generalFaileds.DOB,
    mobileNumber: generalFaileds.mobileNumber,
})