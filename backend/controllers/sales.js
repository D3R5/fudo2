const Sale = require('../models/sale');
const Product = require('../models/product'); 


const getAllSales = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const sales = await Sale.getAll(startDate, endDate);
        res.json(sales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las ventas' });
    }
};

const createSale = async (req, res) => {
    const saleData = req.body;
    try {
        // Validar que el precio ingresado sea el correcto para cada producto
        for (const item of saleData.items) {
            const product = await Product.getById(item.product_id);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ error: `Stock insuficiente para el producto: ${product ? product.name : 'ID ' + item.product_id}` });
            }

            // Verificar que el precio en la venta coincida con el precio actual del producto
            if (item.price_at_time !== product.price) {
                return res.status(400).json({ error: `Precio incorrecto para el producto: ${product.name}` });
            }
        }

        // Proceder a crear la venta y actualizar el stock si todo es válido
        const newSale = await Sale.create(saleData);
        await Sale.createSaleItems(newSale.id, saleData.items);

        const updatedItems = [];
        for (const item of saleData.items) {
            await Product.updateStock(item.product_id, item.quantity);
            const updatedProduct = await Product.getById(item.product_id);
            updatedItems.push({
                product_id: updatedProduct.id,
                name: updatedProduct.name,
                updated_stock: updatedProduct.stock
            });
        }

        res.status(201).json({
            ...newSale,
            items: updatedItems
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la venta' });
    }
};



const getDailyTotal = async (req, res) => {
    try {
        const total = await Sale.getDailyTotal();
        res.json({ total_daily: total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el total diario de ventas' });
    }
};

const getTopSellingProducts = async (req, res) => {
    try {
        const topProducts = await Sale.getTopSellingProducts();
        res.json(topProducts.map(product => ({
            product_id: product.product_id,
            name: product.name,
            total_quantity: product.total_quantity
        })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos más vendidos' });
    }
};

module.exports = {
    getAllSales,
    createSale,
    getDailyTotal,
    getTopSellingProducts
};
