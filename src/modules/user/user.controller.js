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
const router = Router();

// ==================== admin,customer,seller ====================
router.patch("/update-personal-info", auth, updatePersonalInfo);
// ==================== admin ====================
// ==================== customer ====================
router.post("/add-product-to-cart", auth, addProductToCart);
router.delete("/delete-product-from-cart", auth, deleteProductFromCart);
router.delete("/delete-cart", auth, deleteCart);
router.post("/create-order", auth, createOrder);
// ==================== seller ====================
router.post("/create-myProduct", auth, createMyProduct);
router.get("/read-myProducts", auth, readMyProducts);
router.patch("/update-myProduct/:id", auth, updateMyProduct);
router.delete("/delete-myProduct", auth, deleteMyProduct);

export default router;
