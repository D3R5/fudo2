// src/components/Sales/SalesList.js
import React, { useEffect, useState } from 'react';
import api from '../../api';

const SalesList = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    api.get('/sales')
      .then(response => setSales(response.data))
      .catch(error => console.error("Error al obtener ventas:", error));
  }, []);

  return (
    <div>
      <h2>Lista de Ventas</h2>
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

export default SalesList;
