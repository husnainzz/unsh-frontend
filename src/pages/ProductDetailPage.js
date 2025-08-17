import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import "../styles/ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select both size and color");
      return;
    }

    const cartItem = {
      product: product,
      size: selectedSize,
      color: selectedColor,
      quantity: parseInt(quantity),
    };

    dispatch(addToCart(cartItem));
    alert("Product added to cart!");
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!selectedSize || !selectedColor) {
      alert("Please select both size and color");
      return;
    }

    // Add to cart and navigate to checkout
    const cartItem = {
      product: product,
      size: selectedSize,
      color: selectedColor,
      quantity: parseInt(quantity),
    };

    dispatch(addToCart(cartItem));
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <h2>Product not found</h2>
        <p>Sorry, we couldn't find the product you're looking for.</p>
        <button onClick={() => navigate("/shop")} className="btn btn-primary">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <nav className="breadcrumb">
          <span onClick={() => navigate("/shop")} className="breadcrumb-link">
            Shop
          </span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={
                  product.images?.[selectedImage] || "/placeholder-product.jpg"
                }
                alt={product.name}
                onError={(e) => {
                  e.target.src = "/placeholder-product.jpg";
                }}
              />
            </div>
            <div className="thumbnail-images">
              {product.images &&
                product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${
                      selectedImage === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      onError={(e) => {
                        e.target.src = "/placeholder-product.jpg";
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>
            <div className="product-brand">{product.brand}</div>

            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`star ${
                      index <
                      Math.floor(
                        typeof product.rating === "object"
                          ? product.rating.average || 0
                          : product.rating
                      )
                        ? "filled"
                        : ""
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-text">
                {typeof product.rating === "object"
                  ? product.rating.average || 0
                  : product.rating}{" "}
                out of 5
              </span>
            </div>

            <div className="product-price">
              <span className="current-price">${product.price}</span>
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice}</span>
              )}
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            <div className="option-group">
              <label className="option-label">Size</label>
              <div className="size-options">
                {product.sizes &&
                  product.sizes.map((size) => (
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
            </div>

            {/* Color Selection */}
            <div className="option-group">
              <label className="option-label">Color</label>
              <div className="color-options">
                {product.colors &&
                  product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${
                        selectedColor === color ? "selected" : ""
                      }`}
                      onClick={() => setSelectedColor(color.name)}
                      style={{
                        backgroundColor: color.hexCode,
                      }}
                      title={color.name || color}
                    >
                      {selectedColor === color.name && (
                        <span className="checkmark">✓</span>
                      )}
                    </button>
                  ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="option-group">
              <label className="option-label">Quantity</label>
              <div className="quantity-controls">
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
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <div className="stock-info">
                {product.stock > 0 ? (
                  <span className="in-stock">
                    {product.stock} items in stock
                  </span>
                ) : (
                  <span className="out-of-stock">Out of stock</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button
                className="btn btn-primary btn-large"
                onClick={handleAddToCart}
                disabled={
                  !selectedSize || !selectedColor || product.stock === 0
                }
              >
                Add to Cart
              </button>
              <button
                className="btn btn-secondary btn-large"
                onClick={handleBuyNow}
                disabled={
                  !selectedSize || !selectedColor || product.stock === 0
                }
              >
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            <div className="additional-info">
              <div className="info-item">
                <span className="info-label">Category:</span>
                <span className="info-value">{product.category}</span>
              </div>
              <div className="info-item">
                <span className="info-label">SKU:</span>
                <span className="info-value">{product._id.slice(-8)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="product-tabs">
          <div className="tab-content">
            <h3>Product Details</h3>
            <div className="tab-text">
              <p>{product.description}</p>
              {/* Add more detailed product information here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
