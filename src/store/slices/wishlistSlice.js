import { createSlice } from "@reduxjs/toolkit";

// Load wishlist from localStorage
const loadWishlistFromStorage = () => {
  try {
    const wishlist = localStorage.getItem("wishlist");
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error("Error loading wishlist from localStorage:", error);
    return [];
  }
};

// Save wishlist to localStorage
const saveWishlistToStorage = (wishlist) => {
  try {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  } catch (error) {
    console.error("Error saving wishlist to localStorage:", error);
  }
};

// Initial state
const initialState = {
  items: loadWishlistFromStorage(),
  isGuestMode: true, // Track if user is in guest mode
};

// Wishlist slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const { product } = action.payload;

      // Check if product already exists in wishlist
      const existingItemIndex = state.items.findIndex(
        (item) => item.prodId === product.prodId
      );

      if (existingItemIndex === -1) {
        // Add new item to wishlist
        state.items.push({
          prodId: product.prodId,
          product: product,
          addedAt: new Date().toISOString(),
        });
      }

      saveWishlistToStorage(state.items);
    },

    removeFromWishlist: (state, action) => {
      const { productId } = action.payload;

      state.items = state.items.filter((item) => item.prodId !== productId);

      saveWishlistToStorage(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },

    // Initialize wishlist from localStorage (for hydration)
    initializeWishlist: (state) => {
      state.items = loadWishlistFromStorage();
    },

    // Set guest mode status
    setGuestMode: (state, action) => {
      state.isGuestMode = action.payload;
    },

    // Sync guest wishlist with user account (when user logs in)
    syncGuestWishlist: (state, action) => {
      const { guestWishlist, userWishlist } = action.payload;

      // Merge guest wishlist with user wishlist, avoiding duplicates
      const mergedWishlist = [...userWishlist];

      guestWishlist.forEach((guestItem) => {
        const exists = userWishlist.some(
          (userItem) => userItem.prodId === guestItem.prodId
        );

        if (!exists) {
          mergedWishlist.push({
            ...guestItem,
            addedAt: new Date().toISOString(), // Update timestamp
          });
        }
      });

      state.items = mergedWishlist;
      state.isGuestMode = false;
      saveWishlistToStorage(mergedWishlist);
    },

    // Clear guest mode and set user wishlist
    setUserWishlist: (state, action) => {
      state.items = action.payload;
      state.isGuestMode = false;
      saveWishlistToStorage(action.payload);
    },
  },
});

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistItemCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (state, productId) =>
  state.wishlist.items.some((item) => item.prodId === productId);
export const selectIsGuestMode = (state) => state.wishlist.isGuestMode;

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  initializeWishlist,
  setGuestMode,
  syncGuestWishlist,
  setUserWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
