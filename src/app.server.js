import connectDB from "./DB/connection.js";
import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import companyRouter from "./Modules/Company/company.controller.js";
import jobRouter from "./Modules/Job/job.controller.js";
import { notFoundHandler, globalErrorHandler } from "./utils/error handling/globalErrorHandler.js";
import "./utils/jobs/deleteExpiredOTP.js";

const bootstrap = async (app, express) => {
    await connectDB();

    app.use(express.json());

    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    app.use("/company", companyRouter)
    app.use("/job", jobRouter)

    // 404
    app.all("*", notFoundHandler);

    // global error handler
    app.use(globalErrorHandler);

}

export default bootstrap;