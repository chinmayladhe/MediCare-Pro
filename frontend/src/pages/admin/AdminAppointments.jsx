import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import Toast from '../../components/Toast';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = () => {
    setLoading(true);
    API.get('/appointments', {
      params: {
        status: statusFilter || undefined,
        size: 50
      }
    })
      .then(res => setAppointments(res.data.content))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, null, {
        params: { status }
      });
      setToastMsg(`Appointment ${status.toLowerCase()} successfully`);
      fetchAppointments();
    } catch (err) {
      setToastMsg('Failed to update status');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold m-0">Appointment Bookings</h2>
            <div style={{ width: '220px' }}>
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Appointments</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="alert alert-warning text-center py-4">No appointment bookings found.</div>
          ) : (
            <div className="card border-0 shadow-sm overflow-hidden bg-white">
              <table className="table align-middle mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id}>
                      <td className="fw-bold">{a.patientName}</td>
                      <td>Dr. {a.doctorName} <br/> <small className="text-muted">{a.doctorSpecialization}</small></td>
                      <td>{a.appointmentDate} <br/> <small className="text-muted">{a.appointmentTime}</small></td>
                      <td>{a.reason}</td>
                      <td>
                        <span className={`badge bg-${
                          a.status === 'CONFIRMED' ? 'success' :
                          a.status === 'PENDING' ? 'warning' :
                          a.status === 'COMPLETED' ? 'primary' : 'danger'
                        }`}>{a.status}</span>
                      </td>
                      <td>
                        {a.status === 'PENDING' && (
                          <>
                            <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdateStatus(a.id, 'CONFIRMED')}>Approve</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleUpdateStatus(a.id, 'REJECTED')}>Reject</button>
                          </>
                        )}
                        {a.status === 'CONFIRMED' && (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleUpdateStatus(a.id, 'CANCELLED')}>Cancel</button>
                        )}
                        {(a.status === 'CANCELLED' || a.status === 'REJECTED' || a.status === 'COMPLETED') && (
                          <span className="text-muted small">No action needed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  );
};

export default AdminAppointments;
