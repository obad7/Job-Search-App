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

export const viewOthersProfile = async (req, res, next) => {
    const { userId } = req.params;

    const user = await UserModel.findById(userId)
        .select("firstName lastName mobileNumber profilePic coverPic -_id")
        .lean(); // Convert to plain JavaScript object

    if (!user) return next(new Error("User not found", { cause: 400 }));

    // Construct the userName
    const userName = `${user.firstName} ${user.lastName}`;

    // Remove firstName and lastName from the response
    delete user.firstName;
    delete user.lastName;

    // Add userName to the response
    user.userName = userName;

    return res.status(200).json({
        success: true,
        data: user,
    });
};