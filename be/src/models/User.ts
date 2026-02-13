import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  level: "customer" | "admin";
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  { timestamps: true },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.updatedAt;
  delete obj.createdAt;
  delete obj.__v;
  return obj;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
