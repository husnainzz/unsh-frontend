import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import ProductCard from "../components/ProductCard";
import "../styles/HomePage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Fetch featured products (limit to 4)
    dispatch(
      fetchProducts({ limit: 4, sortBy: "createdAt", sortOrder: "desc" })
    );
  }, [dispatch]);

  // Carousel data
  const carouselSlides = [
    {
      title: "Unstitched • Festive '25",
      subtitle: "Discover our exclusive collection of premium fabrics",
      buttonText: "Shop Now",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      title: "Ready to Wear • New Arrivals",
      subtitle: "Explore our latest ready-to-wear collection",
      buttonText: "Explore Collection",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80",
    },
    {
      title: "Dresses Collection",
      subtitle: "Elegant dresses for every occasion",
      buttonText: "Shop Dresses",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  // Manual slide navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
    );
  };

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="homepage">
      {/* Hero Carousel Section */}
      <section id="hero-carousel" className="homepage-hero-carousel">
        <div
          className="homepage-hero-overlay"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${carouselSlides[currentSlide].image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="homepage-hero-content">
            <h1 className="homepage-hero-title">
              {carouselSlides[currentSlide].title}
            </h1>
            <p className="homepage-hero-subtitle">
              {carouselSlides[currentSlide].subtitle}
            </p>
            <Link to="/shop" className="homepage-hero-button">
              {carouselSlides[currentSlide].buttonText}
            </Link>
          </div>
        </div>

        {/* Carousel Navigation */}
        <button
          className="homepage-carousel-nav homepage-carousel-prev"
          onClick={goToPrevSlide}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button
          className="homepage-carousel-nav homepage-carousel-next"
          onClick={goToNextSlide}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>

        {/* Carousel Indicators */}
        <div className="homepage-hero-indicators">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              className={`homepage-hero-indicator ${
                index === currentSlide ? "active" : ""
              }`}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>
      </section>

      {/* Category Banners Section */}
      <section id="category-banners" className="homepage-category-banners">
        <div className="homepage-container">
          <div className="homepage-category-grid">
            <div
              className="homepage-category-banner homepage-category-ready-to-wear"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="homepage-category-content">
                <h2 className="homepage-category-title">
                  Ready to Wear • New Arrivals
                </h2>
                <Link to="/shop" className="homepage-category-button">
                  Explore Collection
                </Link>
              </div>
            </div>
            <div
              className="homepage-category-banner homepage-category-dresses"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="homepage-category-content">
                <h2 className="homepage-category-title">Dresses</h2>
                <Link to="/shop" className="homepage-category-button">
                  Shop Dresses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="homepage-featured-products">
        <div className="homepage-container">
          <div className="homepage-section-header">
            <h2 className="homepage-section-title">Featured Collection</h2>
            <p className="homepage-section-subtitle">
              Curated pieces for the modern woman
            </p>
          </div>
          {loading ? (
            <div className="homepage-loading">Loading...</div>
          ) : (
            <div className="homepage-products-grid">
              {featuredProducts &&
                featuredProducts.map((product) => (
                  <ProductCard
                    key={product.prodId || product._id}
                    product={product}
                  />
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Styled by You Section */}
      <section id="styled-by-you" className="homepage-styled-by-you">
        <div className="homepage-container">
          <div className="homepage-section-header">
            <h2 className="homepage-section-title">Styled by You</h2>
            <p className="homepage-section-subtitle">#UNSHStyle</p>
          </div>
          <div className="homepage-instagram-grid">
            <div
              className="homepage-instagram-item"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="homepage-instagram-overlay">
                <i className="fa-brands fa-instagram homepage-instagram-icon"></i>
              </div>
            </div>
            <div
              className="homepage-instagram-item"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="homepage-instagram-overlay">
                <span className="homepage-instagram-text">Customer Style</span>
              </div>
            </div>
            <div
              className="homepage-instagram-item"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="homepage-instagram-overlay">
                <span className="homepage-instagram-text">User Photo</span>
              </div>
            </div>
            <div
              className="homepage-instagram-item"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="homepage-instagram-overlay">
                <span className="homepage-instagram-text">Fashion Post</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="homepage-newsletter">
        <div className="homepage-container">
          <div className="homepage-newsletter-content">
            <h2 className="homepage-newsletter-title">Stay in Style</h2>
            <p className="homepage-newsletter-subtitle">
              Subscribe to get the latest updates on new collections and
              exclusive offers
            </p>
            <div className="homepage-newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="homepage-newsletter-input"
              />
              <button className="homepage-newsletter-button">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
