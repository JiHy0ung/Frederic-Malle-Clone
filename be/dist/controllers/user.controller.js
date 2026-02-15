"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const saltRounds = 10;
const userController = {
    async createUser(req, res) {
        const { name, email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (user)
            throw new Error("이미 가입된 이메일입니다.");
        const salt = bcryptjs_1.default.genSaltSync(saltRounds);
        const hash = bcryptjs_1.default.hashSync(password, salt);
        const newUser = new User_1.default({ name, email, password: hash });
        await newUser.save();
        res.status(200).json({ status: "success" });
        try {
        }
        catch (err) {
            res.status(400).json({ status: "fail", error: "Unknown error" });
        }
    },
    async getUser(req, res) {
        try {
            const { userId } = req;
            const user = await User_1.default.findOne({ _id: userId });
            if (user) {
                return res.status(200).json({ status: "Success", user });
            }
            throw new Error("invalid token");
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
exports.default = userController;
