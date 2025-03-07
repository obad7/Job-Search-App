import joi from "joi";
import { generalFaileds } from "../../Middlewares/validation.middleware.js";

export const getChatsSchema = joi.object({
    receiverId: generalFaileds.id.required(),
})

export const sendMessageSchema = joi.object({
    receiverId: generalFaileds.id.required(),
    message: joi.string().required(),
}).required();