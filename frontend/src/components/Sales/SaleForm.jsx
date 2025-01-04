import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/SaleForm.css";

const SaleForm = ({ onSaleCreated }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [items, setItems] = useState([
    { product_id: "", quantity: 0, price_at_time: 0 },
  ]);
  const [products, setProducts] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  // Fetch products on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  // Update item prices and total when products or payment method changes
  useEffect(() => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        if (!product) return item;

        const price = paymentMethod === "efectivo" ? product.cash_price || product.price : product.price;
        return { ...item, price_at_time: price };
      })
    );
  }, [paymentMethod, products]);

  // Calculate total amount with discount
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => {
      const price = parseFloat(item.price_at_time) || 0;
      return sum + price * (item.quantity || 0);
    }, 0);

    setTotalAmount(subtotal * (1 - discountPercentage / 100));
  }, [items, discountPercentage]);

  // Calculate remaining amount when paid amount changes
  useEffect(() => {
    setRemainingAmount(amountPaid - totalAmount);
  }, [amountPaid, totalAmount]);

  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 0, price_at_time: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "quantity" ? parseInt(value) || 0 : value;

    if (field === "product_id") {
      const selectedProduct = products.find((product) => product.id === value);
      if (selectedProduct) {
        const price = paymentMethod === "efectivo" ? selectedProduct.cash_price || selectedProduct.price : selectedProduct.price;
        newItems[index].price_at_time = price;
      }
    }

    setItems(newItems);
  };

  const handleDiscountChange = (e) => setDiscountPercentage(parseFloat(e.target.value) || 0);

  const handleAmountPaidChange = (e) => {
    const value = parseFloat(e.target.value);
    setAmountPaid(isNaN(value) ? 0 : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validPaymentMethods = ["efectivo", "tarjeta_debito", "tarjeta_credito", "transferencia"];
    if (!validPaymentMethods.includes(paymentMethod)) {
      alert(`Método de pago inválido. Métodos válidos: ${validPaymentMethods.join(", ")}`);
      return;
    }

    const saleData = {
      total_amount: totalAmount,
      discounted_total: totalAmount,
      payment_method: paymentMethod,
      discount_percentage: discountPercentage,
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
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Error al crear la venta");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar Nueva Venta</h2>
      {items.map((item, index) => (
        <div key={index}>
          <label>Producto:</label>
          <select
            value={item.product_id}
            onChange={(e) => handleItemChange(index, "product_id", e.target.value)}
          >
            <option value="">Seleccione un producto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => removeItem(index)}>
            Eliminar
          </button>
          <label>Cantidad:</label>
          <input
            type="number"
            min="0"
            placeholder="Cantidad de productos"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
          />
          <label>Precio:</label>
          <input
            type="number"
            min="0"
            placeholder="Precio del producto"
            value={item.price_at_time}
            readOnly
          />
        </div>
      ))}
      <button type="button" onClick={addItem}>
        Agregar Producto
      </button>
      <label>Método de pago:</label>
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="efectivo">Efectivo</option>
        <option value="tarjeta_debito">Tarjeta de Débito</option>
        <option value="tarjeta_credito">Tarjeta de Crédito</option>
        <option value="transferencia">Transferencia</option>
      </select>
      <label>Descuento (%):</label>
      <input type="number" placeholder="Descuento" value={discountPercentage} onChange={handleDiscountChange} min="0" max="100" />
      {paymentMethod === "efectivo" && (
        <div>
          <label>Monto Pagado:</label>
          <input
            type="number"
            placeholder="Monto Pagado"
            value={amountPaid}
            onChange={(e) => handleAmountPaidChange}
            min="0"
          />
          <p>Vuelto: ${!isNaN(remainingAmount) ? remainingAmount.toFixed(2) : 0}</p>
        </div>
      )}
      <label>Total de la venta:</label>
      <input type="number" placeholder="Total de la venta" value={totalAmount} readOnly />
      <button type="submit">Registrar Venta</button>
    </form>
  );
};

export default SaleForm;
