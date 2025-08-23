import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API base URL
const API_BASE_URL = "http://localhost:5001/api";

// Create order (authenticated user)
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue, dispatch, getState }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const order = await response.json();

      // Clear cart after successful order by dispatching clearCart action
      dispatch({ type: "cart/clearCart" });

      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create guest order (no authentication required)
export const createGuestOrder = createAsyncThunk(
  "order/createGuestOrder",
  async (orderData, { rejectWithValue, dispatch }) => {
    try {
      console.log("createGuestOrder - Sending data:", orderData);
      console.log(
        "createGuestOrder - API URL:",
        `${API_BASE_URL}/orders/guest`
      );

      const response = await fetch(`${API_BASE_URL}/orders/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      console.log("createGuestOrder - Response status:", response.status);
      console.log("createGuestOrder - Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("createGuestOrder - Error response:", errorData);
        throw new Error(errorData.error || "Failed to create guest order");
      }

      const order = await response.json();
      console.log("createGuestOrder - Success response:", order);

      // Clear cart after successful order by dispatching clearCart action
      dispatch({ type: "cart/clearCart" });

      return order;
    } catch (error) {
      console.log("createGuestOrder - Caught error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Track order by tracking ID
export const trackOrder = createAsyncThunk(
  "order/trackOrder",
  async (trackingId, { rejectWithValue }) => {
    try {
      console.log("trackOrder action called with trackingId:", trackingId);
      console.log("API URL:", `${API_BASE_URL}/orders/track/${trackingId}`);

      const response = await fetch(
        `${API_BASE_URL}/orders/track/${trackingId}`
      );

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response:", errorData);
        throw new Error(errorData.error || "Order not found");
      }

      const order = await response.json();
      console.log("Order data received:", order);
      return order;
    } catch (error) {
      console.log("trackOrder error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Get user orders (authenticated user)
export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/orders/user/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch orders");
      }

      const orders = await response.json();
      return orders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
  "order/fetchAllOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams
        ? `${API_BASE_URL}/orders?${queryParams}`
        : `${API_BASE_URL}/orders`;

      console.log("fetchAllOrders - API URL:", url);
      console.log("fetchAllOrders - Token:", token ? "Present" : "Missing");

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("fetchAllOrders - Response status:", response.status);
      console.log("fetchAllOrders - Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("fetchAllOrders - Error response:", errorData);
        throw new Error(errorData.error || "Failed to fetch orders");
      }

      const orders = await response.json();
      console.log("fetchAllOrders - Success response:", orders);
      return orders;
    } catch (error) {
      console.log("fetchAllOrders - Caught error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Update order status (admin/coordinator only)
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(statusData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update order status");
      }

      const order = await response.json();
      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update payment status (admin only)
export const updatePaymentStatus = createAsyncThunk(
  "order/updatePaymentStatus",
  async ({ id, paymentData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/orders/${id}/payment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update payment status");
      }

      const order = await response.json();
      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentOrder: null,
  userOrders: [],
  trackedOrder: null,
  adminOrders: [], // Add admin orders state
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.currentOrder = null;
      state.trackedOrder = null;
      state.error = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Create Guest Order
      .addCase(createGuestOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createGuestOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(createGuestOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Track Order
      .addCase(trackOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.trackedOrder = action.payload;
        state.error = null;
      })
      .addCase(trackOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Orders
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Orders (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload.orders || action.payload; // Handle both response formats
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update in admin orders list
        const orderIndex = state.adminOrders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (orderIndex !== -1) {
          state.adminOrders[orderIndex] = action.payload;
        }
        // Update in user orders list
        const userOrderIndex = state.userOrders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (userOrderIndex !== -1) {
          state.userOrders[userOrderIndex] = action.payload;
        }
        // Update current order if it's the same
        if (
          state.currentOrder &&
          state.currentOrder._id === action.payload._id
        ) {
          state.currentOrder = action.payload;
        }
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Payment Status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update in admin orders list
        const orderIndex = state.adminOrders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (orderIndex !== -1) {
          state.adminOrders[orderIndex] = action.payload;
        }
        // Update in user orders list
        const userOrderIndex = state.userOrders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (userOrderIndex !== -1) {
          state.userOrders[userOrderIndex] = action.payload;
        }
        // Update current order if it's the same
        if (
          state.currentOrder &&
          state.currentOrder._id === action.payload._id
        ) {
          state.currentOrder = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderState, clearError, clearSuccess } = orderSlice.actions;

// Selectors
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectUserOrders = (state) => state.order.userOrders;
export const selectTrackedOrder = (state) => state.order.trackedOrder;
export const selectAdminOrders = (state) => state.order.adminOrders;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;
export const selectOrderSuccess = (state) => state.order.success;

export default orderSlice.reducer;
