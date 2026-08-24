import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const DoctorProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Edit fields
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    availableDays: '',
    availableTime: '',
    licenseNumber: '',
    departmentId: '',
    password: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
      API.get('/departments').then(res => setDepartments(res.data));
    }
  }, [user]);

  const fetchProfile = () => {
    setLoading(true);
    API.get(`/doctors/${user.id}`)
      .then(res => {
        setProfile(res.data);
        setFormData({
          email: res.data.email,
          phone: res.data.phone,
          specialization: res.data.specialization,
          qualification: res.data.qualification,
          experience: res.data.experience,
          consultationFee: res.data.consultationFee,
          availableDays: res.data.availableDays,
          availableTime: res.data.availableTime,
          licenseNumber: res.data.licenseNumber,
          departmentId: res.data.departmentId || '',
          password: ''
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
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: formData.phone,
        specialization: formData.specialization,
        qualification: formData.qualification,
        experience: parseInt(formData.experience),
        consultationFee: parseFloat(formData.consultationFee),
        availableDays: formData.availableDays,
        availableTime: formData.availableTime,
        licenseNumber: formData.licenseNumber,
        departmentId: parseInt(formData.departmentId),
        password: formData.password || undefined
      };

      await API.put(`/doctors/${user.id}`, updatePayload);
      setToastMsg('Profile details updated successfully');
      fetchProfile();
    } catch (err) {
      setToastMsg('Failed to update profile details');
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
          <h2 className="fw-bold mb-4">Practitioner Profile Settings</h2>

          <div className="card border-0 shadow-sm p-4 bg-white" style={{ maxWidth: '800px' }}>
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">First Name</label>
                  <input type="text" className="form-control" disabled value={profile?.firstName || ''} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Last Name</label>
                  <input type="text" className="form-control" disabled value={profile?.lastName || ''} />
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
                  <label className="form-label small fw-bold">Department</label>
                  <select name="departmentId" className="form-select" value={formData.departmentId} onChange={handleChange}>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Specialization</label>
                  <input type="text" name="specialization" className="form-control" required value={formData.specialization} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">License Number</label>
                  <input type="text" name="licenseNumber" className="form-control" required value={formData.licenseNumber} onChange={handleChange} />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Qualification</label>
                  <input type="text" name="qualification" className="form-control" required value={formData.qualification} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Experience (Years)</label>
                  <input type="number" name="experience" className="form-control" required value={formData.experience} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Consultation Fee ($)</label>
                  <input type="number" name="consultationFee" className="form-control" required value={formData.consultationFee} onChange={handleChange} />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Available Days</label>
                  <input type="text" name="availableDays" className="form-control" required value={formData.availableDays} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Available Time</label>
                  <input type="text" name="availableTime" className="form-control" required value={formData.availableTime} onChange={handleChange} />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">Reset Password (Leave blank to keep current)</label>
                <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} />
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

export default DoctorProfile;
