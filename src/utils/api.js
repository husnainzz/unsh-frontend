import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post("/users/login", credentials),
  register: (userData) => api.post("/users/register", userData),
  getProfile: () => api.get("/users/profile"),
  updateProfile: (userData) => api.put("/users/profile", userData),
  getMyOrders: () => api.get("/users/orders"),
  getAllUsers: () => api.get("/users/all"), // New method for admin to get all users
};

// Product API calls
export const productAPI = {
  getProducts: (params = {}) => api.get("/products", { params }),
  getAllProducts: () => api.get("/products/all"), // New method for admin to get all products
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post("/products", productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  toggleProductStatus: (id) => api.patch(`/products/${id}/toggle-status`),
  getCategories: () => api.get("/products/categories"),
  getBrands: () => api.get("/products/brands"),
};

// Order API calls
export const orderAPI = {
  createOrder: (orderData) => api.post("/orders", orderData),
  getOrder: (id) => api.get(`/orders/${id}`),
  getAllOrders: (params = {}) => api.get("/orders", { params }),
  updateOrderStatus: (id, statusData) =>
    api.put(`/orders/${id}/status`, statusData),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

export default api;
