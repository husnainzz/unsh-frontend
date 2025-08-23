import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productAPI } from "../../utils/api";

// Async thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log("productSlice: fetchProducts called with params:", params);
      const response = await productAPI.getProducts(params);
      console.log("productSlice: API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("productSlice: fetchProducts error:", error);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch products"
      );
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getAllProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch all products"
      );
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (prodId, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductByProdId(prodId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch product details"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productAPI.createProduct(productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ prodId, productData }, { rejectWithValue }) => {
    try {
      const response = await productAPI.updateProduct(prodId, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (prodId, { rejectWithValue }) => {
    try {
      await productAPI.deleteProduct(prodId);
      return prodId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete product"
      );
    }
  }
);

export const toggleProductStatus = createAsyncThunk(
  "products/toggleProductStatus",
  async (prodId, { rejectWithValue }) => {
    try {
      const response = await productAPI.toggleProductStatus(prodId);
      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to toggle product status"
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch categories"
      );
    }
  }
);

// Initial state
const initialState = {
  products: [],
  product: null,
  categories: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  total: 0,
  filters: {
    category: "",
    minPrice: "",
    maxPrice: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

// Product slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.product = null;
    },
    setFilters: (state, action) => {
      console.log("productSlice: setFilters called with:", action.payload);
      console.log("productSlice: Previous filters:", state.filters);
      state.filters = { ...state.filters, ...action.payload };
      console.log("productSlice: New filters:", state.filters);
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        minPrice: "",
        maxPrice: "",
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch All Products
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Product Details
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Product
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p.prodId === action.payload.prodId
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.product && state.product.prodId === action.payload.prodId) {
          state.product = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (p) => p.prodId !== action.payload
        );
        if (state.product && state.product.prodId === action.payload) {
          state.product = null;
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Toggle Product Status
    builder
      .addCase(toggleProductStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p.prodId === action.payload.prodId
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.product && state.product.prodId === action.payload.prodId) {
          state.product = action.payload;
        }
        state.error = null;
      })
      .addCase(toggleProductStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductDetails, setFilters, clearFilters, clearError } =
  productSlice.actions;
export default productSlice.reducer;
