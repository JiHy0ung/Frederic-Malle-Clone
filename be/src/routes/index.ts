import express from "express";
const router = express.Router();

import userApi from "./user.api";
import authApi from "./auth.api";

router.use("/user", userApi);
router.use("/auth", authApi);

export default router;
