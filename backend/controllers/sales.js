//controller sale.js
const Sale = require("../models/sale");
const Product = require("../models/product");

const getAllSales = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const sales = await Sale.getAll(startDate, endDate);
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las ventas" });
  }
};

const createSale = async (req, res) => {
  const saleData = req.body;

  try {
    const { items, discount_percentage = 0 } = saleData;

    // Validar productos y precios
    for (const item of items) {
      const product = await Product.getById(item.product_id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          error: `Stock insuficiente para el producto: ${product?.name || "ID " + item.product_id}`,
        });
      }

      const enteredPrice = Math.round(item.price_at_time * 100);
      const actualPrice = Math.round(product.price * 100);
      if (enteredPrice !== actualPrice) {
        return res.status(400).json({
          error: `Precio incorrecto para el producto: ${product.name}`,
        });
      }
    }

    // Calcular el monto total con descuento
    const total_amount = items.reduce((acc, item) => acc + item.subtotal, 0);
    const discounted_total = total_amount * ((100 - discount_percentage) / 100);

    // Crear la venta y guardar el descuento
    const newSale = await Sale.create({
      total_amount,
      payment_method: saleData.payment_method,
      discount_percentage,
    });

    // Crear los elementos de la venta
    await Sale.createSaleItems(newSale.id, items);

    // Actualizar stock
    const updatedItems = [];
    for (const item of items) {
      await Product.updateStock(item.product_id, item.quantity);
      const updatedProduct = await Product.getById(item.product_id);
      updatedItems.push({
        product_id: updatedProduct.id,
        name: updatedProduct.name,
        updated_stock: updatedProduct.stock,
      });
    }

    res.status(201).json({
      ...newSale,
      discounted_total,
      updatedItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la venta" });
  }
};





const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Sale.getTopSellingProducts();
    res.json(
      topProducts.map((product) => ({
        product_id: product.product_id,
        name: product.name,
        total_quantity: product.total_quantity,
      }))
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener los productos más vendidos" });
  }
};
const getDailyTotal = async (req, res) => {
  try {
    const total = await Sale.getDailyTotal();
    await Sale.saveDailyTotal(total); // Guardar total diario en la tabla
    res.json({ total_daily: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener o guardar el total diario de ventas" });
  }
};

// Ruta para hacer el arqueo de caja
const performCashRegister = async (req, res) => {
  try {
    await Sale.saveCashRegister(); // Ejecutar el arqueo de caja
    res.status(200).json({ message: "Arqueo de caja realizado con éxito." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al realizar el arqueo de caja" });
  }
};

const getDailyTotalsHistory = async (req, res) => {
  try {
    const history = await Sale.getDailyTotalsHistory();
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el historial de totales diarios" });
  }
};

const getProductsSoldByDate = async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: "Debe proporcionar una fecha" });
  }

  try {
    const productsSold = await Sale.getProductsSoldByDate(date);
    res.json(productsSold);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos vendidos" });
  }
};
const getDailyTotalsByPaymentMethod = async (req, res) => {
  const { date } = req.query;
  if (!date) {
      return res.status(400).json({ error: "Debe proporcionar una fecha" });
  }

  try {
      const paymentMethods = await Sale.getDailyTotalsByPaymentMethod(date);
      res.json(paymentMethods);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el desglose por medio de pago" });
  }
};


module.exports = {
  getAllSales,
  createSale,
  getDailyTotal,
  getDailyTotalsHistory,
  getTopSellingProducts,
  performCashRegister,
  getProductsSoldByDate,
  getDailyTotalsByPaymentMethod
};
