import React, { useEffect } from 'react';
import useProductStore from '../../stores/productStore';

const ProductDetail = ({ id }) => {
  const { products, fetchProducts } = useProductStore();
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (!product) fetchProducts();
  }, [fetchProducts, product]);

  if (!product) return <p>Cargando...</p>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Precio: ${product.price}</p>
      <p>Stock: {product.stock}</p>
    </div>
  );
};

export default ProductDetail;
