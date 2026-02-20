import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

interface IProduct extends Document {
  sku: string;
  name: string;
  size: string[];
  image: string;
  category: string[];
  description: string;
  price: number;
  stock: Record<string, number>;
  status: "active" | "sold-out";
  isDeleted: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    size: { type: [String], required: true },
    image: { type: String, required: true },
    category: { type: [String], required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Map, of: Number, required: true },
    status: { type: String, enum: ["active", "sold-out"], default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

productSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.updatedAt;
  delete obj.createdAt;
  delete obj.__v;
  return obj;
};

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
