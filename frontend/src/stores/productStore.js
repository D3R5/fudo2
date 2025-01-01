import { create } from 'zustand';
import api from '../api';

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  // Fetch all products
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/products');
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: 'Error al obtener productos', loading: false });
      console.error(error);
    }
  },

  // Add or update a product
  saveProduct: async (product, onSuccess) => {
    try {
      if (product.id) {
        await api.put(`/products/${product.id}`, product);
      } else {
        await api.post('/products', product);
      }
      set((state) => ({
        products: product.id
          ? state.products.map((p) =>
              p.id === product.id ? { ...p, ...product } : p
            )
          : [...state.products, product],
      }));
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  },

  // Delete a product
  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  },
}));

export default useProductStore;
