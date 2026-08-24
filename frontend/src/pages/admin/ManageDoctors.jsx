import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import Toast from '../../components/Toast';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  // Form states for Add/Edit Doctor modal
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    availableDays: 'Monday,Wednesday,Friday',
    availableTime: '09:00-13:00',
    licenseNumber: '',
    status: 'ACTIVE',
    departmentId: ''
  });

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const fetchDoctors = () => {
    setLoading(true);
    API.get('/doctors', { params: { size: 50 } })
      .then(res => setDoctors(res.data.content))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchDepartments = () => {
    API.get('/departments')
      .then(res => {
        setDepartments(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, departmentId: res.data[0].id }));
        }
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/doctors/${editId}`, formData);
        setToastMsg('Doctor updated successfully');
      } else {
        await API.post('/doctors', formData);
        setToastMsg('Doctor added successfully');
      }
      setToastType('success');
      resetForm();
      fetchDoctors();
    } catch (err) {
      setToastMsg(err.response?.data?.message || 'Error occurred');
      setToastType('danger');
    }
  };

  const handleEdit = (doc) => {
    setEditId(doc.id);
    setFormData({
      username: doc.username,
      password: '',
      email: doc.email,
      firstName: doc.firstName,
      lastName: doc.lastName,
      phone: doc.phone,
      specialization: doc.specialization,
      qualification: doc.qualification,
      experience: doc.experience,
      consultationFee: doc.consultationFee,
      availableDays: doc.availableDays,
      availableTime: doc.availableTime,
      licenseNumber: doc.licenseNumber,
      status: doc.status,
      departmentId: doc.departmentId || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await API.delete(`/doctors/${id}`);
        setToastMsg('Doctor deleted successfully');
        setToastType('success');
        fetchDoctors();
      } catch (err) {
        setToastMsg('Failed to delete doctor');
        setToastType('danger');
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      specialization: '',
      qualification: '',
      experience: '',
      consultationFee: '',
      availableDays: 'Monday,Wednesday,Friday',
      availableTime: '09:00-13:00',
      licenseNumber: '',
      status: 'ACTIVE',
      departmentId: departments[0]?.id || ''
    });
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold m-0">Manage Doctors</h2>
            <button className="btn btn-primary" onClick={resetForm} data-bs-toggle="modal" data-bs-target="#doctorModal">
              <i className="bi bi-person-plus me-1"></i> Add Doctor
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm overflow-hidden">
              <table className="table align-middle mb-0 bg-white">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>Doctor Name</th>
                    <th>Email / Phone</th>
                    <th>Department</th>
                    <th>Specialization</th>
                    <th>Availability</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(doc => (
                    <tr key={doc.id}>
                      <td>Dr. {doc.firstName} {doc.lastName}</td>
                      <td>{doc.email} <br/> <small className="text-muted">{doc.phone}</small></td>
                      <td>{doc.departmentName}</td>
                      <td>{doc.specialization}</td>
                      <td>{doc.availableDays} <br/> <small className="text-muted">{doc.availableTime}</small></td>
                      <td>
                        <span className={`badge bg-${doc.status === 'ACTIVE' ? 'success' : 'danger'}`}>{doc.status}</span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-info text-white me-2" onClick={() => handleEdit(doc)} data-bs-toggle="modal" data-bs-target="#doctorModal">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(doc.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal definition for Add/Edit doctor */}
          <div className="modal fade" id="doctorModal" tabIndex="-1" aria-labelledby="doctorModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
              <form onSubmit={handleSubmit} className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold" id="doctorModalLabel">{editId ? 'Update Doctor Details' : 'Add New Doctor Profile'}</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Username</label>
                      <input type="text" name="username" className="form-control" required value={formData.username} onChange={handleChange} disabled={!!editId} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Password</label>
                      <input type="password" name="password" className="form-control" placeholder={editId ? '(Unchanged)' : 'doctor123'} value={formData.password} onChange={handleChange} required={!editId} />
                    </div>
                  </div>
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
                      <label className="form-label small fw-bold">Department</label>
                      <select name="departmentId" className="form-select" value={formData.departmentId} onChange={handleChange}>
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Specialization</label>
                      <input type="text" name="specialization" className="form-control" placeholder="Cardiologist" required value={formData.specialization} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">License Number</label>
                      <input type="text" name="licenseNumber" className="form-control" required value={formData.licenseNumber} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Qualification</label>
                      <input type="text" name="qualification" className="form-control" placeholder="MD, DM" required value={formData.qualification} onChange={handleChange} />
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
                      <input type="text" name="availableDays" className="form-control" placeholder="Monday,Wednesday" required value={formData.availableDays} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Available Time</label>
                      <input type="text" name="availableTime" className="form-control" placeholder="09:00-13:00" required value={formData.availableTime} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Status</label>
                      <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">{editId ? 'Save Changes' : 'Register Doctor'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
    </div>
  );
};

export default ManageDoctors;
