// src/components/Products/ProductForm.js
import React, { useState } from "react";
import api from "../../api";
import "./css/ProductForm.css";

const ProductForm = ({ product = {}, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    stock: product.stock || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiCall = product.id
      ? api.put(`/products/${product.id}`, formData)
      : api.post("/products", formData);
  
    apiCall
      .then(() => {
        alert("Producto guardado con éxito");
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        if (error.response && error.response.data.error) {
          alert(error.response.data.error); // Muestra el error del backend
        } else {
          console.error("Error al guardar producto:", error);
        }
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nombre"
      />
      <input
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Descripción"
      />
      <input
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Precio"
        type="number"
      />
      <input
        name="stock"
        value={formData.stock}
        onChange={handleChange}
        placeholder="Stock"
        type="number"
      />
      <button type="submit">Guardar Producto</button>
    </form>
  );
};

export default ProductForm;
