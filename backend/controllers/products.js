// backend/controllers/products.js
const Product = require("../models/product");

const getAllProducts = async (req, res) => {
  const products = await Product.getAll();
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.getById(req.params.id);
  res.json(product);
};

const createProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;

  try {
    const newProduct = await Product.create({ name, description, price, stock });
    res.status(201).json(newProduct);
  } catch (error) {
    if (error.code === '23505') { // Código de error para violación de restricción única en PostgreSQL
      res.status(400).json({ error: "El nombre del producto ya está en uso." });
    } else {
      res.status(500).json({ error: "Error al crear el producto." });
    }
  }
};

const updateProduct = async (req, res) => {
  const updatedProduct = await Product.update(req.params.id, req.body);
  res.json(updatedProduct);
};

const deleteProduct = async (req, res) => {
  await Product.delete(req.params.id);
  res.status(204).send();
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
