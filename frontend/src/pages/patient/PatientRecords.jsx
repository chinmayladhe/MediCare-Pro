import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const PatientRecords = () => {
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      API.get(`/medical-records/patient/${user.id}`)
        .then(res => setRecords(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <h2 className="fw-bold mb-4">My Clinical Records</h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : records.length === 0 ? (
            <div className="alert alert-warning text-center py-4">No diagnosis logs found.</div>
          ) : (
            <div className="row g-4">
              {records.map(r => (
                <div className="col-md-6" key={r.id}>
                  <div className="card border-0 shadow-sm p-4 bg-white h-100">
                    <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                      <h5 className="fw-bold text-primary mb-0">Dr. {r.doctorName}</h5>
                      <span className="text-muted small">{r.recordDate}</span>
                    </div>
                    <div className="mb-2">
                      <strong className="text-secondary small d-block">Symptoms</strong>
                      <p className="mb-0">{r.symptoms}</p>
                    </div>
                    <div className="mb-2">
                      <strong className="text-secondary small d-block">Diagnosis</strong>
                      <p className="mb-0 fw-semibold">{r.diagnosis}</p>
                    </div>
                    <div className="mb-2">
                      <strong className="text-secondary small d-block">Treatment Plan</strong>
                      <p className="mb-0">{r.treatment}</p>
                    </div>
                    {r.medicalTestResults && (
                      <div className="mb-2">
                        <strong className="text-secondary small d-block">Lab & Tests</strong>
                        <span className="badge bg-info text-dark">{r.medicalTestResults}</span>
                      </div>
                    )}
                    {r.notes && (
                      <div className="mt-3 p-2 bg-light rounded small text-muted">
                        <i className="bi bi-info-circle me-1"></i>{r.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
