import joi from "joi";
import { generalFaileds } from "../../Middlewares/validation.middleware.js";

export const banAndUnbanUserSchema = joi.object({
    userId: generalFaileds.id.required(),
})
