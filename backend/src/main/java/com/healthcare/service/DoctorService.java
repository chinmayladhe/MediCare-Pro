package com.healthcare.service;

import com.healthcare.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface DoctorService {
    DoctorResponse addDoctor(DoctorRequest request);
    DoctorResponse getDoctorById(Long id);
    DoctorResponse updateDoctor(Long id, DoctorRequest request);
    void deleteDoctor(Long id);
    Page<DoctorResponse> getDoctors(Long deptId, String specialization, String query, Pageable pageable);
    List<DoctorResponse> getDoctorsByDepartment(Long deptId);
}
