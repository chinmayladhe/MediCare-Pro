package com.healthcare.dto;

import java.time.LocalDate;

public class BillResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private Long appointmentId;
    private Double consultationFee;
    private Double medicineCharges;
    private Double testCharges;
    private Double otherCharges;
    private Double discount;
    private Double tax;
    private Double totalAmount;
    private String paymentStatus;
    private LocalDate billDate;

    public BillResponse() {}
    public BillResponse(Long id, Long patientId, String patientName, Long doctorId, String doctorName, Long appointmentId, Double consultationFee, Double medicineCharges, Double testCharges, Double otherCharges, Double discount, Double tax, Double totalAmount, String paymentStatus, LocalDate billDate) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.appointmentId = appointmentId;
        this.consultationFee = consultationFee;
        this.medicineCharges = medicineCharges;
        this.testCharges = testCharges;
        this.otherCharges = otherCharges;
        this.discount = discount;
        this.tax = tax;
        this.totalAmount = totalAmount;
        this.paymentStatus = paymentStatus;
        this.billDate = billDate;
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
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public LocalDate getBillDate() { return billDate; }
    public void setBillDate(LocalDate billDate) { this.billDate = billDate; }
}
