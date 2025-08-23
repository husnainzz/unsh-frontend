import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">UNSH</div>
            <p className="footer-description">
              Redefining elegance through contemporary fashion
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fa-brands fa-twitter"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Shop</h3>
            <ul className="footer-links">
              <li>
                <Link to="/shop?category=unstitched" className="footer-link">
                  Unstitched
                </Link>
              </li>
              <li>
                <Link to="/shop?category=ready-to-wear" className="footer-link">
                  Ready to Wear
                </Link>
              </li>
              <li>
                <Link to="/shop?category=dresses" className="footer-link">
                  Dresses
                </Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="footer-link">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-links">
              <li>
                <Link to="/faqs" className="footer-link">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="footer-link">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/returns" className="footer-link">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Payment Methods</h3>
            <div className="payment-methods">
              <div className="payment-method"></div>
              <div className="payment-method"></div>
              <div className="payment-method"></div>
              <div className="payment-method"></div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© 2025 UNSH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
