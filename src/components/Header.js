import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { PRODUCT_CATEGORIES } from "../store/constants";
import { selectWishlistItemCount } from "../store/slices/wishlistSlice";
import "../styles/Header.css";

const Header = () => {
  const { items: cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const wishlistItemCount = useSelector(selectWishlistItemCount);

  // Calculate total cart items with safety check
  const totalCartItems = cartItems
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  return (
    <header id="header" className="header-component">
      <div className="header-container">
        <div className="header-content">
          <div className="header-left">
            <Link to="/" className="header-logo">
              UNSH
            </Link>
            <nav className="header-nav">
              <Link to="/shop" className="nav-link">
                Shop
              </Link>
              <Link
                to={`/shop?category=${PRODUCT_CATEGORIES.WOMEN}`}
                className="nav-link"
                onClick={() =>
                  console.log(
                    "Header: Navigating to Women category:",
                    PRODUCT_CATEGORIES.WOMEN
                  )
                }
              >
                Women
              </Link>
              <Link
                to={`/shop?category=${PRODUCT_CATEGORIES.BOY}`}
                className="nav-link"
                onClick={() =>
                  console.log(
                    "Header: Navigating to Boy category:",
                    PRODUCT_CATEGORIES.BOY
                  )
                }
              >
                Boy
              </Link>
              <Link
                to={`/shop?category=${PRODUCT_CATEGORIES.GIRL}`}
                className="nav-link"
                onClick={() =>
                  console.log(
                    "Header: Navigating to Girl category:",
                    PRODUCT_CATEGORIES.GIRL
                  )
                }
              >
                Girl
              </Link>
              <Link to="/track-order" className="nav-link">
                Track Order
              </Link>
            </nav>
          </div>
          <div className="header-right">
            <button className="header-action-btn">
              <i className="fa-solid fa-search"></i>
            </button>
            <Link
              to={userInfo ? "/profile" : "/login"}
              className="header-action-btn"
            >
              <i className="fa-regular fa-user"></i>
            </Link>
            <Link to="/wishlist" className="header-action-btn wishlist-btn">
              <i className="fa-regular fa-heart"></i>
              {wishlistItemCount > 0 && (
                <span className="wishlist-badge">{wishlistItemCount}</span>
              )}
            </Link>
            <Link to="/cart" className="header-action-btn cart-btn">
              <i className="fa-solid fa-shopping-bag"></i>
              {totalCartItems > 0 && (
                <span className="cart-badge">{totalCartItems}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
