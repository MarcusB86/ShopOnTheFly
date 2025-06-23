import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateCartItem, removeFromCart, getCartTotal, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState({});

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(prev => ({ ...prev, [productId]: true }));
    const result = await updateCartItem(productId, newQuantity);
    setUpdating(prev => ({ ...prev, [productId]: false }));
    
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      const result = await removeFromCart(productId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/100x100?text=Product'}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=Product';
                    }}
                  />
                </div>
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">
                    <Link to={`/products/${item.productId}`}>{item.name}</Link>
                  </h3>
                  <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                  <p className="cart-item-stock">
                    {item.stockQuantity > 0 ? (
                      <span className="in-stock">In Stock ({item.stockQuantity})</span>
                    ) : (
                      <span className="out-of-stock">Out of Stock</span>
                    )}
                  </p>
                </div>

                <div className="cart-item-quantity">
                  <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updating[item.productId]}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stockQuantity || updating[item.productId]}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  <p className="item-total">${item.total.toFixed(2)}</p>
                </div>

                <div className="cart-item-actions">
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="btn btn-outline btn-sm remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items):</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="btn btn-primary btn-lg checkout-btn"
                disabled={!isAuthenticated}
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
              
              {!isAuthenticated && (
                <p className="login-prompt">
                  Please <Link to="/login">login</Link> to complete your purchase
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 