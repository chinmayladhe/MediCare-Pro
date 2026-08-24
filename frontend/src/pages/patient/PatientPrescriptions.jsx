import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const PatientPrescriptions = () => {
  const { user } = useContext(AuthContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      API.get(`/prescriptions/patient/${user.id}`)
        .then(res => setPrescriptions(res.data))
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
          <h2 className="fw-bold mb-4">My Prescriptions</h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="alert alert-warning text-center py-4">No active prescriptions found.</div>
          ) : (
            <div className="row g-4">
              {prescriptions.map(pr => (
                <div className="col-md-6" key={pr.id}>
                  <div className="card border-0 shadow-sm p-4 bg-white h-100">
                    <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                      <h5 className="fw-bold text-success mb-0">Dr. {pr.doctorName}</h5>
                      <span className="text-muted small">{pr.prescriptionDate}</span>
                    </div>

                    <table className="table align-middle table-sm">
                      <thead className="table-light">
                        <tr className="small">
                          <th>Medicine</th>
                          <th>Dosage</th>
                          <th>Frequency</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pr.medicines?.map((m, idx) => (
                          <tr key={idx}>
                            <td className="fw-semibold">{m.medicineName}</td>
                            <td>{m.dosage}</td>
                            <td>{m.frequency}</td>
                            <td>{m.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default PatientPrescriptions;
