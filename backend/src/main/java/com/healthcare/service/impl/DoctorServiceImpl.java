package com.healthcare.service.impl;

import com.healthcare.dto.*;
import com.healthcare.entity.*;
import com.healthcare.exception.*;
import com.healthcare.mapper.EntityMapper;
import com.healthcare.repository.*;
import com.healthcare.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EntityMapper mapper;

    @Override
    public DoctorResponse addDoctor(DoctorRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Doctor doctor = new Doctor();
        doctor.setUsername(request.getUsername());
        doctor.setPassword(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "doctor123"));
        doctor.setEmail(request.getEmail());
        doctor.setFirstName(request.getFirstName());
        doctor.setLastName(request.getLastName());
        doctor.setRole(Role.ROLE_DOCTOR);
        doctor.setPhone(request.getPhone());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        doctor.setExperience(request.getExperience());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setAvailableDays(request.getAvailableDays());
        doctor.setAvailableTime(request.getAvailableTime());
        doctor.setLicenseNumber(request.getLicenseNumber());
        doctor.setProfileImage(request.getProfileImage());
        doctor.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        doctor.setDepartment(dept);

        Doctor saved = doctorRepository.save(doctor);
        return mapper.toDoctorResponse(saved);
    }

    @Override
    public DoctorResponse getDoctorById(Long id) {
        Doctor d = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id " + id));
        return mapper.toDoctorResponse(d);
    }

    @Override
    public DoctorResponse updateDoctor(Long id, DoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id " + id));

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        doctor.setEmail(request.getEmail());
        doctor.setFirstName(request.getFirstName());
        doctor.setLastName(request.getLastName());
        doctor.setPhone(request.getPhone());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        doctor.setExperience(request.getExperience());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setAvailableDays(request.getAvailableDays());
        doctor.setAvailableTime(request.getAvailableTime());
        doctor.setLicenseNumber(request.getLicenseNumber());
        if (request.getProfileImage() != null) {
            doctor.setProfileImage(request.getProfileImage());
        }
        doctor.setStatus(request.getStatus());
        doctor.setDepartment(dept);

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            doctor.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        Doctor updated = doctorRepository.save(doctor);
        return mapper.toDoctorResponse(updated);
    }

    @Override
    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with id " + id);
        }
        doctorRepository.deleteById(id);
    }

    @Override
    public Page<DoctorResponse> getDoctors(Long deptId, String specialization, String query, Pageable pageable) {
        Page<Doctor> doctors = doctorRepository.filterAndSearchDoctors(deptId, specialization, query, pageable);
        return doctors.map(mapper::toDoctorResponse);
    }

    @Override
    public List<DoctorResponse> getDoctorsByDepartment(Long deptId) {
        return doctorRepository.findByDepartmentId(deptId)
                .stream().map(mapper::toDoctorResponse)
                .collect(Collectors.toList());
    }
}
