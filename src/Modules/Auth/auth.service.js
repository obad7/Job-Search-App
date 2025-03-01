import * as dbService from "../../DB/dbService.js";
import UserModel from "../../DB/Models/user.model.js";

export const register = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    const user = await dbService.findOne({ model: UserModel, filter: { email } });
    if (user) return next(new Error("User already exists", { cause: 400 }));

    const newUser = await dbService.create({
        model: UserModel,
        data: { firstName, lastName, email, password }
    });

    return res.status(200).json({
        success: true,
        message: newUser,
    });
}