-- Eliminar las tablas si ya existen
DROP TABLE IF EXISTS sale_items;
DROP TABLE IF EXISTS sales;
DROP TYPE IF EXISTS payment_method;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS daily_totals;
DROP TABLE IF EXISTS cash_register;

-- Crear tabla de productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- Restricción única para evitar nombres duplicados
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0), -- Validación: precio no puede ser negativo
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0), -- Validación: stock no puede ser negativo
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
    quantity INTEGER NOT NULL CHECK (quantity > 0), -- Validación: la cantidad debe ser mayor a 0
    price_at_time DECIMAL(10,2) NOT NULL CHECK (price_at_time >= 0), -- Validación: precio no puede ser negativo
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0), -- Validación: subtotal no puede ser negativo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla para registrar los totales diarios
CREATE TABLE daily_totals (
    id SERIAL PRIMARY KEY,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0), -- Validación: total no puede ser negativo
    date DATE NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla para registrar el arqueo de caja
CREATE TABLE cash_register (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    total_cash DECIMAL(10,2) DEFAULT 0 CHECK (total_cash >= 0), -- Validación: efectivo no puede ser negativo
    total_card DECIMAL(10,2) DEFAULT 0 CHECK (total_card >= 0), -- Validación: tarjetas no pueden ser negativas
    total_transfer DECIMAL(10,2) DEFAULT 0 CHECK (total_transfer >= 0), -- Validación: transferencias no pueden ser negativas
    total_sales DECIMAL(10,2) DEFAULT 0 CHECK (total_sales >= 0), -- Validación: total ventas no puede ser negativo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_sales_created_at ON sales(created_at);
CREATE INDEX idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product_id ON sale_items(product_id);

ALTER TABLE sales ADD COLUMN discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100);
