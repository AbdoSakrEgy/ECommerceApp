import { Router } from "express";
import userRouter from "./modules/user/user.controller.js";
import authRouter from "./modules/auth/auth.controller.js";
import productRouter from "./modules/product/product.controller.js";
import salesRouter from "./modules/sales/sales.controller.js";
const router = Router();

router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/sales", salesRouter);
router.use("/user", userRouter);

export default router;
