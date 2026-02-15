import express from "express";
import userController from "../controllers/user.controller";
const router = express.Router();

router.post("/", userController.createUser);

router.post("/login", userController.loginWithEmail);

router.get("/me", userController.getUser);

export default router;
