import mongoose, { Document, Model } from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const Schema = mongoose.Schema;

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  level: "customer" | "admin";
}

interface IUserMethods {
  generateToken(): string;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  { timestamps: true },
);

userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.updatedAt;
  delete obj.createdAt;
  delete obj.__v;
  return obj;
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
