import express from "express";
import userController from "../controllers/user.controller";
import authController from "../controllers/auth.controller";
const router = express.Router();

router.post("/", userController.createUser);

router.post("/login", userController.loginWithEmail);

router.get("/me", authController.authenticate, userController.getUser);

export default router;
