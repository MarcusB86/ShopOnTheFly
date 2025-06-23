import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import ImageGenerator from '../components/ImageGenerator';
import './Admin.css';

const Admin = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchProducts();
      fetchCategories();
    }
  }, [user]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
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
      showToast('Failed to fetch categories', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      categoryId: '',
      imageUrl: ''
    });
    setEditingProduct(null);
    setShowForm(false);
    setShowImageGenerator(false);
  };

  const handleImageGenerated = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      imageUrl
    }));
    setShowImageGenerator(false);
    showToast('Image URL added to form!', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingProduct 
      ? `/api/products/${editingProduct.id}`
      : '/api/products';
    
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast(
          editingProduct ? 'Product updated successfully!' : 'Product created successfully!',
          'success'
        );
        resetForm();
        fetchProducts();
      } else {
        const error = await response.json();
        showToast(error.error || 'An error occurred', 'error');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('An error occurred while saving the product', 'error');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stockQuantity: product.stock_quantity.toString(),
      categoryId: product.category_id?.toString() || '',
      imageUrl: product.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showToast('Product deleted successfully!', 'success');
        fetchProducts();
      } else {
        const error = await response.json();
        showToast(error.error || 'An error occurred', 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('An error occurred while deleting the product', 'error');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Access Denied</h3>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : 'Add New Product'}
          </button>
        </div>

        {showForm && (
          <div className="admin-form">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="categoryId">Category</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-input"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="stockQuantity">Stock Quantity *</label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <div className="image-url-section">
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowImageGenerator(!showImageGenerator)}
                    className="btn btn-outline"
                  >
                    🎨 Generate Image
                  </button>
                </div>
                {formData.imageUrl && (
                  <div className="image-preview">
                    <img 
                      src={formData.imageUrl} 
                      alt="Product preview"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="image-error" style={{ display: 'none' }}>
                      Invalid image URL
                    </div>
                  </div>
                )}
              </div>

              {showImageGenerator && (
                <ImageGenerator
                  onImageGenerated={handleImageGenerated}
                  productName={formData.name}
                  productDescription={formData.description}
                />
              )}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={resetForm} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="admin-products">
          <h2>Product Management</h2>
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image_url || 'https://via.placeholder.com/50x50?text=No+Image'}
                        alt={product.name}
                        className="product-thumbnail"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category_name || 'Uncategorized'}</td>
                    <td>${parseFloat(product.price).toFixed(2)}</td>
                    <td>{product.stock_quantity}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(product)}
                          className="btn btn-outline btn-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn btn-outline btn-sm delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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

export default Admin; 