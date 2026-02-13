import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";

const saltRounds = 10;

const userController = {
  async createUser(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) throw new Error("이미 가입된 이메일입니다.");

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({ name, email, password: hash });
    await newUser.save();

    res.status(200).json({ status: "success" });
    try {
    } catch (err: any) {
      res.status(400).json({ status: "fail", error: "Unknown error" });
    }
  },
};

export default userController;
