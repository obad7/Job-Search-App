import * as dbService from "../../DB/dbService.js";
import UserModel from "../../DB/Models/user.model.js";
import { encrypt } from "../../utils/encryption/encryption.js";


export const updateProfile = async (req, res, next) => {

    if (req.body.mobileNumber) {
        req.body.mobileNumber = encrypt({
            plainText: req.body.mobileNumber,
            signature: process.env.ENCRYPTION_KEY,
        });
    }

    const user = await dbService.findByIdAndUpdate({
        model: UserModel,
        id: req.user._id,
        data: { ...req.body },
        options: { new: true, runValidators: true },
    })

    return res.status(200).json({
        success: true,
        data: { user },
    });

};

export const getProfile = async (req, res, next) => {

    const user = await dbService.findOne({
        model: UserModel,
        filter: { _id: req.user._id }
    });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    return res.status(200).json({
        success: true,
        data: { user },
    });
};