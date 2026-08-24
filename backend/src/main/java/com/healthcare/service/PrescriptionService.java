package com.healthcare.service;

import com.healthcare.dto.*;
import java.util.List;

public interface PrescriptionService {
    PrescriptionResponse createPrescription(PrescriptionRequest request);
    PrescriptionResponse getPrescriptionById(Long id);
    PrescriptionResponse updatePrescription(Long id, PrescriptionRequest request);
    List<PrescriptionResponse> getPatientPrescriptions(Long patientId);
    List<PrescriptionResponse> getDoctorPrescriptions(Long doctorId);
}
