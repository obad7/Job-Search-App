import * as dbService from "../../DB/dbService.js";
import { EventEmitter } from "events";
import sendEmail, { subject } from "./sendEmail.js";
import { signUpHTML } from "./generateHTML.js";
import { customAlphabet } from "nanoid";
import OTPModel from "../../DB/Models/OTP.model.js";
import { hash } from './../hashing/hash.js';
import * as enumTypes from "../../DB/enumTypes.js";

export const emailEmitter = new EventEmitter();

emailEmitter.on("sendEmail", async (userName, email, id) => {
    await sendCode({
        data: { userName, email, id },
        subjectType: subject.verifyEmail,
    });
});

emailEmitter.on("forgetPassword", async (email, userName, id) => {
    await sendCode({
        data: { userName, email, id },
        subjectType: subject.resetPassword,
    });
});

emailEmitter.on("updateEmail", async (email, userName, id) => {
    await sendCode({
        data: { userName, email, id },
        subjectType: subject.updateEmail,
    });
});


//Generates a new OTP, hashes it, stores it in the `OTPModel`, and sends an email.
export const sendCode = async ({ data = {}, subjectType = subject.verifyEmail }) => {
    try {
        const { userName, email, id } = data;

        // Generate a 6-digit OTP
        const otp = customAlphabet('0123456789', 6)();
        const hashedOtp = hash({ plainText: otp });

        let otpType;
        switch (subjectType) {
            case subject.verifyEmail:
                otpType = enumTypes.OTPType.confirmEmail;
                break;
            case subject.resetPassword:
                otpType = enumTypes.OTPType.forgetPassword;
                break;
            case subject.updateEmail:
                otpType = enumTypes.OTPType.updateEmail;
                break;
            default:
                throw new Error("Invalid OTP Type");
        }

        // Remove any existing OTPs for this user and type before inserting a new one
        await OTPModel.deleteMany({ userId: id, type: otpType });

        // Save the new OTP in the OTPModel
        await OTPModel.create({
            userId: id,
            code: hashedOtp,
            type: otpType,
            createdAt: new Date(),
        });

        // Send email with the OTP
        await sendEmail({
            to: email,
            subject: subjectType,
            html: signUpHTML(otp, userName, subjectType),
        });

    } catch (error) {
        console.log("Error sending OTP:", error);
    }
};
