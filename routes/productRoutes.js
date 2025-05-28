import {
  deleteProduct,
  getProducts,
  getOneProduct,
} from "../controlers/productControler.js";
import { createProduct } from "../controlers/productControler.js";
import express from "express";
const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getOneProduct);
router.post("/", createProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
