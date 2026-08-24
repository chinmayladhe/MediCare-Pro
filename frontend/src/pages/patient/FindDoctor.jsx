import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Toast from '../../components/Toast';

const FindDoctor = () => {
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Booking Modal Form parameters
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('09:00');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchDepartments();
    fetchDoctors();
  }, [selectedDept, searchQuery]);

  const fetchDepartments = () => {
    API.get('/departments').then(res => setDepartments(res.data));
  };

  const fetchDoctors = () => {
    setLoading(true);
    API.get('/doctors', {
      params: {
        departmentId: selectedDept || undefined,
        query: searchQuery || undefined,
        size: 50
      }
    })
      .then(res => setDoctors(res.data.content))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    try {
      await API.post('/appointments', {
        patientId: user.id,
        doctorId: selectedDoctor.id,
        appointmentDate,
        appointmentTime: `${appointmentTime}:00`,
        reason
      });
      setToastMsg('Appointment booked successfully! Status: PENDING Admin Approval.');
      resetBookingForm();
    } catch (err) {
      setToastMsg(err.response?.data?.message || 'Double booking error: Doctor is already scheduled at this slot.');
    }
  };

  const resetBookingForm = () => {
    setSelectedDoctor(null);
    setAppointmentDate('');
    setAppointmentTime('09:00');
    setReason('');
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light" style={{ maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <h2 className="fw-bold mb-4">Book Consultation</h2>

          {/* Filters */}
          <div className="row g-3 mb-4 bg-white p-3 rounded shadow-sm">
            <div className="col-md-5">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search doctor by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select className="form-select" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-secondary w-100" onClick={() => { setSearchQuery(''); setSelectedDept(''); }}>Reset</button>
            </div>
          </div>

          {/* Grid list of doctors */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="alert alert-warning text-center py-3">No active doctors found.</div>
          ) : (
            <div className="row g-3">
              {doctors.map(doc => (
                <div className="col-md-4" key={doc.id}>
                  <div className="card h-100 border-0 shadow-sm p-3">
                    <h5 className="fw-bold m-0">Dr. {doc.firstName} {doc.lastName}</h5>
                    <span className="text-primary small fw-semibold">{doc.specialization}</span>
                    <span className="text-muted small mb-2">{doc.departmentName} Dept.</span>
                    <div className="border-top pt-2 small text-muted">
                      <div><strong>Days:</strong> {doc.availableDays}</div>
                      <div><strong>Hours:</strong> {doc.availableTime}</div>
                      <div className="text-success fw-bold mt-1">Fee: ${doc.consultationFee}</div>
                    </div>
                    <button className="btn btn-primary btn-sm w-100 mt-3" onClick={() => setSelectedDoctor(doc)} data-bs-toggle="modal" data-bs-target="#bookingModal">
                      Schedule Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Booking Modal */}
          <div className="modal fade" id="bookingModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
              <form onSubmit={handleBookAppointment} className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Book Slot: Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Consultation Date</label>
                    <input type="date" className="form-control" required value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Preferred Time</label>
                    <input type="time" className="form-control" required value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Reason for Visit</label>
                    <textarea className="form-control" rows="3" required placeholder="Describe symptoms briefly..." value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Confirm Request</button>
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

export default FindDoctor;
