import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearWishlist,
  selectWishlistItems,
  selectWishlistItemCount,
  selectIsGuestMode,
} from "../store/slices/wishlistSlice";
import ProductCard from "../components/ProductCard";
import "../styles/WishlistPage.css";

const WishlistPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistCount = useSelector(selectWishlistItemCount);
  const isGuestMode = useSelector(selectIsGuestMode);

  const handleMoveAllToCart = () => {
    if (!userInfo) {
      // Redirect to login if guest tries to add to cart
      navigate("/login", { state: { from: "/wishlist" } });
      return;
    }

    // For now, just clear the wishlist
    // In a full implementation, you might want to add all items to cart
    dispatch(clearWishlist());
  };

  const handleShopNow = () => {
    navigate("/shop");
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { from: "/wishlist" } });
  };

  // Show empty state if no items
  if (wishlistCount === 0) {
    return (
      <div className="wishlist-page">
        <div id="empty-state" className="empty-state">
          <div className="empty-state-container">
            <div className="empty-state-content">
              <div className="empty-state-icon">
                <i className="fa-regular fa-heart"></i>
              </div>
              <h2 className="empty-state-title">Your wishlist is empty</h2>
              <p className="empty-state-description">
                Start saving your favorite looks!
              </p>
              {isGuestMode && (
                <div className="guest-notice">
                  <p>
                    💡 You're browsing as a guest. Your favorites are saved
                    locally.
                  </p>
                  <button className="login-btn" onClick={handleLoginClick}>
                    Log In to Sync
                  </button>
                </div>
              )}
              <button className="shop-now-btn" onClick={handleShopNow}>
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <main id="main" className="wishlist-main">
        <div className="wishlist-container">
          <div className="wishlist-header-info">
            <p className="wishlist-count">{wishlistCount} items saved</p>
            {isGuestMode && (
              <div className="guest-notice">
                <p>
                  💡 You're browsing as a guest.
                  <button className="login-link" onClick={handleLoginClick}>
                    Log in
                  </button>
                  to sync your wishlist with your account!
                </p>
              </div>
            )}
          </div>

          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <ProductCard
                key={item.prodId || item.product?.prodId || item.product?._id}
                product={item.product}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WishlistPage;
