const db = require("../config/db");

const Sale = {
  getAll: async (startDate, endDate) => {
    let query = `
            SELECT s.id AS sale_id, s.total_amount, s.payment_method, s.created_at,
                   si.product_id, si.quantity, si.price_at_time, si.subtotal,
                   p.name AS product_name
            FROM sales s
            JOIN sale_items si ON s.id = si.sale_id
            JOIN products p ON si.product_id = p.id
        `;
    const params = [];

    if (startDate && endDate) {
      query += " WHERE DATE(s.created_at) BETWEEN $1 AND $2";
      params.push(startDate, endDate);
    }

    const res = await db.query(query, params);

    // Agrupar los resultados por venta
    const sales = res.rows.reduce((acc, row) => {
      const sale = acc.find((s) => s.id === row.sale_id);
      const product = {
        product_id: row.product_id,
        name: row.product_name,
        quantity: row.quantity,
        price_at_time: row.price_at_time,
        subtotal: row.subtotal,
      };

      if (sale) {
        sale.products.push(product);
      } else {
        acc.push({
          id: row.sale_id,
          total_amount: row.total_amount,
          payment_method: row.payment_method,
          created_at: row.created_at,
          products: [product],
        });
      }

      return acc;
    }, []);

    return sales;
  },

  create: async (sale) => {
    const { total_amount, payment_method, discount_percentage = 0 } = sale;

  // Calcular descuento
  const discount_amount = total_amount * (discount_percentage / 100);
  const discounted_total = total_amount - discount_amount;

  // Guardar la venta
  const res = await db.query(
    `INSERT INTO sales (total_amount, payment_method, discount_percentage, discount_amount) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [discounted_total, payment_method, discount_percentage, discount_amount]
  );

  return res.rows[0];
  },
  
  
  createSaleItems: async (saleId, saleItems) => {
    const queryText =
      "INSERT INTO sale_items (sale_id, product_id, quantity, price_at_time, subtotal) VALUES ($1, $2, $3, $4, $5) RETURNING *";

    for (const item of saleItems) {
      await db.query(queryText, [
        saleId,
        item.product_id,
        item.quantity,
        item.price_at_time,
        item.subtotal,
      ]);
    }
  },

  // Nueva función para guardar el arqueo de caja
  saveCashRegister: async () => {
    const today = new Date().toISOString().split("T")[0];
    const res = await db.query(
      `SELECT 
          SUM(CASE WHEN payment_method = 'efectivo' THEN total_amount ELSE 0 END) AS total_cash,
          SUM(CASE WHEN payment_method = 'tarjeta_debito' OR payment_method = 'tarjeta_credito' THEN total_amount ELSE 0 END) AS total_card,
          SUM(CASE WHEN payment_method = 'transferencia' THEN total_amount ELSE 0 END) AS total_transfer,
          SUM(total_amount) AS total_sales
       FROM sales
       WHERE DATE(created_at) = $1`,
      [today]
    );
    const { total_cash, total_card, total_transfer, total_sales } = res.rows[0];

    await db.query(
      `INSERT INTO cash_register (date, total_cash, total_card, total_transfer, total_sales)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (date)
       DO UPDATE SET total_cash = EXCLUDED.total_cash,
                     total_card = EXCLUDED.total_card,
                     total_transfer = EXCLUDED.total_transfer,
                     total_sales = EXCLUDED.total_sales`,
      [today, total_cash, total_card, total_transfer, total_sales]
    );
  },

  getDailyTotal: async () => {
    const today = new Date().toISOString().split("T")[0];
    const res = await db.query(
      `SELECT SUM(total_amount) AS total_daily FROM sales WHERE DATE(created_at) = $1`,
      [today]
    );
    return res.rows[0].total_daily || 0;
  },

  getTopSellingProducts: async () => {
    const res = await db.query(`
        SELECT si.product_id, p.name, SUM(si.quantity) AS total_quantity
        FROM sale_items si
        JOIN products p ON si.product_id = p.id
        GROUP BY si.product_id, p.name
        ORDER BY total_quantity DESC
        LIMIT 10
      `);
    return res.rows;
  },

  saveDailyTotal: async (total) => {
    const today = new Date().toISOString().split("T")[0];
    await db.query(
      `INSERT INTO daily_totals (total, date)
       VALUES ($1, $2)
       ON CONFLICT (date)
       DO UPDATE SET total = EXCLUDED.total`,
      [total, today]
    );
  },

  getDailyTotalsHistory: async () => {
    const res = await db.query(
      "SELECT date, total FROM daily_totals ORDER BY date DESC"
    );
    return res.rows;
  },

  getProductsSoldByDate: async (date) => {
    const res = await db.query(
      `SELECT si.product_id, p.name, SUM(si.quantity) AS total_quantity, SUM(si.subtotal) AS total_revenue
       FROM sale_items si
       JOIN products p ON si.product_id = p.id
       JOIN sales s ON si.sale_id = s.id
       WHERE DATE(s.created_at) = $1
       GROUP BY si.product_id, p.name
       ORDER BY total_quantity DESC`,
      [date]
    );
    return res.rows;
  },
  getDailyTotalsByPaymentMethod: async (date) => {
    const res = await db.query(
        `SELECT payment_method, SUM(total_amount) AS total_amount
         FROM sales
         WHERE DATE(created_at) = $1
         GROUP BY payment_method`,
        [date]
    );
    return res.rows;
},

};

module.exports = Sale;
