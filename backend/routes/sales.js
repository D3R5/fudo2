const express = require("express");
const {
  getAllSales,
  createSale,
  getDailyTotal,
  getTopSellingProducts,
} = require("../controllers/sales");

const router = express.Router();

router.get("/", getAllSales);
router.post("/", createSale);
router.get("/daily_total", getDailyTotal); // Nueva ruta para total diario
router.get("/top_selling_products", getTopSellingProducts); // Nueva ruta para productos más vendidos

module.exports = router;
