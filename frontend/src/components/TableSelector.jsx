import React, { useEffect, useState } from "react";

const TableSelector = ({ onTableSelect }) => {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('/api/tables');
        if (!response.ok) {
          throw new Error(`Error en la respuesta del servidor: ${response.status}`);
        }

        const data = await response.json(); // Asegúrate de que la API devuelve JSON válido
        setTables(data);
      } catch (err) {
        console.error("Error al cargar mesas:", err.message);
        setError("No se pudieron cargar las mesas. Verifica la conexión o el formato de la respuesta.");
      }
    };

    fetchTables();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Seleccionar Mesa</h2>
      <ul>
        {tables.map((table) => (
          <li key={table.id} onClick={() => onTableSelect(table)}>
            {table.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableSelector;
