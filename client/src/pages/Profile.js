import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>You are not logged in</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>Profile</h1>
      <div className="card" style={{ padding: '2rem', marginTop: '2rem' }}>
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
};

export default Profile; 