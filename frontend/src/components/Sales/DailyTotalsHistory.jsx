import React, { useEffect } from "react";
import { format } from "date-fns";
import useSalesStore from "../../stores/salesStore";

const DailyTotalsHistory = () => {
  const {
    history,
    selectedDate,
    productsSold,
    paymentMethods,
    fetchHistory,
    fetchDetailsByDate,
    syncState, // Método de sincronización
  } = useSalesStore();

  useEffect(() => {
    syncState(); // Sincroniza los datos al montar
  }, [syncState]);

  const handleShowProducts = (date) => {
    fetchDetailsByDate(date);
  };

  return (
    <div>
      <h2>Historial de Totales Diarios</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => (
            <tr key={entry.date}>
              <td>{format(new Date(entry.date), "dd/MM/yyyy")}</td>
              <td>${entry.total}</td>
              <td>
                <button onClick={() => handleShowProducts(entry.date)}>
                  Ver Productos Vendidos
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDate && (
        <div>
          <h3>Productos vendidos el {format(new Date(selectedDate), "dd/MM/yyyy")}</h3>
          {productsSold.length > 0 ? (
            <ul>
              {productsSold.map((product) => (
                <li key={product.product_id}>
                  {product.name} - Cantidad: {product.total_quantity} - Total Generado: ${product.total_revenue}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay productos vendidos en esta fecha.</p>
          )}

          <h3>Desglose por Medio de Pago</h3>
          {paymentMethods.length > 0 ? (
            <ul>
              {paymentMethods.map((method) => (
                <li key={method.payment_method}>
                  {method.payment_method} - Total: ${method.total_amount}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay información de medios de pago para esta fecha.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyTotalsHistory;
