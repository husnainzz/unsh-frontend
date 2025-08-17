import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartTotal,
} from "../store/slices/cartSlice";
import "../styles/CartPage.css";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);
  const cartTotal = useSelector(selectCartTotal);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleQuantityChange = (productId, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart({ productId, size, color }));
    } else {
      dispatch(
        updateQuantity({
          productId,
          size,
          color,
          quantity: newQuantity,
        })
      );
    }
  };

  const handleRemoveItem = (productId, size, color) => {
    dispatch(removeFromCart({ productId, size, color }));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/shop");
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <button
              onClick={handleContinueShopping}
              className="btn btn-primary"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="cart-count">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={`${item.product?._id || index}-${
                    item.size || "default"
                  }-${item.color || "default"}`}
                  className="cart-item"
                >
                  <div className="item-image">
                    <img
                      src={
                        item.product?.images?.[0] || "/placeholder-product.jpg"
                      }
                      alt={item.product?.name || "Product"}
                      onError={(e) => {
                        e.target.src = "/placeholder-product.jpg";
                      }}
                    />
                  </div>

                  <div className="item-details">
                    <h3 className="item-name">
                      {item.product?.name || "Unknown Product"}
                    </h3>
                    <div className="item-variants">
                      {item.size && (
                        <span className="variant">Size: {item.size}</span>
                      )}
                      {item.color && (
                        <span className="variant">Color: {item.color}</span>
                      )}
                    </div>
                    <div className="item-price">
                      ${(item.price || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className="item-quantity">
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() =>
                          handleQuantityChange(
                            item.product?._id,
                            item.size || "default",
                            item.color || "default",
                            (item.quantity || 1) - 1
                          )
                        }
                      >
                        -
                      </button>
                      <span className="quantity-display">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() =>
                          handleQuantityChange(
                            item.product?._id,
                            item.size || "default",
                            item.color || "default",
                            (item.quantity || 1) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">
                      ${((item.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      handleRemoveItem(
                        item.product?._id,
                        item.size || "default",
                        item.color || "default"
                      )
                    }
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div className="no-items">
                <p>No items in cart</p>
              </div>
            )}
          </div>

          <div className="cart-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${(cartTotal || 0).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total-row">
                <span>Total:</span>
                <span>${(cartTotal || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-actions">
              <button
                className="btn btn-primary btn-full"
                onClick={handleCheckout}
                disabled={!isAuthenticated}
              >
                {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
              </button>

              <button
                className="btn btn-secondary btn-full"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>

              <button
                className="btn btn-outline btn-full"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
            </div>

            {!isAuthenticated && (
              <div className="login-prompt">
                <p>Please log in to complete your purchase</p>
                <button
                  className="btn btn-link"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
