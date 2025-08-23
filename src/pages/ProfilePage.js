import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - replace with actual user data from Redux
  const userData = {
    fullName: userInfo?.fullName || "Sarah Johnson",
    email: userInfo?.email || "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    gender: "Female",
    birthday: "March 15, 1990",
    memberSince: "January 2023",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=456",
  };

  const addresses = [
    {
      id: 1,
      type: "Home",
      address: "123 Fashion Street",
      city: "New York, NY 10001",
    },
    {
      id: 2,
      type: "Work",
      address: "456 Business Ave",
      city: "New York, NY 10002",
    },
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      icon: "fa-brands fa-cc-visa",
      number: "•••• •••• •••• 1234",
      expires: "Expires 12/25",
    },
    {
      id: 2,
      type: "Apple Pay",
      icon: "fa-brands fa-apple-pay",
      number: "Apple Pay",
      expires: "•••• 5678",
    },
  ];

  const wishlistItems = [
    {
      id: 1,
      name: "Elegant Silk Blouse",
      price: "$89.99",
      image: "Silk Blouse",
    },
    {
      id: 2,
      name: "Summer Dress",
      price: "$159.99",
      image: "Designer Dress",
    },
  ];

  const orderHistory = [
    {
      id: "ORD-2025-001",
      date: "Jan 15, 2025",
      status: "Delivered",
    },
    {
      id: "ORD-2025-002",
      date: "Jan 10, 2025",
      status: "Shipped",
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleMoveToCart = (itemId) => {
    // TODO: Implement move to cart functionality
    console.log("Move to cart:", itemId);
  };

  const handleViewAllOrders = () => {
    // TODO: Navigate to orders page
    console.log("View all orders");
  };

  const handleViewAllWishlist = () => {
    // TODO: Navigate to wishlist page
    console.log("View all wishlist");
  };

  const handleChangePassword = () => {
    // TODO: Implement change password functionality
    console.log("Change password");
  };

  const handleTwoFactorAuth = () => {
    // TODO: Implement 2FA functionality
    console.log("Two-factor auth");
  };

  const handleDeleteAccount = () => {
    // TODO: Implement delete account functionality
    console.log("Delete account");
  };

  if (!userInfo) {
    return (
      <div className="profile-page">
        <div className="no-auth-container">
          <i className="fa-solid fa-user-lock"></i>
          <h2>Authentication Required</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <main id="main-content" className="profile-main">
        <div className="profile-container">
          <div id="profile-header" className="profile-header">
            <div className="profile-header-content">
              <div className="profile-info">
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="profile-avatar"
                />
                <div>
                  <h1 className="profile-name">{userData.fullName}</h1>
                  <p className="profile-member-since">
                    Member since {userData.memberSince}
                  </p>
                </div>
              </div>
              <button className="edit-profile-btn" onClick={handleEditProfile}>
                <i className="fa-solid fa-pen"></i>
                Edit Profile
              </button>
            </div>
          </div>

          <div className="profile-grid">
            <div id="personal-info" className="profile-card">
              <div className="card-header">
                <h2 className="card-title">Personal Information</h2>
                <button className="edit-btn">
                  <i className="fa-solid fa-pen"></i>
                </button>
              </div>
              <div className="card-content">
                <div className="info-item">
                  <label className="info-label">Full Name</label>
                  <p className="info-value">{userData.fullName}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Email</label>
                  <p className="info-value">{userData.email}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Phone</label>
                  <p className="info-value">{userData.phone}</p>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <label className="info-label">Gender</label>
                    <p className="info-value">{userData.gender}</p>
                  </div>
                  <div className="info-item">
                    <label className="info-label">Birthday</label>
                    <p className="info-value">{userData.birthday}</p>
                  </div>
                </div>
              </div>
            </div>

            <div id="saved-addresses" className="profile-card">
              <div className="card-header">
                <h2 className="card-title">Saved Addresses</h2>
                <button className="add-btn">
                  <i className="fa-solid fa-plus"></i>
                  Add New
                </button>
              </div>
              <div className="card-content">
                {addresses.map((address) => (
                  <div key={address.id} className="address-item">
                    <div className="address-header">
                      <span className="address-type">{address.type}</span>
                      <i className="fa-solid fa-ellipsis"></i>
                    </div>
                    <p className="address-text">{address.address}</p>
                    <p className="address-city">{address.city}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="payment-methods" className="profile-card">
              <div className="card-header">
                <h2 className="card-title">Payment Methods</h2>
                <button className="add-btn">
                  <i className="fa-solid fa-plus"></i>
                  Add New
                </button>
              </div>
              <div className="card-content">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="payment-item">
                    <div className="payment-info">
                      <i className={`${method.icon} payment-icon`}></i>
                      <div>
                        <p className="payment-number">{method.number}</p>
                        <p className="payment-expires">{method.expires}</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-ellipsis"></i>
                  </div>
                ))}
              </div>
            </div>

            <div id="wishlist" className="profile-card">
              <div className="card-header">
                <h2 className="card-title">Wishlist</h2>
                <span className="wishlist-count">
                  {wishlistItems.length} items
                </span>
              </div>
              <div className="wishlist-grid">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="wishlist-item">
                    <div className="wishlist-image">
                      <span className="wishlist-placeholder">{item.image}</span>
                    </div>
                    <p className="wishlist-name">{item.name}</p>
                    <p className="wishlist-price">{item.price}</p>
                    <button
                      className="move-to-cart-btn"
                      onClick={() => handleMoveToCart(item.id)}
                    >
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
              <button className="view-all-btn">View All Wishlist Items</button>
            </div>
          </div>

          <div className="profile-bottom-grid">
            <div id="order-history" className="profile-card">
              <h2 className="card-title">Order History</h2>
              <div className="order-list">
                {orderHistory.map((order) => (
                  <div key={order.id} className="order-item">
                    <div>
                      <p className="order-id">{order.id}</p>
                      <p className="order-date">{order.date}</p>
                    </div>
                    <span className="order-status">{order.status}</span>
                  </div>
                ))}
              </div>
              <button className="view-all-btn" onClick={handleViewAllOrders}>
                View All Orders
              </button>
            </div>

            <div id="notifications" className="profile-card">
              <h2 className="card-title">Notifications</h2>
              <div className="notification-list">
                <div className="notification-item">
                  <div>
                    <p className="notification-title">Email Updates</p>
                    <p className="notification-desc">
                      Order updates & shipping
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="notification-item">
                  <div>
                    <p className="notification-title">SMS Notifications</p>
                    <p className="notification-desc">Delivery alerts</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="notification-item">
                  <div>
                    <p className="notification-title">Promotional Offers</p>
                    <p className="notification-desc">Sales & discounts</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div id="security" className="profile-card">
              <h2 className="card-title">Security & Privacy</h2>
              <div className="security-list">
                <button className="security-btn" onClick={handleChangePassword}>
                  <div className="security-btn-content">
                    <i className="fa-solid fa-lock"></i>
                    <span>Change Password</span>
                  </div>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
                <button className="security-btn" onClick={handleTwoFactorAuth}>
                  <div className="security-btn-content">
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Two-Factor Auth</span>
                  </div>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
                <button
                  className="security-btn delete-btn"
                  onClick={handleDeleteAccount}
                >
                  <div className="security-btn-content">
                    <i className="fa-solid fa-trash"></i>
                    <span>Delete Account</span>
                  </div>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          <div id="logout-section" className="logout-section">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fa-solid fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
