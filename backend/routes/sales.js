const express = require("express");
const {
  getAllSales,
  createSale,
  getDailyTotal,
  getDailyTotalsHistory,
  getTopSellingProducts,
  getProductsSoldByDate 
} = require("../controllers/sales");

const router = express.Router();

router.get("/", getAllSales);
router.post("/", createSale);
router.get("/daily_total", getDailyTotal); // Nueva ruta para total diario
router.get("/top_selling_products", getTopSellingProducts); // Nueva ruta para productos más vendidos
router.get("/daily_totals_history", getDailyTotalsHistory); // Nueva ruta para el historial de totales diarios
router.get("/products_sold", getProductsSoldByDate); // Nueva ruta para productos vendidos



module.exports = router;
