import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      API.get(`/dashboards/patient/${user.id}`)
        .then(res => setStats(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <h2 className="fw-bold mb-4">Patient Dashboard</h2>

          {/* Quick Metrics */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white text-center">
                <i className="bi bi-calendar2-heart text-primary fs-1 mb-2"></i>
                <h6 className="text-muted text-uppercase mb-1 small">Appointments Booked</h6>
                <h3 className="fw-bold">{stats.totalAppointments}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white text-center">
                <i className="bi bi-people-fill text-success fs-1 mb-2"></i>
                <h6 className="text-muted text-uppercase mb-1 small">Doctors Visited</h6>
                <h3 className="fw-bold">{stats.totalDoctorsVisited}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white text-center">
                <i className="bi bi-file-earmark-medical text-info fs-1 mb-2"></i>
                <h6 className="text-muted text-uppercase mb-1 small">Medical Records</h6>
                <h3 className="fw-bold">{stats.totalMedicalRecords}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white text-center">
                <i className="bi bi-cash-stack text-danger fs-1 mb-2"></i>
                <h6 className="text-muted text-uppercase mb-1 small">Pending Bills ($)</h6>
                <h3 className="fw-bold text-danger">${stats.pendingBillsAmount.toFixed(2)}</h3>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            {/* Upcoming Appointment */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm p-4 bg-white h-100">
                <h5 className="fw-bold mb-3 text-muted">Upcoming Appointment</h5>
                {stats.upcomingAppointment ? (
                  <div className="p-3 border rounded bg-light">
                    <div className="d-flex justify-content-between mb-2">
                      <h6 className="fw-bold text-primary mb-0">Dr. {stats.upcomingAppointment.doctorName}</h6>
                      <span className="badge bg-warning">{stats.upcomingAppointment.status}</span>
                    </div>
                    <p className="mb-1 small"><strong>Date:</strong> {stats.upcomingAppointment.appointmentDate}</p>
                    <p className="mb-1 small"><strong>Time:</strong> {stats.upcomingAppointment.appointmentTime}</p>
                    <p className="mb-0 small"><strong>Reason:</strong> {stats.upcomingAppointment.reason}</p>
                  </div>
                ) : (
                  <div className="text-center py-4 border border-dashed rounded bg-light">
                    <p className="text-muted small mb-3">No upcoming appointments booked.</p>
                    <Link to="/patient/find-doctor" className="btn btn-sm btn-primary">Book Consult</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm p-4 bg-white h-100">
                <h5 className="fw-bold mb-3 text-muted">Recent Booking History</h5>
                {stats.recentAppointments.length === 0 ? (
                  <p className="text-muted small text-center py-4">No appointments recorded.</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {stats.recentAppointments.map(a => (
                      <div key={a.id} className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold mb-0 small">Dr. {a.doctorName}</h6>
                          <small className="text-muted">{a.appointmentDate} at {a.appointmentTime}</small>
                        </div>
                        <span className={`badge bg-${a.status === 'CONFIRMED' ? 'success' : a.status === 'PENDING' ? 'warning' : 'secondary'}`}>{a.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
