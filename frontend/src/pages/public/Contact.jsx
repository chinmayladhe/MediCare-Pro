import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Toast from '../../components/Toast';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setToastMsg('Message sent successfully! Our customer support representative will get back to you shortly.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5" style={{ maxWidth: '600px' }}>
        <h2 className="fw-bold mb-4 text-center">Contact Support</h2>
        <div className="card border-0 shadow-sm p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows="5" required value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">Send Message</button>
          </form>
        </div>
        <Toast message={toastMsg} onClose={() => setToastMsg('')} />
      </div>
    </div>
  );
};

export default Contact;
