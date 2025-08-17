import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus } from "../store/slices/orderSlice";
import {
  fetchAllProducts,
  deleteProduct,
  toggleProductStatus,
} from "../store/slices/productSlice";
import {
  getProfile,
  logout,
  updateProfile,
  getAllUsers,
} from "../store/slices/authSlice";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, isAuthenticated, users, usersLoading, usersError } =
    useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.products);
  const {
    orders: allOrders,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [customerFilterRole, setCustomerFilterRole] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (userInfo?.role !== "admin") {
      navigate("/");
      return;
    }

    dispatch(getProfile());
    dispatch(fetchAllOrders());
    dispatch(fetchAllProducts());
  }, [dispatch, isAuthenticated, userInfo?.role, navigate]);

  useEffect(() => {
    if (activeTab === "customers") {
      dispatch(getAllUsers());
    }
  }, [dispatch, activeTab]);

  useEffect(() => {
    if (userInfo) {
      setProfileData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        contact: userInfo.contact || "",
        address: userInfo.address || "",
      });
    }
  }, [userInfo]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (profileData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!profileData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!profileData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    }

    if (!profileData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (validateProfile()) {
      try {
        await dispatch(updateProfile(profileData)).unwrap();
        setIsEditingProfile(false);
        setProfileErrors({});
      } catch (err) {
        console.error("Profile update failed:", err);
      }
    }
  };

  const getStatusColor = (status) => {
    if (!status || typeof status !== "string") return "#6c757d";
    switch (status.toLowerCase()) {
      case "pending":
        return "#ffc107";
      case "processing":
        return "#17a2b8";
      case "shipped":
        return "#007bff";
      case "delivered":
        return "#28a745";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "$0.00";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    } catch (error) {
      return "$0.00";
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Customer management functions
  const getFilteredCustomers = () => {
    if (!users) return [];

    let filtered = users.filter((user) => user.role !== "admin"); // Exclude admins

    if (customerFilterRole !== "all") {
      filtered = filtered.filter((user) => user.role === customerFilterRole);
    }

    if (customerSearchTerm) {
      const searchLower = customerSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.contact?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const getCustomerStats = () => {
    if (!users) return { total: 0, active: 0, inactive: 0 };

    const customers = users.filter((user) => user.role !== "admin");
    const total = customers.length;
    const active = customers.filter((user) => user.isActive !== false).length;
    const inactive = customers.filter((user) => user.isActive === false).length;

    return { total, active, inactive };
  };

  const getOrderStats = () => {
    if (!allOrders || !Array.isArray(allOrders)) {
      return {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      };
    }
    const total = allOrders.length;
    const pending = allOrders.filter(
      (order) => order.status === "pending"
    ).length;
    const processing = allOrders.filter(
      (order) => order.status === "processing"
    ).length;
    const shipped = allOrders.filter(
      (order) => order.status === "shipped"
    ).length;
    const delivered = allOrders.filter(
      (order) => order.status === "delivered"
    ).length;
    const cancelled = allOrders.filter(
      (order) => order.status === "cancelled"
    ).length;

    return { total, pending, processing, shipped, delivered, cancelled };
  };

  const getProductStats = () => {
    if (!products || !Array.isArray(products)) {
      return {
        total: 0,
        inStock: 0,
        outOfStock: 0,
        lowStock: 0,
        active: 0,
        inactive: 0,
      };
    }
    const total = products.length;
    const inStock = products.filter((product) => product.stock > 0).length;
    const outOfStock = products.filter((product) => product.stock === 0).length;
    const lowStock = products.filter(
      (product) => product.stock > 0 && product.stock <= 10
    ).length;
    const active = products.filter((product) => product.isActive).length;
    const inactive = products.filter((product) => !product.isActive).length;

    return { total, inStock, outOfStock, lowStock, active, inactive };
  };

  const getRevenueStats = () => {
    if (!allOrders || !Array.isArray(allOrders)) {
      return { totalRevenue: 0, monthlyRevenue: 0 };
    }
    const totalRevenue = allOrders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const monthlyRevenue = allOrders
      .filter((order) => {
        try {
          const orderDate = new Date(order.createdAt);
          const currentDate = new Date();
          return (
            orderDate.getMonth() === currentDate.getMonth() &&
            orderDate.getFullYear() === currentDate.getFullYear() &&
            order.status !== "cancelled"
          );
        } catch (error) {
          return false;
        }
      })
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return { totalRevenue, monthlyRevenue };
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ id: orderId, statusData: { status: newStatus } })
      ).unwrap();
      dispatch(fetchAllOrders());
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        // Refresh products after deletion
        dispatch(fetchAllProducts());
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleToggleProductStatus = async (productId) => {
    try {
      await dispatch(toggleProductStatus(productId)).unwrap();
      // Refresh products after status change
      dispatch(fetchAllProducts());
    } catch (error) {
      console.error("Failed to toggle product status:", error);
      alert("Failed to toggle product status. Please try again.");
    }
  };

  if (!isAuthenticated || userInfo?.role !== "admin") {
    return null;
  }

  const orderStats = getOrderStats();
  const productStats = getProductStats();
  const revenueStats = getRevenueStats();
  const recentOrders = allOrders ? allOrders.slice(0, 3) : [];

  return (
    <div className="operations-app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">U</div>
            <h1>UNCH Fashion Operations</h1>
          </div>
          <div className="header-right">
            <div className="notification-icon">
              <i className="fa-solid fa-bell"></i>
              <span className="notification-badge"></span>
            </div>
            <img
              src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${
                userInfo?.name || "admin"
              }`}
              alt="User"
              className="user-avatar"
            />
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <i className="fa-solid fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <span
              className={`nav-item ${
                activeTab === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <i className="fa-solid fa-chart-line"></i>
              <span>Dashboard</span>
            </span>
            <span
              className={`nav-item ${
                activeTab === "customers" ? "active" : ""
              }`}
              onClick={() => setActiveTab("customers")}
            >
              <i className="fa-solid fa-users"></i>
              <span>Customers</span>
            </span>
            <span
              className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <i className="fa-solid fa-shopping-cart"></i>
              <span>Orders</span>
            </span>
            <span
              className={`nav-item ${
                activeTab === "inventory" ? "active" : ""
              }`}
              onClick={() => setActiveTab("inventory")}
            >
              <i className="fa-solid fa-boxes"></i>
              <span>Inventory</span>
            </span>
            <span
              className={`nav-item ${activeTab === "workers" ? "active" : ""}`}
              onClick={() => setActiveTab("workers")}
            >
              <i className="fa-solid fa-hard-hat"></i>
              <span>Workers</span>
            </span>
            <span
              className={`nav-item ${
                activeTab === "production" ? "active" : ""
              }`}
              onClick={() => setActiveTab("production")}
            >
              <i className="fa-solid fa-cogs"></i>
              <span>Production</span>
            </span>
            <span
              className={`nav-item ${
                activeTab === "logistics" ? "active" : ""
              }`}
              onClick={() => setActiveTab("logistics")}
            >
              <i className="fa-solid fa-truck"></i>
              <span>Logistics</span>
            </span>
            <span
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fa-solid fa-user-cog"></i>
              <span>Profile</span>
            </span>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <>
              {/* Notifications Bar */}
              <div className="notifications">
                {productStats.lowStock > 0 && (
                  <div className="notification">
                    <i className="fa-solid fa-exclamation-triangle notification-icon"></i>
                    <span className="notification-text">
                      Low stock alert: {productStats.lowStock} products below 10
                      units
                    </span>
                    <button className="notification-close">
                      <i className="fa-solid fa-times"></i>
                    </button>
                  </div>
                )}
                {orderStats.pending > 0 && (
                  <div className="notification">
                    <i className="fa-solid fa-clock notification-icon"></i>
                    <span className="notification-text">
                      {orderStats.pending} pending orders require attention
                    </span>
                    <button className="notification-close">
                      <i className="fa-solid fa-times"></i>
                    </button>
                  </div>
                )}
              </div>

              {/* Dashboard Metrics */}
              <div className="dashboard-metrics">
                <div className="metric-card">
                  <div className="metric-content">
                    <div>
                      <p className="metric-label">Orders in Progress</p>
                      <p className="metric-value">{orderStats.processing}</p>
                    </div>
                    <i className="fa-solid fa-shopping-cart metric-icon"></i>
                  </div>
                  <div className="metric-subtitle">
                    <span>{orderStats.total} total orders</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-content">
                    <div>
                      <p className="metric-label">Active Products</p>
                      <p className="metric-value">{productStats.active}</p>
                    </div>
                    <i className="fa-solid fa-hard-hat metric-icon"></i>
                  </div>
                  <div className="metric-subtitle">
                    <span>{productStats.lowStock} low stock alerts</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-content">
                    <div>
                      <p className="metric-label">Inactive Products</p>
                      <p className="metric-value">{productStats.inactive}</p>
                    </div>
                    <i className="fa-solid fa-eye-slash metric-icon"></i>
                    <span>Hidden from customers</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-content">
                    <div>
                      <p className="metric-label">Total Products</p>
                      <p className="metric-value">{productStats.total}</p>
                    </div>
                    <i className="fa-solid fa-boxes metric-icon"></i>
                    <span>{productStats.outOfStock} out of stock</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-content">
                    <div>
                      <p className="metric-label">Total Revenue</p>
                      <p className="metric-value">
                        {formatCurrency(revenueStats.totalRevenue).replace(
                          "$",
                          ""
                        )}
                      </p>
                    </div>
                    <i className="fa-solid fa-truck metric-icon"></i>
                  </div>
                  <div className="metric-subtitle">
                    <span>
                      {formatCurrency(revenueStats.monthlyRevenue)} this month
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="content-grid">
                {/* Recent Orders */}
                <div className="content-card">
                  <div className="card-header">
                    <h3>Recent Orders</h3>
                  </div>
                  <div className="card-body">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order, index) => (
                        <div key={order._id} className="order-item">
                          <div className="order-info">
                            <div className="order-number">#{index + 1}</div>
                            <div className="order-details">
                              <h4>Order #{order._id.slice(-8)}</h4>
                              <p>Customer: {order.user?.name || "N/A"}</p>
                            </div>
                          </div>
                          <span className="order-status">{order.status}</span>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <p>No recent orders</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="content-card">
                  <div className="card-header">
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="card-body">
                    <div
                      className="action-item"
                      onClick={() => navigate("/admin/products/new")}
                    >
                      <div className="action-content">
                        <i className="fa-solid fa-plus action-icon"></i>
                        <div className="action-details">
                          <h4>Add New Product</h4>
                          <p>Create a new product listing</p>
                        </div>
                      </div>
                      <i className="fa-solid fa-arrow-right action-arrow"></i>
                    </div>

                    <div
                      className="action-item"
                      onClick={() => setActiveTab("orders")}
                    >
                      <div className="action-content">
                        <i className="fa-solid fa-shopping-cart action-icon"></i>
                        <div className="action-details">
                          <h4>Manage Orders</h4>
                          <p>View and update order status</p>
                        </div>
                      </div>
                      <i className="fa-solid fa-arrow-right action-arrow"></i>
                    </div>

                    <div
                      className="action-item"
                      onClick={() => setActiveTab("inventory")}
                    >
                      <div className="action-content">
                        <i className="fa-solid fa-boxes action-icon"></i>
                        <div className="action-details">
                          <h4>Inventory Management</h4>
                          <p>Update stock levels</p>
                        </div>
                      </div>
                      <i className="fa-solid fa-arrow-right action-arrow"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Production Pipeline */}
              <div className="content-card production-pipeline">
                <div className="card-header">
                  <h3>Order Status Overview</h3>
                </div>
                <div className="card-body">
                  <div className="pipeline-grid">
                    <div className="pipeline-stage">
                      <div className="pipeline-icon">
                        <i className="fa-solid fa-clock"></i>
                      </div>
                      <p className="pipeline-label">Pending</p>
                      <p className="pipeline-count">{orderStats.pending}</p>
                    </div>
                    <div className="pipeline-stage">
                      <div className="pipeline-icon">
                        <i className="fa-solid fa-cogs"></i>
                      </div>
                      <p className="pipeline-label">Processing</p>
                      <p className="pipeline-count">{orderStats.processing}</p>
                    </div>
                    <div className="pipeline-stage">
                      <div className="pipeline-icon">
                        <i className="fa-solid fa-shipping-fast"></i>
                      </div>
                      <p className="pipeline-label">Shipped</p>
                      <p className="pipeline-count">{orderStats.shipped}</p>
                    </div>
                    <div className="pipeline-stage">
                      <div className="pipeline-icon">
                        <i className="fa-solid fa-check-circle"></i>
                      </div>
                      <p className="pipeline-label">Delivered</p>
                      <p className="pipeline-count">{orderStats.delivered}</p>
                    </div>
                    <div className="pipeline-stage">
                      <div className="pipeline-icon">
                        <i className="fa-solid fa-times-circle"></i>
                      </div>
                      <p className="pipeline-label">Cancelled</p>
                      <p className="pipeline-count">{orderStats.cancelled}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="content-card">
              <div className="card-header">
                <h3>All Orders</h3>
              </div>
              <div className="card-body">
                {ordersLoading && (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading orders...</p>
                  </div>
                )}

                {ordersError && (
                  <div className="error-alert">
                    <p>Error loading orders: {ordersError}</p>
                    <button
                      className="btn btn-outline"
                      onClick={() => dispatch(fetchAllOrders())}
                    >
                      Retry
                    </button>
                  </div>
                )}

                {!ordersLoading && !ordersError && (
                  <div className="table-container">
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!allOrders || allOrders.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="no-data">
                              <p>No orders found</p>
                            </td>
                          </tr>
                        ) : (
                          allOrders.map((order) => (
                            <tr key={order._id}>
                              <td>{order._id.slice(-8)}</td>
                              <td>{order.user?.name || "N/A"}</td>
                              <td>{formatDate(order.createdAt)}</td>
                              <td>{formatCurrency(order.totalAmount)}</td>
                              <td>
                                <span
                                  className="status-badge"
                                  style={{
                                    backgroundColor:
                                      getStatusColor(order.status) + "20",
                                    color: getStatusColor(order.status),
                                  }}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() => setSelectedOrder(order)}
                                  >
                                    View
                                  </button>
                                  <select
                                    className="status-select"
                                    value={order.status}
                                    onChange={(e) =>
                                      handleUpdateOrderStatus(
                                        order._id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="processing">
                                      Processing
                                    </option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <div className="content-card">
              <div className="card-header">
                <h3>Inventory Management</h3>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/admin/products/new")}
                >
                  <i className="fa-solid fa-plus"></i>
                  Add New Product
                </button>
              </div>
              <div className="card-body">
                <div className="inventory-grid">
                  {products &&
                    products.map((product) => (
                      <div key={product._id} className="inventory-item">
                        <div className="inventory-item-content">
                          <div className="inventory-image">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="product-image"
                              />
                            ) : (
                              <i className="fa-solid fa-image"></i>
                            )}
                          </div>
                          <div className="inventory-details">
                            <h4>{product.name}</h4>
                            <p className="product-brand">{product.brand}</p>
                            <p className="product-price">
                              {formatCurrency(product.price)}
                            </p>
                            <div className="product-status">
                              <span
                                className={`status-badge ${
                                  product.isActive ? "active" : "inactive"
                                }`}
                              >
                                {product.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <p
                              className={`stock-status ${
                                product.stock === 0
                                  ? "out-of-stock"
                                  : product.stock <= 10
                                  ? "low-stock"
                                  : "in-stock"
                              }`}
                            >
                              Stock: {product.stock}
                              {product.stock === 0
                                ? " (Out of Stock)"
                                : product.stock <= 10
                                ? " (Low Stock)"
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div className="inventory-actions">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() =>
                              navigate(`/admin/products/${product._id}/edit`)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() =>
                              handleToggleProductStatus(product._id)
                            }
                          >
                            {product.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="content-card">
              <div className="card-header">
                <h3>Profile Management</h3>
                {!isEditingProfile && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <i className="fa-solid fa-edit"></i>
                    Edit Profile
                  </button>
                )}
              </div>
              <div className="card-body">
                {isEditingProfile ? (
                  <form onSubmit={handleProfileSubmit} className="profile-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          className={`form-input ${
                            profileErrors.name ? "error" : ""
                          }`}
                          placeholder="Enter your full name"
                        />
                        {profileErrors.name && (
                          <div className="form-error">{profileErrors.name}</div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className={`form-input ${
                            profileErrors.email ? "error" : ""
                          }`}
                          placeholder="Enter your email"
                        />
                        {profileErrors.email && (
                          <div className="form-error">
                            {profileErrors.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact" className="form-label">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        id="contact"
                        name="contact"
                        value={profileData.contact}
                        onChange={handleProfileChange}
                        className={`form-input ${
                          profileErrors.contact ? "error" : ""
                        }`}
                        placeholder="Enter your contact number"
                      />
                      {profileErrors.contact && (
                        <div className="form-error">
                          {profileErrors.contact}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        className={`form-input ${
                          profileErrors.address ? "error" : ""
                        }`}
                        placeholder="Enter your address"
                        rows="3"
                      />
                      {profileErrors.address && (
                        <div className="form-error">
                          {profileErrors.address}
                        </div>
                      )}
                    </div>

                    <div className="profile-actions">
                      <button type="submit" className="btn btn-primary">
                        <i className="fa-solid fa-save"></i>
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileErrors({});
                          // Reset to original data
                          if (userInfo) {
                            setProfileData({
                              name: userInfo.name || "",
                              email: userInfo.email || "",
                              contact: userInfo.contact || "",
                              address: userInfo.address || "",
                            });
                          }
                        }}
                      >
                        <i className="fa-solid fa-times"></i>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-info">
                    <div className="profile-avatar">
                      <img
                        src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${
                          userInfo?.name || "admin"
                        }`}
                        alt="Profile"
                        className="profile-image"
                      />
                    </div>
                    <div className="profile-details">
                      <div className="profile-field">
                        <label>Full Name:</label>
                        <span>{userInfo?.name || "N/A"}</span>
                      </div>
                      <div className="profile-field">
                        <label>Email:</label>
                        <span>{userInfo?.email || "N/A"}</span>
                      </div>
                      <div className="profile-field">
                        <label>Contact:</label>
                        <span>{userInfo?.contact || "N/A"}</span>
                      </div>
                      <div className="profile-field">
                        <label>Address:</label>
                        <span>{userInfo?.address || "N/A"}</span>
                      </div>
                      <div className="profile-field">
                        <label>Role:</label>
                        <span className="role-badge admin">Administrator</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other tabs */}
          {activeTab === "customers" && (
            <div className="content-card">
              <div className="card-header">
                <h3>Customers</h3>
                <div className="header-actions">
                  <div className="search-filter-container">
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={customerSearchTerm}
                      onChange={(e) => setCustomerSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    <select
                      value={customerFilterRole}
                      onChange={(e) => setCustomerFilterRole(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Roles</option>
                      <option value="user">Users</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="card-body">
                {usersLoading ? (
                  <div className="loading-state">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <p>Loading customers...</p>
                  </div>
                ) : usersError ? (
                  <div className="error-state">
                    <i className="fa-solid fa-exclamation-triangle"></i>
                    <p>Error loading customers: {usersError}</p>
                  </div>
                ) : (
                  <>
                    {/* Customer Stats */}
                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-icon">
                          <i className="fa-solid fa-users"></i>
                        </div>
                        <div className="stat-content">
                          <h4>Total Customers</h4>
                          <p>{getCustomerStats().total}</p>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon">
                          <i className="fa-solid fa-user-check"></i>
                        </div>
                        <div className="stat-content">
                          <h4>Active Customers</h4>
                          <p>{getCustomerStats().active}</p>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon">
                          <i className="fa-solid fa-user-times"></i>
                        </div>
                        <div className="stat-content">
                          <h4>Inactive Customers</h4>
                          <p>{getCustomerStats().inactive}</p>
                        </div>
                      </div>
                    </div>

                    {/* Customer List */}
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredCustomers().map((customer) => (
                            <tr key={customer._id}>
                              <td>
                                <div className="customer-info">
                                  <div className="customer-avatar">
                                    {customer.name?.charAt(0)?.toUpperCase() ||
                                      "U"}
                                  </div>
                                  <span>{customer.name || "N/A"}</span>
                                </div>
                              </td>
                              <td>{customer.email}</td>
                              <td>{customer.contact || "N/A"}</td>
                              <td>
                                <span className={`role-badge ${customer.role}`}>
                                  {customer.role}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`status-badge ${
                                    customer.isActive === false
                                      ? "inactive"
                                      : "active"
                                  }`}
                                >
                                  {customer.isActive === false
                                    ? "Inactive"
                                    : "Active"}
                                </span>
                              </td>
                              <td>{formatDateTime(customer.createdAt)}</td>
                              <td>
                                <div className="action-buttons">
                                  <button
                                    className="btn btn-sm btn-outline"
                                    // onClick={() =>
                                    //   setSelectedCustomer(customer)
                                    // }
                                    title="View Details"
                                  >
                                    <i className="fa-solid fa-eye"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {getFilteredCustomers().length === 0 && (
                        <div className="empty-state">
                          <i className="fa-solid fa-users empty-icon"></i>
                          <h3>No customers found</h3>
                          <p>
                            {customerSearchTerm || customerFilterRole !== "all"
                              ? "Try adjusting your search or filters"
                              : "No customers have registered yet"}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "workers" && (
            <div className="content-card">
              <div className="card-header">
                <h3>Workers</h3>
              </div>
              <div className="card-body">
                <div className="empty-state">
                  <i className="fa-solid fa-hard-hat empty-icon"></i>
                  <h3>Worker Management</h3>
                  <p>Worker management features coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "production" && (
            <div className="content-card">
              <div className="card-header">
                <h3>Production</h3>
              </div>
              <div className="card-body">
                <div className="empty-state">
                  <i className="fa-solid fa-cogs empty-icon"></i>
                  <h3>Production Management</h3>
                  <p>Production management features coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "logistics" && (
            <div className="content-card">
              <div className="card-header">
                <h3>Logistics</h3>
              </div>
              <div className="card-body">
                <div className="empty-state">
                  <i className="fa-solid fa-truck empty-icon"></i>
                  <h3>Logistics Management</h3>
                  <p>Logistics management features coming soon...</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details</h3>
              <button
                className="modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="order-detail-info">
                <p>
                  <strong>Order ID:</strong> {selectedOrder._id}
                </p>
                <p>
                  <strong>Customer:</strong> {selectedOrder.user?.name || "N/A"}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                </p>
                <p>
                  <strong>Total:</strong>{" "}
                  {formatCurrency(selectedOrder.totalAmount)}
                </p>
                <p>
                  <strong>Status:</strong> {selectedOrder.status}
                </p>
              </div>

              <div className="order-items">
                <h4>Order Items</h4>
                {selectedOrder.orderItems &&
                  selectedOrder.orderItems.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-info">
                        <strong>{item.product?.name}</strong>
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <div className="item-price">
                        {formatCurrency(item.price)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedCustomer(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Customer Details</h3>
              <button
                className="modal-close"
                onClick={() => setSelectedCustomer(null)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="customer-detail-info">
                <div className="customer-header">
                  <div className="customer-avatar-large">
                    {selectedCustomer.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="customer-basic-info">
                    <h4>{selectedCustomer.name || "N/A"}</h4>
                    <p className="customer-email">{selectedCustomer.email}</p>
                    <span
                      className={`status-badge ${
                        selectedCustomer.isActive === false
                          ? "inactive"
                          : "active"
                      }`}
                    >
                      {selectedCustomer.isActive === false
                        ? "Inactive"
                        : "Active"}
                    </span>
                  </div>
                </div>

                <div className="customer-details-grid">
                  <div className="detail-item">
                    <strong>Contact:</strong>
                    <span>{selectedCustomer.contact || "Not provided"}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Address:</strong>
                    <span>{selectedCustomer.address || "Not provided"}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Role:</strong>
                    <span className={`role-badge ${selectedCustomer.role}`}>
                      {selectedCustomer.role}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Joined:</strong>
                    <span>{formatDateTime(selectedCustomer.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Last Updated:</strong>
                    <span>{formatDateTime(selectedCustomer.updatedAt)}</span>
                  </div>
                </div>

                {selectedCustomer.orders &&
                  selectedCustomer.orders.length > 0 && (
                    <div className="customer-orders">
                      <h4>Order History</h4>
                      <div className="orders-list">
                        {selectedCustomer.orders.slice(0, 5).map((order) => (
                          <div key={order._id} className="order-summary">
                            <div className="order-info">
                              <strong>Order #{order._id.slice(-8)}</strong>
                              <span>{formatDate(order.createdAt)}</span>
                              <span className={`status-badge ${order.status}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="order-amount">
                              {formatCurrency(order.totalAmount)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
