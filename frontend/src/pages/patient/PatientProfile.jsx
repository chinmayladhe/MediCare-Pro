import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const PatientProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Form parameters
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    emergencyContact: '',
    medicalHistory: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = () => {
    setLoading(true);
    API.get(`/patients/${user.id}`)
      .then(res => {
        setProfile(res.data);
        setFormData({
          email: res.data.email,
          phone: res.data.phone,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          dateOfBirth: res.data.dateOfBirth,
          gender: res.data.gender,
          bloodGroup: res.data.bloodGroup,
          address: res.data.address || '',
          emergencyContact: res.data.emergencyContact || '',
          medicalHistory: res.data.medicalHistory || ''
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatePayload = {
        username: user.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        medicalHistory: formData.medicalHistory
      };

      await API.put(`/patients/${user.id}`, updatePayload);
      setToastMsg('Profile details updated successfully');
      fetchProfile();
    } catch (err) {
      setToastMsg('Failed to update details');
    }
  };

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
          <h2 className="fw-bold mb-4">Patient Profile Settings</h2>

          <div className="card border-0 shadow-sm p-4 bg-white" style={{ maxWidth: '800px' }}>
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">First Name</label>
                  <input type="text" name="firstName" className="form-control" required value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Last Name</label>
                  <input type="text" name="lastName" className="form-control" required value={formData.lastName} onChange={handleChange} />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Email Address</label>
                  <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Phone Number</label>
                  <input type="text" name="phone" className="form-control" required value={formData.phone} onChange={handleChange} />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Date of Birth</label>
                  <input type="date" name="dateOfBirth" className="form-control" required value={formData.dateOfBirth} onChange={handleChange} />
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
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Address</label>
                <input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Emergency Contact</label>
                <input type="text" name="emergencyContact" className="form-control" value={formData.emergencyContact} onChange={handleChange} />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">Medical History / Allergies</label>
                <textarea name="medicalHistory" className="form-control" rows="3" value={formData.medicalHistory} onChange={handleChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary px-4">Update Profile</button>
            </form>
          </div>
        </div>
      </div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  );
};

export default PatientProfile;
