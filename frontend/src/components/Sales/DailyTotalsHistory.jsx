import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "../../api";

const DailyTotalsHistory = () => {
  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [productsSold, setProductsSold] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Obtener el historial de ventas diarias
  useEffect(() => {
    api
      .get("/sales/daily_totals_history")
      .then((response) => setHistory(response.data))
      .catch((error) => console.error("Error al obtener el historial:", error));
  }, []);

  // Manejar la selección de una fecha para mostrar detalles
  const handleShowProducts = (date) => {
    setSelectedDate(date);

    // Obtener los productos vendidos en la fecha seleccionada
    api
      .get(`/sales/products_sold?date=${date}`)
      .then((response) => setProductsSold(response.data))
      .catch((error) => console.error("Error al obtener productos:", error));

    // Obtener el desglose de medios de pago en la fecha seleccionada
    api
      .get(`/sales/daily_totals_by_payment_method?date=${date}`)
      .then((response) => setPaymentMethods(response.data))
      .catch((error) => console.error("Error al obtener medios de pago:", error));
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
