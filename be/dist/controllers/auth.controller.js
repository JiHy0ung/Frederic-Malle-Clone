"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const authController = {
    async authenticate(req, res, next) {
        try {
            const tokenString = req.headers.authorization;
            if (!tokenString) {
                throw new Error("invalid token");
            }
            const token = tokenString.replace("Bearer ", "");
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
            req.userId = decoded._id;
            next();
        }
        catch (err) {
            res.status(400).json({
                status: "Token Verified Failed",
                message: err.message,
            });
        }
    },
};
exports.default = authController;
