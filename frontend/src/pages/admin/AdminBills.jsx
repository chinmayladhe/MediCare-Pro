import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import Toast from '../../components/Toast';

const AdminBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  // Form state to generate bill
  const [formData, setFormData] = useState({
    appointmentId: '',
    consultationFee: 0,
    medicineCharges: 0,
    testCharges: 0,
    otherCharges: 0,
    discount: 0,
    tax: 0,
    billDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchBills();
    fetchUnbilledAppointments();
  }, []);

  const fetchBills = () => {
    setLoading(true);
    API.get('/bills', { params: { size: 50 } })
      .then(res => setBills(res.data.content))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchUnbilledAppointments = () => {
    // Fetch all confirmed/completed appointments to generate bill for
    API.get('/appointments', { params: { size: 100 } })
      .then(res => {
        // filter completed appointments to list
        const filtered = res.data.content.filter(a => a.status === 'COMPLETED');
        setAppointments(filtered);
        if (filtered.length > 0) {
          setFormData(prev => ({ ...prev, appointmentId: filtered[0].id }));
        }
      });
  };

  const handleSelectAppointment = (e) => {
    const id = e.target.value;
    const selected = appointments.find(a => a.id === parseInt(id));
    if (selected) {
      // Pre-fill doctor consultation fee (e.g. mock consultation charge)
      setFormData(prev => ({
        ...prev,
        appointmentId: id,
        consultationFee: 500.0 // Standard charge or fetch doctor details
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selected = appointments.find(a => a.id === parseInt(formData.appointmentId));
    if (!selected) return;

    const requestBody = {
      patientId: selected.patientId,
      doctorId: selected.doctorId,
      appointmentId: selected.id,
      consultationFee: parseFloat(formData.consultationFee),
      medicineCharges: parseFloat(formData.medicineCharges),
      testCharges: parseFloat(formData.testCharges),
      otherCharges: parseFloat(formData.otherCharges),
      discount: parseFloat(formData.discount),
      tax: parseFloat(formData.tax),
      billDate: formData.billDate
    };

    try {
      await API.post('/bills', requestBody);
      setToastMsg('Bill generated successfully');
      fetchBills();
    } catch (err) {
      setToastMsg('Failed to generate bill');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold m-0">Billing Ledger</h2>
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#billModal" disabled={appointments.length === 0}>
              <i className="bi bi-file-earmark-medical me-1"></i> Generate Bill
            </button>
          </div>

          {appointments.length === 0 && (
            <div className="alert alert-info text-center py-2 mb-4 small">
              No COMPLETED appointments available to bill. (Doctor must mark appointments as COMPLETED first).
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : bills.length === 0 ? (
            <div className="alert alert-warning text-center py-4">No billing records found.</div>
          ) : (
            <div className="card border-0 shadow-sm overflow-hidden bg-white">
              <table className="table align-middle mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>Bill ID</th>
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>Total Amount</th>
                    <th>Payment Status</th>
                    <th>Bill Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map(b => (
                    <tr key={b.id}>
                      <td className="fw-bold">#BILL-{b.id}</td>
                      <td>{b.patientName}</td>
                      <td>Dr. {b.doctorName}</td>
                      <td className="fw-bold text-success">${b.totalAmount.toFixed(2)}</td>
                      <td>
                        <span className={`badge bg-${b.paymentStatus === 'PAID' ? 'success' : 'warning'}`}>{b.paymentStatus}</span>
                      </td>
                      <td>{b.billDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Generate Bill Modal */}
          <div className="modal fade" id="billModal" tabIndex="-1" aria-labelledby="billModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <form onSubmit={handleSubmit} className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Generate Invoice</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Select Appointment</label>
                    <select className="form-select" value={formData.appointmentId} onChange={handleSelectAppointment}>
                      {appointments.map(a => (
                        <option key={a.id} value={a.id}>{a.patientName} - {a.appointmentDate} ({a.reason})</option>
                      ))}
                    </select>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Consultation Fee ($)</label>
                      <input type="number" className="form-control" value={formData.consultationFee} onChange={(e) => setFormData({...formData, consultationFee: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Medicine Charges ($)</label>
                      <input type="number" className="form-control" value={formData.medicineCharges} onChange={(e) => setFormData({...formData, medicineCharges: e.target.value})} />
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Test Charges ($)</label>
                      <input type="number" className="form-control" value={formData.testCharges} onChange={(e) => setFormData({...formData, testCharges: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Other Charges ($)</label>
                      <input type="number" className="form-control" value={formData.otherCharges} onChange={(e) => setFormData({...formData, otherCharges: e.target.value})} />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Discount ($)</label>
                      <input type="number" className="form-control" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Tax ($)</label>
                      <input type="number" className="form-control" value={formData.tax} onChange={(e) => setFormData({...formData, tax: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Generate Bill</button>
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

export default AdminBills;
