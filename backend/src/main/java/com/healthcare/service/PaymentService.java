package com.healthcare.service;

import com.healthcare.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PaymentService {
    PaymentResponse processPayment(PaymentRequest request);
    List<PaymentResponse> getPatientPayments(Long patientId);
    Page<PaymentResponse> getAllPayments(Pageable pageable);
}
