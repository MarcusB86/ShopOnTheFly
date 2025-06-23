import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      alert('Product added to cart successfully!');
    } else {
      alert(result.error);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="empty-state">
            <h3>Product not found</h3>
            <p>The product you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail">
          <div className="product-image-section">
            <div className="product-image">
              <img
                src={product.image_url || 'https://via.placeholder.com/500x500?text=Product'}
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=Product';
                }}
              />
            </div>
          </div>

          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-name">{product.name}</h1>
              <p className="product-category">{product.category_name}</p>
            </div>

            <div className="product-price-section">
              <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
              <p className="product-stock">
                {product.stock_quantity > 0 ? (
                  <span className="in-stock">In Stock ({product.stock_quantity} available)</span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </p>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {product.stock_quantity > 0 && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock_quantity}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary btn-lg add-to-cart-btn"
                  disabled={!isAuthenticated}
                >
                  {isAuthenticated ? 'Add to Cart' : 'Login to Add to Cart'}
                </button>

                {!isAuthenticated && (
                  <p className="login-prompt">
                    Please <button onClick={() => navigate('/login')} className="link-btn">login</button> to add items to your cart
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 