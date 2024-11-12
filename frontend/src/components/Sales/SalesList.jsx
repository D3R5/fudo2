import React, { useEffect, useState } from "react";
import api from "../../api";

const SalesList = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    api
      .get("/sales")
      .then((response) => setSales(response.data))
      .catch((error) => console.error("Error al obtener ventas:", error));
  }, []);

  return (
    <div>
      <h2>Lista de Ventas</h2>
      <ul>
        {sales.map((sale) => (
          <li key={sale.id}>
            <p>
              ID Venta: {sale.id} - Monto Total: ${sale.total_amount} - Método
              de Pago: {sale.payment_method}
            </p>
            <ul>
              {sale.products.map((product) => (
                <li key={product.product_id}>
                  Producto: {product.name} - Cantidad Vendida:{" "}
                  {product.quantity} - Precio en Venta: ${product.price_at_time}{" "}
                  - Subtotal: ${product.subtotal}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesList;
