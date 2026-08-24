import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/payments', { params: { size: 50 } })
      .then(res => setPayments(res.data.content))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <h2 className="fw-bold mb-4">Patient Payment Audit</h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : payments.length === 0 ? (
            <div className="alert alert-warning text-center py-4">No payment audits found.</div>
          ) : (
            <div className="card border-0 shadow-sm overflow-hidden bg-white">
              <table className="table align-middle mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>Transaction ID</th>
                    <th>Invoice ID</th>
                    <th>Patient Name</th>
                    <th>Payment Method</th>
                    <th>Paid Amount</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td className="fw-bold text-monospace">{p.transactionId}</td>
                      <td>#BILL-{p.billId}</td>
                      <td>{p.patientName}</td>
                      <td>{p.paymentMethod}</td>
                      <td className="fw-bold text-success">${p.amount.toFixed(2)}</td>
                      <td>{new Date(p.paymentDate).toLocaleString()}</td>
                      <td>
                        <span className="badge bg-success">{p.paymentStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
