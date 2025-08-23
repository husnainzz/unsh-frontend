import React, { useState } from "react";
import "../styles/SizeColorModal.css";

const SizeColorModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isInCart = false,
}) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});

  // Get product image - prioritize featured image, then first image, then placeholder
  const getProductImage = () => {
    if (product?.images && product.images.length > 0) {
      const featuredImage = product.images.find((img) => img.featured);

      if (featuredImage) {
        return featuredImage.url || featuredImage;
      }
      return product.images[0].url || product.images[0];
    }
    return "https://via.placeholder.com/100x100?text=Product";
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    if (!selectedSize) newErrors.size = "Please select a size";
    if (!selectedColor) newErrors.color = "Please select a color";
    if (quantity < 1) newErrors.quantity = "Quantity must be at least 1";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add to cart
    const payload = {
      product,
      size: selectedSize,
      color: selectedColor,
      quantity,
    };

    onAddToCart(payload);

    // Reset form and close modal
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
    setErrors({});
    onClose();
  };

  // Handle modal close
  const handleClose = () => {
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
    setErrors({});
    onClose();
  };

  // Get available sizes and colors from product
  const availableSizes =
    product?.sizes && product.sizes.length > 0
      ? product.sizes
      : ["XS", "S", "M", "L", "XL", "XXL"];
  const availableColors =
    product?.colors && product.colors.length > 0
      ? product.colors
      : ["Black", "White", "Red", "Blue", "Green"];

  if (!isOpen) return null;

  // Safety check: ensure product exists
  if (!product) {
    console.error("SizeColorModal: product prop is undefined");
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add to Cart</h3>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="product-info">
            <img
              src={getProductImage()}
              alt={product?.name}
              className="product-thumbnail"
            />
            <div className="product-details">
              <h4>{product?.name}</h4>
              <p className="price">PKR {product?.price?.toFixed(2)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="selection-form">
            {/* Size Selection */}
            <div className="form-group">
              <label>Size *</label>
              <div className="size-options">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-option ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {errors.size && (
                <span className="error-message">{errors.size}</span>
              )}
            </div>

            {/* Color Selection */}
            <div className="form-group">
              <label>Color *</label>
              <div className="color-options">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${
                      selectedColor === color ? "selected" : ""
                    }`}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  >
                    {color}
                  </button>
                ))}
              </div>
              {errors.color && (
                <span className="error-message">{errors.color}</span>
              )}
            </div>

            {/* Quantity Selection */}
            <div className="form-group">
              <label>Quantity</label>
              <div className="quantity-selector">
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  type="button"
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              {errors.quantity && (
                <span className="error-message">{errors.quantity}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button type="submit" className="add-to-cart-btn">
                {isInCart ? "Update Cart" : "Add to Cart"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SizeColorModal;
