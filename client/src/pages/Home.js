import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?sort=created_at&order=desc&limit=4');
      if (response.ok) {
        const products = await response.json();
        setFeaturedProducts(products.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="highlight">Shop On The Fly</span>
            </h1>
            <p className="hero-subtitle">
              Discover amazing products at unbeatable prices. Shop with confidence and convenience.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Now
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Get your orders delivered quickly and safely to your doorstep.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive prices and regular discounts on all products.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure Shopping</h3>
              <p>Your data is protected with industry-standard security measures.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Quality Products</h3>
              <p>Carefully curated selection of high-quality products.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={product.image_url || 'https://via.placeholder.com/300x300?text=Product'} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category_name}</p>
                    <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
                    <Link to={`/products/${product.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center">
            <Link to="/products" className="btn btn-outline btn-lg">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Shopping?</h2>
            <p>Join thousands of satisfied customers and discover amazing products today.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/products" className="btn btn-outline btn-lg">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 