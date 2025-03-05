import { EventEmitter } from "events";
import sendEmail, { subject } from "./sendEmail.js";
import { signUpHTML, acceptanceEmailHTML, rejectionEmailHTML } from "./generateHTML.js";
import { customAlphabet } from "nanoid";
import OTPModel from "../../DB/Models/OTP.model.js";
import { hash } from "./../hashing/hash.js";
import * as enumTypes from "../../DB/enumTypes.js";

export const emailEmitter = new EventEmitter();

// Event for sending an acceptance email (new addition)

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

emailEmitter.on("sendAcceptanceEmail", async (userName, email, jobTitle, companyName) => {
    await sendEmail({
        to: email,
        subject: subject.acceptanceEmail,
        html: acceptanceEmailHTML(userName, jobTitle, companyName, subject.acceptanceEmail),
    });
});

emailEmitter.on("sendRejectionEmail", async (userName, email, jobTitle, companyName) => {
    await sendEmail({
        to: email,
        subject: subject.rejectionEmail,
        html: rejectionEmailHTML(userName, jobTitle, companyName, subject.rejectionEmail),
    });
});


// Generates and sends an OTP email
export const sendCode = async ({ data = {}, subjectType = subject.verifyEmail }) => {
    try {
        const { userName, email, id } = data;

        // Generate a 6-digit OTP
        const otp = customAlphabet('0123456789', 6)();
        const hashedOtp = hash({ plainText: otp });

        let otpType;
        let html;

        switch (subjectType) {
            case subject.verifyEmail:
                otpType = enumTypes.OTPType.confirmEmail;
                html = signUpHTML(otp, userName, subjectType);
                break;
            case subject.resetPassword:
                otpType = enumTypes.OTPType.forgetPassword;
                html = signUpHTML(otp, userName, subjectType);
                break;
            case subject.updateEmail:
                otpType = enumTypes.OTPType.updateEmail;
                html = signUpHTML(otp, userName, subjectType);
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
            html,
        });

    } catch (error) {
        console.log("Error sending OTP:", error);
    }
};

