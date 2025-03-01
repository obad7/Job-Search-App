import joi from "joi";
import { Types } from "mongoose";
import { genderType, roleType } from "../DB/enumTypes.js";

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

export const isValidObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message("id is not valid");
};

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

    // TASK: format: YYYY-MM-DD
    DOB: joi.date().less("now"),


}