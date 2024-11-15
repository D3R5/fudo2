// backend/models/product.js
const db = require("../config/db");

const Product = {
  getAll: async () => {
    const res = await db.query("SELECT * FROM products");
    return res.rows;
  },
  getById: async (id) => {
    const res = await db.query("SELECT * FROM products WHERE id = $1", [id]);
    return res.rows[0];
  },
  create: async (product) => {
    const { name, description, price, stock } = product;
    const res = await db.query(
      "INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, price, stock]
    );
    return res.rows[0];
  },
  update: async (id, product) => {
    const { name, description, price, stock } = product;
    const res = await db.query(
      "UPDATE products SET name = $1, description = $2, price = $3, stock = $4 WHERE id = $5 RETURNING *",
      [name, description, price, stock, id]
    );
    return res.rows[0];
  },
  delete: async (id) => {
    await db.query("DELETE FROM products WHERE id = $1", [id]);
  },
  updateStock: async (id, quantitySold) => {
    const res = await db.query(
      "UPDATE products SET stock = stock - $1 WHERE id = $2 RETURNING *",
      [quantitySold, id]
    );
    return res.rows[0];
  },
  existsByName: async (name) => {
    const res = await db.query("SELECT 1 FROM products WHERE name = $1", [name]);
    return res.rowCount > 0; // Devuelve true si existe, false si no
  },
};

module.exports = Product;
