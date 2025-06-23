import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, token]);

  const fetchCart = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to add items to cart' };
    }

    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchCart(); // Refresh cart
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) return { success: false, error: 'Not authenticated' };

    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchCart(); // Refresh cart
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return { success: false, error: 'Not authenticated' };

    try {
      const response = await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        await fetchCart(); // Refresh cart
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return { success: false, error: 'Not authenticated' };

    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCartItems([]);
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.total, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 