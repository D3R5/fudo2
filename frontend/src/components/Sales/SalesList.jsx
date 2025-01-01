import React, { useEffect, useState } from "react";
import api from "../../api";

const SalesList = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    api
      .get("/sales")
      .then((response) => {
        console.log("Datos de ventas recibidos:", response.data); // Depuración
        setSales(response.data);
      })
      .catch((error) => console.error("Error al obtener ventas:", error));
  }, []);

  return (
    <div>
      <h2>Lista de Ventas</h2>
      {sales.length === 0 ? (
        <p>No hay ventas disponibles.</p>
      ) : (
        <ul>
          {sales.map((sale) => {
            // Depuración para revisar cada venta
            console.log("Detalles de venta:", sale);

            // Calcular el monto sin descuento
            const originalAmount =
              sale.discount_percentage > 0
                ? Number(sale.total_amount) / (1 - sale.discount_percentage / 100)
                : Number(sale.total_amount);

            // Calcular el monto del descuento aplicado
            const discountAmount = originalAmount - Number(sale.total_amount);

            return (
              <li key={sale.id}>
                <p>{sale.total_amount} {sales.discount_percentage}  </p>
                <p>
                  <strong>ID Venta:</strong> {sale.id} -{" "}
                  <strong>Monto Total:</strong> ${Number(sale.total_amount).toFixed(2)}
                </p>
              
                  <>
                    <p>
                      <strong>Descuento Aplicado:</strong> {sale.discount_percentage}% (
                      <strong>Valor Original:</strong> ${originalAmount.toFixed(2)})
                    </p>
                    <p>
                      <strong>Monto de Descuento:</strong> {sale.total_amount}
                    </p>
                  </>
                
                <p>
                  <strong>Método de Pago:</strong> {sale.payment_method}
                </p>
                <ul>
                  {sale.products.map((product) => (
                    <li key={product.product_id}>
                      <strong>Producto:</strong> {product.name} -{" "}
                      <strong>Cantidad Vendida:</strong> {product.quantity} -{" "}
                      <strong>Precio en Venta:</strong> ${Number(product.price_at_time).toFixed(2)} -{" "}
                      <strong>Subtotal:</strong> ${Number(product.subtotal).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SalesList;
