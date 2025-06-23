import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Please log in to view your orders</h3>
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

  if (orders.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 800, margin: '2rem auto' }}>
      <h1>Your Orders</h1>
      <div className="card" style={{ padding: '2rem', marginTop: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{order.status}</td>
                <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                <td>
                  <Link to={`/orders/${order.id}`} className="btn btn-outline btn-sm">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders; 