import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/frederic-malle-clone";

const PORT = process.env.PORT;

mongoose
  .connect(mongoURI)
  .then(() => console.log("mongoose connected"))
  .catch((err) => console.error("DB connection fail", err));

app.listen(PORT || 5555, () => {
  console.log("server on");
});
