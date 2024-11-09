// src/components/Sales/SalesByDate.js
import React, { useState } from 'react';
import api from '../../api';

const SalesByDate = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sales, setSales] = useState([]);

  const handleSearch = () => {
    // Convertir las fechas al formato YYYY-MM-DD
    const formatDate = (date) => {
      const [year, month, day] = date.split('-');
      return `${year}-${month}-${day}`;
    };
  
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
  
    api.get(`/sales?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
      .then(response => setSales(response.data))
      .catch(error => console.error("Error al obtener ventas:", error));
  };
  

  return (
    <div>
      <h2>Ventas por Fecha</h2>
      <input
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        placeholder="Fecha de inicio"
      />
      <input
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        placeholder="Fecha de fin"
      />
      <button onClick={handleSearch}>Buscar</button>

      <ul>
        {sales.map(sale => (
          <li key={sale.id}>
            ID Venta: {sale.id} - Monto Total: ${sale.total_amount} - Método de Pago: {sale.payment_method}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesByDate;
