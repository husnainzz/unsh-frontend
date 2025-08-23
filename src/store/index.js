import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Import reducers
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import orderTrackingReducer from "./slices/orderTrackingSlice";
import wishlistReducer from "./slices/wishlistSlice";

// Persist configuration for auth
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["userInfo", "token", "isAuthenticated"],
};

// Persist configuration for cart
const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items"],
};

// Persist configuration for wishlist
const wishlistPersistConfig = {
  key: "wishlist",
  storage,
  whitelist: ["items"],
};

// Root reducer with persisted reducers
const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  products: productReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  order: orderReducer,
  orderTracking: orderTrackingReducer,
  wishlist: persistReducer(wishlistPersistConfig, wishlistReducer),
};

// Create store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Create persistor
const persistor = persistStore(store);

export { store, persistor };
export default store;
