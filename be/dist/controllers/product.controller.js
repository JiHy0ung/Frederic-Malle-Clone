"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const Product_1 = __importDefault(require("../models/Product"));
dotenv_1.default.config();
const PAGE_SIZE = 5;
const productController = {
    async createProduct(req, res) {
        try {
            const { sku, name, size, description, stock, image, price, category, status, } = req.body;
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
    async getProducts(req, res) {
        try {
            const { page, name } = req.query;
            const pageNum = Number(page) || 1;
            const nameStr = typeof name === "string" ? name : undefined;
            const condition = nameStr
                ? { name: { $regex: nameStr, $options: "i" } }
                : { isDeleted: false };
            let query = Product_1.default.find(condition);
            const totalItemNum = await Product_1.default.countDocuments(condition);
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
            query.skip((pageNum - 1) * PAGE_SIZE).limit(PAGE_SIZE);
            const productList = await query.exec();
            let response = {
                status: "Get Products Success",
                totalPageNum,
                data: productList,
            };
            res.status(200).json(response);
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
