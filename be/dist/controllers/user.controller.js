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
    async loginWithEmail(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User_1.default.findOne({ email }, "-createdAt -updatedAt -___v");
            if (user) {
                const isMatch = bcryptjs_1.default.compareSync(password, user.password);
                if (isMatch) {
                    const token = user.generateToken();
                    return res.status(200).json({ status: "success", user, token });
                }
                throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
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
};
exports.default = userController;
