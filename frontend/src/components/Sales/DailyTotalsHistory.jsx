import React, { useState, useEffect } from "react";
import api from "../../api";

const DailyTotalsHistory = () => {
  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [productsSold, setProductsSold] = useState([]);

  useEffect(() => {
    // Obtener el historial de totales diarios
    api
      .get("/sales/daily_totals_history")
      .then((response) => setHistory(response.data))
      .catch((error) =>
        console.error("Error al obtener el historial de totales diarios:", error)
      );
  }, []);

  const handleShowProducts = (date) => {
    setSelectedDate(date);
    // Obtener productos vendidos en la fecha seleccionada
    api
      .get(`/sales/products_sold?date=${date}`)
      .then((response) => setProductsSold(response.data))
      .catch((error) =>
        console.error("Error al obtener los productos vendidos:", error)
      );
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
              <td>{entry.date}</td>
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
          <h3>Productos vendidos el {selectedDate}</h3>
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
        </div>
      )}
    </div>
  );
};

export default DailyTotalsHistory;
