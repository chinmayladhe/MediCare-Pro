package com.healthcare.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BillRequest {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    private Long appointmentId;

    private Double consultationFee = 0.0;
    private Double medicineCharges = 0.0;
    private Double testCharges = 0.0;
    private Double otherCharges = 0.0;
    private Double discount = 0.0;
    private Double tax = 0.0;

    @NotNull(message = "Bill date is required")
    private LocalDate billDate;

    public BillRequest() {}

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    public Double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(Double consultationFee) { this.consultationFee = consultationFee; }
    public Double getMedicineCharges() { return medicineCharges; }
    public void setMedicineCharges(Double medicineCharges) { this.medicineCharges = medicineCharges; }
    public Double getTestCharges() { return testCharges; }
    public void setTestCharges(Double testCharges) { this.testCharges = testCharges; }
    public Double getOtherCharges() { return otherCharges; }
    public void setOtherCharges(Double otherCharges) { this.otherCharges = otherCharges; }
    public Double getDiscount() { return discount; }
    public void setDiscount(Double discount) { this.discount = discount; }
    public Double getTax() { return tax; }
    public void setTax(Double tax) { this.tax = tax; }
    public LocalDate getBillDate() { return billDate; }
    public void setBillDate(LocalDate billDate) { this.billDate = billDate; }
}
