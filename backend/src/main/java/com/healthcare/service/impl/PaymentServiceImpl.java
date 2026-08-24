package com.healthcare.service.impl;

import com.healthcare.dto.*;
import com.healthcare.entity.*;
import com.healthcare.exception.*;
import com.healthcare.mapper.EntityMapper;
import com.healthcare.repository.*;
import com.healthcare.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private EntityMapper mapper;

    @Override
    public PaymentResponse processPayment(PaymentRequest request) {
        Bill bill = billRepository.findById(request.getBillId())
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));

        if (bill.getPaymentStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("This bill is already paid");
        }

        // Simulate payment gateway logic:
        Payment payment = new Payment();
        payment.setBill(bill);
        payment.setPatient(bill.getPatient());
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setPaymentStatus("SUCCESS"); // Simulated success

        Payment saved = paymentRepository.save(payment);

        // Update Bill Status
        if (request.getAmount() >= bill.getTotalAmount()) {
            bill.setPaymentStatus(PaymentStatus.PAID);
        } else {
            bill.setPaymentStatus(PaymentStatus.PARTIALLY_PAID);
        }
        billRepository.save(bill);

        return mapper.toPaymentResponse(saved);
    }

    @Override
    public List<PaymentResponse> getPatientPayments(Long patientId) {
        return paymentRepository.findByPatientId(patientId).stream()
                .map(mapper::toPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable).map(mapper::toPaymentResponse);
    }
}
