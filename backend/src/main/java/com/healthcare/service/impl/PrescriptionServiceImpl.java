package com.healthcare.service.impl;

import com.healthcare.dto.*;
import com.healthcare.entity.*;
import com.healthcare.exception.*;
import com.healthcare.mapper.EntityMapper;
import com.healthcare.repository.*;
import com.healthcare.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EntityMapper mapper;

    @Override
    public PrescriptionResponse createPrescription(PrescriptionRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        }

        Prescription pr = new Prescription();
        pr.setPatient(patient);
        pr.setDoctor(doctor);
        pr.setAppointment(appointment);
        pr.setPrescriptionDate(request.getPrescriptionDate());

        List<PrescriptionMedicine> medicines = request.getMedicines().stream().map(m -> {
            PrescriptionMedicine pm = new PrescriptionMedicine();
            pm.setPrescription(pr);
            pm.setMedicineName(m.getMedicineName());
            pm.setDosage(m.getDosage());
            pm.setFrequency(m.getFrequency());
            pm.setDuration(m.getDuration());
            pm.setInstructions(m.getInstructions());
            return pm;
        }).collect(Collectors.toList());

        pr.setMedicines(medicines);

        Prescription saved = prescriptionRepository.save(pr);
        return mapper.toPrescriptionResponse(saved);
    }

    @Override
    public PrescriptionResponse getPrescriptionById(Long id) {
        Prescription pr = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id " + id));
        return mapper.toPrescriptionResponse(pr);
    }

    @Override
    public PrescriptionResponse updatePrescription(Long id, PrescriptionRequest request) {
        Prescription pr = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id " + id));

        pr.setPrescriptionDate(request.getPrescriptionDate());
        pr.getMedicines().clear();

        List<PrescriptionMedicine> medicines = request.getMedicines().stream().map(m -> {
            PrescriptionMedicine pm = new PrescriptionMedicine();
            pm.setPrescription(pr);
            pm.setMedicineName(m.getMedicineName());
            pm.setDosage(m.getDosage());
            pm.setFrequency(m.getFrequency());
            pm.setDuration(m.getDuration());
            pm.setInstructions(m.getInstructions());
            return pm;
        }).collect(Collectors.toList());

        pr.getMedicines().addAll(medicines);

        Prescription updated = prescriptionRepository.save(pr);
        return mapper.toPrescriptionResponse(updated);
    }

    @Override
    public List<PrescriptionResponse> getPatientPrescriptions(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId).stream()
                .map(mapper::toPrescriptionResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionResponse> getDoctorPrescriptions(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId).stream()
                .map(mapper::toPrescriptionResponse)
                .collect(Collectors.toList());
    }
}
