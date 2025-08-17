import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import "../styles/HomePage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    // Fetch featured products (limit to 6)
    dispatch(
      fetchProducts({ limit: 6, sortBy: "createdAt", sortOrder: "desc" })
    );
  }, [dispatch]);

  const featuredProducts = products.slice(0, 6);

  const categories = [
    {
      name: "Men's Clothing",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      link: "/shop?category=men",
    },
    {
      name: "Women's Clothing",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop",
      link: "/shop?category=women",
    },
    {
      name: "Accessories",
      image:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop",
      link: "/shop?category=accessories",
    },
    {
      name: "Footwear",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
      link: "/shop?category=shoes",
    },
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Your Style</h1>
          <p>
            Explore our curated collection of trendy clothing and accessories
            that define your unique personality.
          </p>
          <div className="hero-buttons">
            <Link to="/shop" className="btn btn-lg">
              Shop Now
            </Link>
            <Link to="/shop?category=new" className="btn btn-outline btn-lg">
              New Arrivals
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
            alt="Fashion Collection"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories &&
              categories.map((category, index) => (
                <Link key={index} to={category.link} className="category-card">
                  <div className="category-image">
                    <img src={category.image} alt={category.name} />
                  </div>
                  <div className="category-overlay">
                    <h3>{category.name}</h3>
                    <span className="category-arrow">→</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <h2>Featured Products</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts &&
                featuredProducts.map((product) => (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      <img
                        src={
                          product.images?.[0] ||
                          "https://via.placeholder.com/300x400?text=Product"
                        }
                        alt={product.name}
                      />
                      <div className="product-overlay">
                        <Link
                          to={`/product/${product._id}`}
                          className="btn btn-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-brand">{product.brand}</p>
                      <div className="product-price">${product.price}</div>
                    </div>
                  </div>
                ))}
            </div>
          )}
          <div className="text-center m-auto">
            <Link to="/shop" className="btn btn-black">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3>Free Shipping</h3>
              <p>Free shipping on orders over $50</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Quality Guarantee</h3>
              <p>30-day return policy for all items</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>24/7 Support</h3>
              <p>Round the clock customer support</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3>Secure Payment</h3>
              <p>Safe and secure payment methods</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Upgrade Your Wardrobe?</h2>
            <p>
              Join thousands of satisfied customers who trust AIreco for their
              fashion needs.
            </p>
            <Link to="/shop" className="btn btn-lg">
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
