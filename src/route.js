import { Router } from "express";
import adminRouter from "./modules/admin/admin.controller.js";
import authRouter from "./modules/auth/auth.controller.js";
import customerRouter from "./modules/customer/customer.controller.js";
import productRouter from "./modules/product/product.controller.js";
import sellerRouter from "./modules/seller/seller.controller.js";
const router = Router();

router.use("/admin", adminRouter);
router.use("/auth", authRouter);
router.use("/customer", customerRouter);
router.use("/product", productRouter);
router.use("/seller", sellerRouter);

export default router;
