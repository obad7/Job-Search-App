import * as dbService from "../../DB/dbService.js";
import UserModel from "../../DB/Models/user.model.js";
import { encrypt } from "../../utils/encryption/encryption.js";
import { compareHash } from "../../utils/hashing/hash.js";
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";


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
        message: "Profile updated successfully",
    });

};


export const getProfile = async (req, res, next) => {

    const user = await dbService.findOne({
        model: UserModel,
        filter: { _id: req.user._id, deletedAt: null },
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


export const updatePassword = async (req, res, next) => {
    const { oldPassword, password } = req.body;

    if (!compareHash({ plainText: oldPassword, hash: req.user.password }))
        return next(new Error("Invalid password", { cause: 400 }));

    const user = await dbService.findOne({
        model: UserModel,
        filter: { _id: req.user._id, deletedAt: null },
    });

    // use user.save(); to trigger hashing hook
    user.password = password;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
}


export const uploadProfilePic = async (req, res, next) => {

    const user = await dbService.findById({
        model: UserModel,
        id: { _id: req.user._idm },
    });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path,
        { folder: `Users/${user._id}/profilePic` }
    );

    user.profilePic = { public_id, secure_url };
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
    });
}


export const deleteProfilePic = async (req, res, next) => {

    const user = await dbService.findById({
        model: UserModel,
        id: { _id: req.user._id },
    });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    if (user.profilePic.public_id) {
        await cloudinary.uploader.destroy(user.profilePic.public_id);
    }

    user.profilePic = null;
    await user.save();

    return res.status(200).json({
        success: true,
        message: " Profile picture deleted successfully",
    });
}


export const uploadCoverPic = async (req, res, next) => {
    const user = await dbService.findById({
        model: UserModel,
        id: { _id: req.user._id },
    });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path,
        { folder: `Users/${user._id}/coverPic` }
    );

    user.coverPic = { public_id, secure_url };
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Cover picture uploaded successfully",
    });
}


export const deleteCoverPic = async (req, res, next) => {
    const user = await dbService.findById({
        model: UserModel,
        id: { _id: req.user._id },
    });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    if (user.coverPic.public_id) {
        await cloudinary.uploader.destroy(user.coverPic.public_id);
    }

    user.coverPic = null;
    await user.save();

    return res.status(200).json({
        success: true,
        message: " Cover picture deleted successfully",
    });
}


export const softDeleteProfile = async (req, res, next) => {
    const user = await dbService.findById({
        model: UserModel,
        id: { _id: req.user._id },
    });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    user.deletedAt = new Date();
    await user.save();

    return res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
}