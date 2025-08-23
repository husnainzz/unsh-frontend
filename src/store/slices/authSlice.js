import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../utils/api";

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userInfo", JSON.stringify(response.data));

      // Get current guest wishlist before login
      const currentState = getState();
      const guestWishlist = currentState.wishlist.items;

      // If there are items in guest wishlist, we'll need to sync them
      if (guestWishlist.length > 0) {
        // Store guest wishlist temporarily for sync
        localStorage.setItem(
          "tempGuestWishlist",
          JSON.stringify(guestWishlist)
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userInfo", JSON.stringify(response.data));

      // Get current guest wishlist before registration
      const currentState = getState();
      const guestWishlist = currentState.wishlist.items;

      // If there are items in guest wishlist, we'll need to sync them
      if (guestWishlist.length > 0) {
        // Store guest wishlist temporarily for sync
        localStorage.setItem(
          "tempGuestWishlist",
          JSON.stringify(guestWishlist)
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Registration failed"
      );
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to get profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update profile"
      );
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getAllUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to get users"
      );
    }
  }
);

// New: Update user role (Admin only)
export const updateUserRole = createAsyncThunk(
  "auth/updateUserRole",
  async ({ userId, roleData }, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateUserRole(userId, roleData);
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update user role"
      );
    }
  }
);

// New: Toggle user status (Admin only)
export const toggleUserStatus = createAsyncThunk(
  "auth/toggleUserStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await authAPI.toggleUserStatus(userId);
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to toggle user status"
      );
    }
  }
);

// Initial state
const initialState = {
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
  users: [],
  usersLoading: false,
  usersError: null,
  userManagementLoading: false,
  userManagementError: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUserManagementError: (state) => {
      state.userManagementError = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get All Users
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
        state.usersError = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      });

    // Update User Role
    builder
      .addCase(updateUserRole.pending, (state) => {
        state.userManagementLoading = true;
        state.userManagementError = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.userManagementLoading = false;
        // Update user in users list
        const userIndex = state.users.findIndex(
          (u) => u._id === action.payload.userId
        );
        if (userIndex !== -1) {
          state.users[userIndex] = {
            ...state.users[userIndex],
            ...action.payload,
          };
        }
        // Update current user if it's the same
        if (state.userInfo && state.userInfo._id === action.payload.userId) {
          state.userInfo = { ...state.userInfo, ...action.payload };
        }
        state.userManagementError = null;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.userManagementLoading = false;
        state.userManagementError = action.payload;
      });

    // Toggle User Status
    builder
      .addCase(toggleUserStatus.pending, (state) => {
        state.userManagementLoading = true;
        state.userManagementError = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.userManagementLoading = false;
        // Update user in users list
        const userIndex = state.users.findIndex(
          (u) => u._id === action.payload.userId
        );
        if (userIndex !== -1) {
          state.users[userIndex] = {
            ...state.users[userIndex],
            ...action.payload,
          };
        }
        // Update current user if it's the same
        if (state.userInfo && state.userInfo._id === action.payload.userId) {
          state.userInfo = { ...state.userInfo, ...action.payload };
        }
        state.userManagementError = null;
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.userManagementLoading = false;
        state.userManagementError = action.payload;
      });
  },
});

export const { logout, clearError, clearUserManagementError } =
  authSlice.actions;
export default authSlice.reducer;
