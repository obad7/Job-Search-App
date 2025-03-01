import connectDB from "./DB/connection.js";
import authRouter from "./Modules/Auth/auth.controller.js";
import { notFoundHandler, globalErrorHandler } from "./utils/error handling/globalErrorHandler.js";

const bootstrap = async (app, express) => {
    await connectDB();

    app.use(express.json());

    app.use("/auth", authRouter)

    // 404
    app.all("*", notFoundHandler);

    // global error handler
    app.use(globalErrorHandler);

}

export default bootstrap;