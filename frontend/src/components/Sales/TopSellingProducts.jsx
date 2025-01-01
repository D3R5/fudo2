// src/components/Sales/TopSellingProducts.js
import React, { useEffect } from "react";
import useSalesStore from "../../stores/salesStore";

const TopSellingProducts = () => {
  // Extraer estado y función del store
  const { topProducts, fetchTopSellingProducts } = useSalesStore();

  // Cargar los productos más vendidos al montar el componente
  useEffect(() => {
    if (topProducts.length === 0) { // Evita solicitudes redundantes si los datos ya están en el store
      fetchTopSellingProducts();
    }
  }, [fetchTopSellingProducts, topProducts.length]);

  return (
    <div>
      <h2>Productos Más Vendidos</h2>
      {topProducts.length > 0 ? ( // Mostrar datos si están disponibles
        <ul>
          {topProducts.map((product) => (
            <li key={product.product_id}>
              <strong>Producto:</strong> {product.name} -{" "}
              <strong>Cantidad Vendida:</strong> {product.total_quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p>Cargando productos más vendidos...</p> // Indicador de carga
      )}
    </div>
  );
};

export default TopSellingProducts;
