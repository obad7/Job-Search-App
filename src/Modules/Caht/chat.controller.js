import { Router } from "express";
import asyncHandler from "../../utils/error handling/asyncHandler.js";
import * as chatService from "./chat.service.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as chatValidation from "./chat.validation.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";

const router = Router();

router.post(
    "/getChat/:receiverId",
    authentication(),
    allowTo(["User"]),
    validation(chatValidation.getChatsSchema),
    asyncHandler(chatService.getChat),
);

router.post(
    "/sendMessage/:receiverId",
    authentication(),
    allowTo(["User"]),
    validation(chatValidation.sendMessageSchema),
    asyncHandler(chatService.sendMessage),
);

export default router;