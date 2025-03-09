import { Router } from "express";
import asyncHandler from "../../utils/error handling/asyncHandler.js";
import * as companyService from "./company.service.js";
import { validation, validateImageUpload, validatePDFUpload } from "../../Middlewares/validation.middleware.js";
import * as companyValidation from "./company.validation.js";
import { authentication, allowTo } from "../../Middlewares/auth.middleware.js";
import jobRouter from "../Job/job.controller.js";
import { uploadOnCloud } from "../../utils/file uploading/multerCloud.js";
import { exportCompanyApplications } from "../Company/exls/generate.exl.js";

const router = Router();

router.use("/:companyId/job", jobRouter);

router.post(
    "/createCompany",
    authentication(),
    allowTo(["User"]),
    validation(companyValidation.createCompanySchema),
    asyncHandler(companyService.createCompany),
);

router.patch(
    "/updateCompany/:companyId",
    authentication(),
    allowTo(["User"]),
    validation(companyValidation.updateCompanySchema),
    asyncHandler(companyService.updateCompany),
);

router.patch(
    "/softDeleteCompany/:companyId",
    authentication(),
    allowTo(["User", "Admin"]),
    validation(companyValidation.softDeleteCompanySchema),
    asyncHandler(companyService.softDeleteCompany),
);

router.get(
    "/searchCompany",
    asyncHandler(companyService.searchCompany),
);

router.patch(
    "/uploadLogo/:companyId",
    authentication(),
    allowTo(["User"]),
    validation(companyValidation.uploadLogoSchema),
    uploadOnCloud().single("logo"),
    validateImageUpload,
    asyncHandler(companyService.uploadLogo),
);

router.delete(
    "/deleteLogo/:companyId",
    authentication(),
    allowTo(["User"]),
    validation(companyValidation.deleteLogoSchema),
    uploadOnCloud().single("logo"),
    asyncHandler(companyService.deleteLogo),
);

router.patch(
    "/uploadCoverPic/:companyId",
    authentication(),
    allowTo(["User"]),
    validation(companyValidation.uploadCoverPicSchema),
    uploadOnCloud().single("coverPic"),
    validateImageUpload,
    asyncHandler(companyService.uploadCoverPic),
);

router.delete(
    "/deleteCoverPic/:companyId",
    authentication(),
    allowTo(["User"]),
    validation(companyValidation.deleteCoverPicSchema),
    asyncHandler(companyService.deleteCoverPic),
);

router.patch(
    "/legalAttachment/:companyId",
    authentication(),
    allowTo(["User"]),
    validation(companyValidation.legalAttachmentSchema),
    uploadOnCloud().single("legalAttachment"),
    validatePDFUpload,
    asyncHandler(companyService.uploadLegalAttachment),
);

router.get(
    "/getCompany/:companyId",
    authentication(),
    allowTo(["User", "Admin"]),
    validation(companyValidation.getCompanyWithJobsSchema),
    asyncHandler(companyService.getCompanyWithJobs),
)

// export company applications
router.get(
    "/export-company-applications/:companyId",
    asyncHandler(exportCompanyApplications)
);






export default router;