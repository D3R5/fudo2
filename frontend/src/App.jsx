// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import SalesList from './components/Sales/SalesList';
import SaleForm from './components/Sales/SaleForm';
import SaleDetail from './components/Sales/SaleDetail';
import SalesByDate from './components/Sales/SalesByDate';
import DailyTotalSales from './components/Sales/DailyTotalSales';
import DailyTotalsHistory from './components/Sales/DailyTotalsHistory';
import TopSellingProducts from './components/Sales/TopSellingProducts';
import './App.css';
import '../src/Nav.css';

const App = () => {
  const handleSaleCreated = (saleData) => {
    console.log("Venta creada:", saleData);
  };

  return (
    <Router>
      <div className="container">
        <h1>Gestión de Productos y Ventas</h1>

        <nav>
          PRODUCTOS &nbsp;
          <Link to="/products/new">Crear Producto</Link> |{' '}
          <Link to="/products">Productos</Link> |{' '}
          <br />
          <br />
          VENTAS &nbsp;
          <Link to="/sales">Ventas</Link> |{' '}
          <Link to="/sales/new">Registrar Venta</Link> |{' '}
          <Link to="/sales/by_date">Ventas por Fecha</Link> |{' '}
          <Link to="/sales/daily_total">Total Diario</Link> |{' '}
          <Link to="/sales/daily_totals_history">Historial Diarios</Link> |{' '}
          <Link to="/sales/top_selling">Productos Más Vendidos</Link>
        </nav>

        <Routes>
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm onSuccess={() => window.location.href = '/products'} />} />
          <Route path="/sales" element={<SalesList />} />
          <Route path="/sales/new" element={<SaleForm onSaleCreated={handleSaleCreated} />} />
          <Route path="/sales/:id" element={<SaleDetail />} />
          <Route path="/sales/by_date" element={<SalesByDate />} />
          <Route path="/sales/daily_total" element={<DailyTotalSales />} />
          <Route path="/sales/daily_totals_history" element={<DailyTotalsHistory />} />
          <Route path="/sales/top_selling" element={<TopSellingProducts />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
