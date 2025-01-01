import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import SalesList from './components/Sales/SalesList';
import SaleForm from './components/Sales/SaleForm';
import SaleDetail from './components/Sales/SaleDetail';
import SalesByDate from './components/Sales/SalesByDate';
import DailyTotalSales from './components/Sales/DailyTotalSales';
import DailyTotalsHistory from './components/Sales/DailyTotalsHistory';
import TopSellingProducts from './components/Sales/TopSellingProducts';
import Navbar from './components/Navbar';
import TableSelector from './components/TableSelector';
import ProductSelector from './components/ProductSelector';
import SaleProcessor from './components/SaleProcessor';

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


const App = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleTableSelect = (tableId) => {
    setSelectedTable(tableId);
  };

  const handleTableClose = (tableId) => {
    console.log('Mesa cerrada:', tableId);
    setSelectedTable(null);
    setSelectedProducts([]);
  };

  const handleProductAdd = (product) => {
    setSelectedProducts((prev) => {
      const existingProduct = prev.find((p) => p.id === product.id);
      if (existingProduct) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleProcessSale = () => {
    console.log('Venta procesada para mesa:', selectedTable);
    console.log('Productos vendidos:', selectedProducts);
    setSelectedTable(null);
    setSelectedProducts([]);
  };

  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm onSuccess={() => window.location.href = '/products'} />} />
          <Route path="/sales" element={<SalesList />} />
          <Route path="/sales/new" element={<SaleForm onSaleCreated={(saleData) => console.log('Venta creada:', saleData)} />} />
          <Route path="/sales/:id" element={<SaleDetail />} />
          <Route path="/sales/by_date" element={<SalesByDate />} />
          <Route path="/sales/daily_total" element={<DailyTotalSales />} />
          <Route path="/sales/daily_totals_history" element={<DailyTotalsHistory />} />
          <Route path="/sales/top_selling" element={<TopSellingProducts />} />
          <Route
            path="/table"
            element={
              <div>
                <TableSelector onTableSelect={handleTableSelect} onTableClose={handleTableClose} />
                {selectedTable && (
                  <>
                    <ProductSelector onProductAdd={handleProductAdd} />
                    {selectedProducts.length > 0 && (
                      <SaleProcessor
                        selectedProducts={selectedProducts}
                        onProcessSale={handleProcessSale}
                      />
                    )}
                  </>
                )}
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
