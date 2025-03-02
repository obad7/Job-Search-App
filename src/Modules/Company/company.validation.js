import joi from "joi";
import { generalFaileds } from "../../Middlewares/validation.middleware.js";
import * as enumTypes from "../../DB/enumTypes.js";

export const createCompanySchema = joi.object({
    companyName: joi.string().required(),
    companyEmail: generalFaileds.email.required(),
    numberOfEmployees: joi.string()
        .valid(...Object.values(enumTypes.numberOfEmployeesType)).required()
}).required();

export const updateCompanySchema = joi.object({
    companyId: generalFaileds.id.required(),
    companyName: joi.string(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.string().valid(...Object.values(enumTypes.numberOfEmployeesType)),
}).required();

export const softDeleteCompanySchema = joi.object({
    companyId: generalFaileds.id.required(),
}).required();

export const uploadLogoSchema = joi.object({
    companyId: generalFaileds.id.required(),
}).required();

export const deleteLogoSchema = joi.object({
    companyId: generalFaileds.id.required(),
}).required();

export const uploadCoverPicSchema = joi.object({
    companyId: generalFaileds.id.required(),
}).required();

export const deleteCoverPicSchema = joi.object({
    companyId: generalFaileds.id.required(),
}).required();