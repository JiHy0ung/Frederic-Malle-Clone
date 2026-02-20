"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const Product_1 = __importDefault(require("../models/Product"));
dotenv_1.default.config();
const productController = {
    async createProduct(req, res) {
        try {
            const { sku, name, size, description, stock, image, price, category, status, isNew, } = req.body;
            const isDuplicate = await Product_1.default.findOne({ sku });
            if (isDuplicate) {
                throw new Error("이미 존재하는 sku입니다.");
            }
            const product = new Product_1.default({
                sku,
                name,
                size,
                description,
                stock,
                image,
                price,
                category,
                status,
                isNew,
            });
            await product.save();
            res.status(200).json({ status: "Add Item Success", product });
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
exports.default = productController;
