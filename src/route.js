import { Router } from "express";
import userRouter from "./modules/user/user.controller.js";
import authRouter from "./modules/auth/auth.controller.js";
import productRouter from "./modules/product/product.controller.js";
const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/product", productRouter);

export default router;
