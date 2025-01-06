// backend/routes/products.js
const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFilteredAndSortedProducts,
} = require("../controllers/products");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/filter", getFilteredAndSortedProducts); // Nueva ruta

router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
