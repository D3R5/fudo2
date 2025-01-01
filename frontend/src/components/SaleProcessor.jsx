// src/components/Sales/SaleProcessor.js
import React from 'react';

const SaleProcessor = ({ selectedProducts, onProcessSale }) => {
  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  return (
    <div>
      <h2>Resumen de Venta</h2>
      <ul>
        {selectedProducts.map((product, index) => (
          <li key={index}>
            {product.name} - {product.quantity} x ${product.price} = $
            {product.quantity * product.price}
          </li>
        ))}
      </ul>
      <h3>Total: ${calculateTotal()}</h3>
      <button onClick={onProcessSale}>Procesar Venta</button>
    </div>
  );
};

export default SaleProcessor;
