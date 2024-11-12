// src/components/Sales/TopSellingProducts.js
import React, { useEffect, useState } from "react";
import api from "../../api";

const TopSellingProducts = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    api
      .get("/sales/top_selling_products")
      .then((response) => setTopProducts(response.data))
      .catch((error) =>
        console.error("Error al obtener productos más vendidos:", error)
      );
  }, []);

  return (
    <div>
      <h2>Productos Más Vendidos</h2>
      <ul>
        {topProducts.map((product) => (
          <li key={product.product_id}>
            Producto: {product.name} - Cantidad Vendida:{" "}
            {product.total_quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSellingProducts;
