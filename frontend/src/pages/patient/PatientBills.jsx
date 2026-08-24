import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const PatientBills = () => {
  const { user } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Payment Form parameters
  const [activeBill, setActiveBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');

  useEffect(() => {
    if (user?.id) {
      fetchBillsAndPayments();
    }
  }, [user]);

  const fetchBillsAndPayments = async () => {
    setLoading(true);
    try {
      const billsRes = await API.get(`/bills/patient/${user.id}`);
      setBills(billsRes.data);

      const paymentsRes = await API.get(`/payments/patient/${user.id}`);
      setPayments(paymentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!activeBill) return;

    try {
      await API.post('/payments', {
        billId: activeBill.id,
        amount: activeBill.totalAmount,
        paymentMethod
      });
      setToastMsg(`Payment of $${activeBill.totalAmount.toFixed(2)} completed successfully!`);
      setActiveBill(null);
      fetchBillsAndPayments();
    } catch (err) {
      setToastMsg('Payment transaction failed');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <h2 className="fw-bold mb-4">Bills & Payment History</h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {/* Bills List */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm p-4 bg-white h-100">
                  <h5 className="fw-bold mb-3 text-muted">My Invoices</h5>
                  {bills.length === 0 ? (
                    <p className="text-muted small">No invoices generated.</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {bills.map(b => (
                        <div key={b.id} className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="fw-bold mb-1">Invoice #BILL-{b.id}</h6>
                            <span className="text-muted small">Dr. {b.doctorName} &bullet; {b.billDate}</span>
                            <div className="mt-1 small">
                              Consultation: ${b.consultationFee} | Meds: ${b.medicineCharges} | Tests: ${b.testCharges}
                            </div>
                          </div>
                          <div className="text-end">
                            <h5 className="fw-bold text-success mb-1">${b.totalAmount.toFixed(2)}</h5>
                            {b.paymentStatus === 'PENDING' ? (
                              <button className="btn btn-sm btn-primary py-0 px-2" onClick={() => setActiveBill(b)} data-bs-toggle="modal" data-bs-target="#payModal">
                                Pay Now
                              </button>
                            ) : (
                              <span className="badge bg-success">{b.paymentStatus}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Payments Ledger */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm p-4 bg-white h-100">
                  <h5 className="fw-bold mb-3 text-muted">Transaction History</h5>
                  {payments.length === 0 ? (
                    <p className="text-muted small">No transactions completed.</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {payments.map(p => (
                        <div key={p.id} className="list-group-item px-0 py-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-bold text-monospace text-dark small">{p.transactionId}</span>
                            <span className="badge bg-success text-uppercase small">{p.paymentStatus}</span>
                          </div>
                          <div className="d-flex justify-content-between small text-muted">
                            <span>Paid ${p.amount.toFixed(2)} via {p.paymentMethod}</span>
                            <span>{new Date(p.paymentDate).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pay Simulated Modal */}
          <div className="modal fade" id="payModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
              <form onSubmit={handlePay} className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Process Simulated Payment</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-info py-2 small">
                    Simulation Mode: No real banking details are captured. Processing will automatically complete in success status.
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Total Payable Amount</label>
                    <input type="text" className="form-control" disabled value={`$${activeBill?.totalAmount.toFixed(2)}`} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Payment Mode</label>
                    <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <option value="ONLINE">ONLINE / NETBANKING</option>
                      <option value="CARD">CREDIT/DEBIT CARD</option>
                      <option value="UPI">UPI / WALLET</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Submit Transaction</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  );
};

export default PatientBills;
