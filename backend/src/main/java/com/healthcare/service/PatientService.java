package com.healthcare.service;

import com.healthcare.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PatientService {
    PatientResponse getPatientById(Long id);
    Page<PatientResponse> searchPatients(String query, Pageable pageable);
    PatientResponse updatePatient(Long id, PatientRegisterRequest request);
    void deletePatient(Long id);
}
