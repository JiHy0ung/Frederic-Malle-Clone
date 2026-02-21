import dotenv from "dotenv";
import { Request, Response } from "express";
import Product from "../models/Product";

dotenv.config();

const PAGE_SIZE = 5;

const productController = {
  async createProduct(req: Request, res: Response) {
    try {
      const {
        sku,
        name,
        size,
        description,
        stock,
        image,
        price,
        category,
        status,
      } = req.body;

      const isDuplicate = await Product.findOne({ sku });
      if (isDuplicate) {
        throw new Error("이미 존재하는 sku입니다.");
      }

      const product = new Product({
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).json({ status: "fail", error: err.message });
      } else {
        res.status(400).json({ status: "fail", error: "Unknown error" });
      }
    }
  },
  async getProducts(req: Request, res: Response) {
    try {
      const { page, name, limit } = req.query;

      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || PAGE_SIZE;
      const nameStr = typeof name === "string" ? name : undefined;

      const condition = nameStr
        ? { name: { $regex: nameStr, $options: "i" } }
        : { isDeleted: false };

      let query = Product.find(condition);

      const totalItemNum = await Product.countDocuments(condition);
      const totalPageNum = Math.ceil(totalItemNum / limitNum);

      query.skip((pageNum - 1) * limitNum).limit(limitNum);

      const productList = await query.exec();

      res.status(200).json({
        status: "Get Products Success",
        totalPageNum,
        data: productList,
      });
    } catch (err) {
      res.status(400).json({ status: "fail", error: "Unknown error" });
    }
  },
};

export default productController;
