import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const DoctorPatients = () => {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detail Modal parameters
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);

  useEffect(() => {
    if (user?.id) {
      // Find list of unique patients that visited this doctor
      API.get('/appointments', { params: { doctorId: user.id, size: 200 } })
        .then(res => {
          const uniquePatientsMap = {};
          res.data.content.forEach(a => {
            if (a.status === 'COMPLETED') {
              uniquePatientsMap[a.patientId] = {
                id: a.patientId,
                name: a.patientName
              };
            }
          });
          setPatients(Object.values(uniquePatientsMap));
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleViewPatientDetails = async (p) => {
    setSelectedPatient(p);
    setPatientRecords([]);
    setPatientPrescriptions([]);

    try {
      // Fetch details of selected patient
      const patientDetails = await API.get(`/patients/${p.id}`);
      setSelectedPatient(patientDetails.data);

      const recordsRes = await API.get(`/medical-records/patient/${p.id}`);
      setPatientRecords(recordsRes.data);

      const prescriptionsRes = await API.get(`/prescriptions/patient/${p.id}`);
      setPatientPrescriptions(prescriptionsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <h2 className="fw-bold mb-4">My Patient Cohort</h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : patients.length === 0 ? (
            <div className="alert alert-warning text-center py-4">No patients have completed appointments with you yet.</div>
          ) : (
            <div className="row g-3">
              {patients.map(p => (
                <div className="col-md-4" key={p.id}>
                  <div className="card border-0 shadow-sm p-4 bg-white text-center">
                    <i className="bi bi-person-bounding-box text-secondary fs-1 mb-2"></i>
                    <h5 className="fw-bold mb-3">{p.name || 'Patient'}</h5>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleViewPatientDetails(p)} data-bs-toggle="modal" data-bs-target="#patientDetailModal">
                      <i className="bi bi-eye me-1"></i> Medical History
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Patient Details Modal */}
          <div className="modal fade" id="patientDetailModal" tabIndex="-1" aria-labelledby="patientDetailModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Patient Folder: {selectedPatient?.firstName} {selectedPatient?.lastName}</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {/* Basic Details */}
                  <h6 className="fw-bold border-bottom pb-2 mb-3">Demographics & Profile</h6>
                  <div className="row g-3 mb-4 small">
                    <div className="col-md-3"><strong>DOB:</strong> {selectedPatient?.dateOfBirth}</div>
                    <div className="col-md-3"><strong>Gender:</strong> {selectedPatient?.gender}</div>
                    <div className="col-md-3"><strong>Blood Group:</strong> {selectedPatient?.bloodGroup}</div>
                    <div className="col-md-3"><strong>Phone:</strong> {selectedPatient?.phone}</div>
                    <div className="col-md-6"><strong>Emergency Contact:</strong> {selectedPatient?.emergencyContact}</div>
                    <div className="col-md-6"><strong>Medical Allergies:</strong> {selectedPatient?.medicalHistory || 'None'}</div>
                  </div>

                  {/* Medical History Records */}
                  <h6 className="fw-bold border-bottom pb-2 mb-3">Consultation Logs</h6>
                  {patientRecords.length === 0 ? (
                    <p className="text-muted small">No diagnosis records found.</p>
                  ) : (
                    patientRecords.map(r => (
                      <div key={r.id} className="border rounded p-3 bg-light mb-3">
                        <div className="d-flex justify-content-between mb-2 small">
                          <span className="fw-bold text-primary">Dr. {r.doctorName}</span>
                          <span className="text-muted">{r.recordDate}</span>
                        </div>
                        <div className="small">
                          <div><strong>Symptoms:</strong> {r.symptoms}</div>
                          <div><strong>Diagnosis:</strong> {r.diagnosis}</div>
                          <div><strong>Treatment:</strong> {r.treatment}</div>
                          {r.medicalTestResults && <div><strong>Tests:</strong> {r.medicalTestResults}</div>}
                          {r.notes && <div className="text-muted italic">*{r.notes}</div>}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Prescribed Medicines */}
                  <h6 className="fw-bold border-bottom pb-2 mb-3 mt-4">Medication List</h6>
                  {patientPrescriptions.length === 0 ? (
                    <p className="text-muted small">No prescriptions generated.</p>
                  ) : (
                    patientPrescriptions.map(pr => (
                      <div key={pr.id} className="border rounded p-3 bg-light mb-3">
                        <div className="d-flex justify-content-between mb-2 small border-bottom pb-1">
                          <span className="fw-bold text-success">Prescribed by Dr. {pr.doctorName}</span>
                          <span className="text-muted">{pr.prescriptionDate}</span>
                        </div>
                        <table className="table table-sm table-borderless mb-0 small">
                          <thead>
                            <tr className="text-muted">
                              <th>Medicine</th>
                              <th>Dosage</th>
                              <th>Frequency</th>
                              <th>Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pr.medicines?.map((m, idx) => (
                              <tr key={idx}>
                                <td>{m.medicineName}</td>
                                <td>{m.dosage}</td>
                                <td>{m.frequency}</td>
                                <td>{m.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;
