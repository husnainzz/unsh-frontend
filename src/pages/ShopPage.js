import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchProducts,
  setFilters,
  clearFilters,
} from "../store/slices/productSlice";
import { PRODUCT_CATEGORIES } from "../store/constants";
import ProductCard from "../components/ProductCard";
import "../styles/ShopPage.css";

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useDispatch();
  const { products, loading, error, totalPages, currentPage, total, filters } =
    useSelector((state) => state.products);



  // Initialize filters from URL params and fetch products
  useEffect(() => {
    const urlFilters = {
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "desc",
      page: searchParams.get("page") || "1",
    };



    // Update filters state
    dispatch(setFilters(urlFilters));

    // Prepare API params
    const params = {
      page: urlFilters.page,
      limit: 12,
      ...urlFilters,
    };

    // Remove empty values
    Object.keys(params).forEach((key) => {
      if (!params[key] || params[key] === "") {
        delete params[key];
      }
    });



    // Fetch products immediately with URL params
    dispatch(fetchProducts(params));
  }, [dispatch, searchParams]);

  // Remove the separate filters useEffect to prevent race conditions

  // Handle initial load - ensure products are fetched on first render
  useEffect(() => {
    // Only run on initial mount
    const hasInitialParams = searchParams.toString().length > 0;

    if (!hasInitialParams) {
      // If no URL params, fetch all products
      dispatch(fetchProducts({ page: 1, limit: 12 }));
    }
  }, []); // Empty dependency array - only run once

  // Use predefined categories from constants
  const categories = Object.values(PRODUCT_CATEGORIES);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: "1" };

    dispatch(setFilters(newFilters));

    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    newSearchParams.set("page", "1");

    setSearchParams(newSearchParams);
  };

  const handleSearch = (searchTerm) => {
    handleFilterChange("search", searchTerm);
  };

  const handleSort = (sortBy, sortOrder) => {
    handleFilterChange("sortBy", sortBy);
    handleFilterChange("sortOrder", sortOrder);
  };

  const handlePageChange = (page) => {
    handleFilterChange("page", page.toString());
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    setSearchParams({});
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="shop-page">
      <div className="container">
        {/* Header */}
        <div className="shop-header">
          <h1>Shop</h1>
          <p>Discover our amazing collection of clothing and accessories</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="shop-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="controls-right">
            <button
              className="btn btn-outline filter-toggle"
              onClick={toggleFilters}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <button
              className="btn btn-outline clear-filters-btn"
              onClick={clearAllFilters}
              disabled={
                !filters.category &&
                !filters.minPrice &&
                !filters.maxPrice &&
                !filters.search
              }
            >
              Clear Filters
            </button>

            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                handleSort(sortBy, sortOrder);
              }}
              className="sort-select"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Filters Sidebar */}
        {showFilters && (
          <div className="filters-sidebar">
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={filters.category === ""}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                  />
                  <span>All Categories</span>
                </label>
                {categories &&
                  categories.map((category) => (
                    <label key={category} className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={(e) =>
                          handleFilterChange("category", e.target.value)
                        }
                      />
                      <span>{category}</span>
                    </label>
                  ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  className="price-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  className="price-input"
                />
              </div>
            </div>

            <button
              className="btn btn-outline clear-filters"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="shop-content">

          {loading ? (
            <div className="loading">
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                  🔄
                </div>
                <div>
                  Loading products
                  {filters.category ? ` for ${filters.category}` : ""}...
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    marginTop: "0.5rem",
                  }}
                >
                  Please wait while we fetch the latest products
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="error">Error: {error}</div>
          ) : (
            <>
              <div className="results-info">
                <p>
                  Showing {products.length} of {total} products
                  {filters.category && ` in ${filters.category} category`}
                </p>
              </div>

              {products.length === 0 ? (
                <div className="no-products">
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search terms</p>
                  <button className="btn btn-outline" onClick={clearAllFilters}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {products &&
                    products.map((product) => (
                      <ProductCard
                        key={product.prodId || product._id}
                        product={product}
                      />
                    ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </button>

                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`btn ${
                            currentPage === page ? "" : "btn-outline"
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    className="btn btn-outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
