import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderAPI } from "../../utils/api";

// Async thunk for tracking orders by tracking ID (public, no auth required)
export const trackOrder = createAsyncThunk(
  "orderTracking/trackOrder",
  async (trackingId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderByTrackingId(trackingId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to track order"
      );
    }
  }
);

// Initial state
const initialState = {
  trackedOrder: null,
  loading: false,
  error: null,
  trackingHistory: [], // Store multiple tracking attempts
};

// Order tracking slice
const orderTrackingSlice = createSlice({
  name: "orderTracking",
  initialState,
  reducers: {
    clearTrackedOrder: (state) => {
      state.trackedOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearTrackingHistory: (state) => {
      state.trackingHistory = [];
    },
    addToTrackingHistory: (state, action) => {
      // Add to history if not already present
      const exists = state.trackingHistory.find(
        (item) => item.trackingId === action.payload.trackingId
      );
      if (!exists) {
        state.trackingHistory.unshift(action.payload);
        // Keep only last 10 tracking attempts
        if (state.trackingHistory.length > 10) {
          state.trackingHistory = state.trackingHistory.slice(0, 10);
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Track Order
    builder
      .addCase(trackOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.trackedOrder = action.payload;
        state.error = null;
        // Add to tracking history
        state.trackingHistory.unshift({
          trackingId: action.payload.trackingId,
          orderDate: action.payload.createdAt,
          status: action.payload.status,
          customerName:
            action.payload.guestInfo?.name || action.payload.user?.name,
          totalAmount: action.payload.totalAmount,
        });
        // Keep only last 10 tracking attempts
        if (state.trackingHistory.length > 10) {
          state.trackingHistory = state.trackingHistory.slice(0, 10);
        }
      })
      .addCase(trackOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearTrackedOrder,
  clearError,
  clearTrackingHistory,
  addToTrackingHistory,
} = orderTrackingSlice.actions;
export default orderTrackingSlice.reducer;
