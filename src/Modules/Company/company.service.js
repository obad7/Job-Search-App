import * as dbService from "../../DB/dbService.js";
import CompanyModel from "../../DB/Models/company.model.js";
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";

export const createCompany = async (req, res, next) => {
    const { companyName, companyEmail, numberOfEmployees, HR } = req.body;

    // Check if company name or email already exists
    const existingCompany = await dbService.findOne({
        model: CompanyModel,
        filter: { $or: [{ companyEmail }, { companyName }] },
    });
    if (existingCompany) return next(new Error("Company already exists", { cause: 400 }));

    const newCompany = await dbService.create({
        model: CompanyModel,
        data: {
            createdBy: req.user._id,
            companyName,
            companyEmail,
            numberOfEmployees,
            HRs: Array.isArray(HR) ? [...HR, req.user._id] : [req.user._id],
        },
    });

    return res.status(201).json({ success: true, data: newCompany });
};


export const updateCompany = async (req, res, next) => {
    const { companyId } = req.params;

    // Check if company exists
    const company = await dbService.findOne({ model: CompanyModel, filter: { _id: companyId } });
    if (!company) return next(new Error("Company not found", { cause: 400 }));

    // Check if company belongs to the user
    if (company.createdBy.toString() !== req.user._id.toString())
        return next(new Error("You are not authorized to update this company", { cause: 400 }));

    // Check if legalAttachment is not allowed to update
    if (req.body.legalAttachment)
        return next(new Error("legalAttachment is not allowed to update", { cause: 400 }));

    const updatedCompany = await dbService.findByIdAndUpdate({
        model: CompanyModel,
        id: companyId,
        data: { ...req.body },
        options: { new: true, runValidators: true },
    });

    return res.status(201).json({ success: true, data: updatedCompany });
};


export const softDeleteCompany = async (req, res, next) => {
    const { companyId } = req.params;

    // Check if company exists
    const company = await dbService.findOne({
        model: CompanyModel,
        filter: { _id: companyId, deletedAt: null }
    });
    if (!company) return next(new Error("Company not found"));

    // Check if the user is authorized to delete
    if (req.user.role === "Admin" || company.createdBy.toString() === req.user._id.toString()) {
        company.deletedAt = new Date();
        await company.save();
        return res.status(200).json({ success: true, message: "Company deleted successfully" });
    }
    return next(new Error("You are not authorized to delete this company"));
};


export const searchCompany = async (req, res, next) => {
    const { companyName } = req.query;

    const companies = await dbService.find({
        model: CompanyModel,
        filter: { companyName: { $regex: companyName, $options: "i" } },
    });

    return res.status(200).json({ success: true, data: companies });
};


export const uploadLogo = async (req, res, next) => {
    const { companyId } = req.params;

    // Check if company exists
    const company = await dbService.findOne({ model: CompanyModel, filter: { _id: companyId } });
    if (!company) return next(new Error("Company not found", { cause: 400 }));

    // Check if company belongs to the user
    if (company.createdBy.toString() !== req.user._id.toString() && !company.HRs.includes(req.user._id))
        return next(new Error("You are not authorized to update this company", { cause: 400 }));

    // Upload logo
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path,
        { folder: `Companies/${company._id}/logo` }
    );

    company.logo = { public_id, secure_url };
    await company.save();

    return res.status(201).json({ success: true, message: "Logo uploaded successfully" });

};


export const deleteLogo = async (req, res, next) => {
    const { companyId } = req.params;

    // Check if company exists
    const company = await dbService.findOne({ model: CompanyModel, filter: { _id: companyId } });
    if (!company) return next(new Error("Company not found", { cause: 400 }));

    // Check if company belongs to the user
    if (company.createdBy.toString() !== req.user._id.toString() && !company.HRs.includes(req.user._id))
        return next(new Error("You are not authorized to update this company", { cause: 400 }));

    // Delete logo
    if (company.logo.public_id) await cloudinary.uploader.destroy(company.logo.public_id);

    company.logo = null;
    await company.save();

    return res.status(200).json({ success: true, message: "Logo deleted successfully" });
};


export const uploadCoverPic = async (req, res, next) => {
    const { companyId } = req.params;

    // Check if company exists
    const company = await dbService.findOne({ model: CompanyModel, filter: { _id: companyId } });
    if (!company) return next(new Error("Company not found", { cause: 400 }));

    // Check if company belongs to the user
    if (company.createdBy.toString() !== req.user._id.toString() && !company.HRs.includes(req.user._id))
        return next(new Error("You are not authorized to update this company", { cause: 400 }));

    // Upload cover picture
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path,
        { folder: `Companies/${company._id}/coverPic` }
    );

    company.coverPic = { public_id, secure_url };
    await company.save();

    return res.status(201).json({ success: true, message: "Cover picture uploaded successfully" });
};


export const deleteCoverPic = async (req, res, next) => {
    const { companyId } = req.params;

    // Check if company exists
    const company = await dbService.findOne({ model: CompanyModel, filter: { _id: companyId } });
    if (!company) return next(new Error("Company not found", { cause: 400 }));

    // Check if company belongs to the user
    if (company.createdBy.toString() !== req.user._id.toString() && !company.HRs.includes(req.user._id))
        return next(new Error("You are not authorized to update this company", { cause: 400 }));

    // Delete cover picture
    if (company.coverPic.public_id) await cloudinary.uploader.destroy(company.coverPic.public_id);

    company.coverPic = null;
    await company.save();

    return res.status(200).json({ success: true, message: "Cover picture deleted successfully" });
};

//legalAttachment (PDF or img) ⇒ {secure_url,public_id}


export const uploadLegalAttachment = async (req, res, next) => {
    const { companyId } = req.params;

    // Check if company exists
    const company = await dbService.findOne({ model: CompanyModel, filter: { _id: companyId } });
    if (!company) return next(new Error("Company not found", { cause: 400 }));

    // Check if company belongs to the user
    if (company.createdBy.toString() !== req.user._id.toString() && !company.HRs.includes(req.user._id))
        return next(new Error("You are not authorized to update this company", { cause: 400 }));

    // Upload legal attachment
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path,
        { folder: `Companies/${company._id}/legalAttachment` }
    );

    company.legalAttachment = { public_id, secure_url };
    await company.save();

    return res.status(201).json({ success: true, message: "Legal attachment uploaded successfully" });
};