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

  // Validación de precio y stock
  if (price < 0 || stock < 0) {
    return res.status(400).json({ error: "El precio y el stock deben ser valores positivos." });
  }

  try {
    const newProduct = await Product.create({ name, description, price, stock });
    res.status(201).json(newProduct);
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ error: "El nombre del producto ya está en uso." });
    } else {
      res.status(500).json({ error: "Error al crear el producto." });
    }
  }
};


const updateProduct = async (req, res) => {
  const { price, stock } = req.body;

  // Validación de precio y stock
  if ((price !== undefined && price < 0) || (stock !== undefined && stock < 0)) {
    return res.status(400).json({ error: "El precio y el stock deben ser valores positivos." });
  }

  try {
    const updatedProduct = await Product.update(req.params.id, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto." });
  }
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
