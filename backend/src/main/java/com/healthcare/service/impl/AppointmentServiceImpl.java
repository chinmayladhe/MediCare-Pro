package com.healthcare.service.impl;

import com.healthcare.dto.*;
import com.healthcare.entity.*;
import com.healthcare.exception.*;
import com.healthcare.mapper.EntityMapper;
import com.healthcare.repository.*;
import com.healthcare.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private EntityMapper mapper;

    @Override
    public AppointmentResponse bookAppointment(AppointmentRequest request) {
        // Prevent booking appointments in the past
        if (request.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot book appointments in the past");
        }

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        // Prevent double booking (excluding CANCELLED and REJECTED statuses)
        boolean exists = appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                request.getDoctorId(),
                request.getAppointmentDate(),
                request.getAppointmentTime(),
                AppointmentStatus.CANCELLED // We will allow booking if existing is cancelled or rejected
        );
        if (exists) {
            throw new DoubleBookingException("The doctor is already booked at this date and time.");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setReason(request.getReason());
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setNotes(request.getNotes());

        Appointment saved = appointmentRepository.save(appointment);
        return mapper.toAppointmentResponse(saved);
    }

    @Override
    public AppointmentResponse getAppointmentById(Long id) {
        Appointment a = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id " + id));
        return mapper.toAppointmentResponse(a);
    }

    @Override
    public AppointmentResponse updateAppointmentStatus(Long id, AppointmentStatus status, String notes) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id " + id));

        appointment.setStatus(status);
        if (notes != null) {
            appointment.setNotes(notes);
        }

        Appointment updated = appointmentRepository.save(appointment);
        return mapper.toAppointmentResponse(updated);
    }

    @Override
    public Page<AppointmentResponse> getAppointments(Long patientId, Long doctorId, AppointmentStatus status, LocalDate date, Pageable pageable) {
        Page<Appointment> appointments = appointmentRepository.filterAppointments(patientId, doctorId, status, date, pageable);
        return appointments.map(mapper::toAppointmentResponse);
    }

    @Override
    public List<AppointmentResponse> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
                .map(mapper::toAppointmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(mapper::toAppointmentResponse)
                .collect(Collectors.toList());
    }
}
