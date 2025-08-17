import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import "../styles/App.css";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (userInfo?.role === "admin") {
    return null;
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">U</div>
          <h1>UNCH Fashion</h1>
        </div>

        <div className="header-right">
          <nav className="nav-links">
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`nav-link ${isActive("/shop") ? "active" : ""}`}
            >
              Shop
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  className={`nav-link ${isActive("/orders") ? "active" : ""}`}
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                >
                  Profile
                </Link>
              </>
            )}
          </nav>

          <div className="user-menu">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="nav-link">
                  Cart ({cartItems?.length || 0})
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-sm"
                >
                  Logout
                </button>
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${
                    userInfo?.name || "user"
                  }`}
                  alt="User"
                  className="user-avatar"
                />
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
