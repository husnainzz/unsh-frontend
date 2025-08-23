import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchProducts,
} from "../store/slices/productSlice";
import { addToCart as addToCartAction } from "../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import ProductCard from "../components/ProductCard";
import "../styles/ProductDetailPage.css";

const ProductDetailPage = () => {
  const { prodId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Get new arrivals for Complete the Look section
  const newArrivals = useSelector((state) => {
    const allProducts = state.products.products || [];
    const currentProductId = product?.prodId || product?._id;

    return allProducts
      .filter((p) => {
        // Filter out the current product and ensure product has required fields
        const productId = p.prodId || p._id;
        return productId && productId !== currentProductId && p.name && p.price;
      })
      .sort((a, b) => {
        // Sort by creation date (newest first), fallback to name if no date
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        if (dateA.getTime() === dateB.getTime()) {
          return a.name.localeCompare(b.name);
        }
        return dateB - dateA;
      })
      .slice(0, 4); // Take only 4 products
  });

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState("");

  // Check if product is in wishlist
  const isFavorite =
    product &&
    wishlistItems.some(
      (item) =>
        (item.prodId || item.product?.prodId) ===
        (product.prodId || product._id)
    );

  useEffect(() => {
    if (prodId) {
      dispatch(fetchProductDetails(prodId));
    }
  }, [dispatch, prodId]);

  // Fetch products list for New Arrivals section
  useEffect(() => {
    dispatch(fetchProducts({ limit: 20 })); // Fetch more products to have variety for New Arrivals
  }, [dispatch]);

  // Set default size and color when product loads
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product]);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(0);
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    if (availableColors.length > 1 && !selectedColor) {
      alert("Please select a color");
      return;
    }

    const cartItem = {
      product: {
        ...product,
        prodId: product.prodId || product._id,
      },
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      price: product.price,
    };

    dispatch(addToCartAction(cartItem));

    // Show success message
    setShowSuccessMessage("Added to cart successfully!");
    setTimeout(() => setShowSuccessMessage(""), 3000);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleFavoriteToggle = () => {
    const productId = product.prodId || product._id;

    if (isFavorite) {
      // Remove from wishlist
      dispatch(removeFromWishlist({ productId }));
      setShowSuccessMessage("Removed from wishlist!");
    } else {
      // Add to wishlist
      dispatch(
        addToWishlist({
          product: {
            ...product,
            prodId: productId,
          },
        })
      );
      setShowSuccessMessage("Added to wishlist successfully!");
    }

    setTimeout(() => setShowSuccessMessage(""), 3000);
  };

  const getProductImage = (index = 0) => {
    if (!product || !product.images || product.images.length === 0) {
      return "/placeholder-image.jpg";
    }

    // Ensure index is within bounds
    if (index >= product.images.length) {
      index = 0; // Fallback to first image if index is out of bounds
    }

    // Return image at specific index
    const image = product.images[index];
    return image?.url || image || product.images[0]?.url || product.images[0];
  };

  const formatPrice = (price) => {
    return `PKR ${price?.toLocaleString() || "0"}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <i key={i} className="fa-solid fa-star text-yellow-400"></i>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <i key={i} className="fa-solid fa-star-half-alt text-yellow-400"></i>
        );
      } else {
        stars.push(
          <i key={i} className="fa-regular fa-star text-gray-300"></i>
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <h2>Product not found</h2>
        <button onClick={() => navigate("/shop")}>Back to Shop</button>
      </div>
    );
  }

  // Use actual product sizes or provide fallback
  const availableSizes =
    product.sizes && product.sizes.length > 0 ? product.sizes : ["One Size"];

  // Use actual product colors or provide fallback
  const availableColors =
    product.colors && product.colors.length > 0 ? product.colors : ["Black"];

  // Color mapping for better visual representation
  const getColorValue = (colorName) => {
    const colorMap = {
      black: "#000000",
      white: "#ffffff",
      red: "#dc2626",
      blue: "#2563eb",
      green: "#16a34a",
      yellow: "#eab308",
      pink: "#ec4899",
      purple: "#9333ea",
      orange: "#ea580c",
      brown: "#92400e",
      gray: "#6b7280",
      navy: "#1e3a8a",
      maroon: "#991b1b",
      olive: "#65a30d",
      teal: "#0d9488",
      coral: "#f97316",
      gold: "#f59e0b",
      silver: "#9ca3af",
    };

    const normalizedColor = colorName.toLowerCase();
    return colorMap[normalizedColor] || normalizedColor;
  };

  return (
    <main id="main" className="product-detail-main">
      <div className="product-detail-container">
        <div className="product-detail-grid">
          {/* Product Images Section */}
          <section id="product-images" className="product-images-section">
            <div className="main-product-image-container">
              <div className="main-product-image">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[selectedImage]?.url ||
                        product.images[selectedImage] ||
                        product.images[0]?.url ||
                        product.images[0]
                      : "/placeholder-image.jpg"
                  }
                  alt={product.name}
                  className="product-main-img"
                />
                <button className="zoom-button">
                  <i className="fa-solid fa-expand zoom-icon"></i>
                </button>
              </div>
            </div>

            <div className="thumbnail-images">
              {product.images && product.images.length > 0 ? (
                product.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail-item ${
                      selectedImage === index ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedImage(index);
                    }}
                  >
                    <img
                      src={image.url || image}
                      alt={`${product.name} view ${index + 1}`}
                      className="thumbnail-img"
                    />
                  </div>
                ))
              ) : (
                // Show placeholder if no images
                <div className="thumbnail-item">
                  <img
                    src="/placeholder-image.jpg"
                    alt="No product image"
                    className="thumbnail-img"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Product Info Section */}
          <section id="product-info" className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-price">{formatPrice(product.price)}</p>
            </div>

            <div className="product-options">
              <div className="option-group">
                <label className="option-label">Size</label>
                <div className="option-values">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`option-value ${
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
                <div className="option-values">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      className={`option-value color-option ${
                        selectedColor === color ? "selected" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        backgroundColor: getColorValue(color),
                        border:
                          selectedColor === color
                            ? "3px solid #111827"
                            : "1px solid #d1d5db",
                      }}
                    >
                      <span className="color-name">{color}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label className="option-label">Quantity</label>
                <div className="quantity-selector">
                  <span className="quantity-label">Qty:</span>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 1;
                        if (newQuantity >= 1 && newQuantity <= 10) {
                          setQuantity(newQuantity);
                        }
                      }}
                      min="1"
                      max="10"
                    />
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="product-actions">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <i className="fa-solid fa-shopping-cart"></i>
                <span>Add to Cart - {formatPrice(product.price)}</span>
              </button>
              <button
                className={`wishlist-btn ${
                  isFavorite ? "favorite-active" : ""
                }`}
                onClick={handleFavoriteToggle}
              >
                <i
                  className={`fa-${isFavorite ? "solid" : "regular"} fa-heart`}
                ></i>
                <span>
                  {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
                </span>
              </button>
            </div>

            {/* Success Message */}
            {showSuccessMessage && (
              <div className="success-message">
                <i className="fa-solid fa-check-circle"></i>
                <span>{showSuccessMessage}</span>
              </div>
            )}

            {/* Guest User Info */}
            {!userInfo && (
              <div className="guest-info">
                <i className="fa-solid fa-info-circle"></i>
                <span>
                  You can add items to cart and wishlist as a guest. Sign in to
                  sync with your account.
                </span>
              </div>
            )}

            <div className="product-description">
              <p className="description-text">
                {product.description ||
                  "Elegant design featuring premium materials and craftsmanship. Perfect for special occasions or elevated everyday wear."}
              </p>
            </div>

            <div className="product-details-info">
              <p>
                <strong>Fabric:</strong> Premium quality materials
              </p>
              <p>
                <strong>Care:</strong> Follow care instructions on label
              </p>
              <p>
                <strong>Origin:</strong> Ethically made
              </p>
            </div>
          </section>
        </div>

        {/* Product Details Tabs Section */}
        <section id="product-details" className="product-details-tabs">
          <div className="tabs-header">
            <button
              className={`tab-button ${
                activeTab === "details" ? "active" : ""
              }`}
              onClick={() => setActiveTab("details")}
            >
              Details & Care
            </button>
            <button
              className={`tab-button ${
                activeTab === "delivery" ? "active" : ""
              }`}
              onClick={() => setActiveTab("delivery")}
            >
              Delivery & Returns
            </button>
            <button
              className={`tab-button ${
                activeTab === "size-guide" ? "active" : ""
              }`}
              onClick={() => setActiveTab("size-guide")}
            >
              Size Guide
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === "details" && (
              <div className="tab-content active">
                <h3>Product Details</h3>
                <p>
                  Premium quality materials with expert craftsmanship. This
                  piece features a flattering fit and design that offers
                  versatile styling options.
                </p>
                <p>
                  Made to be comfortable and durable, perfect for various
                  occasions. The attention to detail ensures a premium
                  experience.
                </p>

                <h3>Care Instructions</h3>
                <p>
                  Follow care label instructions carefully. Use appropriate
                  temperature settings and avoid harsh chemicals.
                </p>
                <p>
                  Store properly when not in use and consider professional
                  cleaning for best results. Handle with care to maintain
                  quality.
                </p>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="tab-content active">
                <h3>Delivery Information</h3>
                <p>
                  Standard delivery takes 3-5 business days. Express delivery
                  available for 1-2 business days.
                </p>
                <p>
                  Free shipping on orders over PKR 2000. International shipping
                  available to select countries.
                </p>

                <h3>Returns & Exchanges</h3>
                <p>
                  30-day return policy for unworn items with original tags.
                  Exchanges available for different sizes or colors.
                </p>
                <p>
                  Return shipping is free for defective items. Contact customer
                  service for assistance.
                </p>
              </div>
            )}

            {activeTab === "size-guide" && (
              <div className="tab-content active">
                <h3>Size Guide</h3>
                <p>
                  Use our size guide to find your perfect fit. Measure your
                  bust, waist, and hips for accurate sizing.
                </p>

                <div className="product-specs">
                  <div className="spec-item">
                    <span className="spec-label">Size</span>
                    <span className="spec-value">XS</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Bust</span>
                    <span className="spec-value">32-34"</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Waist</span>
                    <span className="spec-value">26-28"</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Hips</span>
                    <span className="spec-value">36-38"</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Products Section */}
        <section id="related-products" className="related-products">
          <h2>New Arrivals</h2>
          <div className="related-products-grid">
            {newArrivals.length > 0 ? (
              newArrivals.map((newProduct) => (
                <ProductCard
                  key={newProduct._id || newProduct.prodId}
                  product={newProduct}
                />
              ))
            ) : (
              <div className="no-products-message">
                <p>No additional products available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetailPage;
