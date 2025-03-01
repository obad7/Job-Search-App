import * as dbService from "../../DB/dbService.js";
import UserModel from "../../DB/Models/user.model.js";
import { emailEmitter } from "../../utils/emails/emailEvents.js";
import * as enumTypes from "../../DB/enumTypes.js";
import { compareHash } from "../../utils/hashing/hash.js";

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
    if (user.confirmOTP == true) { return next(new Error("Email already confirmed", { cause: 400 })) }

    const OTP = user.OTP.find((obj) => obj.type == enumTypes.OTPType.confirmEmail);
    if (!OTP) return next(new Error("OTP not found", { cause: 400 }));

    if (!compareHash({ plainText: otp, hash: user.OTP[0].code }))
        return next(new Error("Invalid OTP", { cause: 400 }))

    user.isConfirmed = true;
    await user.save();

    return res.status(200).json({
        success: true,
        message: user,
    });
}


export const signIn = async (req, res, next) => {

}