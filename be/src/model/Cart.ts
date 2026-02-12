import mongoose, { Document, Types } from "mongoose";
import User from "./User";
import Product from "./Product";

const Schema = mongoose.Schema;

interface ICartItem {
  productId: Types.ObjectId;
  size: string;
  qty: number;
}

interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
}

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: User },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: Product },
        size: { type: String, required: true },
        qty: { type: Number, default: 1, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true },
);

cartSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.updatedAt;
  delete obj.createdAt;
  delete obj.__v;
  return obj;
};

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
