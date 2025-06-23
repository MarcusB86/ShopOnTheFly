import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrderDetail = () => {
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrder();
    }
  }, [isAuthenticated, id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Please log in to view order details</h3>
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

  if (!order) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Order not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h1>Order #{order.id}</h1>
      <div className="card" style={{ padding: '2rem', marginTop: '2rem' }}>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ${parseFloat(order.total_amount).toFixed(2)}</p>
        <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
        <h3 style={{ marginTop: '2rem' }}>Items</h3>
        <ul>
          {order.items && order.items.map(item => (
            <li key={item.id}>
              {item.name} (x{item.quantity}) - ${parseFloat(item.price).toFixed(2)} each
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetail; 