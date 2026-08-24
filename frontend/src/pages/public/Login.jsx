import React, { useState, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const ROLE_PRESETS = {
  '': { username: '', password: '' },
  ADMIN: { username: 'admin', password: 'admin123' },
  DOCTOR: { username: 'drsmith', password: 'doctor123' },
  PATIENT: { username: 'patient', password: 'patient123' },
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('sessionExpired');

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    const preset = ROLE_PRESETS[role];
    setUsername(preset.username);
    setPassword(preset.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(username, password);
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (user.role === 'ROLE_DOCTOR') {
        navigate('/doctor');
      } else {
        navigate('/patient');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 50%, #e8f0fe 100%)' }}>
      <Navbar />
      <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <div className="card border-0 shadow-lg p-4 w-100" style={{ maxWidth: '420px', borderRadius: '16px' }}>

          {/* Header */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle mb-3"
              style={{ width: '56px', height: '56px' }}>
              <i className="bi bi-heart-pulse-fill text-white fs-4"></i>
            </div>
            <h4 className="fw-bold mb-1">Welcome Back</h4>
            <p className="text-muted small mb-0">Sign in to your <strong>MediCare Pro</strong> account</p>
          </div>

          {sessionExpired && (
            <div className="alert alert-warning text-center small py-2 mb-3">
              <i className="bi bi-exclamation-triangle me-1"></i>
              Your session has expired. Please log in again.
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center small py-2 mb-3">
              <i className="bi bi-x-circle me-1"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Role Dropdown */}
            <div className="mb-3">
              <label className="form-label small fw-bold">
                <i className="bi bi-person-badge me-1 text-primary"></i>Login As
              </label>
              <select
                className="form-select"
                value={selectedRole}
                onChange={handleRoleChange}
                id="loginRoleSelect"
              >
                <option value="">— Select your role —</option>
                <option value="PATIENT">🧑‍⚕️ Patient</option>
                <option value="DOCTOR">👨‍⚕️ Doctor</option>
                <option value="ADMIN">🛡️ Administrator</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">
                <i className="bi bi-person me-1 text-primary"></i>Username
              </label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="loginUsername"
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">
                <i className="bi bi-lock me-1 text-primary"></i>Password
              </label>
              <input
                type="password"
                className="form-control"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="loginPassword"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3 py-2 fw-semibold"
              disabled={loading}
              id="loginSubmitBtn"
            >
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</>
                : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
              }
            </button>

            <div className="text-center small text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
