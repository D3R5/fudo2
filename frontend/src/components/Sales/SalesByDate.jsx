// src/components/Sales/SalesByDate.js
import React, { useState } from "react";
import useSalesStore from "../../stores/salesStore";

const SalesByDate = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { salesByDate, fetchSalesByDate } = useSalesStore();

  const handleSearch = () => {
    // Asegúrate de que ambas fechas estén seleccionadas
    if (!startDate || !endDate) {
      alert("Por favor, selecciona ambas fechas.");
      return;
    }

    // Llama al método del store para obtener las ventas por rango de fechas
    fetchSalesByDate(startDate, endDate);
  };

  return (
    <div>
      <h2>Ventas por Fecha</h2>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Fecha de inicio"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="Fecha de fin"
      />
      <button onClick={handleSearch}>Buscar</button>

      <ul>
        {salesByDate.length > 0 ? (
          salesByDate.map((sale) => (
            <li key={sale.id}>
              ID Venta: {sale.id} - Monto Total: ${sale.total_amount} - Método
              de Pago: {sale.payment_method}
            </li>
          ))
        ) : (
          <p>No hay ventas en el rango de fechas seleccionado.</p>
        )}
      </ul>
    </div>
  );
};

export default SalesByDate;
