package com.healthcare.service;

import com.healthcare.dto.*;
import java.util.List;

public interface MedicalRecordService {
    MedicalRecordResponse createRecord(MedicalRecordRequest request);
    MedicalRecordResponse getRecordById(Long id);
    MedicalRecordResponse updateRecord(Long id, MedicalRecordRequest request);
    List<MedicalRecordResponse> getPatientRecords(Long patientId);
    List<MedicalRecordResponse> getDoctorRecords(Long doctorId);
}
