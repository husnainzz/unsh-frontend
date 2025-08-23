# UNCH Fashion Frontend Redux Store

This document describes the Redux store setup and how to use it with the backend API.

## Store Structure

The Redux store is organized into the following slices:

- **authSlice**: User authentication and management
- **productSlice**: Product management and display
- **cartSlice**: Shopping cart functionality
- **orderSlice**: Order management
- **orderTrackingSlice**: Order tracking functionality
- **wishlistSlice**: Wishlist/favorites functionality (now supports guests!)

## Authentication (authSlice)

### Actions

#### Public Actions (No Authentication Required)

- `register(userData)`: Register a new user
- `login(credentials)`: Login user

#### Protected Actions (Requires Authentication)

- `getProfile()`: Get current user profile
- `updateProfile(userData)`: Update current user profile
- `getMyOrders()`: Get current user's orders

#### Admin Only Actions

- `getAllUsers()`: Get all users
- `updateUserRole(userId, roleData)`: Update user role
- `toggleUserStatus(userId)`: Toggle user active status

### Usage Example

```javascript
import { useDispatch, useSelector } from "react-redux";
import { login, getProfile } from "../store/slices/authSlice";

const MyComponent = () => {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    const result = await dispatch(login(credentials));
    if (login.fulfilled.match(result)) {
      // Login successful
      dispatch(getProfile());
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {userInfo && <p>Welcome, {userInfo.name}!</p>}
    </div>
  );
};
```

## Products (productSlice)

### Actions

#### Public Actions

- `fetchProducts(params)`: Get all active products with pagination/filtering
- `fetchProductDetails(prodId)`: Get product by prodId
- `fetchCategories()`: Get product categories

#### Admin Only Actions

- `fetchAllProducts()`: Get all products (including inactive)
- `createProduct(productData)`: Create new product
- `updateProduct({ prodId, productData })`: Update product
- `deleteProduct(prodId)`: Delete product
- `toggleProductStatus(prodId)`: Toggle product active status

### Usage Example

```javascript
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchProductDetails,
} from "../store/slices/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error, totalPages, currentPage } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleProductClick = (prodId) => {
    dispatch(fetchProductDetails(prodId));
  };

  return (
    <div>
      {loading && <p>Loading products...</p>}
      {error && <p>Error: {error}</p>}
      {products.map((product) => (
        <div
          key={product.prodId}
          onClick={() => handleProductClick(product.prodId)}
        >
          {product.name}
        </div>
      ))}
    </div>
  );
};
```

## Cart (cartSlice)

### Actions

- `addToCart({ product, size, color, quantity })`: Add item to cart
- `removeFromCart({ productId, size, color })`: Remove item from cart
- `updateQuantity({ productId, size, color, quantity })`: Update item quantity
- `clearCart()`: Clear entire cart

### Selectors

- `selectCartItems`: Get all cart items
- `selectCartItemCount`: Get total number of items in cart
- `selectCartTotal`: Get total price of cart

### Usage Example

```javascript
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  selectCartItems,
  selectCartTotal,
} from "../store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const handleAddToCart = (product, size, color, quantity = 1) => {
    dispatch(addToCart({ product, size, color, quantity }));
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, size, color }));
  };

  return (
    <div>
      <h2>Cart Total: ${cartTotal}</h2>
      {cartItems.map((item) => (
        <div key={`${item.product.prodId}-${item.size}-${item.color}`}>
          <h3>{item.product.name}</h3>
          <p>
            Size: {item.size}, Color: {item.color}
          </p>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ${item.price * item.quantity}</p>
          <button
            onClick={() =>
              handleRemoveFromCart(item.product.prodId, item.size, item.color)
            }
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};
```

## Wishlist (wishlistSlice) - Now Guest-Friendly! 🎉

### Features

- **Guest Access**: Guests can now add/remove favorites without logging in
- **Local Storage**: Wishlist persists in browser localStorage
- **Smart Sync**: When guests log in, their wishlist automatically syncs with their account
- **No Duplicates**: Prevents duplicate items when syncing guest and user wishlists

### Actions

- `addToWishlist({ product })`: Add product to wishlist (works for guests and users)
- `removeFromWishlist({ productId })`: Remove product from wishlist
- `clearWishlist()`: Clear entire wishlist
- `initializeWishlist()`: Initialize wishlist from localStorage
- `setGuestMode(boolean)`: Set guest mode status
- `syncGuestWishlist({ guestWishlist, userWishlist })`: Sync guest wishlist with user account
- `setUserWishlist(wishlist)`: Set user wishlist and exit guest mode

### Selectors

- `selectWishlistItems`: Get all wishlist items
- `selectWishlistItemCount`: Get total number of items in wishlist
- `selectIsInWishlist(state, productId)`: Check if product is in wishlist
- `selectIsGuestMode`: Check if user is in guest mode

### Usage Example

```javascript
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
  selectWishlistItems,
  selectIsInWishlist,
  selectIsGuestMode,
} from "../store/slices/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const isGuestMode = useSelector(selectIsGuestMode);

  const handleToggleWishlist = (product) => {
    const isInWishlist = useSelector((state) =>
      selectIsInWishlist(state, product.prodId)
    );

    if (isInWishlist) {
      dispatch(removeFromWishlist({ productId: product.prodId }));
    } else {
      dispatch(addToWishlist({ product }));
    }
  };

  return (
    <div>
      <h2>My Wishlist ({wishlistItems.length} items)</h2>
      {isGuestMode && (
        <p className="guest-notice">
          💡 You're browsing as a guest.
          <a href="/login">Log in</a> to sync your wishlist with your account!
        </p>
      )}
      {wishlistItems.map((item) => (
        <div key={item.prodId}>
          <h3>{item.product.name}</h3>
          <p>Added: {new Date(item.addedAt).toLocaleDateString()}</p>
          <button onClick={() => handleToggleWishlist(item.product)}>
            Remove from Wishlist
          </button>
        </div>
      ))}
    </div>
  );
};
```

### Guest Wishlist Workflow

1. **Guest Browsing**: Users can add/remove favorites without logging in
2. **Local Storage**: Wishlist is saved in browser localStorage
3. **Login/Register**: When user logs in, guest wishlist is preserved
4. **Smart Sync**: Guest wishlist is merged with user's existing wishlist
5. **No Duplicates**: System prevents duplicate items during sync
6. **Seamless Experience**: User continues with their favorites intact

### Implementation Details

```javascript
// In your login component, after successful login:
import { syncGuestWishlist } from "../store/slices/wishlistSlice";

const handleLoginSuccess = () => {
  // Get guest wishlist from localStorage
  const guestWishlist = JSON.parse(
    localStorage.getItem("tempGuestWishlist") || "[]"
  );

  if (guestWishlist.length > 0) {
    // Sync guest wishlist with user account
    dispatch(
      syncGuestWishlist({
        guestWishlist,
        userWishlist: [], // Get from user's account if available
      })
    );

    // Clean up temporary storage
    localStorage.removeItem("tempGuestWishlist");
  }
};
```

## Orders (orderSlice)

### Actions

#### Public Actions (No Authentication Required)

- `createGuestOrder(orderData)`: Create guest order

#### Protected Actions (Requires Authentication)

- `createOrder(orderData)`: Create authenticated user order
- `fetchOrderDetails(id)`: Get order by ID
- `fetchMyOrders()`: Get current user's orders
- `cancelOrder(id)`: Cancel order

#### Admin/Coordinator Actions

- `fetchAllOrders(params)`: Get all orders with pagination/filtering
- `updateOrderStatus({ id, statusData })`: Update order status
- `updatePaymentStatus({ id, paymentData })`: Update payment status

### Usage Example

```javascript
import { useDispatch, useSelector } from "react-redux";
import { createOrder, fetchMyOrders } from "../store/slices/orderSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.orders);
  const cartItems = useSelector((state) => state.cart.items);

  const handleCheckout = async (shippingAddress, paymentDetails) => {
    const orderData = {
      items: cartItems.map((item) => ({
        prodId: item.product.prodId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
      })),
      shippingAddress,
      paymentDetails,
    };

    const result = await dispatch(createOrder(orderData));
    if (createOrder.fulfilled.match(result)) {
      // Order created successfully
      dispatch(fetchMyOrders());
    }
  };

  return (
    <div>
      {loading && <p>Processing order...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={() => handleCheckout(address, payment)}>
        Place Order
      </button>
    </div>
  );
};
```

## Order Tracking (orderTrackingSlice)

### Actions

- `trackOrder(trackingId)`: Track order by tracking ID (public, no auth required)

### Usage Example

```javascript
import { useDispatch, useSelector } from "react-redux";
import { trackOrder } from "../store/slices/orderTrackingSlice";

const OrderTracking = () => {
  const dispatch = useDispatch();
  const { trackedOrder, loading, error, trackingHistory } = useSelector(
    (state) => state.orderTracking
  );

  const handleTrackOrder = (trackingId) => {
    dispatch(trackOrder(trackingId));
  };

  return (
    <div>
      <input
        placeholder="Enter tracking ID"
        onKeyPress={(e) =>
          e.key === "Enter" && handleTrackOrder(e.target.value)
        }
      />

      {loading && <p>Tracking order...</p>}
      {error && <p>Error: {error}</p>}

      {trackedOrder && (
        <div>
          <h3>Order Status: {trackedOrder.status}</h3>
          <p>Tracking ID: {trackedOrder.trackingId}</p>
          <p>
            Customer: {trackedOrder.guestInfo?.name || trackedOrder.user?.name}
          </p>
          <p>Total Amount: ${trackedOrder.totalAmount}</p>
        </div>
      )}

      {trackingHistory.length > 0 && (
        <div>
          <h4>Recent Tracking History</h4>
          {trackingHistory.map((item) => (
            <div key={item.trackingId}>
              <p>
                {item.trackingId} - {item.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## ProductCard Component Functionality

The ProductCard component now includes full functionality for all three main options:

### 1. Add to Favorite (Wishlist) - Now Guest-Friendly! 🎉

- **Functionality**: Toggle product in/out of wishlist
- **Authentication**: **No login required** - works for both guests and authenticated users
- **State Management**: Uses Redux wishlist slice with localStorage persistence
- **Visual Feedback**: Heart icon changes between filled/outlined based on wishlist status
- **Smart Sync**: Guest wishlist automatically syncs when user logs in

### 2. View Details

- **Functionality**: Navigate to product detail page
- **Routing**: Uses React Router navigation
- **URL Structure**: `/product/{prodId}`

### 3. Add to Cart

- **Functionality**: Open size/color selection modal, add product to cart
- **Authentication**: Requires user login (redirects to login if not authenticated)
- **Modal**: SizeColorModal component for selecting size, color, and quantity
- **State Management**: Uses Redux cart slice with localStorage persistence
- **Validation**: Form validation for required fields (size, color, quantity)

### Usage in ProductCard

```javascript
import ProductCard from "../components/ProductCard";

const ProductList = () => {
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.prodId} product={product} />
      ))}
    </div>
  );
};
```

## API Integration

The Redux store integrates with the backend API through the `api.js` utility file. All API calls include:

- Automatic token management
- Error handling
- Response interceptors
- Base URL configuration

### API Base URL

The API base URL is configured via environment variable:

```bash
REACT_APP_API_BASE_URL=http://localhost:5001/api
```

### Authentication

Protected routes automatically include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Error Handling

The store automatically handles common errors:

- 401 Unauthorized: Redirects to login page
- Network errors: Displays user-friendly error messages
- Validation errors: Shows specific error details

## Best Practices

1. **Use Selectors**: Always use selectors to access state instead of directly accessing the store
2. **Handle Loading States**: Check loading states before rendering components
3. **Error Handling**: Always handle errors and show appropriate messages to users
4. **Async Actions**: Use `unwrap()` or check action status for better error handling
5. **State Updates**: Let Redux handle all state updates, don't mutate state directly
6. **Authentication Checks**: Always check user authentication before performing protected actions
7. **Form Validation**: Validate user inputs before dispatching actions
8. **Guest Experience**: Provide seamless experience for non-authenticated users where possible

## Common Patterns

### Loading State Pattern

```javascript
const { loading, error, data } = useSelector((state) => state.sliceName);
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;
return <DataComponent data={data} />;
```

### Action Dispatch Pattern

```javascript
const handleAction = async (data) => {
  const result = await dispatch(actionName(data));
  if (actionName.fulfilled.match(result)) {
    // Success handling
  } else {
    // Error handling
  }
};
```

### Effect Pattern

```javascript
useEffect(() => {
  dispatch(fetchData());
}, [dispatch]);
```

### Authentication Check Pattern

```javascript
const handleProtectedAction = () => {
  if (!userInfo) {
    navigate("/login", { state: { from: window.location.pathname } });
    return;
  }
  // Perform protected action
};
```

### Guest Wishlist Pattern

```javascript
const handleWishlistToggle = (product) => {
  // Works for both guests and authenticated users
  if (isInWishlist) {
    dispatch(removeFromWishlist({ productId: product.prodId }));
  } else {
    dispatch(addToWishlist({ product }));
  }
};
```

This Redux store is fully integrated with the backend API and provides a robust foundation for the UNCH Fashion frontend application, now with enhanced guest user experience! 🎉
