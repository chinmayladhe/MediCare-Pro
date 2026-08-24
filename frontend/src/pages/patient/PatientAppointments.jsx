import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const PatientAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = () => {
    setLoading(true);
    API.get('/appointments', {
      params: {
        patientId: user.id,
        size: 50
      }
    })
      .then(res => setAppointments(res.data.content))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment request?')) {
      try {
        await API.put(`/appointments/${id}/status`, null, {
          params: { status: 'CANCELLED' }
        });
        setToastMsg('Appointment cancelled successfully');
        fetchAppointments();
      } catch (err) {
        setToastMsg('Failed to cancel appointment');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <h2 className="fw-bold mb-4">My Booked Appointments</h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="alert alert-warning text-center py-4">No appointments booked yet.</div>
          ) : (
            <div className="card border-0 shadow-sm overflow-hidden bg-white">
              <table className="table align-middle mb-0">
                <thead className="bg-dark text-white">
                  <tr>
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
                      <td className="fw-bold">Dr. {a.doctorName}</td>
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
                        {(a.status === 'PENDING' || a.status === 'CONFIRMED') ? (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancel(a.id)}>
                            Cancel Appointment
                          </button>
                        ) : (
                          <span className="text-muted small">No action</span>
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

export default PatientAppointments;
