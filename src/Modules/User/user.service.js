import * as dbService from "../../DB/dbService.js";
import UserModel from "../../DB/Models/user.model.js";
import { emailEmitter } from "../../utils/emails/emailEvents.js";
import * as enumTypes from "../../DB/enumTypes.js";
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