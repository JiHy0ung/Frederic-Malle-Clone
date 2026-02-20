"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const authController = {
    async authenticate(req, res, next) {
        try {
            const tokenString = req.headers.authorization;
            if (!tokenString) {
                throw new Error("Token not found");
            }
            else {
                const token = tokenString.replace("Bearer ", "");
                jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY, (err, payload) => {
                    if (err) {
                        return res.status(400).json({
                            status: "Failed",
                            err: "Invalid token",
                            code: "INVALID_TOKEN",
                        });
                    }
                    const decodedPayload = payload;
                    req.userId = decodedPayload._id;
                    next();
                });
            }
        }
        catch (err) {
            res.status(400).json({
                status: "Token Verified Failed",
                message: err.message,
            });
        }
    },
    async loginWithEmail(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User_1.default.findOne({ email }, "-createdAt -updatedAt -___v");
            if (user) {
                const isMatch = await bcryptjs_1.default.compare(password, user.password);
                if (isMatch) {
                    const token = await user.generateToken();
                    return res.status(200).json({ status: "Login Success", user, token });
                }
                else {
                    throw new Error("비밀번호를 다시 입력해주세요.");
                }
            }
            else {
                throw new Error("가입되지 않은 이메일입니다.");
            }
        }
        catch (err) {
            if (err instanceof Error) {
                res.status(400).json({ status: "fail", error: err.message });
            }
            else {
                res.status(400).json({ status: "fail", error: "Unknown error" });
            }
        }
    },
    async checkAdminPermission(req, res, next) {
        try {
            const { userId } = req;
            const user = await User_1.default.findById(userId);
            if (!user) {
                throw new Error("사용자를 찾을 수 없습니다.");
            }
            if (user.level !== "admin")
                throw new Error("등록 권한이 없습니다.");
            next();
        }
        catch (err) {
            if (err instanceof Error) {
                res.status(400).json({ status: "fail", error: err.message });
            }
            else {
                res.status(400).json({ status: "fail", error: "Unknown error" });
            }
        }
    },
};
exports.default = authController;
