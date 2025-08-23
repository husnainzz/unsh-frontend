import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProductDetails,
  updateProduct,
  fetchCategories,
} from "../store/slices/productSlice";
import { getProfile } from "../store/slices/authSlice";
import "../styles/AdminEditProductPage.css";

const AdminEditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);
  const { product, categories, brands, loading, error } = useSelector(
    (state) => state.products
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    images: [],
  });

  const [formErrors, setFormErrors] = useState({});
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (userInfo?.role !== "admin") {
      navigate("/");
      return;
    }

    dispatch(getProfile());
    dispatch(fetchProductDetails(id));
    dispatch(fetchCategories());
  }, [dispatch, isAuthenticated, userInfo?.role, navigate, id]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        category: product.category || "",
        brand: product.brand || "",
        sizes: product.sizes || [],
        colors: product.colors || [],
        images: product.images || [],
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAddSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()],
      }));
      setNewSize("");
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size !== sizeToRemove),
    }));
  };

  const handleAddColor = () => {
    if (
      newColor.trim() &&
      !formData.colors.some((c) => c.name === newColor.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        colors: [
          ...prev.colors,
          { name: newColor.trim(), hexCode: newColorHex },
        ],
      }));
      setNewColor("");
      setNewColorHex("#000000");
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((color) => color.name !== colorToRemove),
    }));
  };

  const handleAddImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage("");
    }
  };

  const handleRemoveImage = (imageToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((image) => image !== imageToRemove),
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Product description is required";
    }
    if (!formData.price || formData.price <= 0) {
      errors.price = "Valid price is required";
    }
    if (!formData.stock || formData.stock < 0) {
      errors.stock = "Valid stock quantity is required";
    }
    if (!formData.category) {
      errors.category = "Category is required";
    }
    if (!formData.brand) {
      errors.brand = "Brand is required";
    }
    if (formData.sizes.length === 0) {
      errors.sizes = "At least one size is required";
    }
    if (formData.colors.length === 0) {
      errors.colors = "At least one color is required";
    }
    if (formData.images.length === 0) {
      errors.images = "At least one image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      await dispatch(updateProduct({ id, productData })).unwrap();
      navigate("/admin");
    } catch (error) {
      console.error("Product update error:", error);
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  if (!isAuthenticated || userInfo?.role !== "admin") {
    return null;
  }

  if (loading && !product) {
    return (
      <div className="admin-edit-product-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="admin-edit-product-page">
        <div className="container">
          <div className="error-container">
            <h2>Product not found</h2>
            <p>The product you're trying to edit doesn't exist.</p>
            <button
              onClick={() => navigate("/admin")}
              className="btn btn-primary"
            >
              Back to Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-edit-product-page">
      <div className="container">
        <div className="page-header">
          <h1>Edit Product</h1>
          <p>Update product information and inventory</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={formErrors.name ? "error" : ""}
                  placeholder="Enter product name"
                />
                {formErrors.name && (
                  <span className="error-message">{formErrors.name}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={formErrors.description ? "error" : ""}
                  placeholder="Enter product description"
                  rows="4"
                />
                {formErrors.description && (
                  <span className="error-message">
                    {formErrors.description}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={formErrors.price ? "error" : ""}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {formErrors.price && (
                  <span className="error-message">{formErrors.price}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className={formErrors.stock ? "error" : ""}
                  placeholder="0"
                  min="0"
                />
                {formErrors.stock && (
                  <span className="error-message">{formErrors.stock}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={formErrors.category ? "error" : ""}
                >
                  <option value="">Select Category</option>
                  {categories &&
                    categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
                {formErrors.category && (
                  <span className="error-message">{formErrors.category}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="brand">Brand *</label>
                <select
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className={formErrors.brand ? "error" : ""}
                >
                  <option value="">Select Brand</option>
                  {brands &&
                    brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                </select>
                {formErrors.brand && (
                  <span className="error-message">{formErrors.brand}</span>
                )}
              </div>

              <div className="form-group full-width">
                <label>Sizes *</label>
                <div className="add-item-controls">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Enter size (e.g., S, M, L, XL)"
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleAddSize}
                  >
                    Add Size
                  </button>
                </div>
                {formErrors.sizes && (
                  <span className="error-message">{formErrors.sizes}</span>
                )}
                <div className="items-list">
                  {formData.sizes.map((size, index) => (
                    <div key={index} className="item-tag">
                      <span>{size}</span>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemoveSize(size)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Colors *</label>
                <div className="add-item-controls">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Enter color name"
                  />
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="color-picker"
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleAddColor}
                  >
                    Add Color
                  </button>
                </div>
                {formErrors.colors && (
                  <span className="error-message">{formErrors.colors}</span>
                )}
                <div className="items-list">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="item-tag color-tag">
                      <span
                        className="color-preview"
                        style={{ backgroundColor: color.hexCode }}
                      ></span>
                      <span>{color.name}</span>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemoveColor(color.name)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Images *</label>
                <div className="add-item-controls">
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Enter image URL"
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleAddImage}
                  >
                    Add Image
                  </button>
                </div>
                {formErrors.images && (
                  <span className="error-message">{formErrors.images}</span>
                )}
                <div className="items-list">
                  {formData.images.map((image, index) => (
                    <div key={index} className="item-tag image-tag">
                      <img src={image} alt={`Preview ${index + 1}`} />
                      <span className="image-url">{image}</span>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemoveImage(image)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>

            {error && (
              <div className="error-alert">
                <p>Error: {error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProductPage;
