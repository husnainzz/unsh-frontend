import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    console.log("CartSlice - Saving to localStorage:", cart);
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("CartSlice - Successfully saved to localStorage");
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

// Initial state
const initialState = {
  items: loadCartFromStorage(),
};

// Cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, size, color, quantity = 1 } = action.payload;

      // Safety check: ensure product exists and has required fields
      if (!product || (!product.prodId && !product._id)) {
        console.error("Invalid product data:", product);
        return;
      }

      // Get the primary product ID (always prioritize prodId)
      const productId = product.prodId || product._id;

      // Check if item already exists in cart with same size and color
      const existingItemIndex = state.items.findIndex((item) => {
        // Get the item's primary product ID
        const itemProductId = item.product.prodId || item.product._id;
        return (
          itemProductId === productId &&
          item.size === size &&
          item.color === color
        );
      });

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        const newItem = {
          product,
          size,
          color,
          quantity,
          price: product.price,
        };
        state.items.push(newItem);
      }

      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      const { productId, size, color } = action.payload;
      console.log("CartSlice - removeFromCart called:", {
        productId,
        size,
        color,
      });

      // Safety check: ensure productId exists
      if (!productId) {
        console.error("Invalid productId:", productId);
        return;
      }

      state.items = state.items.filter((item) => {
        // Get the item's primary product ID
        const itemProductId = item.product.prodId || item.product._id;
        const isMatch = !(
          itemProductId === productId &&
          item.size === size &&
          item.color === color
        );
        if (!isMatch) {
          console.log("CartSlice - Removing item:", {
            itemProductId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          });
        }
        return isMatch;
      });

      saveCartToStorage(state.items);
    },

    updateQuantity: (state, action) => {
      const { productId, size, color, quantity } = action.payload;
      console.log("CartSlice - updateQuantity called:", {
        productId,
        size,
        color,
        quantity,
      });

      // Safety check: ensure productId exists
      if (!productId) {
        console.error("Invalid productId:", productId);
        return;
      }

      const itemIndex = state.items.findIndex((item) => {
        // Get the item's primary product ID
        const itemProductId = item.product.prodId || item.product._id;
        console.log("CartSlice - Comparing:", {
          itemProductId,
          productId,
          itemSize: item.size,
          size,
          itemColor: item.color,
          color,
        });
        return (
          itemProductId === productId &&
          item.size === size &&
          item.color === color
        );
      });

      console.log("CartSlice - Found item at index:", itemIndex);

      if (itemIndex !== -1) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          console.log("CartSlice - Removing item due to quantity <= 0");
          state.items.splice(itemIndex, 1);
        } else {
          console.log(
            "CartSlice - Updating quantity from",
            state.items[itemIndex].quantity,
            "to",
            quantity
          );
          state.items[itemIndex].quantity = quantity;
        }
      } else {
        console.error("CartSlice - Item not found for updateQuantity");
        console.log(
          "CartSlice - Current items:",
          state.items.map((item) => ({
            productId: item.product.prodId || item.product._id,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          }))
        );
      }

      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

// Backward compatibility selector
export const selectCartItemsLegacy = (state) => state.cart.items;

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
