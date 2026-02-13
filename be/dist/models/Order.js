"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./User"));
const Product_1 = __importDefault(require("./Product"));
const Schema = mongoose_1.default.Schema;
const orderSchema = new Schema({
    orderNum: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: User_1.default, required: true },
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
                ref: Product_1.default,
                required: true,
            },
            price: { type: Number, required: true, min: 0 },
            size: { type: String, required: true },
            qty: { type: Number, default: 1, required: true, min: 1 },
        },
    ],
}, { timestamps: true });
orderSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.updatedAt;
    delete obj.createdAt;
    delete obj.__v;
    return obj;
};
const Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
