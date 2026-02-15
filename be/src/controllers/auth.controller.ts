import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import bcrypt from "bcryptjs/umd/types";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

interface JwtPayload {
  _id: string;
}

const authController = {
  async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenString = req.headers.authorization;
      if (!tokenString) {
        throw new Error("Token not found");
      } else {
        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
          if (err) {
            return res.status(400).json({
              status: "Failed",
              err: "Invalid token",
              code: "INVALID_TOKEN",
            });
          }

          const decodedPayload = payload as JwtPayload;
          req.userId = decodedPayload._id;
          next();
        });
      }
    } catch (err: any) {
      res.status(400).json({
        status: "Token Verified Failed",
        message: err.message,
      });
    }
  },
  async loginWithEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }, "-createdAt -updatedAt -___v");

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const token = await user.generateToken();
          return res.status(200).json({ status: "Login Success", user, token });
        } else {
          throw new Error("비밀번호를 다시 입력해주세요.");
        }
      } else {
        throw new Error("가입되지 않은 이메일입니다.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(400).json({ status: "fail", error: err.message });
      } else {
        res.status(400).json({ status: "fail", error: "Unknown error" });
      }
    }
  },
};

export default authController;
