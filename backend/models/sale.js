const db = require('../config/db');

const Sale = {
    getAll: async (startDate, endDate) => {
        let query = 'SELECT * FROM sales';
        const params = [];

        if (startDate && endDate) {
            query += ' WHERE DATE(created_at) BETWEEN $1 AND $2';
            params.push(startDate, endDate);
        }

        const res = await db.query(query, params);
        return res.rows;
    },
    // Resto del código del modelo Sale


    create: async (sale) => {
        const { total_amount, payment_method } = sale;
        const res = await db.query(
            'INSERT INTO sales (total_amount, payment_method) VALUES ($1, $2) RETURNING *',
            [total_amount, payment_method]
        );
        return res.rows[0];
    },
    createSaleItems: async (saleId, saleItems) => {
        const queryText = 'INSERT INTO sale_items (sale_id, product_id, quantity, price_at_time, subtotal) VALUES ($1, $2, $3, $4, $5) RETURNING *';

        for (const item of saleItems) {
            await db.query(queryText, [saleId, item.product_id, item.quantity, item.price_at_time, item.subtotal]);
        }
    },
    getDailyTotal: async () => {
        const today = new Date();
        const startDate = today.toISOString().split('T')[0]; // Obtener fecha actual en formato YYYY-MM-DD
        const res = await db.query(
            'SELECT SUM(total_amount) AS total_daily FROM sales WHERE DATE(created_at) = $1',
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
    }
};

module.exports = Sale;
