package com.healthcare.service;

import com.healthcare.dto.*;
import com.healthcare.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface BillService {
    BillResponse generateBill(BillRequest request);
    BillResponse getBillById(Long id);
    BillResponse updateBill(Long id, BillRequest request);
    Page<BillResponse> getBills(Long patientId, PaymentStatus status, Pageable pageable);
    List<BillResponse> getPatientBills(Long patientId);
}
