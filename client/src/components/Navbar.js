import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          🛒 Shop On The Fly
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Products
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="nav-link cart-link" onClick={() => setIsMenuOpen(false)}>
                🛒 Cart
                {getCartItemCount() > 0 && (
                  <span className="cart-badge">{getCartItemCount()}</span>
                )}
              </Link>
              <Link to="/orders" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Orders
              </Link>
              <div className="nav-dropdown">
                <button className="nav-link dropdown-toggle" onClick={toggleMenu}>
                  👤 {user?.firstName}
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 