import React, { useState, useEffect } from "react";
import axios from "axios";
import './css/SaleForm.css';


const SaleForm = ({ onSaleCreated }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [items, setItems] = useState([
    { product_id: "", quantity: 1, price_at_time: 0 },
  ]);
  const [products, setProducts] = useState([]);

  // Obtener todos los productos al cargar el componente
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Recalcular el total automáticamente cada vez que cambien los items
  useEffect(() => {
    const newTotal = items.reduce((sum, item) => {
      const price = parseFloat(item.price_at_time) || 0;
      const subtotal = price * item.quantity;
      return sum + subtotal;
    }, 0);
    setTotalAmount(newTotal);
  }, [items]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];

    if (field === "price_at_time") {
      // Guardamos el valor como texto temporalmente para evitar reiniciar el cursor
      newItems[index][field] = value ? value : "";
    } else {
      // Parseamos solo la cantidad, si es necesario
      newItems[index][field] = value ? parseInt(value) || 0 : 0;
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1, price_at_time: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el método de pago
    const validPaymentMethods = ['efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      alert(`Método de pago inválido. Los métodos permitidos son: ${validPaymentMethods.join(', ')}`);
      return;
    }

    const saleData = {
      total_amount: totalAmount,
      payment_method: paymentMethod,
      items: items.map((item) => ({
        ...item,
        subtotal: item.price_at_time * item.quantity,
      })),
    };

    try {
      const response = await axios.post("http://localhost:5000/api/sales", saleData);
      alert("Venta creada exitosamente");
      onSaleCreated(response.data);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      alert(error.response?.data?.error || "Error al crear la venta");
    }
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar Nueva Venta</h2>

      <h3>Productos</h3>
      {items.map((item, index) => (
        <div key={index}>
          <select
            value={item.product_id}
            onChange={(e) =>
              handleItemChange(index, "product_id", e.target.value)
            }
            required
          >
            <option value="">Seleccionar Producto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Cantidad"
            value={item.quantity}
            onChange={(e) =>
              handleItemChange(index, "quantity", e.target.value)
            }
            required
          />

          <input
            type="number"
            placeholder="Precio"
            value={item.price_at_time}
            onChange={(e) =>
              handleItemChange(index, "price_at_time", e.target.value)
            }
            required
          />

          <button type="button" onClick={() => removeItem(index)}>
            Eliminar
          </button>
        </div>
      ))}

      <button type="button" onClick={addItem}>
        Agregar Producto
      </button>

      <h3>Información de Pago</h3>
      <label>Método de pago:</label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        required
      >
        <option value="efectivo">Efectivo</option>
        <option value="tarjeta_debito">Tarjeta de Débito</option>
        <option value="tarjeta_credito">Tarjeta de Crédito</option>
        <option value="transferencia">Transferencia</option>
      </select>
      
      <h3>Resumen de la Venta</h3>
      <label>Total de la venta:</label>
      <input type="number" value={totalAmount} readOnly />

      <button type="submit">Registrar Venta</button>
    </form>
  );
};

export default SaleForm;
