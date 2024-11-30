import React, { useEffect, useState } from "react";
import api from "../../api";
import "./css/ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api
      .get("/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error al obtener productos:", error));
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este producto?"
    );
    if (confirmDelete) {
      api
        .delete(`/products/${id}`)
        .then(() => {
          setProducts(products.filter((product) => product.id !== id));
        })
        .catch((error) => console.error("Error al eliminar producto:", error));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const { price, stock } = formData;

    // Validación: precio y stock deben ser positivos
    if (price < 0 || stock < 0) {
      alert("El precio y el stock deben ser valores positivos.");
      return;
    }

    api
      .put(`/products/${editingProduct}`, formData)
      .then(() => {
        fetchProducts();
        setEditingProduct(null);
        setFormData({ name: "", price: "", stock: "", description: "" });
      })
      .catch((error) => console.error("Error al actualizar producto:", error));
  };

  return (
    <div>
      <h2>Lista de Productos</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {editingProduct === product.id ? (
              <div>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre"
                />
                <input
                  name="price"
                  type="number"
                  min="0" // Restringir valores negativos
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Precio"
                />
                <input
                  name="stock"
                  type="number"
                  min="0" // Restringir valores negativos
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                />
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descripción"
                />
                <button onClick={handleSave}>Guardar</button>
                <button onClick={() => setEditingProduct(null)}>
                  Cancelar
                </button>
              </div>
            ) : (
              <div>
                {product.name} - ${product.price} - Stock: {product.stock}
                &nbsp;&nbsp;
                <button
                  onClick={() => handleEdit(product)}
                  className="button-edit"
                >
                  Editar
                </button>
                &nbsp;&nbsp;
                <button onClick={() => handleDelete(product.id)}>
                  Eliminar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
