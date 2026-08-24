package com.healthcare.dto;

import java.time.LocalDateTime;

public class PaymentResponse {
    private Long id;
    private Long billId;
    private Long patientId;
    private String patientName;
    private Double amount;
    private LocalDateTime paymentDate;
    private String paymentMethod;
    private String transactionId;
    private String paymentStatus;

    public PaymentResponse() {}
    public PaymentResponse(Long id, Long billId, Long patientId, String patientName, Double amount, LocalDateTime paymentDate, String paymentMethod, String transactionId, String paymentStatus) {
        this.id = id;
        this.billId = billId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.paymentStatus = paymentStatus;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getBillId() { return billId; }
    public void setBillId(Long billId) { this.billId = billId; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
