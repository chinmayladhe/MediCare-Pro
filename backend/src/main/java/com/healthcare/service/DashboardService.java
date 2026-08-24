package com.healthcare.service;

import com.healthcare.dto.*;

public interface DashboardService {
    DashboardResponse getAdminDashboardStats();
    DoctorDashboardResponse getDoctorDashboardStats(Long doctorId);
    PatientDashboardResponse getPatientDashboardStats(Long patientId);
}
