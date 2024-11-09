import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SaleDetail = () => {
    const { id } = useParams();
    const [sale, setSale] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/sales/${id}`)
            .then(response => setSale(response.data))
            .catch(error => console.error(error));
    }, [id]);

    if (!sale) {
        return <p>Cargando detalles de la venta...</p>;
    }

    return (
        <div>
            <h2>Detalles de la Venta #{sale.id}</h2>
            <p><strong>Total de la venta:</strong> ${sale.total_amount}</p>
            <p><strong>Método de pago:</strong> {sale.payment_method}</p>
            <p><strong>Fecha de creación:</strong> {new Date(sale.created_at).toLocaleString()}</p>

            <h3>Productos</h3>
            <ul>
                {sale.items.map(item => (
                    <li key={item.product_id}>
                        <p><strong>Producto:</strong> {item.name}</p>
                        <p><strong>Cantidad vendida:</strong> {item.quantity}</p>
                        <p><strong>Precio en la venta:</strong> ${item.price_at_time}</p>
                        <p><strong>Subtotal:</strong> ${item.subtotal}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SaleDetail;
