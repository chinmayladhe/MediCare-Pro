import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const DoctorAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Diagnosis Modal Form states
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');
  const [testResults, setTestResults] = useState('');

  // Prescription creation parameters
  const [medicines, setMedicines] = useState([
    { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = () => {
    setLoading(true);
    API.get('/appointments', {
      params: {
        doctorId: user.id,
        size: 50
      }
    })
      .then(res => setAppointments(res.data.content))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, null, {
        params: { status }
      });
      setToastMsg(`Appointment status changed to ${status.toLowerCase()}`);
      fetchAppointments();
    } catch (err) {
      setToastMsg('Failed to update status');
    }
  };

  // Submit diagnosis (creates medical record + prescription + auto-marks appointment as COMPLETED)
  const handleSubmitConsultation = async (e) => {
    e.preventDefault();
    if (!activeAppointment) return;

    try {
      const recordDate = new Date().toISOString().split('T')[0];

      // 1. Create Medical Record
      await API.post('/medical-records', {
        patientId: activeAppointment.patientId,
        doctorId: user.id,
        appointmentId: activeAppointment.id,
        diagnosis,
        symptoms,
        treatment,
        notes,
        medicalTestResults: testResults,
        recordDate
      });

      // 2. Create Prescription
      if (medicines.some(m => m.medicineName.trim() !== '')) {
        await API.post('/prescriptions', {
          patientId: activeAppointment.patientId,
          doctorId: user.id,
          appointmentId: activeAppointment.id,
          medicines: medicines.filter(m => m.medicineName.trim() !== ''),
          prescriptionDate: recordDate
        });
      }

      // 3. Mark appointment as COMPLETED
      await API.put(`/appointments/${activeAppointment.id}/status`, null, {
        params: { status: 'COMPLETED' }
      });

      setToastMsg('Consultation submitted and appointment marked as completed');
      resetConsultationForm();
      fetchAppointments();
    } catch (err) {
      setToastMsg('Failed to submit consultation details');
    }
  };

  const handleAddMedicineRow = () => {
    setMedicines([...medicines, { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const resetConsultationForm = () => {
    setActiveAppointment(null);
    setDiagnosis('');
    setSymptoms('');
    setTreatment('');
    setNotes('');
    setTestResults('');
    setMedicines([{ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <h2 className="fw-bold mb-4">My Assigned Appointments</h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="alert alert-warning text-center py-4">No appointments assigned.</div>
          ) : (
            <div className="card border-0 shadow-sm overflow-hidden bg-white">
              <table className="table align-middle mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>Patient Name</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id}>
                      <td className="fw-bold">{a.patientName}</td>
                      <td>{a.appointmentDate} <br/> <small className="text-muted">{a.appointmentTime}</small></td>
                      <td>{a.reason}</td>
                      <td>
                        <span className={`badge bg-${
                          a.status === 'CONFIRMED' ? 'success' :
                          a.status === 'PENDING' ? 'warning' :
                          a.status === 'COMPLETED' ? 'primary' : 'danger'
                        }`}>{a.status}</span>
                      </td>
                      <td>
                        {a.status === 'PENDING' && (
                          <>
                            <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdateStatus(a.id, 'CONFIRMED')}>Accept</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleUpdateStatus(a.id, 'REJECTED')}>Reject</button>
                          </>
                        )}
                        {a.status === 'CONFIRMED' && (
                          <>
                            <button className="btn btn-sm btn-primary me-2" onClick={() => setActiveAppointment(a)} data-bs-toggle="modal" data-bs-target="#consultationModal">
                              <i className="bi bi-file-earmark-medical me-1"></i> Consult / Diagnose
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleUpdateStatus(a.id, 'CANCELLED')}>Cancel</button>
                          </>
                        )}
                        {a.status === 'COMPLETED' && (
                          <span className="text-success small"><i className="bi bi-check-circle-fill me-1"></i>Consultation Completed</span>
                        )}
                        {(a.status === 'CANCELLED' || a.status === 'REJECTED') && (
                          <span className="text-muted small">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Consultation Modal */}
          <div className="modal fade" id="consultationModal" tabIndex="-1" aria-labelledby="consultationModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
              <form onSubmit={handleSubmitConsultation} className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Consultation Details: {activeAppointment?.patientName}</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <h6 className="fw-bold border-bottom pb-2 mb-3">Clinical Assessment</h6>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Symptoms</label>
                      <input type="text" className="form-control" placeholder="e.g. Cough, high fever" required value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Diagnosis</label>
                      <input type="text" className="form-control" placeholder="e.g. Mild Influenza" required value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Treatment Plan / Prescription Advised</label>
                    <textarea className="form-control" rows="2" placeholder="e.g. Rest for 3 days and stay hydrated" required value={treatment} onChange={(e) => setTreatment(e.target.value)}></textarea>
                  </div>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Medical Test Results (if any)</label>
                      <input type="text" className="form-control" placeholder="e.g. CBC test normal" value={testResults} onChange={(e) => setTestResults(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">General Doctor Notes</label>
                      <input type="text" className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                  </div>

                  <h6 className="fw-bold border-bottom pb-2 mb-3 d-flex justify-content-between align-items-center">
                    Prescribe Medicines (Optional)
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleAddMedicineRow}>
                      <i className="bi bi-plus-circle me-1"></i> Add Row
                    </button>
                  </h6>

                  {medicines.map((med, index) => (
                    <div key={index} className="row g-2 mb-2 border-bottom pb-2">
                      <div className="col-md-3">
                        <input type="text" className="form-control form-control-sm" placeholder="Medicine Name" value={med.medicineName} onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)} />
                      </div>
                      <div className="col-md-2">
                        <input type="text" className="form-control form-control-sm" placeholder="Dosage" value={med.dosage} onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)} />
                      </div>
                      <div className="col-md-2">
                        <input type="text" className="form-control form-control-sm" placeholder="Frequency" value={med.frequency} onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)} />
                      </div>
                      <div className="col-md-2">
                        <input type="text" className="form-control form-control-sm" placeholder="Duration" value={med.duration} onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)} />
                      </div>
                      <div className="col-md-3">
                        <input type="text" className="form-control form-control-sm" placeholder="Instructions" value={med.instructions} onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save Consultation</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  );
};

export default DoctorAppointments;
