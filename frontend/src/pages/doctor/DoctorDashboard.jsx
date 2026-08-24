import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      API.get(`/dashboards/doctor/${user.id}`)
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
          <h2 className="fw-bold mb-4">Doctor Dashboard</h2>

          {/* Quick Metrics */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white text-center">
                <i className="bi bi-calendar2-event text-primary fs-1 mb-2"></i>
                <h6 className="text-muted text-uppercase mb-1 small">Today's Appointments</h6>
                <h3 className="fw-bold">{stats.todayAppointmentsCount}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white text-center">
                <i className="bi bi-calendar-check text-success fs-1 mb-2"></i>
                <h6 className="text-muted text-uppercase mb-1 small">Upcoming Confirmed</h6>
                <h3 className="fw-bold">{stats.upcomingAppointmentsCount}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white text-center">
                <i className="bi bi-check-circle text-info fs-1 mb-2"></i>
                <h6 className="text-muted text-uppercase mb-1 small">Completed Consults</h6>
                <h3 className="fw-bold">{stats.completedAppointmentsCount}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white text-center">
                <i className="bi bi-people text-warning fs-1 mb-2"></i>
                <h6 className="text-muted text-uppercase mb-1 small">Total Patients Visited</h6>
                <h3 className="fw-bold">{stats.totalPatientsCount}</h3>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Today's Appointments List */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm p-4 bg-white h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold m-0 text-muted">Today's Appointments</h5>
                  <Link to="/doctor/appointments" className="btn btn-sm btn-outline-primary">View All</Link>
                </div>
                {stats.todayAppointments.length === 0 ? (
                  <div className="alert alert-light text-center py-4 border">No appointments scheduled for today.</div>
                ) : (
                  <div className="list-group list-group-flush">
                    {stats.todayAppointments.map(a => (
                      <div key={a.id} className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold mb-1">{a.patientName}</h6>
                          <small className="text-muted"><i className="bi bi-clock me-1"></i>{a.appointmentTime}</small> &bullet; <small className="text-muted">{a.reason}</small>
                        </div>
                        <span className={`badge bg-${a.status === 'CONFIRMED' ? 'success' : 'warning'}`}>{a.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Medical Records */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm p-4 bg-white h-100">
                <h5 className="fw-bold mb-3 text-muted">Recent Medical Records</h5>
                {stats.recentRecords.length === 0 ? (
                  <div className="alert alert-light text-center py-4 border">No medical histories recorded yet.</div>
                ) : (
                  <div className="list-group list-group-flush">
                    {stats.recentRecords.map(r => (
                      <div key={r.id} className="list-group-item px-0 py-3">
                        <div className="d-flex justify-content-between mb-1">
                          <h6 className="fw-bold mb-0">{r.patientName}</h6>
                          <small className="text-muted">{r.recordDate}</small>
                        </div>
                        <p className="mb-0 text-muted small"><strong>Diagnosis:</strong> {r.diagnosis}</p>
                        <p className="mb-0 text-muted small"><strong>Treatment:</strong> {r.treatment}</p>
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

export default DoctorDashboard;
