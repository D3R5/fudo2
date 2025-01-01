import { create } from "zustand";
import api from "../api";

const useSalesStore = create((set, get) => ({
  // Estados globales
  dailyTotal: null,
  history: [],
  productsSold: [],
  paymentMethods: [],
  selectedDate: null,
  topProducts: [],
  salesByDate: [],

  // Métodos para obtener datos
  fetchDailyTotal: async () => {
    try {
      const response = await api.get("/sales/daily_total");
      set({ dailyTotal: response.data.total_daily });
    } catch (error) {
      console.error("Error al obtener total diario de ventas:", error);
    }
  },

  fetchHistory: async () => {
    try {
      const response = await api.get("/sales/daily_totals_history");
      set({ history: response.data });
    } catch (error) {
      console.error("Error al obtener el historial:", error);
    }
  },

  fetchDetailsByDate: async (date) => {
    try {
      const [productsResponse, paymentMethodsResponse] = await Promise.all([
        api.get(`/sales/products_sold?date=${date}`),
        api.get(`/sales/daily_totals_by_payment_method?date=${date}`),
      ]);
      set({
        selectedDate: date,
        productsSold: productsResponse.data,
        paymentMethods: paymentMethodsResponse.data,
      });
    } catch (error) {
      console.error("Error al obtener detalles por fecha:", error);
    }
  },

  fetchTopSellingProducts: async () => {
    try {
      const response = await api.get("/sales/top_selling_products");
      set({ topProducts: response.data });
    } catch (error) {
      console.error("Error al obtener productos más vendidos:", error);
    }
  },

  fetchSalesByDate: async (startDate, endDate) => {
    try {
      const response = await api.get(`/sales?startDate=${startDate}&endDate=${endDate}`);
      set({ salesByDate: response.data });
    } catch (error) {
      console.error("Error al obtener ventas por rango de fechas:", error);
    }
  },

  // Sincronizar estado global
  syncState: async (options = {}) => {
    const { syncDailyTotal = true, syncHistory = true, syncTopProducts = true } = options;
    const tasks = [];

    if (syncDailyTotal) tasks.push(get().fetchDailyTotal());
    if (syncHistory) tasks.push(get().fetchHistory());
    if (syncTopProducts) tasks.push(get().fetchTopSellingProducts());

    try {
      await Promise.all(tasks);
    } catch (error) {
      console.error("Error al sincronizar estado:", error);
    }
  },
}));

export default useSalesStore;
