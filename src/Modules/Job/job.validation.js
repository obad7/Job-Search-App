import joi from "joi";
import { generalFaileds } from "../../Middlewares/validation.middleware.js";
import * as enumTypes from "../../DB/enumTypes.js";

export const createJobSchema = joi.object({
    companyId: generalFaileds.id.required(),
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid(...Object.values(enumTypes.jobLocationType)).required(),
    workingTime: joi.string().valid(...Object.values(enumTypes.workingTimeType)).required(),
    seniorityLevel: joi.string().valid(...Object.values(enumTypes.seniorityLevelType)).required(),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string())
}).required();

export const updateJobSchema = joi.object({
    jobId: generalFaileds.id.required(),
    jobTitle: joi.string(),
    jobLocation: joi.string().valid(...Object.values(enumTypes.jobLocationType)),
    workingTime: joi.string().valid(...Object.values(enumTypes.workingTimeType)),
    seniorityLevel: joi.string().valid(...Object.values(enumTypes.seniorityLevelType)),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
}).required();

export const deleteJobSchema = joi.object({
    companyId: generalFaileds.id.required(),
    jobId: generalFaileds.id.required(),
}).required();