import * as dbService from "../../../DB/dbService.js";
import UserModel from "../../../DB/Models/user.model.js";
import * as enumTypes from "../../../DB/enumTypes.js";
import CompanyModel from "../../../DB/Models/company.model.js";
import { authentication } from "../../../Middlewares/graphql/graph.auth.middleware.js";

export const getAllUsers = async (perant, args) => {
    const { authorization } = args;
    // Check user authentication
    const user = await authentication({
        authorization,
        accessRoles: enumTypes.roleType.Admin,
    });

    // Fetch users
    const users = await dbService.find({
        model: UserModel,
        filter: { deletedAt: null },
    });

    return { message: "success", statusCode: 200, data: users };
};


export const getAllCompanies = async (perant, args) => {
    const { authorization } = args;
    // Check user authentication
    const user = await authentication({
        authorization,
        accessRoles: enumTypes.roleType.Admin,
    });

    // Fetch users
    const companies = await dbService.find({
        model: CompanyModel,
        filter: { deletedAt: null },
    });

    return { message: "success", statusCode: 200, data: companies };
};