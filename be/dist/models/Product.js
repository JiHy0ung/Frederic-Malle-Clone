"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const productSchema = new Schema({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: [String], required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Map, of: Number, required: true },
    status: { type: String, enum: ["active", "sold-out"], default: "active" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
productSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.updatedAt;
    delete obj.createdAt;
    delete obj.__v;
    return obj;
};
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
