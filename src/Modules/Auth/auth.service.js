import * as dbService from "../../DB/dbService.js";
import UserModel from "../../DB/Models/user.model.js";
import { emailEmitter } from "../../utils/emails/emailEvents.js";
import * as enumTypes from "../../DB/enumTypes.js";
import { compareHash } from "../../utils/hashing/hash.js";
import { generateToken } from "../../utils/token/token.js";
import OTPModel from "../../DB/Models/OTP.model.js";
import { decodedToken } from "../../Middlewares/auth.middleware.js";

export const signUp = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    const user = await dbService.findOne({ model: UserModel, filter: { email } });
    if (user) return next(new Error("User already exists", { cause: 400 }));

    const newUser = await dbService.create({
        model: UserModel,
        data: { firstName, lastName, email, password }
    });

    const findNewUser = await dbService.findOne({ model: UserModel, filter: { email } });
    emailEmitter.emit("sendEmail", findNewUser.userName, email, findNewUser._id);

    return res.status(200).json({
        success: true,
        message: newUser,
    });
};

export const confirmOTP = async (req, res, next) => {
    const { email, otp } = req.body;

    // Find the user
    const user = await dbService.findOne({ model: UserModel, filter: { email } });
    if (!user) return next(new Error("User not found", { cause: 400 }));
    if (user.isConfirmed) return next(new Error("Email already confirmed", { cause: 400 }));

    // Find the OTP in OTPModel
    const OTP = await OTPModel.findOne({
        userId: user._id,
        type: enumTypes.OTPType.confirmEmail
    });

    // Check if OTP expired
    const now = new Date();
    const otpExpiryTime = new Date(OTP.createdAt.getTime() + (60000 * 10)); // 10 minutes
    if (now > otpExpiryTime)
        return next(new Error("OTP has expired", { cause: 400 }));

    // Compare correct OTP
    if (!compareHash({ plainText: otp, hash: OTP.code })) {
        return next(new Error("Invalid OTP", { cause: 400 }));
    }

    user.isConfirmed = true;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Email confirmed successfully",
    });
};


export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await dbService.findOne({ model: UserModel, filter: { email } });
    if (!user) return next(new Error("User not found", { cause: 400 }));
    if (!user.isConfirmed) return next(new Error("Email not confirmed. Please confirm your email", { cause: 400 }));

    if (!compareHash({ plainText: password, hash: user.password }))
        return next(new Error("Invalid password", { cause: 400 }))

    const sccessToken = generateToken({
        payload: { id: user._id },
        signature:
            user.role === enumTypes.roleType.User
                ? process.env.USER_ACCESS_TOKEN
                : process.env.ADMIN_ACCESS_TOKEN,
        options: { expiresIn: process.env.ACCSESS_TOKEN_EXPIRES },
    });

    const refreshToken = generateToken({
        payload: { id: user._id },
        signature:
            user.role === enumTypes.roleType.User
                ? process.env.USER_REFRESH_TOKEN
                : process.env.ADMIN_REFRESH_TOKEN,
        options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRES },
    });

    return res.status(200).json({
        success: true,
        tokens: {
            accessToken: sccessToken,
            refreshToken: refreshToken,
        },
    });
};


export const forgetPasswordOTP = async (req, res, next) => {
    const { email } = req.body;

    const user = await dbService.findOne({ model: UserModel, filter: { email } });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    emailEmitter.emit("forgetPassword", email, user.userName, user._id);

    return res.status(200).json({
        success: true,
        message: "email sent successfully",
    });
};


export const resetPassword = async (req, res, next) => {
    const { email, otp, password } = req.body;

    // Find the user
    const user = await dbService.findOne({ model: UserModel, filter: { email, deletedAt: null } });
    if (!user) return next(new Error("User not found", { cause: 400 }));

    // Find OTP for password reset
    const OTP = await OTPModel.findOne({
        userId: user._id,
        type: enumTypes.OTPType.forgetPassword
    });

    // Check if OTP expired
    const now = new Date();
    const otpExpiryTime = new Date(OTP.createdAt.getTime() + (60000 * 10)); // 10 minutes
    if (now > otpExpiryTime)
        return next(new Error("OTP has expired", { cause: 400 }));

    // Compare OTP
    if (!compareHash({ plainText: otp, hash: OTP.code })) {
        return next(new Error("Invalid OTP", { cause: 400 }));
    }

    // Set new password & call save() to trigger hashing middleware in the model
    user.password = password;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Password reset successfully",
    });
};

export const refresh_token = async (req, res, next) => {
    const { authorization } = req.headers;
    const user = await decodedToken({
        authorization,
        tokenType: enumTypes.tokenType.refresh,
        next: next
    });

    const accessToken = generateToken({
        payload: { id: user._id },
        signature:
            user.role === enumTypes.roleType.User
                ? process.env.USER_ACCESS_TOKEN
                : process.env.ADMIN_ACCESS_TOKEN,
    });

    const refreshToken = generateToken({
        payload: { id: user._id },
        signature:
            user.role === enumTypes.roleType.User
                ? process.env.USER_REFRESH_TOKEN
                : process.env.ADMIN_REFRESH_TOKEN,
    });

    return res.status(200).json({
        success: true,
        tokens: {
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
    });
};

