import React, { useState } from "react";
import api from "../../api";
import "./css/ProductStyle.css";

const ProductForm = ({ product, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    stock: product?.stock || "",
    description: product?.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.price < 0 || formData.stock < 0) {
      alert("El precio y el stock deben ser valores positivos.");
      return;
    }

    api.get("/products").then((response) => {
      const exists = response.data.some(
        (existingProduct) =>
          existingProduct.name.toLowerCase() === formData.name.toLowerCase()
      );

      if (exists && !product) {
        alert("Ya existe un producto con este nombre.");
        return;
      }

      const apiCall = product
        ? api.put(`/products/${product.id}`, formData)
        : api.post("/products", formData);

      apiCall
        .then(() => {
          alert("Producto guardado con éxito.");
          if (onSuccess) onSuccess();
        })
        .catch((error) => {
          console.error("Error al guardar producto:", error);
          alert("Ocurrió un error al guardar el producto.");
        });
    });
  };

  return (
    <form className="product-form-container" onSubmit={handleSubmit}>
      <h2 className="product-form-title">Gestión de Producto</h2>
      <div className="product-form-group">
        <label className="product-form-label">Nombre del producto</label>
        <input
          type="text"
          className="product-form-input"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="product-form-group">
        <label className="product-form-label">Precio</label>
        <input
          type="number"
          className="product-form-input"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>
      <div className="product-form-group">
        <label className="product-form-label">Stock</label>
        <input
          type="number"
          className="product-form-input"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />
      </div>
      <div className="product-form-group">
        <label className="product-form-label">Descripción</label>
        <textarea
          className="product-form-textarea"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="product-form-actions">
        <button type="submit" className="product-form-btn btn btn-success">
          {product ? "Actualizar" : "Crear"}
        </button>
        <button
          type="button"
          className="product-form-btn btn btn-secondary"
          onClick={() => onSuccess()}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
