import {
  deleteProduct,
  getProducts,
  getOneProduct,
  updateProduct,
  getCategoryStats,
  createProduct,
  buyProduct,
  uploadProductExcel,
  updateProductImages,
} from "../controlers/productControler.js";
// import { createProduct } from "../controlers/productControler.js";
import express from "express";
import { uploadProductImages, uploadExcel } from "../middlware/uploadfile.js";
import { auth, isAdmin, isManagerOrAdmin } from "../middlware/auth.js";
const router = express.Router();

router.get("/", getProducts);
router.get("/category-stats", auth, isManagerOrAdmin, getCategoryStats);
router.get("/:id", getOneProduct);
router.post("/", auth, isManagerOrAdmin, createProduct);
router.delete("/:id", auth, isManagerOrAdmin, deleteProduct);
router.put("/:id", auth, isManagerOrAdmin, updateProduct);
router.post("/buyProduct/:id", auth, buyProduct);
router.post("/upload-product-excel", uploadExcel.single("products"), uploadProductExcel);
router.post("/upload-product-images/:id", uploadProductImages.array("images", 5), updateProductImages);

export default router;
