import React from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <section className="bg-primary text-white text-center py-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-md-6 text-start">
              <h1 className="display-4 fw-bold mb-3"><span className="text-warning">MediCare</span> Pro</h1>
              <p className="lead mb-2 text-white-50 fw-semibold text-uppercase" style={{ letterSpacing: '2px', fontSize: '0.85rem' }}>Advanced Healthcare Management</p>
              <p className="lead mb-4">Book consultations with top medical experts, manage prescriptions, view your complete history, and access medical records securely online.</p>
              <div className="d-flex gap-3">
                <Link to="/register" className="btn btn-warning btn-lg px-4 shadow">Get Started</Link>
                <Link to="/doctors" className="btn btn-outline-light btn-lg px-4">Find a Doctor</Link>
              </div>
            </div>
            <div className="col-md-6 d-none d-md-block text-center">
              <i className="bi bi-heart-pulse text-white" style={{ fontSize: '10rem', opacity: 0.85 }}></i>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-5">Our Key Medical Services</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="text-primary mb-3">
                <i className="bi bi-calendar2-check-fill fs-1"></i>
              </div>
              <h4 className="fw-bold">Easy Appointments</h4>
              <p className="text-muted">Schedule consults instantly with your doctor. Select convenient dates and time-slots without hassle.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="text-success mb-3">
                <i className="bi bi-file-medical-fill fs-1"></i>
              </div>
              <h4 className="fw-bold">Electronic Health Records</h4>
              <p className="text-muted">Access diagnoses, medication list, test results, and notes securely from any device at any time.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm text-center p-4">
              <div className="text-danger mb-3">
                <i className="bi bi-credit-card-2-back-fill fs-1"></i>
              </div>
              <h4 className="fw-bold">Instant Billing & Payment</h4>
              <p className="text-muted">Check out transparent digital invoices, pay online securely via simulated methods, and view payment history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-light py-5 border-top border-bottom">
        <div className="container text-center">
          <div className="row g-4">
            <div className="col-md-3 col-6">
              <h2 className="fw-bold text-primary mb-0">15k+</h2>
              <span className="text-muted">Happy Patients</span>
            </div>
            <div className="col-md-3 col-6">
              <h2 className="fw-bold text-primary mb-0">120+</h2>
              <span className="text-muted">Doctor Experts</span>
            </div>
            <div className="col-md-3 col-6">
              <h2 className="fw-bold text-primary mb-0">8+</h2>
              <span className="text-muted">Specialty Departments</span>
            </div>
            <div className="col-md-3 col-6">
              <h2 className="fw-bold text-primary mb-0">99.8%</h2>
              <span className="text-muted">Customer Trust</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-1">&copy; 2026 <strong>MediCare Pro</strong>. All rights reserved.</p>
          <span className="text-muted small">Secure Healthcare Platform &bullet; HIPAA Compliant Storage Simulation</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
