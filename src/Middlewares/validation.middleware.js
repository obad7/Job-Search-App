import joi from "joi";
import { Types } from "mongoose";
import { genderType, roleType } from "../DB/enumTypes.js";

// validation middleware
export const validation = (schema) => {
    return (req, res, next) => {
        const data = { ...req.body, ...req.params, ...req.query };
        if (req.file || req.files?.length) {
            data.file = req.file || req.files;
        }
        const results = schema.validate(data, { abortEarly: false });
        if (results.error) {
            const errorMessage = results.error.details.map((obj) => obj.message);
            return next(new Error(errorMessage, { cause: 400 }));
        }
        return next();
    };
};

// validate pdf upload
export const validatePDFUpload = (req, res, next) => {
    if (!req.file) {
        return next(new Error("No file uploaded!", { cause: 400 }));
    }

    if (req.file.mimetype !== "application/pdf") {
        return next(new Error("Only PDF files are allowed!", { cause: 400 }));
    }

    next();
};

// validate image upload
const validateImageUpload = (req, res, next) => {
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedImageTypes.includes(req.file.mimetype)) {
        return next(new Error("Only JPG, JPEG, and PNG images are allowed!", { cause: 400 }));
    }
    next();
};

// validate object id
export const isValidObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message("id is not valid");
};

// minimum date of birth
const minDOB = new Date();
minDOB.setFullYear(minDOB.getFullYear() - 18);

// general faileds object
export const generalFaileds = {
    id: joi.string().custom(isValidObjectId),
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi
        .string()
        .email({
            minDomainSegments: 2,
            maxDomainSegments: 2,
            tlds: { allow: ["com", "net"] }
        }),
    password: joi.string(),
    confirmPassword: joi.string().valid(joi.ref('password')),
    role: joi.string().valid(...Object.values(roleType)),
    gender: joi.string().valid(...Object.values(genderType)),
    mobileNumber: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    // format: YYYY-MM-DD
    DOB: joi.date()
        .less("now") // Must be in the past
        .max(minDOB) // Must be at least 18 years old
        .iso(),// Ensures strict format YYYY-MM-DD
    code: joi.string().pattern(new RegExp(/^[0-9]{6}$/)),
    fileObject: joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        size: joi.number().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
    })

}