package com.healthcare.service.impl;

import com.healthcare.dto.*;
import com.healthcare.entity.*;
import com.healthcare.exception.*;
import com.healthcare.mapper.EntityMapper;
import com.healthcare.repository.*;
import com.healthcare.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordServiceImpl implements MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EntityMapper mapper;

    @Override
    public MedicalRecordResponse createRecord(MedicalRecordRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        }

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setDoctor(doctor);
        record.setAppointment(appointment);
        record.setDiagnosis(request.getDiagnosis());
        record.setSymptoms(request.getSymptoms());
        record.setTreatment(request.getTreatment());
        record.setNotes(request.getNotes());
        record.setMedicalTestResults(request.getMedicalTestResults());
        record.setRecordDate(request.getRecordDate());

        MedicalRecord saved = medicalRecordRepository.save(record);
        return mapper.toMedicalRecordResponse(saved);
    }

    @Override
    public MedicalRecordResponse getRecordById(Long id) {
        MedicalRecord mr = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical Record not found with id " + id));
        return mapper.toMedicalRecordResponse(mr);
    }

    @Override
    public MedicalRecordResponse updateRecord(Long id, MedicalRecordRequest request) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical Record not found"));

        record.setDiagnosis(request.getDiagnosis());
        record.setSymptoms(request.getSymptoms());
        record.setTreatment(request.getTreatment());
        record.setNotes(request.getNotes());
        record.setMedicalTestResults(request.getMedicalTestResults());
        record.setRecordDate(request.getRecordDate());

        MedicalRecord updated = medicalRecordRepository.save(record);
        return mapper.toMedicalRecordResponse(updated);
    }

    @Override
    public List<MedicalRecordResponse> getPatientRecords(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId).stream()
                .map(mapper::toMedicalRecordResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicalRecordResponse> getDoctorRecords(Long doctorId) {
        return medicalRecordRepository.findByDoctorId(doctorId).stream()
                .map(mapper::toMedicalRecordResponse)
                .collect(Collectors.toList());
    }
}
