"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./User"));
const Product_1 = __importDefault(require("./Product"));
const Schema = mongoose_1.default.Schema;
const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: User_1.default },
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: Product_1.default },
            size: { type: String, required: true },
            qty: { type: Number, default: 1, required: true, min: 1 },
        },
    ],
}, { timestamps: true });
cartSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.updatedAt;
    delete obj.createdAt;
    delete obj.__v;
    return obj;
};
const Cart = mongoose_1.default.model("Cart", cartSchema);
exports.default = Cart;
