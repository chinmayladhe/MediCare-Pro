import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import Toast from '../../components/Toast';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchPatients();
  }, [searchQuery]);

  const fetchPatients = () => {
    setLoading(true);
    API.get('/patients', {
      params: {
        query: searchQuery || undefined,
        size: 50
      }
    })
      .then(res => setPatients(res.data.content))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      try {
        await API.delete(`/patients/${id}`);
        setToastMsg('Patient deleted successfully');
        fetchPatients();
      } catch (err) {
        setToastMsg('Failed to delete patient');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold m-0">Patient Registry</h2>
            <div style={{ width: '300px' }}>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search patient name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : patients.length === 0 ? (
            <div className="alert alert-warning text-center py-4">No patients registered.</div>
          ) : (
            <div className="card border-0 shadow-sm overflow-hidden">
              <table className="table align-middle mb-0 bg-white">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>Patient Name</th>
                    <th>Gender / DOB</th>
                    <th>Phone / Email</th>
                    <th>Blood Group</th>
                    <th>Emergency Contact</th>
                    <th>Registered Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id}>
                      <td className="fw-bold">{p.firstName} {p.lastName}</td>
                      <td>{p.gender} <br/> <small className="text-muted">{p.dateOfBirth}</small></td>
                      <td>{p.phone} <br/> <small className="text-muted">{p.email}</small></td>
                      <td><span className="badge bg-secondary">{p.bloodGroup}</span></td>
                      <td>{p.emergencyContact}</td>
                      <td>{new Date(p.createdDate).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  );
};

export default ManagePatients;
