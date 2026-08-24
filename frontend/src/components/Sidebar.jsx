import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="bg-dark text-white p-3 flex-shrink-0" style={{ width: '260px', minHeight: 'calc(100vh - 56px)' }}>
      <div className="text-center py-3 border-bottom border-secondary mb-3">
        <i className="bi bi-person-circle fs-1 text-info"></i>
        <h5 className="mt-2 mb-0 text-truncate">{user.firstName} {user.lastName}</h5>
        <span className="badge bg-secondary text-uppercase">{user.role.replace('ROLE_', '')}</span>
      </div>

      <ul className="nav nav-pills flex-column mb-auto gap-1">
        {/* Admin Dashboard Sidebars */}
        {user.role === 'ROLE_ADMIN' && (
          <>
            <li className="nav-item">
              <NavLink to="/admin" end className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-speedometer2"></i> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/doctors" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-person-badge"></i> Doctors
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/patients" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-people"></i> Patients
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/departments" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-building"></i> Departments
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/appointments" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-calendar-event"></i> Appointments
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/bills" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-receipt"></i> Bills
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/payments" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-cash-stack"></i> Payments
              </NavLink>
            </li>
          </>
        )}

        {/* Doctor Dashboard Sidebars */}
        {user.role === 'ROLE_DOCTOR' && (
          <>
            <li className="nav-item">
              <NavLink to="/doctor" end className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-speedometer2"></i> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/doctor/appointments" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-calendar-check"></i> My Appointments
              </NavLink>
            </li>
            <li>
              <NavLink to="/doctor/patients" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-people"></i> Patients List
              </NavLink>
            </li>
            <li>
              <NavLink to="/doctor/profile" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-person-card-chest"></i> My Profile
              </NavLink>
            </li>
          </>
        )}

        {/* Patient Dashboard Sidebars */}
        {user.role === 'ROLE_PATIENT' && (
          <>
            <li className="nav-item">
              <NavLink to="/patient" end className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-speedometer2"></i> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/patient/find-doctor" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-search"></i> Book Appointment
              </NavLink>
            </li>
            <li>
              <NavLink to="/patient/appointments" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-calendar-event"></i> My Appointments
              </NavLink>
            </li>
            <li>
              <NavLink to="/patient/records" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-file-medical"></i> Medical Records
              </NavLink>
            </li>
            <li>
              <NavLink to="/patient/prescriptions" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-prescription"></i> Prescriptions
              </NavLink>
            </li>
            <li>
              <NavLink to="/patient/bills" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-receipt"></i> Bills & Payments
              </NavLink>
            </li>
            <li>
              <NavLink to="/patient/profile" className="nav-link text-white d-flex align-items-center gap-2">
                <i className="bi bi-person-fill-gear"></i> My Profile
              </NavLink>
            </li>
          </>
        )}

        <li className="mt-4 pt-3 border-top border-secondary">
          <button onClick={handleLogout} className="btn btn-outline-danger w-100 btn-sm d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-box-arrow-right"></i> Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
