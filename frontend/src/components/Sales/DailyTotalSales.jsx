// src/components/Sales/DailyTotalSales.js
import React, { useEffect, useState } from 'react';
import api from '../../api';
import './css/DailyTotalSales.css';


const DailyTotalSales = () => {
  const [dailyTotal, setDailyTotal] = useState(null);

  useEffect(() => {
    api.get('/sales/daily_total')
      .then(response => setDailyTotal(response.data.total_daily))
      .catch(error => console.error("Error al obtener total diario de ventas:", error));
  }, []);

  return (
    <div>
      <h2>Total Diario de Ventas</h2>
      {dailyTotal !== null ? (
        <p>El total de ventas de hoy es: ${dailyTotal}</p>
      ) : (
        <p>Cargando total diario...</p>
      )}
    </div>
  );
};

export default DailyTotalSales;
