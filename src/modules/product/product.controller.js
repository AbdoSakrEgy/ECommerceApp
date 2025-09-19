import { Router } from "express";
import {
  viewProducts,
  searchByName,
  searchBySeller,
} from "./product.service.js";
import { auth } from "../../middlewares/auth.middleware.js";
const router = Router();

router.get("/view-products", viewProducts);
router.post("/search-by-productName/:productName", auth, searchByName);
router.post("/search-by-seller/:sellerId", auth, searchBySeller);

export default router;
