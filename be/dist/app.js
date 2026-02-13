"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", index_1.default);
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/frederic-malle-clone";
const PORT = process.env.PORT;
mongoose_1.default
    .connect(mongoURI)
    .then(() => console.log("mongoose connected"))
    .catch((err) => console.error("DB connection fail", err));
app.listen(PORT || 5555, () => {
    console.log("server on");
});
