import { Router } from "express";
import { createSales } from "./sales.service.js";
const router = Router();

router.post("/create-sales", createSales);

export default router;
