import * as dbService from "../../DB/dbService.js";
import CompanyModel from "../../DB/Models/company.model.js";


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