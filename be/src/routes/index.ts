import express from "express";
const router = express.Router();

import userApi from "./user.api";

router.use("/user", userApi);

export default router;
