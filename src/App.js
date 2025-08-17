import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";

// Import components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Import pages
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreateProductPage from "./pages/AdminCreateProductPage";
import AdminEditProductPage from "./pages/AdminEditProductPage";
import CheckoutPage from "./pages/CheckoutPage";

// Import styles
import "./styles/App.css";

// Protected Route Component for Users
const ProtectedUserRoute = ({ children }) => {
  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userInfo?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

// Protected Route Component for Admins
const ProtectedAdminRoute = ({ children }) => {
  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userInfo?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App Component
const AppContent = () => {
  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  // Wait for auth state to be initialized
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If user is admin, show only admin routes without navbar/footer
  if (isAuthenticated && userInfo?.role === "admin") {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          path="/admin/products/new"
          element={<AdminCreateProductPage />}
        />
        <Route
          path="/admin/products/:id/edit"
          element={<AdminEditProductPage />}
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // For regular users, show the full app with navbar and footer
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedUserRoute>
                <ProfilePage />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedUserRoute>
                <OrderTrackingPage />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedUserRoute>
                <CheckoutPage />
              </ProtectedUserRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className="App">
            <AppContent />
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
