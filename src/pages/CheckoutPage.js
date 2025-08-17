import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart, selectCartTotal } from "../store/slices/cartSlice";
import { createOrder } from "../store/slices/orderSlice";
import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);
  const cartTotal = useSelector(selectCartTotal);
  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.orders);

  const [shippingInfo, setShippingInfo] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      navigate("/cart");
      return;
    }

    // Pre-fill shipping info with user's address if available
    if (userInfo?.address) {
      setShippingInfo(userInfo.address);
    }
  }, [isAuthenticated, items.length, userInfo, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!shippingInfo.street.trim()) {
      errors.street = "Street address is required";
    }
    if (!shippingInfo.city.trim()) {
      errors.city = "City is required";
    }
    if (!shippingInfo.state.trim()) {
      errors.state = "State is required";
    }
    if (!shippingInfo.zipCode.trim()) {
      errors.zipCode = "ZIP code is required";
    }
    if (!shippingInfo.country.trim()) {
      errors.country = "Country is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.product?._id,
          name: item.product?.name || "Unknown Product",
          price: item.price || 0,
          size: item.size || "Default",
          color: item.color || "Default",
          quantity: item.quantity || 1,
        })),
        shippingAddress: shippingInfo,
        paymentMethod: paymentMethod,
        totalAmount: cartTotal || 0,
      };

      console.log("Order data being sent:", orderData);
      console.log("Cart items:", items);

      await dispatch(createOrder(orderData)).unwrap();

      // Clear cart after successful order
      dispatch(clearCart());

      // Redirect to order confirmation
      navigate("/order-success");
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your purchase</p>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="form-section">
                <h3>Shipping Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="street">Street Address *</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={shippingInfo.street}
                      onChange={handleInputChange}
                      className={formErrors.street ? "error" : ""}
                      placeholder="Enter your street address"
                    />
                    {formErrors.street && (
                      <span className="error-message">{formErrors.street}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className={formErrors.city ? "error" : ""}
                      placeholder="Enter your city"
                    />
                    {formErrors.city && (
                      <span className="error-message">{formErrors.city}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State/Province *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className={formErrors.state ? "error" : ""}
                      placeholder="Enter your state"
                    />
                    {formErrors.state && (
                      <span className="error-message">{formErrors.state}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP/Postal Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      className={formErrors.zipCode ? "error" : ""}
                      placeholder="Enter your ZIP code"
                    />
                    {formErrors.zipCode && (
                      <span className="error-message">
                        {formErrors.zipCode}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleInputChange}
                      className={formErrors.country ? "error" : ""}
                      placeholder="Enter your country"
                    />
                    {formErrors.country && (
                      <span className="error-message">
                        {formErrors.country}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="payment-label">
                      <span className="payment-icon">💳</span>
                      Credit Card
                    </span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="payment-label">
                      <span className="payment-icon">📱</span>
                      PayPal
                    </span>
                  </label>

                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === "cash_on_delivery"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="payment-label">
                      <span className="payment-icon">💵</span>
                      Cash on Delivery
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : `Place Order - $${(cartTotal || 0).toFixed(2)}`}
                </button>

                {error && (
                  <div className="error-alert">
                    <p>Error: {error}</p>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
              <span className="item-count">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="summary-items">
              {items && items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={`${item.product?._id || "unknown"}-${
                      item.size || "default"
                    }-${item.color || "default"}`}
                    className="summary-item"
                  >
                    <div className="item-image">
                      <img
                        src={
                          item.product?.images?.[0] ||
                          "/placeholder-product.jpg"
                        }
                        alt={item.product?.name || "Product"}
                        onError={(e) => {
                          e.target.src = "/placeholder-product.jpg";
                        }}
                      />
                    </div>

                    <div className="item-details">
                      <h4>{item.product?.name || "Unknown Product"}</h4>
                      <div className="item-variants">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && " | "}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <div className="item-price">
                        ${(item.price || 0).toFixed(2)}
                      </div>
                    </div>

                    <div className="item-quantity">
                      <span>Qty: {item.quantity}</span>
                      <span className="item-total">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-items">
                  <p>No items in cart</p>
                </div>
              )}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${(cartTotal || 0).toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="total-row total">
                <span>Total:</span>
                <span>${(cartTotal || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-actions">
              <button
                className="btn btn-outline btn-full"
                onClick={() => navigate("/cart")}
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
