import React, { useEffect, useState } from "react";
import api from "../../api";
import ProductForm from "./ProductForm";
import "./css/ProductStyle.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api
      .get("/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error al obtener productos:", error));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      api.delete(`/products/${id}`).then(() => {
        setProducts(products.filter((p) => p.id !== id));
        alert("Producto eliminado con éxito.");
      });
    }
  };

  const handleSuccess = () => {
    fetchProducts();
    setEditingProduct(null);
  };

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Lista de Productos</h1>
      {editingProduct ? (
        <ProductForm product={editingProduct} onSuccess={handleSuccess} />
      ) : (
        <div className="product-list-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-card-body">
                <h5 className="product-card-title">{product.name}</h5>
                <p className="product-card-text">
                  <strong>Precio:</strong> ${product.price}
                </p>
                <p className="product-card-text">
                  <strong>Stock:</strong> {product.stock}
                </p>
                <p className="product-card-text">
                  <strong>Descripción:</strong> {product.description || "Sin descripción"}
                </p>
              </div>
              <div className="product-card-footer">
                <button
                  className="product-card-btn btn btn-primary"
                  onClick={() => handleEdit(product)}
                >
                  Editar
                </button>
                <button
                  className="product-card-btn btn btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
