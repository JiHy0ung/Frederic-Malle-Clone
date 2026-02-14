"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Schema = mongoose_1.default.Schema;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: String, enum: ["customer", "admin"], default: "customer" },
}, { timestamps: true });
userSchema.methods.generateToken = function () {
    const token = jsonwebtoken_1.default.sign({ _id: this._id }, JWT_SECRET_KEY, {
        expiresIn: "7d",
    });
    return token;
};
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.updatedAt;
    delete obj.createdAt;
    delete obj.__v;
    return obj;
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
