import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'ROLE_ADMIN') return '/admin';
    if (user.role === 'ROLE_DOCTOR') return '/doctor';
    return '/patient';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-heart-pulse-fill text-danger me-2 fs-3"></i>
          <span className="fw-bold tracking-tight">
            <span className="text-white">Medi</span><span className="text-danger">Care</span><span className="text-info ms-1 fw-light">Pro</span>
          </span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/doctors">Our Doctors</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/departments">Departments</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About Us</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">Contact</NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <Link to={getDashboardLink()} className="btn btn-outline-info btn-sm">
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard ({user.firstName})
                </Link>
                <button onClick={handleLogout} className="btn btn-danger btn-sm">
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm px-3">Login</Link>
                <Link to="/register" className="btn btn-danger btn-sm px-3">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
