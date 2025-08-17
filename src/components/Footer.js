import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>UNCH Fashion</h3>
          <p>
            Elevating style through innovative design and quality craftsmanship.
          </p>
          <p>
            Discover your unique fashion statement with our curated collection.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-section">
          <h3>Customer Service</h3>
          <Link to="/help">Help Center</Link>
          <Link to="/shipping">Shipping Info</Link>
          <Link to="/returns">Returns</Link>
          <Link to="/size-guide">Size Guide</Link>
        </div>

        <div className="footer-section">
          <h3>Connect With Us</h3>
          <p>Follow us for the latest trends and exclusive offers.</p>
          <p>Email: info@unchfashion.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2024 UNCH Fashion. All rights reserved. | Privacy Policy |
          Terms of Service
        </p>
      </div>
    </footer>
  );
};

export default Footer;
