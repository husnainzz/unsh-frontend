import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api";

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
  getAllUsers: () => api.get("/users/all"), // Admin: Get all users
  updateUserRole: (userId, roleData) =>
    api.put(`/users/${userId}/role`, roleData), // Admin: Update user role
  toggleUserStatus: (userId) => api.patch(`/users/${userId}/toggle-status`), // Admin: Toggle user status
};

// Product API calls
export const productAPI = {
  getProducts: (params = {}) => api.get("/products", { params }),
  getAllProducts: () => api.get("/products/all"), // Admin: Get all products including inactive
  getProductByProdId: (prodId) => api.get(`/products/prod/${prodId}`), // Get by prodId
  createProduct: (productData) => api.post("/products", productData),
  updateProduct: (prodId, productData) =>
    api.put(`/products/${prodId}`, productData), // Updated to use prodId
  deleteProduct: (prodId) => api.delete(`/products/${prodId}`), // Updated to use prodId
  toggleProductStatus: (prodId) =>
    api.patch(`/products/${prodId}/toggle-status`), // Updated to use prodId
  getCategories: () => api.get("/products/categories"),
};

// Order API calls
export const orderAPI = {
  createOrder: (orderData) => api.post("/orders", orderData),
  createGuestOrder: (orderData) => api.post("/orders/guest", orderData), // Guest order creation
  getOrder: (id) => api.get(`/orders/${id}`),
  getOrderByTrackingId: (trackingId) => api.get(`/orders/track/${trackingId}`), // Public order tracking
  getAllOrders: (params = {}) => api.get("/orders", { params }),
  updateOrderStatus: (id, statusData) =>
    api.put(`/orders/${id}/status`, statusData),
  updatePaymentStatus: (id, paymentData) =>
    api.put(`/orders/${id}/payment`, paymentData), // Update payment status
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  getUserOrders: () => api.get("/orders/user/orders"), // Get current user's orders
};

export default api;
