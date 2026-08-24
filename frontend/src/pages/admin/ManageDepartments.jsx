import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import Toast from '../../components/Toast';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    setLoading(true);
    API.get('/departments')
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/departments/${editId}`, { name, description });
        setToastMsg('Department updated successfully');
      } else {
        await API.post('/departments', { name, description });
        setToastMsg('Department created successfully');
      }
      setName('');
      setDescription('');
      setEditId(null);
      fetchDepartments();
    } catch (err) {
      setToastMsg('Error creating or updating department');
    }
  };

  const handleEdit = (dept) => {
    setEditId(dept.id);
    setName(dept.name);
    setDescription(dept.description);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete department? Doctors assigned to this department might lose department association.')) {
      try {
        await API.delete(`/departments/${id}`);
        setToastMsg('Department deleted successfully');
        fetchDepartments();
      } catch (err) {
        setToastMsg('Failed to delete department');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <h2 className="fw-bold mb-4">Manage Departments</h2>

          <div className="row g-4">
            {/* Form Column */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 bg-white">
                <h5 className="fw-bold mb-3">{editId ? 'Edit Department' : 'Add Department'}</h5>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Department Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Description</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary flex-grow-1">{editId ? 'Update' : 'Create'}</button>
                    {editId && (
                      <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditId(null); setName(''); setDescription(''); }}>Cancel</button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* List Column */}
            <div className="col-md-8">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : (
                <div className="card border-0 shadow-sm overflow-hidden bg-white">
                  <table className="table align-middle mb-0">
                    <thead className="bg-dark text-white">
                      <tr>
                        <th>Department Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map(d => (
                        <tr key={d.id}>
                          <td className="fw-bold">{d.name}</td>
                          <td className="text-muted small" style={{ maxWidth: '300px' }}>{d.description || '(No description)'}</td>
                          <td>
                            <button className="btn btn-sm btn-info text-white me-2" onClick={() => handleEdit(d)}>
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d.id)}>
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
        </div>
      </div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  );
};

export default ManageDepartments;
