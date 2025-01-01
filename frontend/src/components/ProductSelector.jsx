// src/components/Sales/ProductSelector.js
import React, { useState, useEffect } from 'react';

const ProductSelector = ({ onProductAdd }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Simula una llamada a la API para obtener productos
    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error al cargar productos:', error));
  }, []);

  return (
    <div>
      <h2>Productos</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
            <button onClick={() => onProductAdd(product)}>Agregar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSelector;
