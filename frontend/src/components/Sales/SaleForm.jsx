import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/SaleForm.css";

const SaleItem = ({
  index,
  item,
  products,
  paymentMethod,
  handleItemChange,
  removeItem,
}) => {
  return (
    <div className="mb-3">
      <div className="row g-3 align-items-center">
        <div className="col-md-4">
          <label className="form-label">Producto:</label>
          <select
            className="form-select"
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
        </div>
        <div className="col-md-2">
          <label className="form-label">Cantidad:</label>
          <input
            type="number"
            className="form-control"
            min="0"
            placeholder="Cantidad"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
            required
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Precio:</label>
          <input
            type="number"
            className="form-control"
            min="0"
            placeholder="Precio"
            value={item.price_at_time}
            onChange={(e) => handleItemChange(index, "price_at_time", e.target.value)}
          />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => removeItem(index)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

const PaymentDetails = ({
  paymentMethod,
  setPaymentMethod,
  amountPaid,
  remainingAmount,
  handleAmountPaidChange,
}) => {
  return (
    <div className="mb-3">
      <label className="form-label">Método de pago:</label>
      <select
        className="form-select"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="efectivo">Efectivo</option>
        <option value="tarjeta_debito">Tarjeta de Débito</option>
        <option value="tarjeta_credito">Tarjeta de Crédito</option>
        <option value="transferencia">Transferencia</option>
      </select>
      {paymentMethod === "efectivo" && (
        <div className="mt-3">
          <label className="form-label">Monto Pagado:</label>
          <input
            type="number"
            className="form-control"
            placeholder="Monto Pagado"
            value={amountPaid}
            onChange={handleAmountPaidChange}
            min="0"
          />
          <p className="mt-2">
            <strong>Vuelto:</strong> ${!isNaN(remainingAmount) ? remainingAmount.toFixed(2) : 0}
          </p>
        </div>
      )}
    </div>
  );
};

const DiscountInput = ({ discountPercentage, handleDiscountChange }) => {
  return (
    <div className="mb-3">
      <label className="form-label">Descuento (%):</label>
      <input
        type="number"
        className="form-control"
        placeholder="Descuento"
        value={discountPercentage}
        onChange={handleDiscountChange}
        min="0"
        max="100"
      />
    </div>
  );
};

const SaleSummary = ({ totalAmount }) => {
  return (
    <div className="mb-3">
      <label className="form-label">Total de la venta:</label>
      <input
        type="number"
        className="form-control"
        placeholder="Total de la venta"
        value={totalAmount}
        readOnly
      />
    </div>
  );
};

const SaleForm = ({ onSaleCreated }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [items, setItems] = useState([
    { product_id: "", quantity: "", price_at_time: "" },
  ]);
  const [products, setProducts] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const subtotal = items.reduce((sum, item) => {
      const price = parseFloat(item.price_at_time) || 0;
      return sum + price * item.quantity;
    }, 0);

    setTotalAmount(subtotal * (1 - discountPercentage / 100));
  }, [items, discountPercentage]);

  useEffect(() => {
    setRemainingAmount(Math.max(amountPaid - totalAmount));
  }, [amountPaid, totalAmount]);

  useEffect(() => {
    if (paymentMethod !== "efectivo") {
      setItems((prevItems) =>
        prevItems.map((item) => {
          const product = products.find((p) => p.id === item.product_id);
          return product ? { ...item, price_at_time: product.price } : item;
        })
      );
    }
  }, [paymentMethod, products]);

  const addItem = () => {
    setItems([...items, { product_id: "", quantity: "", price_at_time: "" }]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] =
      field === "price_at_time"
        ? parseFloat(value) || ""
        : parseInt(value) || 0;

    if (field === "product_id" && paymentMethod !== "efectivo") {
      const selectedProduct = products.find((product) => product.id === value);
      newItems[index].price_at_time = selectedProduct
        ? selectedProduct.price
        : 0;
    }

    setItems(newItems);
  };

  const handleDiscountChange = (e) =>
    setDiscountPercentage(parseFloat(e.target.value));

  const handleAmountPaidChange = (e) => {
    const value = parseFloat(e.target.value);
    setAmountPaid(isNaN(value) ? 0 : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validPaymentMethods = [
      "efectivo",
      "tarjeta_debito",
      "tarjeta_credito",
      "transferencia",
    ];
    if (!validPaymentMethods.includes(paymentMethod)) {
      alert(
        `Método de pago inválido. Métodos válidos: ${validPaymentMethods.join(", ")}`
      );
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
      const response = await axios.post(
        "http://localhost:5000/api/sales",
        saleData
      );
      alert("Venta creada exitosamente");
      onSaleCreated(response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Error al crear la venta");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
    <h2 className="mb-4 text-center">Registrar Nueva Venta</h2>
    {items.map((item, index) => (
      <SaleItem
        key={index}
        index={index}
        item={item}
        products={products}
        paymentMethod={paymentMethod}
        handleItemChange={handleItemChange}
        removeItem={removeItem}
      />
    ))}
    <button type="button" className="btn btn-primary mb-3" onClick={addItem}>
      Agregar Producto
    </button>
    <DiscountInput
      discountPercentage={discountPercentage}
      handleDiscountChange={setDiscountPercentage}
    />
    <PaymentDetails
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      amountPaid={amountPaid}
      remainingAmount={remainingAmount}
      handleAmountPaidChange={setAmountPaid}
    />
    <SaleSummary totalAmount={totalAmount} />
    <button type="submit" className="btn btn-success w-100">
      Registrar Venta
    </button>
  </form>
);
};

export default SaleForm;
