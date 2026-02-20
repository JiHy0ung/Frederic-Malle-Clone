import dotenv from "dotenv";
import { Request, Response } from "express";
import Product from "../models/Product";

dotenv.config();

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
        isNew,
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
        isNew,
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
};

export default productController;
