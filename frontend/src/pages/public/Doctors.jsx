import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { Link } from 'react-router-dom';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
    fetchDoctors();
  }, [selectedDept, searchQuery]);

  const fetchDepartments = async () => {
    try {
      const res = await API.get('/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await API.get('/doctors', {
        params: {
          departmentId: selectedDept || undefined,
          query: searchQuery || undefined,
          size: 50
        }
      });
      setDoctors(res.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-bold mb-4">Meet Our Doctor Experts</h2>

        {/* Filters */}
        <div className="row g-3 mb-5 bg-light p-3 rounded shadow-sm">
          <div className="col-md-5">
            <label className="form-label fw-bold">Search by Name or Specialization</label>
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">Filter by Department</label>
            <select 
              className="form-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-outline-secondary w-100" onClick={() => { setSearchQuery(''); setSelectedDept(''); }}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Doctor Cards */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="alert alert-warning text-center py-4">
            No doctors found matching the search criteria.
          </div>
        ) : (
          <div className="row g-4">
            {doctors.map(doc => (
              <div className="col-md-4" key={doc.id}>
                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                  <div className="position-relative bg-light text-center py-4">
                    {doc.profileImage ? (
                      <img 
                        src={`http://localhost:8081/api${doc.profileImage}`} 
                        alt={`${doc.firstName} ${doc.lastName}`}
                        className="rounded-circle border border-primary p-1"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                      />
                    ) : (
                      <i className="bi bi-person-bounding-box text-secondary" style={{ fontSize: '100px' }}></i>
                    )}
                    <span className="position-absolute top-0 end-0 m-3 badge bg-success">{doc.status}</span>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bold">Dr. {doc.firstName} {doc.lastName}</h5>
                    <p className="card-text text-primary fw-semibold mb-1">{doc.specialization}</p>
                    <p className="card-text text-muted small mb-3">{doc.departmentName} Dept.</p>
                    
                    <div className="border-top pt-3">
                      <div className="d-flex justify-content-between mb-1 small">
                        <span>Qualification:</span>
                        <span className="fw-semibold text-truncate" style={{ maxWidth: '160px' }}>{doc.qualification}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1 small">
                        <span>Experience:</span>
                        <span className="fw-semibold">{doc.experience} Years</span>
                      </div>
                      <div className="d-flex justify-content-between mb-3 small">
                        <span>Consultation Fee:</span>
                        <span className="fw-bold text-success">${doc.consultationFee}</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-white border-0 p-3">
                    <Link to="/register" className="btn btn-primary w-100">
                      <i className="bi bi-calendar-plus me-2"></i> Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
