import { Router } from "express";
import asyncHandler from "../../utils/error handling/asyncHandler.js";
import * as userService from "./user.service.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as userValidation from "./user.validation.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
import { uploadOnCloud } from "../../utils/file uploading/multerCloud.js";

const router = Router();

router.patch(
    "/updateProfile",
    authentication(),
    allowTo(["User"]),
    validation(userValidation.updateProfileSchema),
    asyncHandler(userService.updateProfile),
);

router.get(
    "/getProfile",
    authentication(),
    allowTo(["User"]),
    asyncHandler(userService.getProfile),
);

router.get(
    "/viewOthersProfile/:userId",
    authentication(),
    allowTo(["User"]),
    validation(userValidation.viewOthersProfileSchema),
    asyncHandler(userService.viewOthersProfile),
);

router.patch(
    "/updatePassword",
    authentication(),
    allowTo(["User"]),
    validation(userValidation.updatePasswordSchema),
    asyncHandler(userService.updatePassword),
);

router.patch(
    "/uploadProfilePic",
    authentication(),
    uploadOnCloud().single("profilePic"),
    asyncHandler(userService.uploadProfilePic),
);

router.delete(
    "/deleteProfilePic",
    authentication(),
    uploadOnCloud().single("profilePic"),
    asyncHandler(userService.deleteProfilePic),
);

router.patch(
    "/uploadCoverPic",
    authentication(),
    uploadOnCloud().single("coverPic"),
    asyncHandler(userService.uploadCoverPic),
);

router.delete(
    "/deleteCoverPic",
    authentication(),
    uploadOnCloud().single("coverPic"),
    asyncHandler(userService.deleteCoverPic),
);

export default router;