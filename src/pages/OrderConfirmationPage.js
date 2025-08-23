import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { trackOrder, clearOrderState } from "../store/slices/orderSlice";
import "../styles/OrderConfirmationPage.css";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const { trackingId } = useParams();
  const { currentOrder, trackedOrder, loading, error } = useSelector(
    (state) => state.order
  );

  // Local state to store the order data we want to display
  const [orderData, setOrderData] = useState(null);

  // Clear order state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearOrderState());
    };
  }, [dispatch]);

  // Fetch order data when component mounts or trackingId changes
  useEffect(() => {
    console.log("OrderConfirmationPage - useEffect triggered");
    console.log("trackingId:", trackingId);
    console.log("currentOrder:", currentOrder);

    if (trackingId) {
      // First check if we already have the order in currentOrder (from checkout)
      if (currentOrder && currentOrder.trackingId === trackingId) {
        console.log("Using existing currentOrder");
        setOrderData(currentOrder);
      } else {
        console.log("Fetching order using trackOrder action");
        // If not in currentOrder, fetch it using trackOrder
        dispatch(trackOrder(trackingId));
      }
    }
  }, [trackingId, currentOrder, dispatch]);

  // Update orderData when trackedOrder changes
  useEffect(() => {
    if (trackedOrder) {
      setOrderData(trackedOrder);
    }
  }, [trackedOrder]);

  // Show loading state
  if (loading) {
    return (
      <main id="main" className="order-confirmation-main">
        <div className="order-confirmation-container">
          <div className="loading-state">
            <div className="loading-spinner">
              <i className="fa-solid fa-spinner fa-spin"></i>
            </div>
            <h2>Loading Order Details...</h2>
            <p>Please wait while we fetch your order information.</p>
          </div>
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main id="main" className="order-confirmation-main">
        <div className="order-confirmation-container">
          <div className="order-not-found">
            <h1 className="order-not-found-title">Order Not Found</h1>
            <p className="order-not-found-text">
              {error === "Order not found"
                ? "We couldn't find your order. Please check your order details or contact support."
                : `Error: ${error}`}
            </p>
            <Link to="/shop" className="continue-shopping-btn">
              <i className="fa-solid fa-arrow-left"></i>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Show "not found" if no order data
  if (!orderData) {
    return (
      <main id="main" className="order-confirmation-main">
        <div className="order-confirmation-container">
          <div className="order-not-found">
            <h1 className="order-not-found-title">Order Not Found</h1>
            <p className="order-not-found-text">
              We couldn't find your order. Please check your order details or
              contact support.
            </p>
            <Link to="/shop" className="continue-shopping-btn">
              <i className="fa-solid fa-arrow-left"></i>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const formatPrice = (price) => {
    return `PKR ${price?.toLocaleString() || "0"}`;
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const featuredImage = product.images.find((img) => img.featured);
      return featuredImage ? featuredImage.url : product.images[0].url;
    }
    return "/placeholder-image.jpg";
  };

  return (
    <main id="main" className="order-confirmation-main">
      <div className="order-confirmation-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <i className="fa-solid fa-check-circle"></i>
          </div>
          <h1 className="success-title">Order Placed Successfully!</h1>
          <p className="success-subtitle">
            Thank you for your order. We've received your request and will
            process it shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="order-details-section">
          <h2 className="section-title">Order Details</h2>

          <div className="order-info-grid">
            <div className="order-info-item">
              <span className="info-label">Order ID:</span>
              <span className="info-value">{orderData.trackingId}</span>
            </div>
            <div className="order-info-item">
              <span className="info-label">Order Date:</span>
              <span className="info-value">
                {new Date(orderData.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="order-info-item">
              <span className="info-label">Order Status:</span>
              <span className={`status-badge status-${orderData.status}`}>
                {orderData.status.toUpperCase()}
              </span>
            </div>
            <div className="order-info-item">
              <span className="info-label">Total Amount:</span>
              <span className="info-value total-amount">
                {formatPrice(orderData.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="customer-info-section">
          <h2 className="section-title">Customer Information</h2>

          <div className="customer-info-grid">
            <div className="customer-info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">
                {orderData.guestInfo?.name || orderData.user?.name}
              </span>
            </div>
            <div className="customer-info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{orderData.guestInfo?.email}</span>
            </div>
            <div className="customer-info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value">
                {orderData.guestInfo?.phoneNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="shipping-address-section">
          <h2 className="section-title">Shipping Address</h2>

          <div className="address-details">
            <p className="address-line">{orderData.shippingAddress.street}</p>
            <p className="address-line">
              {orderData.shippingAddress.city},{" "}
              {orderData.shippingAddress.state}{" "}
              {orderData.shippingAddress.zipCode}
            </p>
            <p className="address-line">{orderData.shippingAddress.country}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items-section">
          <h2 className="section-title">Order Items</h2>

          <div className="order-items-list">
            {orderData.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-image">
                  <img
                    src={getProductImage(item)}
                    alt={item.name || "Product"}
                    className="item-img"
                  />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.name || "Product"}</h3>
                  <p className="item-variant">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <p className="item-price">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Information */}
        <div className="payment-info-section">
          <h2 className="section-title">Payment Information</h2>

          <div className="payment-info-grid">
            <div className="payment-info-item">
              <span className="info-label">Payment Method:</span>
              <span className="info-value">
                {orderData.paymentDetails.method.toUpperCase()}
              </span>
            </div>
            <div className="payment-info-item">
              <span className="info-label">Payment Status:</span>
              <span
                className={`status-badge status-${orderData.paymentDetails.status}`}
              >
                {orderData.paymentDetails.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary-section">
          <h2 className="section-title">Order Summary</h2>

          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Subtotal:</span>
              <span className="summary-value">
                {formatPrice(
                  orderData.items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                )}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Shipping:</span>
              <span className="summary-value">
                {formatPrice(
                  orderData.totalAmount -
                    orderData.items.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                )}
              </span>
            </div>
            <div className="summary-item total">
              <span className="summary-label">Total:</span>
              <span className="summary-value">
                {formatPrice(orderData.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps-section">
          <h2 className="section-title">What Happens Next?</h2>

          <div className="steps-list">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Order Confirmation</h3>
                <p className="step-description">
                  Your order has been received and confirmed. You'll receive an
                  email confirmation shortly.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Order Processing</h3>
                <p className="step-description">
                  Our team will process your order and prepare it for shipping
                  within 1-2 business days.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Shipping & Delivery</h3>
                <p className="step-description">
                  Your order will be shipped and delivered to your address
                  within 3-5 business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link to="/shop" className="continue-shopping-btn">
            <i className="fa-solid fa-arrow-left"></i>
            Continue Shopping
          </Link>

          <Link to="/track-order" className="track-order-btn">
            <i className="fa-solid fa-truck"></i>
            Track Order
          </Link>
        </div>

        {/* Important Notes */}
        <div className="important-notes">
          <h3 className="notes-title">Important Notes:</h3>
          <ul className="notes-list">
            <li>
              Keep your order ID ({orderData.trackingId}) safe for tracking and
              support.
            </li>
            <li>You'll receive email updates about your order status.</li>
            <li>
              For any questions, contact our support team with your order ID.
            </li>
            <li>Orders are typically processed within 1-2 business days.</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default OrderConfirmationPage;
