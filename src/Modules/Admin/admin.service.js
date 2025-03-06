import * as dbService from "../../DB/dbService.js";
import UserModel from "../../DB/Models/user.model.js";
import CompanyModel from "../../DB/Models/company.model.js";

export const ban_unban_user = async (req, res, next) => {
    const { userId } = req.params;

    const user = await dbService.findOne({ model: UserModel, filter: { _id: userId } });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    if (user.role === "Admin")
        return next(new Error("You cannot ban an admin", { cause: 400 }));

    // Toggle bannedAt field
    user.bannedAt = user.bannedAt ? null : new Date();
    await user.save();

    const message = user.bannedAt
        ? "User banned successfully"
        : "User unbanned successfully";
    return res.status(200).json({ success: true, message });

};


// Ban or unbanned specific company
export const ban_unban_company = async (req, res, next) => {
    const { companyId } = req.params;

    const company = await dbService.findOne({ model: CompanyModel, filter: { _id: companyId } });
    if (!company) return next(new Error("Company not found", { cause: 400 }));

    // Toggle bannedAt field
    company.bannedAt = company.bannedAt ? null : new Date();
    await company.save();

    const message = company.bannedAt
        ? "Company banned successfully"
        : "Company unbanned successfully";
    return res.status(200).json({ success: true, message });
};