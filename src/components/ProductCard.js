import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showOptions, setShowOptions] = useState(false);

  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setShowOptions(true);
      return;
    }

    // Extract color value for cart storage
    const colorValue =
      typeof selectedColor === "object" ? selectedColor.name : selectedColor;

    dispatch(
      addToCart({
        product,
        size: selectedSize,
        color: colorValue,
        quantity,
      })
    );

    // Reset form
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
    setShowOptions(false);
  };

  const handleQuickAdd = () => {
    if (
      product.sizes &&
      product.sizes.length > 0 &&
      product.colors &&
      product.colors.length > 0
    ) {
      setShowOptions(true);
    } else {
      // If no size/color options, add directly
      dispatch(
        addToCart({
          product,
          size: "One Size",
          color: "Default",
          quantity: 1,
        })
      );
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <Link to={`/product/${product._id}`}>
          <img
            src={
              product.images?.[0] ||
              "https://via.placeholder.com/300x400?text=Product"
            }
            alt={product.name}
          />
        </Link>

        <div className="product-actions">
          <button className="action-btn quick-add" onClick={handleQuickAdd}>
            Quick Add
          </button>
          <Link
            to={`/product/${product._id}`}
            className="action-btn view-details"
          >
            View Details
          </Link>
        </div>
      </div>

      <div className="product-info">
        <Link to={`/product/${product._id}`} className="product-name">
          {product.name}
        </Link>
        <p className="product-brand">{product.brand}</p>
        <div className="product-price">${product.price}</div>

        {product.rating && (
          <div className="product-rating">
            <span className="stars">
              {"★".repeat(
                Math.floor(
                  typeof product.rating === "object"
                    ? product.rating.average || 0
                    : product.rating
                )
              )}
              {"☆".repeat(
                5 -
                  Math.floor(
                    typeof product.rating === "object"
                      ? product.rating.average || 0
                      : product.rating
                  )
              )}
            </span>
            <span className="rating-text">
              (
              {typeof product.rating === "object"
                ? product.rating.average || 0
                : product.rating}
              )
            </span>
          </div>
        )}
      </div>

      {/* Quick Add Options Modal */}
      {showOptions && (
        <div className="quick-add-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Quick Add to Cart</h3>
              <button
                className="close-btn"
                onClick={() => setShowOptions(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {product.sizes && product.sizes.length > 0 && (
                <div className="option-group">
                  <label>Size:</label>
                  <div className="option-buttons">
                    {product.sizes &&
                      product.sizes.map((size) => (
                        <button
                          key={size}
                          className={`option-btn ${
                            selectedSize === size ? "selected" : ""
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="option-group">
                  <label>Color:</label>
                  <div className="option-buttons">
                    {product.colors &&
                      product.colors.map((color) => (
                        <button
                          key={typeof color === "object" ? color._id : color}
                          className={`option-btn ${
                            (typeof selectedColor === "object"
                              ? selectedColor._id
                              : selectedColor) ===
                            (typeof color === "object" ? color._id : color)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => setSelectedColor(color)}
                          style={{
                            backgroundColor:
                              typeof color === "object" ? color.hexCode : color,
                          }}
                          title={typeof color === "object" ? color.name : color}
                        >
                          {typeof color === "object" ? color.name : color}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div className="option-group">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowOptions(false)}
              >
                Cancel
              </button>
              <button
                className="btn"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
