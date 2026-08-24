package com.healthcare.repository;

import com.healthcare.entity.Bill;
import com.healthcare.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {
    
    List<Bill> findByPatientId(Long patientId);

    @Query("SELECT b FROM Bill b WHERE " +
           "(:patientId IS NULL OR b.patient.id = :patientId) AND " +
           "(:status IS NULL OR b.paymentStatus = :status)")
    Page<Bill> filterBills(
            @Param("patientId") Long patientId,
            @Param("status") PaymentStatus status,
            Pageable pageable);

    @Query("SELECT SUM(b.totalAmount) FROM Bill b WHERE b.paymentStatus = 'PAID'")
    Double calculateTotalRevenue();

    @Query("SELECT SUM(b.totalAmount) FROM Bill b WHERE b.paymentStatus = 'PENDING'")
    Double calculateTotalPendingRevenue();
}
