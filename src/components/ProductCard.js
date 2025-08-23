import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from "../store/slices/wishlistSlice";
import SizeColorModal from "./SizeColorModal";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [showSizeColorModal, setShowSizeColorModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Helper function to get the primary product ID (always prioritize prodId)
  const getPrimaryProductId = () => {
    return product?.prodId || product?._id;
  };

  const isInWishlist = useSelector((state) =>
    selectIsInWishlist(state, getPrimaryProductId())
  );

  // Safety check: ensure product exists
  if (!product) {
    console.error("ProductCard: product prop is undefined");
    return null;
  }

  // Handle favorite toggle (now works for both guests and authenticated users)
  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productId = getPrimaryProductId();

    if (isInWishlist) {
      dispatch(removeFromWishlist({ productId }));
    } else {
      dispatch(addToWishlist({ product }));
    }
  };

  // Handle add to cart click
  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Allow both guests and authenticated users to add to cart
    setShowSizeColorModal(true);
  };

  // Handle add to cart from modal
  const handleAddToCart = ({
    product: modalProduct,
    size,
    color,
    quantity,
  }) => {
    setIsAddingToCart(true);

    // Use the product from modal or fallback to component's product
    const productToAdd = modalProduct || product;

    // Safety check: ensure product exists
    if (!productToAdd || (!productToAdd.prodId && !productToAdd._id)) {
      console.error("Invalid product data:", productToAdd);
      setIsAddingToCart(false);
      return;
    }

    dispatch(
      addToCart({
        product: productToAdd,
        size,
        color,
        quantity,
      })
    );

    // Show success feedback (you can add a toast notification here)
    setIsAddingToCart(false);
  };

  // Handle view details click
  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const productLink = `/product/${getPrimaryProductId()}`;
    navigate(productLink);
  };

  // Get product image - prioritize featured image, then first image, then placeholder
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      const featuredImage = product.images.find((img) => img.featured);
      if (featuredImage) {
        return featuredImage.url || featuredImage;
      }
      return product.images[0].url || product.images[0];
    }
    return "https://via.placeholder.com/300x400?text=Product";
  };

  // Format price with PKR currency
  const formatPrice = (price) => {
    return `PKR ${parseFloat(price).toFixed(2)}`;
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const ratingValue = rating || 0;
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="product-stars">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star star-filled">
            ★
          </span>
        ))}
        {/* Half star */}
        {hasHalfStar && <span className="star star-half">★</span>}
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star">
            ☆
          </span>
        ))}
      </div>
    );
  };

  // Get product ID for display
  const getProductId = () => {
    return getPrimaryProductId() || "N/A";
  };

  return (
    <>
      <div className="product-card">
        <div className="product-image">
          <img
            src={getProductImage()}
            alt={product.name}
            className="product-img"
          />
          {product.isNew && <div className="product-badge">New In</div>}

          {/* Favorite Heart Button - Now works for guests too */}
          <button
            className={`favorite-btn ${isInWishlist ? "favorite-active" : ""}`}
            onClick={handleFavoriteToggle}
            title={isInWishlist ? "Remove from favorites" : "Add to favorites"}
          >
            <i
              className={`fa-${isInWishlist ? "solid" : "regular"} fa-heart`}
            ></i>
          </button>

          {/* Hover Overlay with View Details Button */}
          <div className="product-overlay">
            <button className="view-product-btn" onClick={handleViewDetails}>
              View Details
            </button>
          </div>
        </div>

        <div className="product-details">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">{formatPrice(product.price)}</p>

          {/* Reviews Section */}
          <div className="product-reviews">
            {renderStars(product.rating)}
            <span className="product-rating-text">
              {product.rating ? `(${product.rating})` : "(No reviews)"}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            className="product-button"
            onClick={handleAddToCartClick}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Size and Color Selection Modal */}
      <SizeColorModal
        product={product}
        isOpen={showSizeColorModal}
        onClose={() => setShowSizeColorModal(false)}
        onAddToCart={handleAddToCart}
        isInCart={false}
      />
    </>
  );
};

export default ProductCard;
