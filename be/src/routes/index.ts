import express from "express";
const router = express.Router();

import userApi from "./user.api";
import authApi from "./auth.api";
import productApi from "./product.api";

router.use("/user", userApi);
router.use("/auth", authApi);
router.use("/product", productApi);

export default router;
