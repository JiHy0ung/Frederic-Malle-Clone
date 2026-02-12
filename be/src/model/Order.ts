import mongoose, { Document, Types } from "mongoose";
import User from "./User";
import Product from "./Product";

const Schema = mongoose.Schema;

interface IOrderItem {
  productId: Types.ObjectId;
  price: number;
  size: string;
  qty: number;
}

interface IShipping {
  address: string;
  city: string;
}

interface IContact {
  name: string;
  phone: string;
}

interface IOrder extends Document {
  orderNum: string;
  userId: Types.ObjectId;
  status: "preparing" | "shipping" | "completed";
  totalPrice: number;
  shipTo: IShipping;
  contact: IContact;
  items: IOrderItem[];
}

const orderSchema = new Schema<IOrder>(
  {
    orderNum: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: User, required: true },
    status: {
      type: String,
      enum: ["preparing", "shipping", "completed"],
      default: "preparing",
    },
    totalPrice: { type: Number, required: true, default: 0, min: 0 },
    shipTo: {
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    contact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: Product,
          required: true,
        },
        price: { type: Number, required: true, min: 0 },
        size: { type: String, required: true },
        qty: { type: Number, default: 1, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true },
);

orderSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.updatedAt;
  delete obj.createdAt;
  delete obj.__v;
  return obj;
};

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
