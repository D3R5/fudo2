# API Documentation

## 1. Productos (Products)

### 1.1 Obtener todos los productos
**Método:** GET  
**URL:** `http://localhost:5000/api/products`  
**Descripción:** Obtiene la lista de todos los productos.

### 1.2 Obtener un producto por ID
**Método:** GET   
**URL:** `http://localhost:5000/api/products/{id}`  
**Descripción:** Obtiene un producto específico por su ID.  
**Ejemplo:** `http://localhost:5000/api/products/1`

### 1.3 Crear un nuevo producto
**Método:** POST  
**URL:** `http://localhost:5000/api/products`  
**Descripción:** Crea un nuevo producto en la base de datos.  
**Cuerpo (JSON):**
```json
{
  "name": "Nuevo Producto",
  "description": "Descripción del producto",
  "price": 19.99,
  "stock": 100
}
```

### 1.4 Actualizar un producto existente
**Método:** PUT  
**URL:** `http://localhost:5000/api/products/{id}`  
**Descripción:** Actualiza los detalles de un producto existente.  
**Cuerpo (JSON):**
```json
{
    "name": "nuevo helado soft",
    "description": "Nueva helado soft de vainilla en cono",
    "price": "1500.00",
    "stock": 150
}
```

### 1.5 Eliminar un producto
**Método:** DELETE  
**URL:** `http://localhost:5000/api/products/{id}`  
**Descripción:** Elimina un producto específico de la base de datos.

## 2. Ventas (Sales)

### 2.1 Obtener todas las ventas
**Método:** GET  
**URL:** `http://localhost:5000/api/sales`  
**Descripción:** Obtiene la lista de todas las ventas registradas.

### 2.2 Crear una nueva venta
**Método:** POST  
**URL:** `http://localhost:5000/api/sales`  
**Descripción:** Crea una nueva venta y registra el total y el método de pago.

**Cuerpo de la solicitud (JSON):**
```json
{
    "total_amount": 4500.00,
    "payment_method": "efectivo",
    "items": [
        {
            "product_id": 2,
            "quantity": 5,
            "price_at_time": 1500.00,
            "subtotal": 4500.00
        }
    ]
}
```

**Respuesta esperada:**
```json
{
    "id": 15,
    "total_amount": "4500.00",
    "payment_method": "efectivo",
    "created_at": "2024-10-27T18:28:08.548Z",
    "items": [
        {
            "product_id": 2,
            "name": "nuevo helado soft",
            "updated_stock": 95
        }
    ]
}
```

### 2.3 Obtener ventas por fecha
**Método:** GET  
**URL:** `http://localhost:5000/api/sales?startDate={fecha_inicial}&endDate={fecha_final}`  
**Descripción:** Obtiene las ventas dentro de un rango de fechas.  
**Ejemplo:** `http://localhost:5000/api/sales?startDate=2024-01-01&endDate=2024-01-31`

### 2.4 Obtener ventas por método de pago
**Método:** GET  
**URL:** `http://localhost:5000/api/sales/payment_method/{método}`  
**Descripción:** Obtiene las ventas filtradas por el método de pago.  
**Ejemplo:** `http://localhost:5000/api/sales/payment_method/efectivo`

### 2.5 Obtener el total diario de ventas
**Método:** GET  
**URL:** `http://localhost:5000/api/sales/daily_total`  
**Descripción:** Obtiene el total de ventas del día actual.

### 2.6 Obtener productos más vendidos
**Método:** GET  
**URL:** `http://localhost:5000/api/sales/top_selling_products`  
**Descripción:** Obtiene los productos más vendidos en un período determinado.  
**Nota:** Agregar parámetros de fecha si es necesario.

