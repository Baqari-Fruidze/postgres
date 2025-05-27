import { deleteProduct, getProducts } from "../controlers/productControler.js";
import { createProduct } from "../controlers/productControler.js";
import express from "express";
const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);

export default router;
