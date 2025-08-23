import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { trackOrder } from "../store/slices/orderTrackingSlice";
import "../styles/OrderTrackingPage.css";

const OrderTrackingPage = () => {
  const dispatch = useDispatch();
  const { trackedOrder, loading: trackingLoading, error } = useSelector(
    (state) => state.orderTracking
  );
  const [trackingId, setTrackingId] = useState("");

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      dispatch(trackOrder(trackingId.trim()));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price || 0).toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "status-delivered";
      case "shipped":
        return "status-shipped";
      case "processing":
        return "status-processing";
      case "confirmed":
        return "status-confirmed";
      default:
        return "status-pending";
    }
  };

  const getTimelineStatus = (orderStatus, step) => {
    const statusOrder = [
      "confirmed",
      "packed",
      "shipped",
      "out_for_delivery",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(orderStatus?.toLowerCase());
    const stepIndex = statusOrder.indexOf(step);

    if (stepIndex <= currentIndex) {
      return "timeline-step-completed";
    } else {
      return "timeline-step-pending";
    }
  };

  const getTimelineIcon = (orderStatus, step) => {
    const statusOrder = [
      "confirmed",
      "packed",
      "shipped",
      "out_for_delivery",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(orderStatus?.toLowerCase());
    const stepIndex = statusOrder.indexOf(step);

    if (stepIndex <= currentIndex) {
      return "fa-check";
    } else {
      switch (step) {
        case "packed":
          return "fa-box";
        case "shipped":
          return "fa-truck";
        case "out_for_delivery":
          return "fa-truck";
        case "delivered":
          return "fa-home";
        default:
          return "fa-clock";
      }
    }
  };

  if (trackingLoading) {
    return (
      <div className="order-tracking-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Tracking your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="main" className="order-tracking-main">
      <main id="orders-content" className="orders-content">
        <div className="orders-container">
          {/* Tracking Form */}
          <div className="tracking-form-container">
            <div className="tracking-form">
              <h2>Track Your Order</h2>
              <p>Enter your tracking ID to check the status of your order</p>

              <form onSubmit={handleTrackOrder} className="tracking-input-form">
                <div className="input-group">
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter tracking ID (e.g., UNSH-2024-001)"
                    className="tracking-input"
                    required
                  />
                  <button type="submit" className="track-btn">
                    Track Order
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-container">
              <h2>Error</h2>
              <p>{error}</p>
            </div>
          )}

          {/* Tracked Order Display */}
          {trackedOrder && (
            <div className="order-card">
              <div className="order-card-content">
                <div className="order-header">
                  <div className="order-header-left">
                    <h3>
                      Order #
                      {trackedOrder.trackingId ||
                        `UNSH-${new Date(
                          trackedOrder.createdAt
                        ).getFullYear()}-001`}
                    </h3>
                    <span
                      className={`status-badge ${getStatusColor(
                        trackedOrder.status
                      )}`}
                    >
                      {trackedOrder.status}
                    </span>
                  </div>
                  <div className="order-header-right">
                    <p className="order-date">
                      {formatDate(trackedOrder.createdAt)}
                    </p>
                    <p className="order-total">
                      {formatPrice(trackedOrder.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="order-items-section">
                  <div className="order-items-header">
                    <h4>Order Items</h4>
                  </div>

                  <div className="order-items-list">
                    {trackedOrder.items &&
                      trackedOrder.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="order-item">
                          <div className="item-image">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="product-image"
                              />
                            ) : (
                              <span className="image-placeholder">Product</span>
                            )}
                          </div>
                          <div className="item-details">
                            <h5>{item.name || `Item ${itemIndex + 1}`}</h5>
                            <p>
                              Size: {item.size || "N/A"} • Qty:{" "}
                              {item.quantity || 1}
                            </p>
                          </div>
                          <p className="item-price">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="delivery-timeline">
                  <h4>Delivery Timeline</h4>
                  <div className="timeline-container">
                    <div className="timeline-step">
                      <div
                        className={`timeline-icon ${getTimelineStatus(
                          trackedOrder.status,
                          "confirmed"
                        )}`}
                      >
                        <i
                          className={`fa-solid ${getTimelineIcon(
                            trackedOrder.status,
                            "confirmed"
                          )}`}
                        ></i>
                      </div>
                      <p className="timeline-label">Confirmed</p>
                      <p className="timeline-date">
                        {formatDate(trackedOrder.createdAt)}
                      </p>
                    </div>
                    <div className="timeline-connector completed"></div>
                    <div className="timeline-step">
                      <div
                        className={`timeline-icon ${getTimelineStatus(
                          trackedOrder.status,
                          "packed"
                        )}`}
                      >
                        <i
                          className={`fa-solid ${getTimelineIcon(
                            trackedOrder.status,
                            "packed"
                          )}`}
                        ></i>
                      </div>
                      <p className="timeline-label">Packed</p>
                      <p className="timeline-date">
                        {["processing", "confirmed"].includes(
                          trackedOrder.status
                        )
                          ? "Pending"
                          : formatDate(trackedOrder.createdAt)}
                      </p>
                    </div>
                    <div
                      className={`timeline-connector ${
                        ["processing", "confirmed"].includes(
                          trackedOrder.status
                        )
                          ? "pending"
                          : "completed"
                      }`}
                    ></div>
                    <div className="timeline-step">
                      <div
                        className={`timeline-icon ${getTimelineStatus(
                          trackedOrder.status,
                          "shipped"
                        )}`}
                      >
                        <i
                          className={`fa-solid ${getTimelineIcon(
                            trackedOrder.status,
                            "shipped"
                          )}`}
                        ></i>
                      </div>
                      <p className="timeline-label">Shipped</p>
                      <p className="timeline-date">
                        {["processing", "confirmed", "packed"].includes(
                          trackedOrder.status
                        )
                          ? "Pending"
                          : formatDate(trackedOrder.createdAt)}
                      </p>
                    </div>
                    <div
                      className={`timeline-connector ${
                        ["processing", "confirmed", "packed"].includes(
                          trackedOrder.status
                        )
                          ? "pending"
                          : "completed"
                      }`}
                    ></div>
                    <div className="timeline-step">
                      <div
                        className={`timeline-icon ${getTimelineStatus(
                          trackedOrder.status,
                          "out_for_delivery"
                        )}`}
                      >
                        <i
                          className={`fa-solid ${getTimelineIcon(
                            trackedOrder.status,
                            "out_for_delivery"
                          )}`}
                        ></i>
                      </div>
                      <p className="timeline-label">Out for Delivery</p>
                      <p className="timeline-date">
                        {[
                          "processing",
                          "confirmed",
                          "packed",
                          "shipped",
                        ].includes(trackedOrder.status)
                          ? "Pending"
                          : formatDate(trackedOrder.createdAt)}
                      </p>
                    </div>
                    <div
                      className={`timeline-connector ${
                        [
                          "processing",
                          "confirmed",
                          "packed",
                          "shipped",
                        ].includes(trackedOrder.status)
                          ? "pending"
                          : "completed"
                      }`}
                    ></div>
                    <div className="timeline-step">
                      <div
                        className={`timeline-icon ${getTimelineStatus(
                          trackedOrder.status,
                          "delivered"
                        )}`}
                      >
                        <i
                          className={`fa-solid ${getTimelineIcon(
                            trackedOrder.status,
                            "delivered"
                          )}`}
                        ></i>
                      </div>
                      <p className="timeline-label">Delivered</p>
                      <p className="timeline-date">
                        {trackedOrder.status !== "delivered"
                          ? "Pending"
                          : formatDate(trackedOrder.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="order-actions">
                  {trackedOrder.status === "delivered" && (
                    <button className="btn-primary">View Invoice</button>
                  )}
                  {trackedOrder.status === "shipped" && (
                    <button className="btn-primary">Track Package</button>
                  )}
                  <button className="btn-secondary">Contact Support</button>
                </div>
              </div>
            </div>
          )}

          {/* No Order Tracked Yet */}
          {!trackedOrder && !error && (
            <div className="no-orders">
              <div className="no-orders-icon">📦</div>
              <h2>Track Your Order</h2>
              <p>
                Enter your tracking ID above to see the status and details of
                your order.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderTrackingPage;
