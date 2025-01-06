import React, { useEffect, useState } from "react";
import api from "../../api";
import ProductForm from "./ProductForm";
import "./css/ProductStyle.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [orderDirection, setOrderDirection] = useState("asc"); // Estado para dirección de orden

  useEffect(() => {
    fetchProducts();
  }, [orderDirection]); // Refetch cuando cambia la dirección de orden

  const fetchProducts = (orderBy = "name", direction = orderDirection) => {
    api
      .get(`/products/filter`, {
        params: { orderBy, orderDirection: direction },
      })
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

  // Filtrar productos según el término de búsqueda
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Lista de Productos</h1>
      <div className="product-list-controls">
        <input
          type="text"
          className="product-search-input"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="product-order-btn btn btn-secondary"
          onClick={() =>
            setOrderDirection((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          Ordenar por Nombre ({orderDirection === "asc" ? "Asc" : "Desc"})
        </button>
      </div>
      {editingProduct ? (
        <ProductForm product={editingProduct} onSuccess={handleSuccess} />
      ) : (
        <div className="product-list-grid">
          {filteredProducts.map((product) => (
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
