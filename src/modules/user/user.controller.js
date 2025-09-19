import { Router } from "express";
import {
  addProductToCart,
  deleteProductFromCart,
  deleteCart,
  createOrder,
  createMyProduct,
  updatePersonalInfo,
  updateMyProduct,
  readMyProducts,
  deleteMyProduct,
} from "./user.service.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { allowTo } from "../../middlewares/authorization.middleware.js";
import { Role } from "./user.model.js";
const router = Router();

// ==================== admin,customer,seller ====================
router.patch("/update-personal-info", auth, updatePersonalInfo);
// ==================== admin ====================
// ==================== customer ====================
router.post(
  "/add-product-to-cart",
  auth,
  allowTo(Role.customer, Role.admin),
  addProductToCart
);
router.delete(
  "/delete-product-from-cart",
  auth,
  allowTo(Role.customer, Role.admin),
  deleteProductFromCart
);
router.delete(
  "/delete-cart",
  auth,
  allowTo(Role.customer, Role.admin),
  deleteCart
);
router.post("/create-order", auth, allowTo(Role.customer), createOrder);
// ==================== seller ====================
router.post("/create-myProduct", auth, createMyProduct);
router.get("/read-myProducts", auth, readMyProducts);
router.patch("/update-myProduct/:id", auth, updateMyProduct);
router.delete("/delete-myProduct/:id", auth, deleteMyProduct);

export default router;
