import * as enumTypes from "../../../DB/enumTypes.js";
import UserModel from "../../../DB/Models/user.model.js";
import { verifyToken } from "../../../utils/token/token.js";
import * as dbService from "../../../DB/dbService.js";


export const socketAuth = async (socket, next) => {
    try {
        // Get token from handshake headers in postman
        const authorization = socket.handshake.headers.authorization;
        if (!authorization) {
            return next(new Error("Authorization header missing"));
        }

        const [bearer, token] = authorization.split(" ");

        if (!bearer || !token) {
            return next(new Error("Invalid token format"));
        }

        // if (bearer !== "HR") {
        //     console.log("only HR can access");
        //     return next(new Error("only HR can access"));
        // }

        let ACCESS_SIGNATURE;
        switch (bearer) {
            case "Admin":
                ACCESS_SIGNATURE = process.env.ADMIN_ACCESS_TOKEN;
                break;
            case "User":
                ACCESS_SIGNATURE = process.env.USER_ACCESS_TOKEN;
                break;
            default:
                return next(new Error("Invalid token type"));
        }

        const decoded = verifyToken({ token, signature: ACCESS_SIGNATURE });

        const user = await dbService.findOne({
            model: UserModel,
            filter: { _id: decoded.id, deletedAt: null },
        });

        if (!user) return next(new Error("User not found"));

        socket.user = user; // Attach user to socket
        socket.id = user.id // Attach user id to socket

        next();
    } catch (error) {
        next(new Error("Authentication failed: " + error.message));
    }
};

