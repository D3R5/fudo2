-- Eliminar las tablas si ya existen
DROP TABLE IF EXISTS sale_items;
DROP TABLE IF EXISTS sales;
DROP TYPE IF EXISTS payment_method;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS daily_totals;

-- Crear tabla de productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- Restricción única para evitar nombres duplicados
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear enum para métodos de pago
CREATE TYPE payment_method AS ENUM (
    'efectivo',
    'tarjeta_debito',
    'tarjeta_credito',
    'transferencia'
);

-- Crear tabla de ventas
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de items de venta (relación entre productos y ventas) con ON DELETE CASCADE
CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla para registrar los totales diarios
CREATE TABLE daily_totals (
    id SERIAL PRIMARY KEY,
    total DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_sales_created_at ON sales(created_at);
CREATE INDEX idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product_id ON sale_items(product_id);
