package com.healthcare.dto;

import java.util.Map;

public class DashboardResponse {
    private long totalPatients;
    private long totalDoctors;
    private long totalAppointments;
    private long todayAppointments;
    private long pendingAppointments;
    private long completedAppointments;
    private double totalRevenue;
    private double pendingPayments;

    // Chart Data Maps
    private Map<String, Long> monthlyAppointments;
    private Map<String, Double> monthlyRevenue;
    private Map<String, Long> patientRegistrations;
    private Map<String, Long> appointmentStatusBreakdown;

    public DashboardResponse() {}
    public DashboardResponse(long totalPatients, long totalDoctors, long totalAppointments, long todayAppointments, long pendingAppointments, long completedAppointments, double totalRevenue, double pendingPayments, Map<String, Long> monthlyAppointments, Map<String, Double> monthlyRevenue, Map<String, Long> patientRegistrations, Map<String, Long> appointmentStatusBreakdown) {
        this.totalPatients = totalPatients;
        this.totalDoctors = totalDoctors;
        this.totalAppointments = totalAppointments;
        this.todayAppointments = todayAppointments;
        this.pendingAppointments = pendingAppointments;
        this.completedAppointments = completedAppointments;
        this.totalRevenue = totalRevenue;
        this.pendingPayments = pendingPayments;
        this.monthlyAppointments = monthlyAppointments;
        this.monthlyRevenue = monthlyRevenue;
        this.patientRegistrations = patientRegistrations;
        this.appointmentStatusBreakdown = appointmentStatusBreakdown;
    }

    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }
    public long getTotalDoctors() { return totalDoctors; }
    public void setTotalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; }
    public long getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; }
    public long getTodayAppointments() { return todayAppointments; }
    public void setTodayAppointments(long todayAppointments) { this.todayAppointments = todayAppointments; }
    public long getPendingAppointments() { return pendingAppointments; }
    public void setPendingAppointments(long pendingAppointments) { this.pendingAppointments = pendingAppointments; }
    public long getCompletedAppointments() { return completedAppointments; }
    public void setCompletedAppointments(long completedAppointments) { this.completedAppointments = completedAppointments; }
    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }
    public double getPendingPayments() { return pendingPayments; }
    public void setPendingPayments(double pendingPayments) { this.pendingPayments = pendingPayments; }
    public Map<String, Long> getMonthlyAppointments() { return monthlyAppointments; }
    public void setMonthlyAppointments(Map<String, Long> monthlyAppointments) { this.monthlyAppointments = monthlyAppointments; }
    public Map<String, Double> getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(Map<String, Double> monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }
    public Map<String, Long> getPatientRegistrations() { return patientRegistrations; }
    public void setPatientRegistrations(Map<String, Long> patientRegistrations) { this.patientRegistrations = patientRegistrations; }
    public Map<String, Long> getAppointmentStatusBreakdown() { return appointmentStatusBreakdown; }
    public void setAppointmentStatusBreakdown(Map<String, Long> appointmentStatusBreakdown) { this.appointmentStatusBreakdown = appointmentStatusBreakdown; }
}
