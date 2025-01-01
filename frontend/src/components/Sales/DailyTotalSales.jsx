import React, { useEffect } from "react";
import useSalesStore from "../../stores/salesStore";
import "./css/DailyTotalSales.css";

const DailyTotalSales = () => {
  const { dailyTotal, fetchDailyTotal } = useSalesStore();

  useEffect(() => {
    fetchDailyTotal();
  }, [fetchDailyTotal]);

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
