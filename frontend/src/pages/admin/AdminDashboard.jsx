import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';

// Chart.js imports
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboards/admin')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  // Pre-configured chart structures
  const appointmentsChartData = {
    labels: Object.keys(stats.monthlyAppointments || {}),
    datasets: [{
      label: 'Monthly Appointments',
      data: Object.values(stats.monthlyAppointments || {}),
      borderColor: 'rgb(13, 110, 253)',
      backgroundColor: 'rgba(13, 110, 253, 0.1)',
      fill: true
    }]
  };

  const revenueChartData = {
    labels: Object.keys(stats.monthlyRevenue || {}),
    datasets: [{
      label: 'Revenue ($)',
      data: Object.values(stats.monthlyRevenue || {}),
      backgroundColor: 'rgb(25, 135, 84)'
    }]
  };

  const registrationsChartData = {
    labels: Object.keys(stats.patientRegistrations || {}),
    datasets: [{
      label: 'Patient Registrations',
      data: Object.values(stats.patientRegistrations || {}),
      borderColor: 'rgb(220, 53, 69)',
      backgroundColor: 'rgba(220, 53, 69, 0.1)',
      fill: true
    }]
  };

  const breakdownData = {
    labels: Object.keys(stats.appointmentStatusBreakdown || {}),
    datasets: [{
      data: Object.values(stats.appointmentStatusBreakdown || {}),
      backgroundColor: ['#ffc107', '#0dcaf0', '#198754', '#dc3545']
    }]
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <h2 className="fw-bold mb-4">Admin Dashboard Metrics</h2>

          {/* Cards Row */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white text-center">
                <i className="bi bi-people text-primary fs-1 mb-2"></i>
                <h6 className="text-muted text-uppercase mb-1 small">Total Patients</h6>
                <h3 className="fw-bold">{stats.totalPatients}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white text-center">
                <i className="bi bi-person-badge text-success fs-1 mb-2"></i>
                <h6 className="text-muted text-uppercase mb-1 small">Total Doctors</h6>
                <h3 className="fw-bold">{stats.totalDoctors}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white text-center">
                <i className="bi bi-calendar2-check text-info fs-1 mb-2"></i>
                <h6 className="text-muted text-uppercase mb-1 small">Appointments</h6>
                <h3 className="fw-bold">{stats.totalAppointments}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-3 bg-white text-center">
                <i className="bi bi-cash-stack text-warning fs-1 mb-2"></i>
                <h6 className="text-muted text-uppercase mb-1 small">Total Revenue</h6>
                <h3 className="fw-bold text-success">${stats.totalRevenue}</h3>
              </div>
            </div>
          </div>

          {/* Charts grid */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm p-3 bg-white">
                <h6 className="fw-bold mb-3 text-muted">Monthly Appointment Progression</h6>
                <div style={{ height: '240px' }}><Line data={appointmentsChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm p-3 bg-white">
                <h6 className="fw-bold mb-3 text-muted">Revenue Statistics</h6>
                <div style={{ height: '240px' }}><Bar data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm p-3 bg-white">
                <h6 className="fw-bold mb-3 text-muted">Patient Growth</h6>
                <div style={{ height: '240px' }}><Line data={registrationsChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm p-3 bg-white">
                <h6 className="fw-bold mb-3 text-muted">Appointment Statuses</h6>
                <div style={{ height: '240px' }}><Pie data={breakdownData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
