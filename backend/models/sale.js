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
    const { total_amount, payment_method } = sale;
    const res = await db.query(
      "INSERT INTO sales (total_amount, payment_method) VALUES ($1, $2) RETURNING *",
      [total_amount, payment_method]
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
  getDailyTotal: async () => {
    const today = new Date();
    const startDate = today.toISOString().split("T")[0]; // Obtener fecha actual en formato YYYY-MM-DD
    const res = await db.query(
      "SELECT SUM(total_amount) AS total_daily FROM sales WHERE DATE(created_at) = $1",
      [startDate]
    );
    return res.rows[0].total_daily || 0; // Retornar 0 si no hay ventas
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
};

module.exports = Sale;
