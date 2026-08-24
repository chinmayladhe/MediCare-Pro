package com.healthcare.controller;

import com.healthcare.dto.*;
import com.healthcare.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboards")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<DashboardResponse> getAdminStats() {
        return ResponseEntity.ok(dashboardService.getAdminDashboardStats());
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<DoctorDashboardResponse> getDoctorStats(@PathVariable Long doctorId) {
        return ResponseEntity.ok(dashboardService.getDoctorDashboardStats(doctorId));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_PATIENT')")
    public ResponseEntity<PatientDashboardResponse> getPatientStats(@PathVariable Long patientId) {
        return ResponseEntity.ok(dashboardService.getPatientDashboardStats(patientId));
    }
}
