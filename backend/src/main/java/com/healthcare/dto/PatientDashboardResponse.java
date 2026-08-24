package com.healthcare.dto;

import java.util.List;

public class PatientDashboardResponse {
    private AppointmentResponse upcomingAppointment;
    private long totalAppointments;
    private long totalDoctorsVisited;
    private long totalMedicalRecords;
    private long totalPrescriptions;
    private double pendingBillsAmount;
    private List<AppointmentResponse> recentAppointments;
    private List<BillResponse> pendingBills;
    private List<PaymentResponse> paymentHistory;

    public PatientDashboardResponse() {}
    public PatientDashboardResponse(AppointmentResponse upcomingAppointment, long totalAppointments, long totalDoctorsVisited, long totalMedicalRecords, long totalPrescriptions, double pendingBillsAmount, List<AppointmentResponse> recentAppointments, List<BillResponse> pendingBills, List<PaymentResponse> paymentHistory) {
        this.upcomingAppointment = upcomingAppointment;
        this.totalAppointments = totalAppointments;
        this.totalDoctorsVisited = totalDoctorsVisited;
        this.totalMedicalRecords = totalMedicalRecords;
        this.totalPrescriptions = totalPrescriptions;
        this.pendingBillsAmount = pendingBillsAmount;
        this.recentAppointments = recentAppointments;
        this.pendingBills = pendingBills;
        this.paymentHistory = paymentHistory;
    }

    public AppointmentResponse getUpcomingAppointment() { return upcomingAppointment; }
    public void setUpcomingAppointment(AppointmentResponse upcomingAppointment) { this.upcomingAppointment = upcomingAppointment; }
    public long getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; }
    public long getTotalDoctorsVisited() { return totalDoctorsVisited; }
    public void setTotalDoctorsVisited(long totalDoctorsVisited) { this.totalDoctorsVisited = totalDoctorsVisited; }
    public long getTotalMedicalRecords() { return totalMedicalRecords; }
    public void setTotalMedicalRecords(long totalMedicalRecords) { this.totalMedicalRecords = totalMedicalRecords; }
    public long getTotalPrescriptions() { return totalPrescriptions; }
    public void setTotalPrescriptions(long totalPrescriptions) { this.totalPrescriptions = totalPrescriptions; }
    public double getPendingBillsAmount() { return pendingBillsAmount; }
    public void setPendingBillsAmount(double pendingBillsAmount) { this.pendingBillsAmount = pendingBillsAmount; }
    public List<AppointmentResponse> getRecentAppointments() { return recentAppointments; }
    public void setRecentAppointments(List<AppointmentResponse> recentAppointments) { this.recentAppointments = recentAppointments; }
    public List<BillResponse> getPendingBills() { return pendingBills; }
    public void setPendingBills(List<BillResponse> pendingBills) { this.pendingBills = pendingBills; }
    public List<PaymentResponse> getPaymentHistory() { return paymentHistory; }
    public void setPaymentHistory(List<PaymentResponse> paymentHistory) { this.paymentHistory = paymentHistory; }
}
