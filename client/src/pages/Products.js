import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Toast from '../components/Toast';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [toast, setToast] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy, sortOrder]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products/categories/all');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products?';
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (sortBy) params.append('sort', sortBy);
      if (sortOrder) params.append('order', sortOrder);

      url += params.toString();

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      showToast('Added to cart successfully!', 'success');
    } else {
      showToast(result.error, 'error');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const handleCreateProduct = () => {
    navigate('/admin');
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <div className="header-content">
            <h1>Our Products</h1>
            <p>Discover amazing products at great prices</p>
          </div>
          {user?.role === 'admin' && (
            <button onClick={handleCreateProduct} className="btn btn-primary">
              ➕ Create Product
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="created_at">Sort by Date</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="form-input"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>

            <button onClick={clearFilters} className="btn btn-outline">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img
                    src={product.image_url || 'https://via.placeholder.com/300x300?text=Product'}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=Product';
                    }}
                  />
                  <div className="product-overlay">
                    {product.stock_quantity > 0 ? (
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button className="btn btn-outline btn-sm" disabled>
                        Out of Stock
                      </button>
                    )}
                  </div>
                  {user?.role === 'admin' && (
                    <div className="admin-badge">
                      <Link to={`/admin`} className="admin-edit-link">
                        ✏️ Edit
                      </Link>
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="product-category">
                    {product.category_name || 'Uncategorized'}
                  </p>
                  <p className="product-description">
                    {product.description?.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description}
                  </p>
                  <div className="product-footer">
                    <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
                    <p className="product-stock">
                      {product.stock_quantity > 0 ? (
                        <span className="in-stock">
                          In Stock ({product.stock_quantity})
                        </span>
                      ) : (
                        <span className="out-of-stock">Out of Stock</span>
                      )}
                    </p>
                  </div>
                  {user?.role === 'admin' && (
                    <div className="admin-info">
                      <small>ID: {product.id}</small>
                      <small>Created: {new Date(product.created_at).toLocaleDateString()}</small>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default Products; 