import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart, updateQuantity } from "../store/slices/cartSlice";
import "../styles/CartPage.css";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);

  // Ensure cartItems is always an array
  const safeCartItems = cartItems || [];

  // Debug: Log cart state
  console.log("CartPage - Cart items:", safeCartItems);
  console.log("CartPage - Cart items count:", safeCartItems.length);

  // Monitor cart changes
  useEffect(() => {
    console.log("CartPage - Cart items changed:", safeCartItems);
    safeCartItems.forEach((item, index) => {
      console.log(`CartPage - Item ${index} after change:`, {
        productId: item.product.prodId || item.product._id,
        prodId: item.product.prodId,
        _id: item.product._id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      });
    });
  }, [safeCartItems]);

  // Debug: Log each item's structure
  safeCartItems.forEach((item, index) => {
    console.log(`CartPage - Item ${index}:`, {
      productId: item.product.prodId || item.product._id,
      prodId: item.product.prodId,
      _id: item.product._id,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    });
  });

  const handleQuantityChange = (productId, change) => {
    console.log("CartPage - handleQuantityChange called:", {
      productId,
      change,
    });

    // Helper function to get consistent product ID - prioritize prodId
    const getProductId = (item) => {
      // Always use prodId if available, fallback to _id
      return item.product.prodId || item.product._id;
    };

    const item = safeCartItems.find((item) => getProductId(item) === productId);

    if (item) {
      const newQuantity = item.quantity + change;
      console.log("CartPage - Updating quantity:", {
        current: item.quantity,
        new: newQuantity,
        size: item.size,
        color: item.color,
        productId: getProductId(item),
      });

      if (newQuantity >= 1 && newQuantity <= 10) {
        dispatch(
          updateQuantity({
            productId: getProductId(item), // Use the consistent ID
            size: item.size,
            color: item.color,
            quantity: newQuantity,
          })
        );
      }
    } else {
      console.error("CartPage - Item not found for productId:", productId);
      console.log(
        "CartPage - Available items:",
        safeCartItems.map((item) => ({
          productId: getProductId(item),
          prodId: item.product.prodId,
          _id: item.product._id,
        }))
      );
    }
  };

  const handleRemoveItem = (productId) => {
    console.log("CartPage - handleRemoveItem called:", { productId });

    // Helper function to get consistent product ID - prioritize prodId
    const getProductId = (item) => {
      // Always use prodId if available, fallback to _id
      return item.product.prodId || item.product._id;
    };

    const item = safeCartItems.find((item) => getProductId(item) === productId);

    if (item) {
      console.log("CartPage - Removing item:", {
        productId: getProductId(item),
        size: item.size,
        color: item.color,
      });

      dispatch(
        removeFromCart({
          productId: getProductId(item), // Use the consistent ID
          size: item.size,
          color: item.color,
        })
      );
    } else {
      console.error("CartPage - Item not found for productId:", productId);
    }
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

  if (safeCartItems.length === 0) {
    return (
      <main id="main" className="cart-page-main">
        <div className="cart-page-container">
          <div className="empty-cart">
            <h1 className="empty-cart-title">Your Shopping Bag is Empty</h1>
            <p className="empty-cart-text">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/shop" className="continue-shopping-btn">
              <i className="fa-solid fa-arrow-left"></i>
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="cart-page-main">
      <div className="cart-page-container">
        <h1 className="cart-page-title">Your Shopping Bag</h1>

        <div className="cart-page-grid">
          <div className="cart-items-section">
            <div className="cart-items-container">
              <div className="cart-items-list">
                {safeCartItems.map((item) => (
                  <div
                    key={item.product.prodId || item.product._id}
                    className="cart-item"
                  >
                    <div className="cart-item-content">
                      <div className="cart-item-image">
                        <img
                          src={getProductImage(item.product)}
                          alt={item.product.name}
                          className="item-img"
                        />
                      </div>
                      <div className="cart-item-details">
                        <h3 className="item-name">{item.product.name}</h3>
                        <p className="item-size">Size: {item.size}</p>
                        <p className="item-color">
                          Color: {item.product.colors?.[0] || "Default"}
                        </p>
                        <div className="item-actions">
                          <button
                            className="action-btn remove-btn"
                            onClick={() =>
                              handleRemoveItem(
                                item.product.prodId || item.product._id
                              )
                            }
                          >
                            <i className="fa-regular fa-trash-can"></i>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleQuantityChange(
                              item.product.prodId || item.product._id,
                              -1
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <i className="fa-solid fa-minus"></i>
                        </button>
                        <span className="quantity-display">
                          {item.quantity}
                        </span>
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleQuantityChange(
                              item.product.prodId || item.product._id,
                              1
                            )
                          }
                          disabled={item.quantity >= 10}
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                      <p className="item-price">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Order Summary */}
            <div className="mobile-order-summary">
              <h2 className="order-summary-title">Order Summary</h2>
              <div className="order-summary-content">
                <div className="summary-row">
                  <span className="summary-label">
                    Subtotal ({safeCartItems.length} items)
                  </span>
                  <span className="summary-value">
                    {formatPrice(calculateSubtotal())}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Estimated Shipping</span>
                  <span className="summary-value">
                    {formatPrice(calculateShipping())}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Tax</span>
                  <span className="summary-value">
                    {formatPrice(calculateTax())}
                  </span>
                </div>
                <div className="summary-total">
                  <div className="summary-row">
                    <span className="summary-label">Total</span>
                    <span className="summary-value">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="discount-section">
                <label className="discount-label">Discount Code</label>
                <div className="discount-input-group">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="discount-input"
                  />
                  <button className="discount-apply-btn">Apply</button>
                </div>
              </div>
            </div>

            <div className="cart-actions">
              <Link to="/shop" className="continue-shopping-btn">
                <i className="fa-solid fa-arrow-left"></i>
                Continue Shopping
              </Link>
              <Link to="/checkout" className="checkout-btn">
                Proceed to Checkout
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Desktop Order Summary */}
          <div className="desktop-order-summary">
            <div className="order-summary-card">
              <h2 className="order-summary-title">Order Summary</h2>
              <div className="order-summary-content">
                <div className="summary-row">
                  <span className="summary-label">
                    Subtotal ({safeCartItems.length} items)
                  </span>
                  <span className="summary-value">
                    {formatPrice(calculateSubtotal())}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Estimated Shipping</span>
                  <span className="summary-value">
                    {formatPrice(calculateShipping())}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Tax</span>
                  <span className="summary-value">
                    {formatPrice(calculateTax())}
                  </span>
                </div>
                <div className="summary-total">
                  <div className="summary-row">
                    <span className="summary-label">Total</span>
                    <span className="summary-value">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="discount-section">
                <label className="discount-label">Discount Code</label>
                <div className="discount-input-group">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="discount-input"
                  />
                  <button className="discount-apply-btn">Apply</button>
                </div>
              </div>

              <div className="checkout-actions">
                <Link to="/checkout" className="checkout-btn">
                  Proceed to Checkout
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
                <Link to="/shop" className="continue-shopping-btn">
                  <i className="fa-solid fa-arrow-left"></i>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
