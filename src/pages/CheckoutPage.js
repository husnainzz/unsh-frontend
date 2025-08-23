import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  createOrder,
  createGuestOrder,
  clearOrderState,
} from "../store/slices/orderSlice";
import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);

  // Debug: Log the entire state to see what's available
  const entireState = useSelector((state) => state);
  console.log("CheckoutPage - Entire Redux state:", entireState);

  const orderState = useSelector((state) => state.order);
  console.log("CheckoutPage - Order state:", orderState);

  // Safety check: ensure orderState exists before destructuring
  const { loading, error, success, currentOrder } = orderState || {};

  // Ensure cartItems is always an array
  const safeCartItems = cartItems || [];

  // Step state: 1 = Cart, 2 = Payment, 3 = Review, 4 = Place Order
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: userInfo?.firstName || userInfo?.name?.split(" ")[0] || "",
    lastName:
      userInfo?.lastName || userInfo?.name?.split(" ").slice(1).join(" ") || "",
    email: userInfo?.email || "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
    phoneNumber: userInfo?.phoneNumber || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Clear order state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearOrderState());
    };
  }, [dispatch]);

  // Redirect to order confirmation on success
  useEffect(() => {
    if (success && currentOrder) {
      navigate(`/order-confirmation/${currentOrder.trackingId}`);
    }
  }, [success, currentOrder, navigate]);

  // Debug: Log step changes
  useEffect(() => {
    console.log("Current step changed to:", currentStep);
  }, [currentStep]);

  // Debug: Log form data changes
  useEffect(() => {
    console.log("Form data changed:", formData);
  }, [formData]);

  // Debug: Log initial form data
  useEffect(() => {
    console.log("Initial form data:", formData);
    console.log("User info:", userInfo);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePaymentScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, just set a placeholder URL instead of base64
      // Later we'll use Cloudinary to get actual URLs
      setPaymentScreenshot("https://example.com/payment-screenshot.jpg");
      // Clear error when user uploads a file
      if (formErrors.paymentScreenshot) {
        setFormErrors((prev) => ({ ...prev, paymentScreenshot: "" }));
      }
    }
  };

  const validateForm = () => {
    console.log("validateForm called with formData:", formData);
    console.log("paymentMethod:", paymentMethod);
    console.log("paymentScreenshot:", paymentScreenshot);

    const errors = {};

    // Check each field individually and log the result
    console.log(
      "firstName check:",
      formData.firstName,
      "trimmed:",
      formData.firstName?.trim(),
      "empty:",
      !formData.firstName?.trim()
    );
    console.log(
      "lastName check:",
      formData.lastName,
      "trimmed:",
      formData.lastName?.trim(),
      "empty:",
      !formData.lastName?.trim()
    );
    console.log(
      "email check:",
      formData.email,
      "trimmed:",
      formData.email?.trim(),
      "empty:",
      !formData.email?.trim()
    );
    console.log(
      "address check:",
      formData.address,
      "trimmed:",
      formData.address?.trim(),
      "empty:",
      !formData.address?.trim()
    );
    console.log(
      "city check:",
      formData.city,
      "trimmed:",
      formData.city?.trim(),
      "empty:",
      !formData.city?.trim()
    );
    console.log(
      "postalCode check:",
      formData.postalCode,
      "trimmed:",
      formData.postalCode?.trim(),
      "empty:",
      !formData.postalCode?.trim()
    );
    console.log(
      "phoneNumber check:",
      formData.phoneNumber,
      "trimmed:",
      formData.phoneNumber?.trim(),
      "empty:",
      !formData.phoneNumber?.trim()
    );

    if (!formData.firstName?.trim())
      errors.firstName = "First name is required";
    if (!formData.lastName?.trim()) errors.lastName = "Last name is required";
    if (!formData.email?.trim()) errors.email = "Email is required";
    if (!formData.address?.trim()) errors.address = "Address is required";
    if (!formData.city?.trim()) errors.city = "City is required";
    if (!formData.postalCode?.trim())
      errors.postalCode = "Postal code is required";
    if (!formData.phoneNumber?.trim())
      errors.phoneNumber = "Phone number is required";

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Validate payment method requirements
    if (paymentMethod === "bank" && !paymentScreenshot) {
      errors.paymentScreenshot =
        "Payment screenshot is required for bank transfer";
    }

    console.log("Validation errors:", errors);
    console.log("Total errors count:", Object.keys(errors).length);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateSubtotal = () => {
    return safeCartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 2000 ? 0 : 150; // Free shipping over PKR 2000
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.15; // 15% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const featuredImage = product.images.find((img) => img.featured);
      return featuredImage ? featuredImage.url : product.images[0].url;
    }
    return "/placeholder-image.jpg";
  };

  const formatPrice = (price) => {
    return `PKR ${price?.toLocaleString() || "0"}`;
  };

  const handleNextStep = () => {
    console.log("handleNextStep called, current step:", currentStep);
    if (currentStep === 1) {
      // Moving from Cart to Payment
      console.log("Moving from Cart to Payment");
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Moving from Payment to Review
      console.log("Moving from Payment to Review");
      if (validateForm()) {
        setCurrentStep(3);
      } else {
        console.log("Form validation failed, cannot proceed");
      }
    } else if (currentStep === 3) {
      // Moving from Review to Place Order
      console.log("Moving from Review to Place Order");
      setCurrentStep(4);
    }
  };

  const handlePreviousStep = () => {
    console.log("handlePreviousStep called, current step:", currentStep);
    if (currentStep === 2) {
      console.log("Moving from Payment to Cart");
      setCurrentStep(1);
    } else if (currentStep === 3) {
      console.log("Moving from Review to Payment");
      setCurrentStep(2);
    } else if (currentStep === 4) {
      console.log("Moving from Place Order to Review");
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Debug: Log cart items structure
    console.log("Cart items structure:", safeCartItems);
    console.log("First cart item:", safeCartItems[0]);
    console.log("First cart item product:", safeCartItems[0]?.product);

    // Prepare order data
    const orderData = {
      items: safeCartItems.map((item) => {
        // Get the correct product ID - prioritize prodId, fallback to _id
        const productId = item.product.prodId || item.product._id;
        console.log("Processing item:", {
          productName: item.product.name,
          prodId: item.product.prodId,
          _id: item.product._id,
          finalProductId: productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        });

        return {
          prodId: productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        };
      }),
      shippingAddress: {
        street: formData.address,
        city: formData.city,
        state: formData.city, // Using city as state for simplicity
        zipCode: formData.postalCode,
        country: formData.country,
      },
      paymentDetails: {
        method: paymentMethod,
        screenshot: paymentScreenshot,
      },
    };

    console.log("Placing order with data:", orderData);

    try {
      if (isAuthenticated) {
        // Create authenticated user order
        console.log("Creating authenticated user order...");
        const result = await dispatch(createOrder(orderData)).unwrap();
        console.log("Authenticated order result:", result);
      } else {
        // Create guest order
        orderData.guestInfo = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        };
        console.log(
          "Creating guest order with guestInfo:",
          orderData.guestInfo
        );
        const result = await dispatch(createGuestOrder(orderData)).unwrap();
        console.log("Guest order result:", result);
      }
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  const renderProgressIndicator = () => (
    <div id="progress-indicator" className="progress-indicator">
      <div className="progress-steps">
        <div className="progress-step">
          <div
            className={`step-number ${currentStep >= 1 ? "active" : "pending"}`}
          >
            1
          </div>
          <span
            className={`step-label ${currentStep >= 1 ? "active" : "pending"}`}
          >
            CART
          </span>
        </div>
        <div className="step-connector"></div>
        <div className="progress-step">
          <div
            className={`step-number ${currentStep >= 2 ? "active" : "pending"}`}
          >
            2
          </div>
          <span
            className={`step-label ${currentStep >= 2 ? "active" : "pending"}`}
          >
            PAYMENT
          </span>
        </div>
        <div className="step-connector"></div>
        <div className="progress-step">
          <div
            className={`step-number ${currentStep >= 3 ? "active" : "pending"}`}
          >
            3
          </div>
          <span
            className={`step-label ${currentStep >= 3 ? "active" : "pending"}`}
          >
            REVIEW
          </span>
        </div>
        <div className="step-connector"></div>
        <div className="progress-step">
          <div
            className={`step-number ${currentStep >= 4 ? "active" : "pending"}`}
          >
            4
          </div>
          <span
            className={`step-label ${currentStep >= 4 ? "active" : "pending"}`}
          >
            PLACE ORDER
          </span>
        </div>
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div id="order-summary" className="order-summary">
      <h2 className="order-summary-title">ORDER SUMMARY</h2>

      <div className="order-items">
        {safeCartItems.map((item, index) => (
          <div
            key={`${item.product.prodId || item.product._id}-${item.size}-${
              item.color
            }-${index}`}
            className="order-item"
          >
            <div className="item-image">
              <img
                src={
                  item.product.images && item.product.images.length > 0
                    ? item.product.images[0]?.url || item.product.images[0]
                    : "/placeholder-image.jpg"
                }
                alt={item.product.name}
                className="item-img"
              />
            </div>
            <div className="item-details">
              <h3 className="item-name">{item.product.name}</h3>
              <p className="item-meta">
                Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
              </p>
              <div className="item-price-row">
                <span className="item-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <div className="item-actions">
                  <button className="edit-item-btn">EDIT</button>
                  <button className="remove-item-btn">REMOVE</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div id="discount-section" className="discount-section">
        <div className="discount-input-group">
          <input
            type="text"
            placeholder="DISCOUNT CODE"
            className="discount-input"
          />
          <button className="apply-discount-btn">APPLY</button>
        </div>
      </div>

      <div id="order-totals" className="order-totals">
        <div className="total-row">
          <span>Subtotal</span>
          <span>{formatPrice(calculateSubtotal())}</span>
        </div>
        <div className="total-row">
          <span>Shipping</span>
          <span>{formatPrice(calculateShipping())}</span>
        </div>
        <div className="total-row">
          <span>Tax</span>
          <span>{formatPrice(calculateTax())}</span>
        </div>
        <div className="total-row total-final">
          <span>TOTAL</span>
          <span>{formatPrice(calculateTotal())}</span>
        </div>
      </div>
    </div>
  );

  const renderCartStep = () => (
    <div id="checkout-form" className="checkout-form">
      <h2 className="form-title">CART REVIEW</h2>
      <div className="form-content">
        <p className="cart-review-text">
          Review your cart items before proceeding to payment information.
        </p>
        <div className="form-actions">
          <button onClick={handleNextStep} className="next-step-btn">
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div id="checkout-form" className="checkout-form">
      <h2 className="form-title">PAYMENT & SHIPPING INFORMATION</h2>

      <form className="checkout-form-fields">
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">FIRST NAME</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`form-input ${formErrors.firstName ? "error" : ""}`}
            />
            {formErrors.firstName && (
              <p className="error-message">{formErrors.firstName}</p>
            )}
          </div>
          <div className="form-field">
            <label className="form-label">LAST NAME</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`form-input ${formErrors.lastName ? "error" : ""}`}
            />
            {formErrors.lastName && (
              <p className="error-message">{formErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">ADDRESS</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={`form-input ${formErrors.address ? "error" : ""}`}
          />
          {formErrors.address && (
            <p className="error-message">{formErrors.address}</p>
          )}
        </div>

        <div className="form-field">
          <label className="form-label">EMAIL</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`form-input ${formErrors.email ? "error" : ""}`}
          />
          {formErrors.email && (
            <p className="error-message">{formErrors.email}</p>
          )}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">CITY</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`form-input ${formErrors.city ? "error" : ""}`}
            />
            {formErrors.city && (
              <p className="error-message">{formErrors.city}</p>
            )}
          </div>
          <div className="form-field">
            <label className="form-label">POSTAL CODE</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className={`form-input ${formErrors.postalCode ? "error" : ""}`}
            />
            {formErrors.postalCode && (
              <p className="error-message">{formErrors.postalCode}</p>
            )}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">COUNTRY</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="Pakistan">Pakistan</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">PHONE NUMBER</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={`form-input ${formErrors.phoneNumber ? "error" : ""}`}
          />
          {formErrors.phoneNumber && (
            <p className="error-message">{formErrors.phoneNumber}</p>
          )}
        </div>
      </form>

      <div id="payment-methods" className="payment-methods">
        <h3 className="payment-methods-title">PAYMENT METHOD</h3>

        <div className="payment-options">
          <label className="payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-radio"
            />
            <div className="payment-option-content">
              <i className="fa-solid fa-credit-card"></i>
              <span>CREDIT/DEBIT CARD</span>
            </div>
          </label>

          <label className="payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-radio"
            />
            <div className="payment-option-content">
              <i className="fa-solid fa-money-bill"></i>
              <span>CASH ON DELIVERY</span>
            </div>
          </label>

          <label className="payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={paymentMethod === "bank"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-radio"
            />
            <div className="payment-option-content">
              <i className="fa-solid fa-university"></i>
              <span>BANK TRANSFER</span>
            </div>
          </label>
        </div>

        {/* Payment Screenshot Section for Bank Transfer */}
        {paymentMethod === "bank" && (
          <div className="payment-screenshot-section">
            <label className="form-label">
              Payment Screenshot <span className="required">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePaymentScreenshotChange}
              className="file-input"
            />
            {paymentScreenshot && (
              <div className="screenshot-preview">
                <div className="screenshot-placeholder">
                  <i className="fa-solid fa-image"></i>
                  <p>Screenshot uploaded successfully ✓</p>
                  <small>File: {paymentScreenshot.split("/").pop()}</small>
                </div>
              </div>
            )}
            {formErrors.paymentScreenshot && (
              <p className="error-message">{formErrors.paymentScreenshot}</p>
            )}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={handlePreviousStep}
          className="previous-step-btn"
        >
          Back to Cart
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          className="next-step-btn"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div id="checkout-form" className="checkout-form">
      <h2 className="form-title">ORDER REVIEW</h2>
      <div className="form-content">
        <div className="preview-section">
          <h3 className="preview-section-title">Shipping Information</h3>
          <div className="preview-info">
            <p>
              <strong>Name:</strong> {formData.firstName} {formData.lastName}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Phone:</strong> {formData.phoneNumber}
            </p>
            <p>
              <strong>Address:</strong> {formData.address}
            </p>
            <p>
              <strong>City:</strong> {formData.city}
            </p>
            <p>
              <strong>Postal Code:</strong> {formData.postalCode}
            </p>
            <p>
              <strong>Country:</strong> {formData.country}
            </p>
          </div>
        </div>

        <div className="preview-section">
          <h3 className="preview-section-title">Payment Method</h3>
          <div className="preview-info">
            <p>
              <strong>Method:</strong> {paymentMethod.toUpperCase()}
            </p>
            {paymentMethod === "bank" && paymentScreenshot && (
              <p>
                <strong>Screenshot:</strong> Uploaded ✓
              </p>
            )}
          </div>
        </div>

        <div className="preview-section">
          <h3 className="preview-section-title">Order Summary</h3>
          <div className="preview-info">
            <p>
              <strong>Items:</strong> {safeCartItems.length}
            </p>
            <p>
              <strong>Subtotal:</strong> {formatPrice(calculateSubtotal())}
            </p>
            <p>
              <strong>Shipping:</strong> {formatPrice(calculateShipping())}
            </p>
            <p>
              <strong>Tax:</strong> {formatPrice(calculateTax())}
            </p>
            <p>
              <strong>Total:</strong> {formatPrice(calculateTotal())}
            </p>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handlePreviousStep}
            className="previous-step-btn"
          >
            Back to Payment
          </button>
          <button onClick={handleNextStep} className="next-step-btn">
            Continue to Place Order
          </button>
        </div>
      </div>
    </div>
  );

  const renderPlaceOrderStep = () => (
    <div id="checkout-form" className="checkout-form">
      <h2 className="form-title">PLACE ORDER</h2>
      <div className="form-content">
        <div className="final-review">
          <h3>Final Review</h3>
          <p>
            Please review your order details one more time before placing your
            order.
          </p>

          <div className="order-summary-final">
            <h4>Order Summary</h4>
            <p>
              <strong>Total Amount:</strong> {formatPrice(calculateTotal())}
            </p>
            <p>
              <strong>Payment Method:</strong> {paymentMethod.toUpperCase()}
            </p>
            <p>
              <strong>Items:</strong> {safeCartItems.length}
            </p>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handlePreviousStep}
            className="previous-step-btn"
          >
            Back to Review
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="place-order-btn"
          >
            {loading ? "PLACING ORDER..." : "PLACE ORDER"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderCartStep();
      case 2:
        return renderPaymentStep();
      case 3:
        return renderReviewStep();
      case 4:
        return renderPlaceOrderStep();
      default:
        return renderCartStep();
    }
  };

  if (safeCartItems.length === 0) {
    return (
      <main id="main" className="checkout-page-main">
        <div className="container">
          <div className="empty-cart">
            <h1>Your Cart is Empty</h1>
            <p>
              Looks like you haven't added any products to your cart yet. Start
              shopping to see some amazing products!
            </p>
            <Link to="/shop" className="shop-now-btn">
              <i className="fa-solid fa-arrow-left"></i>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="checkout-page-main">
      <div className="checkout-container">
        {renderProgressIndicator()}

        <div className="checkout-grid">
          {renderOrderSummary()}
          {renderCurrentStep()}
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
