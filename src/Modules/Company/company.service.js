import * as dbService from "../../DB/dbService.js";
import CompanyModel from "../../DB/Models/company.model.js";
import UserModel from "../../DB/Models/user.model.js";


export const createCompany = async (req, res, next) => {
    const { companyName, companyEmail, numberOfEmployees } = req.body;

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
            numberOfEmployees
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