package com.healthcare.service.impl;

import com.healthcare.dto.*;
import com.healthcare.entity.*;
import com.healthcare.exception.*;
import com.healthcare.mapper.EntityMapper;
import com.healthcare.repository.*;
import com.healthcare.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillServiceImpl implements BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EntityMapper mapper;

    @Override
    public BillResponse generateBill(BillRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        }

        Bill bill = new Bill();
        bill.setPatient(patient);
        bill.setDoctor(doctor);
        bill.setAppointment(appointment);
        bill.setConsultationFee(request.getConsultationFee());
        bill.setMedicineCharges(request.getMedicineCharges());
        bill.setTestCharges(request.getTestCharges());
        bill.setOtherCharges(request.getOtherCharges());
        bill.setDiscount(request.getDiscount());
        bill.setTax(request.getTax());
        bill.setBillDate(request.getBillDate());
        bill.setPaymentStatus(PaymentStatus.PENDING);

        // Calculate: Total = Consultation Fee + Medicine Charges + Test Charges + Other Charges + Tax - Discount
        double total = request.getConsultationFee() + request.getMedicineCharges() + request.getTestCharges() +
                request.getOtherCharges() + request.getTax() - request.getDiscount();
        bill.setTotalAmount(Math.max(0.0, total));

        Bill saved = billRepository.save(bill);
        return mapper.toBillResponse(saved);
    }

    @Override
    public BillResponse getBillById(Long id) {
        Bill b = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id " + id));
        return mapper.toBillResponse(b);
    }

    @Override
    public BillResponse updateBill(Long id, BillRequest request) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id " + id));

        bill.setConsultationFee(request.getConsultationFee());
        bill.setMedicineCharges(request.getMedicineCharges());
        bill.setTestCharges(request.getTestCharges());
        bill.setOtherCharges(request.getOtherCharges());
        bill.setDiscount(request.getDiscount());
        bill.setTax(request.getTax());
        bill.setBillDate(request.getBillDate());

        double total = request.getConsultationFee() + request.getMedicineCharges() + request.getTestCharges() +
                request.getOtherCharges() + request.getTax() - request.getDiscount();
        bill.setTotalAmount(Math.max(0.0, total));

        Bill updated = billRepository.save(bill);
        return mapper.toBillResponse(updated);
    }

    @Override
    public Page<BillResponse> getBills(Long patientId, PaymentStatus status, Pageable pageable) {
        Page<Bill> bills = billRepository.filterBills(patientId, status, pageable);
        return bills.map(mapper::toBillResponse);
    }

    @Override
    public List<BillResponse> getPatientBills(Long patientId) {
        return billRepository.findByPatientId(patientId).stream()
                .map(mapper::toBillResponse)
                .collect(Collectors.toList());
    }
}
