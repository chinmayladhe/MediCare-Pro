import React from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div>
      <Navbar />
      <div className="container py-5 text-center">
        <div className="py-5">
          <i className="bi bi-shield-lock-fill text-danger" style={{ fontSize: '6rem' }}></i>
          <h2 className="fw-bold mt-4">Access Denied / Unauthorized</h2>
          <p className="lead text-muted mb-4">You do not have the required permissions to access this dashboard page.</p>
          <Link to="/" className="btn btn-primary">Go to Home Page</Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
