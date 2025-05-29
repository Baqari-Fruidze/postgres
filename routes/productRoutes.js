import {
  deleteProduct,
  getProducts,
  getOneProduct,
  updateProduct,
  getCategoryStats,
} from "../controlers/productControler.js";
import { createProduct } from "../controlers/productControler.js";
import express from "express";
const router = express.Router();

router.get("/", getProducts);
router.get("/category-stats", getCategoryStats);
router.get("/:id", getOneProduct);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);

export default router;
