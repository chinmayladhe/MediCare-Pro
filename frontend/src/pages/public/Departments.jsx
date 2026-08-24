import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/departments')
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-bold mb-4 text-center">Our Speciality Departments</h2>
        <p className="text-muted text-center mb-5 lead">We offer specialized diagnosis and therapeutic care for various healthcare fields.</p>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : (
          <div className="row g-4">
            {departments.map((dept, index) => {
              const icons = ['bi-heart-pulse-fill', 'bi-brain-fill', 'bi-activity', 'bi-bandaid-fill', 'bi-capsule', 'bi-clipboard-pulse'];
              const colors = ['text-danger', 'text-info', 'text-success', 'text-warning', 'text-primary', 'text-secondary'];
              const icon = icons[index % icons.length];
              const color = colors[index % colors.length];
              return (
                <div className="col-md-4" key={dept.id}>
                  <div className="card h-100 border-0 shadow-sm p-4">
                    <div className={`${color} mb-3`}>
                      <i className={`bi ${icon}`} style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h4 className="fw-bold">{dept.name}</h4>
                    <p className="text-muted mb-0">{dept.description || 'Quality patient-centric therapies and treatments provided by specialist physicians.'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;
