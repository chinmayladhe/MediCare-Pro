package com.healthcare.dto;

import java.util.List;

public class DoctorDashboardResponse {
    private long todayAppointmentsCount;
    private long upcomingAppointmentsCount;
    private long completedAppointmentsCount;
    private long pendingAppointmentsCount;
    private long totalPatientsCount;
    private List<AppointmentResponse> todayAppointments;
    private List<MedicalRecordResponse> recentRecords;

    public DoctorDashboardResponse() {}
    public DoctorDashboardResponse(long todayAppointmentsCount, long upcomingAppointmentsCount, long completedAppointmentsCount, long pendingAppointmentsCount, long totalPatientsCount, List<AppointmentResponse> todayAppointments, List<MedicalRecordResponse> recentRecords) {
        this.todayAppointmentsCount = todayAppointmentsCount;
        this.upcomingAppointmentsCount = upcomingAppointmentsCount;
        this.completedAppointmentsCount = completedAppointmentsCount;
        this.pendingAppointmentsCount = pendingAppointmentsCount;
        this.totalPatientsCount = totalPatientsCount;
        this.todayAppointments = todayAppointments;
        this.recentRecords = recentRecords;
    }

    public long getTodayAppointmentsCount() { return todayAppointmentsCount; }
    public void setTodayAppointmentsCount(long todayAppointmentsCount) { this.todayAppointmentsCount = todayAppointmentsCount; }
    public long getUpcomingAppointmentsCount() { return upcomingAppointmentsCount; }
    public void setUpcomingAppointmentsCount(long upcomingAppointmentsCount) { this.upcomingAppointmentsCount = upcomingAppointmentsCount; }
    public long getCompletedAppointmentsCount() { return completedAppointmentsCount; }
    public void setCompletedAppointmentsCount(long completedAppointmentsCount) { this.completedAppointmentsCount = completedAppointmentsCount; }
    public long getPendingAppointmentsCount() { return pendingAppointmentsCount; }
    public void setPendingAppointmentsCount(long pendingAppointmentsCount) { this.pendingAppointmentsCount = pendingAppointmentsCount; }
    public long getTotalPatientsCount() { return totalPatientsCount; }
    public void setTotalPatientsCount(long totalPatientsCount) { this.totalPatientsCount = totalPatientsCount; }
    public List<AppointmentResponse> getTodayAppointments() { return todayAppointments; }
    public void setTodayAppointments(List<AppointmentResponse> todayAppointments) { this.todayAppointments = todayAppointments; }
    public List<MedicalRecordResponse> getRecentRecords() { return recentRecords; }
    public void setRecentRecords(List<MedicalRecordResponse> recentRecords) { this.recentRecords = recentRecords; }
}
