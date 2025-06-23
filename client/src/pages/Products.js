import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy, sortOrder]);

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
      // You could show a toast notification here
      console.log('Added to cart successfully');
    } else {
      alert(result.error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('name');
    setSortOrder('asc');
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1>Our Products</h1>
          <p>Discover amazing products at great prices</p>
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
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="btn btn-primary btn-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="product-category">{product.category_name}</p>
                  <p className="product-description">
                    {product.description?.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description}
                  </p>
                  <div className="product-footer">
                    <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
                    <p className="product-stock">
                      {product.stock_quantity > 0 ? (
                        <span className="in-stock">In Stock ({product.stock_quantity})</span>
                      ) : (
                        <span className="out-of-stock">Out of Stock</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 