// API Endpoints
export const API_ENDPOINTS = {
  // Base URL
  BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api",

  // User Routes
  USERS: {
    REGISTER: "/users/register",
    LOGIN: "/users/login",
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    MY_ORDERS: "/users/orders",
    ALL_USERS: "/users/all", // Admin only
    UPDATE_ROLE: (userId) => `/users/${userId}/role`, // Admin only
    TOGGLE_STATUS: (userId) => `/users/${userId}/toggle-status`, // Admin only
  },

  // Product Routes
  PRODUCTS: {
    ALL: "/products",
    ALL_INCLUDING_INACTIVE: "/products/all", // Admin only
    CATEGORIES: "/products/categories",
    BY_PROD_ID: (prodId) => `/products/prod/${prodId}`,
    BY_ID: (prodId) => `/products/${prodId}`,
    CREATE: "/products", // Admin only
    UPDATE: (prodId) => `/products/${prodId}`, // Admin only
    DELETE: (prodId) => `/products/${prodId}`, // Admin only
    TOGGLE_STATUS: (prodId) => `/products/${prodId}/toggle-status`, // Admin only
  },

  // Order Routes
  ORDERS: {
    CREATE: "/orders",
    CREATE_GUEST: "/orders/guest", // Public - no auth required
    TRACK: (trackingId) => `/orders/track/${trackingId}`, // Public - no auth required
    BY_ID: (id) => `/orders/${id}`,
    ALL: "/orders", // Admin only
    USER_ORDERS: "/orders/user/orders",
    UPDATE_STATUS: (id) => `/orders/${id}/status`, // Coordinator/Admin
    UPDATE_PAYMENT: (id) => `/orders/${id}/payment`, // Admin only
    CANCEL: (id) => `/orders/${id}/cancel`,
  },
};

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  COORDINATOR: "coordinator",
  WORKER: "worker",
  CUSTOMER: "customer",
};

// Order Statuses
export const ORDER_STATUSES = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

// Payment Methods
export const PAYMENT_METHODS = {
  BANK: "bank",
  CARD: "card",
  CASH: "cash",
  MOBILE_MONEY: "mobile_money",
};

// Product Categories (frontend categories)
export const PRODUCT_CATEGORIES = {
  WOMEN: "women",
  GIRL: "girl",
  BOY: "boy",
};

// Order Types
export const ORDER_TYPES = {
  GUEST: "guest",
  AUTHENTICATED: "authenticated",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER_INFO: "userInfo",
  CART_ITEMS: "cartItems",
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied. You don't have permission for this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Something went wrong on our end. Please try again later.",
  LOGIN_REQUIRED: "Please log in to continue.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  EMAIL_EXISTS: "An account with this email already exists.",
  WEAK_PASSWORD: "Password must be at least 6 characters long.",
  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_PHONE: "Please enter a valid phone number.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  REGISTRATION_SUCCESS: "Account created successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
  ORDER_CREATED: "Order placed successfully!",
  ORDER_CANCELLED: "Order cancelled successfully!",
  ORDER_STATUS_UPDATED: "Order status updated successfully!",
  PAYMENT_STATUS_UPDATED: "Payment status updated successfully!",
  PRODUCT_CREATED: "Product created successfully!",
  PRODUCT_UPDATED: "Product updated successfully!",
  PRODUCT_DELETED: "Product deleted successfully!",
  PRODUCT_STATUS_TOGGLED: "Product status updated successfully!",
  USER_ROLE_UPDATED: "User role updated successfully!",
  USER_STATUS_TOGGLED: "User status updated successfully!",
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// UI Constants
export const UI = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  MAX_PRODUCT_IMAGES: 5,
  MAX_CART_ITEMS: 50,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
};
