import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <strong><Link to="/">Gestión de Ventas</Link></strong>
      </div>
      <div className="navbar-links">
        <div className="navbar-section">
          <strong>PRODUCTOS</strong>
          <Link to="/products/new">Crear Producto</Link>
          <Link to="/products">Productos</Link>
        </div>
        <br />
        <br />
        <div className="navbar-section">
          <strong>VENTAS</strong>
     
              <Link to="/sales">Ventas</Link>
         
              <Link to="/sales/new">Registrar Venta</Link>
        
              <Link to="/sales/by_date">Ventas por Fecha</Link>
          
              <Link to="/sales/daily_total">Total Diario</Link>
        
              <Link to="/sales/daily_totals_history">Historial Diarios</Link>
       
              <Link to="/sales/top_selling">Productos Más Vendidos</Link>
       
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
