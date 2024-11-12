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
  const newProduct = await Product.create(req.body);
  res.status(201).json(newProduct);
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
