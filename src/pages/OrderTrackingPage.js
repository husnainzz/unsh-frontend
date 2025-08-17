import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../store/slices/orderSlice";
import { getProfile } from "../store/slices/authSlice";
import "../styles/OrderTrackingPage.css";

const OrderTrackingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { myOrders, loading, error } = useSelector((state) => state.orders);

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(getProfile());
    dispatch(fetchMyOrders());
  }, [dispatch, isAuthenticated, navigate]);

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

  const getStatusIcon = (status) => {
    if (!status || typeof status !== "string") return "📋";
    switch (status.toLowerCase()) {
      case "pending":
        return "⏳";
      case "processing":
        return "⚙️";
      case "shipped":
        return "📦";
      case "delivered":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(selectedOrder?._id === order._id ? null : order);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="order-tracking-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-tracking-page">
        <div className="container">
          <div className="error-container">
            <h2>Error loading orders</h2>
            <p>{error}</p>
            <button
              onClick={() => dispatch(fetchMyOrders())}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking-page">
      <div className="container">
        <div className="page-header">
          <h1>Order Tracking</h1>
          <p>Track the status of your orders and view order details</p>
        </div>

        {!myOrders || myOrders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2>No orders yet</h2>
            <p>
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="btn btn-primary"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-container">
            <div className="orders-list">
              <h2>Your Orders ({myOrders ? myOrders.length : 0})</h2>

              {myOrders &&
                myOrders.map((order) => (
                  <div
                    key={order._id}
                    className={`order-card ${
                      selectedOrder?._id === order._id ? "expanded" : ""
                    }`}
                    onClick={() => handleOrderClick(order)}
                  >
                    <div className="order-header">
                      <div className="order-info">
                        <div className="order-id">
                          <span className="label">Order ID:</span>
                          <span className="value">{order._id.slice(-8)}</span>
                        </div>
                        <div className="order-date">
                          <span className="label">Ordered:</span>
                          <span className="value">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <div className="order-total">
                          <span className="label">Total:</span>
                          <span className="value">${order.totalAmount}</span>
                        </div>
                      </div>

                      <div className="order-status">
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(order.status),
                          }}
                        >
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                      </div>
                    </div>

                    {selectedOrder?._id === order._id && (
                      <div className="order-details">
                        <div className="order-items">
                          <h4>Order Items</h4>
                          {order.orderItems &&
                            order.orderItems.map((item, index) => (
                              <div
                                key={`${order._id}-item-${index}`}
                                className="order-item"
                              >
                                <div className="item-info">
                                  <span className="item-name">{item.name}</span>
                                  <span className="item-variants">
                                    {item.size && `Size: ${item.size}`}
                                    {item.size && item.color && " | "}
                                    {item.color && `Color: ${item.color}`}
                                  </span>
                                </div>
                                <div className="item-details">
                                  <span className="item-quantity">
                                    Qty: {item.quantity}
                                  </span>
                                  <span className="item-price">
                                    ${item.price}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>

                        <div className="order-shipping">
                          <h4>Shipping Address</h4>
                          <div className="shipping-address">
                            <p>{order.shippingAddress?.street}</p>
                            <p>
                              {order.shippingAddress?.city},{" "}
                              {order.shippingAddress?.state}{" "}
                              {order.shippingAddress?.zipCode}
                            </p>
                            <p>{order.shippingAddress?.country}</p>
                          </div>
                        </div>

                        <div className="order-payment">
                          <h4>Payment Information</h4>
                          <div className="payment-info">
                            <p>
                              <strong>Status:</strong> {order.paymentStatus}
                            </p>
                            <p>
                              <strong>Method:</strong> {order.paymentMethod}
                            </p>
                          </div>
                        </div>

                        {order.trackingNumber && (
                          <div className="order-tracking">
                            <h4>Tracking Information</h4>
                            <div className="tracking-info">
                              <p>
                                <strong>Tracking Number:</strong>{" "}
                                {order.trackingNumber}
                              </p>
                              {order.trackingUpdates &&
                                order.trackingUpdates.length > 0 && (
                                  <div className="tracking-updates">
                                    <h5>Recent Updates</h5>
                                    {order.trackingUpdates &&
                                      order.trackingUpdates.map(
                                        (update, index) => (
                                          <div
                                            key={index}
                                            className="tracking-update"
                                          >
                                            <span className="update-date">
                                              {formatDate(update.date)}
                                            </span>
                                            <span className="update-status">
                                              {update.status}
                                            </span>
                                            <span className="update-location">
                                              {update.location}
                                            </span>
                                          </div>
                                        )
                                      )}
                                  </div>
                                )}
                            </div>
                          </div>
                        )}

                        <div className="order-actions">
                          <button
                            className="btn btn-outline"
                            onClick={() => window.print()}
                          >
                            Print Order
                          </button>
                          {order.status === "pending" && (
                            <button
                              className="btn btn-secondary"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to cancel this order?"
                                  )
                                ) {
                                  // Handle order cancellation
                                  console.log("Cancel order:", order._id);
                                }
                              }}
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
