import * as dbService from "../../DB/dbService.js";
import UserModel from "../../DB/Models/user.model.js";
import { emailEmitter } from "../../utils/emails/emailEvents.js";
import * as enumTypes from "../../DB/enumTypes.js";
import { compareHash } from "../../utils/hashing/hash.js";
import { generateToken } from "../../utils/token/token.js";

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
}


export const confirmOTP = async (req, res, next) => {
    const { email, otp } = req.body;

    const user = await dbService.findOne({ model: UserModel, filter: { email } });
    if (!user) return next(new Error("User not found", { cause: 400 }));
    if (user.confirmOTP == true) return next(new Error("Email already confirmed", { cause: 400 }))

    const OTP = user.OTP.find((obj) => obj.type == enumTypes.OTPType.confirmEmail);
    if (!OTP) return next(new Error("OTP not found", { cause: 400 }));

    if (!compareHash({ plainText: otp, hash: user.OTP[0].code }))
        return next(new Error("Invalid OTP", { cause: 400 }))

    user.isConfirmed = true;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Email confirmed successfully",
    });
}


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
}