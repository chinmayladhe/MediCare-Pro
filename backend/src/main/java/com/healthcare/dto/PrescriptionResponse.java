package com.healthcare.dto;

import java.time.LocalDate;
import java.util.List;

public class PrescriptionResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private Long appointmentId;
    private List<PrescriptionMedicineDto> medicines;
    private LocalDate prescriptionDate;

    public PrescriptionResponse() {}
    public PrescriptionResponse(Long id, Long patientId, String patientName, Long doctorId, String doctorName, Long appointmentId, List<PrescriptionMedicineDto> medicines, LocalDate prescriptionDate) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.appointmentId = appointmentId;
        this.medicines = medicines;
        this.prescriptionDate = prescriptionDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    public List<PrescriptionMedicineDto> getMedicines() { return medicines; }
    public void setMedicines(List<PrescriptionMedicineDto> medicines) { this.medicines = medicines; }
    public LocalDate getPrescriptionDate() { return prescriptionDate; }
    public void setPrescriptionDate(LocalDate prescriptionDate) { this.prescriptionDate = prescriptionDate; }
}
