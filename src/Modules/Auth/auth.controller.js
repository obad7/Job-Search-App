import { Router } from "express";
import * as authService from "./auth.service.js";

const router = Router();

router.get(
    "/test",
    authService.test
);


export default router;