"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const router = express_1.default.Router();
router.post("/", auth_controller_1.default.authenticate, auth_controller_1.default.checkAdminPermission, product_controller_1.default.createProduct);
router.get("/", product_controller_1.default.getProducts);
exports.default = router;
