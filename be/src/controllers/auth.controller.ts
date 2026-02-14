import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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
        throw new Error("invalid token");
      }

      const token = tokenString.replace("Bearer ", "");

      const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;

      req.userId = decoded._id;

      next();
    } catch (err: any) {
      res.status(400).json({
        status: "Token Verified Failed",
        message: err.message,
      });
    }
  },
};

export default authController;
