import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-cafeteria shadow-lg">
      <div className="container">
        {/* Logo y Nombre */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="logo.png" // Cambia por el logo de tu cafetería
            alt="Logo"
            className="me-2"
            style={{ height: "50px" }}
          />
          <span className="fw-bold text-brand">Gestión de Ventas</span>
        </Link>
        {/* Botón de hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Productos */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-nav"
                to="#"
                id="productosDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Productos
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/products/new">
                    Crear Producto
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/products">
                    Ver Productos
                  </Link>
                </li>
              </ul>
            </li>

            {/* Ventas */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-nav"
                to="#"
                id="ventasDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Ventas
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/sales">
                    Ver Ventas
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/sales/new">
                    Registrar Venta
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/sales/by_date">
                    Ventas por Fecha
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/sales/daily_total">
                    Total Diario
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/sales/daily_totals_history">
                    Historial de Totales
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/sales/top_selling">
                    Productos Más Vendidos
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
