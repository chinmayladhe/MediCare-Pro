package com.healthcare.service;

import com.healthcare.dto.*;
import com.healthcare.entity.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    AppointmentResponse bookAppointment(AppointmentRequest request);
    AppointmentResponse getAppointmentById(Long id);
    AppointmentResponse updateAppointmentStatus(Long id, AppointmentStatus status, String notes);
    Page<AppointmentResponse> getAppointments(Long patientId, Long doctorId, AppointmentStatus status, LocalDate date, Pageable pageable);
    List<AppointmentResponse> getPatientAppointments(Long patientId);
    List<AppointmentResponse> getDoctorAppointments(Long doctorId);
}
