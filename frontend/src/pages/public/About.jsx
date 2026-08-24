import React from 'react';
import Navbar from '../../components/Navbar';

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <div className="row align-items-center mb-5">
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">About <span className="text-primary">MediCare Pro</span></h2>
            <p className="lead">We are committed to delivering premium digital health ecosystems that facilitate seamless integrations between clinic coordinators, practitioner professionals, and patient wellness tracking.</p>
            <p className="text-muted">Built upon clinical-grade security paradigms, our cloud platform offers zero-friction booking pipelines, live health summaries, and robust invoicing solutions.</p>
          </div>
          <div className="col-md-6 text-center">
            <i className="bi bi-shield-plus text-primary" style={{ fontSize: '12rem' }}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
