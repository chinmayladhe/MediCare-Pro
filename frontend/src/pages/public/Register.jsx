import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import Navbar from '../../components/Navbar';

const Register = () => {
  const [role, setRole] = useState('PATIENT'); // PATIENT or DOCTOR
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Common
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    // Patient-specific
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    // Doctor-specific
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    licenseNumber: '',
    availableDays: '',
    availableTime: '',
    departmentId: '',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const { registerPatient } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/departments').then(res => setDepartments(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setErrors({});
    setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setLoading(true);

    try {
      if (role === 'PATIENT') {
        await registerPatient(formData);
        navigate('/patient');
      } else {
        // Doctor registration via admin-like API
        const doctorPayload = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          specialization: formData.specialization,
          qualification: formData.qualification,
          experience: parseInt(formData.experience) || 0,
          consultationFee: parseFloat(formData.consultationFee) || 0,
          licenseNumber: formData.licenseNumber,
          availableDays: formData.availableDays,
          availableTime: formData.availableTime,
          departmentId: parseInt(formData.departmentId) || null,
        };
        await API.post('/doctors/register', doctorPayload);
        navigate('/login');
      }
    } catch (err) {
      if (err?.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err?.response?.data?.message) {
        setGeneralError(err.response.data.message);
      } else if (typeof err === 'object' && !err.response) {
        setErrors(err);
      } else {
        setGeneralError('Registration failed. Please check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 50%, #e8f0fe 100%)' }}>
      <Navbar />
      <div className="container py-5 d-flex justify-content-center">
        <div className="card border-0 shadow-lg p-4 w-100" style={{ maxWidth: '640px', borderRadius: '16px' }}>

          {/* Header */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-success rounded-circle mb-3"
              style={{ width: '56px', height: '56px' }}>
              <i className="bi bi-person-plus-fill text-white fs-4"></i>
            </div>
            <h4 className="fw-bold mb-1">Create Account</h4>
            <p className="text-muted small mb-0">Join the <strong>MediCare Pro</strong> platform</p>
          </div>

          {generalError && (
            <div className="alert alert-danger text-center small py-2 mb-3">
              <i className="bi bi-x-circle me-1"></i>{generalError}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Role Selector */}
            <div className="mb-4">
              <label className="form-label small fw-bold">
                <i className="bi bi-person-badge me-1 text-success"></i>Register As
              </label>
              <div className="d-flex gap-3">
                <div
                  className={`flex-fill border rounded-3 p-3 text-center cursor-pointer ${role === 'PATIENT' ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary-subtle'}`}
                  onClick={() => setRole('PATIENT')}
                  style={{ cursor: 'pointer' }}
                  id="rolePatientCard"
                >
                  <i className={`bi bi-person-heart fs-2 d-block mb-1 ${role === 'PATIENT' ? 'text-primary' : 'text-muted'}`}></i>
                  <span className={`fw-semibold small ${role === 'PATIENT' ? 'text-primary' : 'text-muted'}`}>Patient</span>
                  {role === 'PATIENT' && <div><span className="badge bg-primary mt-1" style={{ fontSize: '10px' }}>Selected</span></div>}
                </div>
                <div
                  className={`flex-fill border rounded-3 p-3 text-center cursor-pointer ${role === 'DOCTOR' ? 'border-success bg-success bg-opacity-10' : 'border-secondary-subtle'}`}
                  onClick={() => setRole('DOCTOR')}
                  style={{ cursor: 'pointer' }}
                  id="roleDoctorCard"
                >
                  <i className={`bi bi-hospital fs-2 d-block mb-1 ${role === 'DOCTOR' ? 'text-success' : 'text-muted'}`}></i>
                  <span className={`fw-semibold small ${role === 'DOCTOR' ? 'text-success' : 'text-muted'}`}>Doctor</span>
                  {role === 'DOCTOR' && <div><span className="badge bg-success mt-1" style={{ fontSize: '10px' }}>Selected</span></div>}
                </div>
              </div>
            </div>

            {/* ── Common Fields ── */}
            <p className="fw-bold small text-muted border-bottom pb-1 mb-3">
              <i className="bi bi-info-circle me-1"></i>Account Details
            </p>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">First Name</label>
                <input type="text" name="firstName"
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  value={formData.firstName} onChange={handleChange} required
                  placeholder="John" />
                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Last Name</label>
                <input type="text" name="lastName"
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  value={formData.lastName} onChange={handleChange} required
                  placeholder="Doe" />
                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Username</label>
                <input type="text" name="username"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  value={formData.username} onChange={handleChange} required
                  placeholder="johndoe123" />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Password</label>
                <input type="password" name="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  value={formData.password} onChange={handleChange} required
                  placeholder="Min. 6 characters" />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Email Address</label>
                <input type="email" name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={formData.email} onChange={handleChange} required
                  placeholder="john@example.com" />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Phone Number</label>
                <input type="text" name="phone"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  value={formData.phone} onChange={handleChange} required
                  placeholder="10-digit mobile number" />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
            </div>

            {/* ── Patient-specific Fields ── */}
            {role === 'PATIENT' && (
              <>
                <p className="fw-bold small text-muted border-bottom pb-1 mb-3 mt-2">
                  <i className="bi bi-person-heart me-1"></i>Medical Profile
                </p>

                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Date of Birth</label>
                    <input type="date" name="dateOfBirth"
                      className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                      value={formData.dateOfBirth} onChange={handleChange} required />
                    {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Gender</label>
                    <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Blood Group</label>
                    <select name="bloodGroup" className="form-select" value={formData.bloodGroup} onChange={handleChange}>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Address</label>
                  <input type="text" name="address" className="form-control"
                    value={formData.address} onChange={handleChange}
                    placeholder="Your current address" />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Emergency Contact (Name & Phone)</label>
                  <input type="text" name="emergencyContact" className="form-control"
                    value={formData.emergencyContact} onChange={handleChange}
                    placeholder="e.g. Jane Doe - 9876543210" />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Medical History / Allergies</label>
                  <textarea name="medicalHistory" className="form-control" rows="2"
                    value={formData.medicalHistory} onChange={handleChange}
                    placeholder="e.g. Mild asthma, penicillin allergy..."></textarea>
                </div>
              </>
            )}

            {/* ── Doctor-specific Fields ── */}
            {role === 'DOCTOR' && (
              <>
                <p className="fw-bold small text-muted border-bottom pb-1 mb-3 mt-2">
                  <i className="bi bi-hospital me-1"></i>Professional Details
                </p>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Department</label>
                    <select name="departmentId" className="form-select" value={formData.departmentId} onChange={handleChange} required>
                      <option value="">— Select Department —</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Specialization</label>
                    <input type="text" name="specialization" className="form-control"
                      value={formData.specialization} onChange={handleChange} required
                      placeholder="e.g. Cardiologist" />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Qualification</label>
                    <input type="text" name="qualification" className="form-control"
                      value={formData.qualification} onChange={handleChange} required
                      placeholder="e.g. MBBS, MD" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">License Number</label>
                    <input type="text" name="licenseNumber" className="form-control"
                      value={formData.licenseNumber} onChange={handleChange} required
                      placeholder="e.g. LIC-12345" />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Experience (Years)</label>
                    <input type="number" name="experience" className="form-control" min="0"
                      value={formData.experience} onChange={handleChange} required
                      placeholder="5" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Consultation Fee ($)</label>
                    <input type="number" name="consultationFee" className="form-control" min="0"
                      value={formData.consultationFee} onChange={handleChange} required
                      placeholder="500" />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Available Days</label>
                    <input type="text" name="availableDays" className="form-control"
                      value={formData.availableDays} onChange={handleChange} required
                      placeholder="e.g. Monday,Wednesday,Friday" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Available Time</label>
                    <input type="text" name="availableTime" className="form-control"
                      value={formData.availableTime} onChange={handleChange} required
                      placeholder="e.g. 09:00-13:00" />
                  </div>
                </div>

                <div className="alert alert-info small py-2 mb-3">
                  <i className="bi bi-info-circle me-1"></i>
                  Doctor accounts require <strong>admin approval</strong> before they can log in.
                </div>
              </>
            )}

            <button
              type="submit"
              className={`btn w-100 mb-3 py-2 fw-semibold ${role === 'DOCTOR' ? 'btn-success' : 'btn-primary'}`}
              disabled={loading}
              id="registerSubmitBtn"
            >
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Registering...</>
                : <><i className="bi bi-person-check me-2"></i>Register as {role === 'DOCTOR' ? 'Doctor' : 'Patient'}</>
              }
            </button>

            <div className="text-center small text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
