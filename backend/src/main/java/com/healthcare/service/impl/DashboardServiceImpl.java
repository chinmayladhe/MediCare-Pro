package com.healthcare.service.impl;

import com.healthcare.dto.*;
import com.healthcare.entity.*;
import com.healthcare.mapper.EntityMapper;
import com.healthcare.repository.*;
import com.healthcare.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EntityMapper mapper;

    @Override
    public DashboardResponse getAdminDashboardStats() {
        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalAppointments = appointmentRepository.count();
        long todayAppointments = appointmentRepository.countTodayAppointments(LocalDate.now());
        long pending = appointmentRepository.countByStatus(AppointmentStatus.PENDING);
        long completed = appointmentRepository.countByStatus(AppointmentStatus.COMPLETED);

        Double rev = billRepository.calculateTotalRevenue();
        double totalRevenue = rev != null ? rev : 0.0;

        Double pend = billRepository.calculateTotalPendingRevenue();
        double pendingPayments = pend != null ? pend : 0.0;

        // Mock Chart Data
        Map<String, Long> monthlyAppointments = new LinkedHashMap<>();
        monthlyAppointments.put("Jan", 15L);
        monthlyAppointments.put("Feb", 22L);
        monthlyAppointments.put("Mar", 30L);
        monthlyAppointments.put("Apr", 28L);
        monthlyAppointments.put("May", 45L);
        monthlyAppointments.put("Jun", 38L);

        Map<String, Double> monthlyRevenue = new LinkedHashMap<>();
        monthlyRevenue.put("Jan", 1500.0);
        monthlyRevenue.put("Feb", 2200.0);
        monthlyRevenue.put("Mar", 3000.0);
        monthlyRevenue.put("Apr", 2800.0);
        monthlyRevenue.put("May", 4500.0);
        monthlyRevenue.put("Jun", 3800.0);

        Map<String, Long> patientRegistrations = new LinkedHashMap<>();
        patientRegistrations.put("Jan", 5L);
        patientRegistrations.put("Feb", 12L);
        patientRegistrations.put("Mar", 18L);
        patientRegistrations.put("Apr", 14L);
        patientRegistrations.put("May", 25L);
        patientRegistrations.put("Jun", 20L);

        Map<String, Long> statusBreakdown = new HashMap<>();
        statusBreakdown.put("PENDING", pending);
        statusBreakdown.put("CONFIRMED", appointmentRepository.countByStatus(AppointmentStatus.CONFIRMED));
        statusBreakdown.put("COMPLETED", completed);
        statusBreakdown.put("CANCELLED", appointmentRepository.countByStatus(AppointmentStatus.CANCELLED));

        return new DashboardResponse(
                totalPatients, totalDoctors, totalAppointments, todayAppointments,
                pending, completed, totalRevenue, pendingPayments,
                monthlyAppointments, monthlyRevenue, patientRegistrations, statusBreakdown
        );
    }

    @Override
    public DoctorDashboardResponse getDoctorDashboardStats(Long doctorId) {
        List<Appointment> allAppointments = appointmentRepository.findByDoctorId(doctorId);
        LocalDate today = LocalDate.now();

        long todayCount = allAppointments.stream()
                .filter(a -> a.getAppointmentDate().equals(today))
                .count();

        long upcomingCount = allAppointments.stream()
                .filter(a -> a.getAppointmentDate().isAfter(today) && a.getStatus() == AppointmentStatus.CONFIRMED)
                .count();

        long completedCount = allAppointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .count();

        long pendingCount = allAppointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.PENDING)
                .count();

        // Total unique patients
        long totalPatients = allAppointments.stream()
                .map(a -> a.getPatient().getId())
                .distinct()
                .count();

        List<AppointmentResponse> todayAppointments = allAppointments.stream()
                .filter(a -> a.getAppointmentDate().equals(today))
                .map(mapper::toAppointmentResponse)
                .collect(Collectors.toList());

        List<MedicalRecordResponse> recentRecords = medicalRecordRepository.findByDoctorId(doctorId).stream()
                .sorted((r1, r2) -> r2.getRecordDate().compareTo(r1.getRecordDate()))
                .limit(5)
                .map(mapper::toMedicalRecordResponse)
                .collect(Collectors.toList());

        return new DoctorDashboardResponse(
                todayCount, upcomingCount, completedCount, pendingCount, totalPatients,
                todayAppointments, recentRecords
        );
    }

    @Override
    public PatientDashboardResponse getPatientDashboardStats(Long patientId) {
        List<Appointment> all = appointmentRepository.findByPatientId(patientId);
        LocalDate today = LocalDate.now();

        AppointmentResponse upcoming = all.stream()
                .filter(a -> (a.getAppointmentDate().isAfter(today) || a.getAppointmentDate().equals(today))
                        && (a.getStatus() == AppointmentStatus.CONFIRMED || a.getStatus() == AppointmentStatus.PENDING))
                .sorted(Comparator.comparing(Appointment::getAppointmentDate).thenComparing(Appointment::getAppointmentTime))
                .findFirst()
                .map(mapper::toAppointmentResponse)
                .orElse(null);

        long totalAppointments = all.size();

        long totalDoctorsVisited = all.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .map(a -> a.getDoctor().getId())
                .distinct()
                .count();

        long totalMedicalRecords = medicalRecordRepository.findByPatientId(patientId).size();
        long totalPrescriptions = prescriptionRepository.findByPatientId(patientId).size();

        List<Bill> bills = billRepository.findByPatientId(patientId);
        double pendingBillsAmount = bills.stream()
                .filter(b -> b.getPaymentStatus() == PaymentStatus.PENDING || b.getPaymentStatus() == PaymentStatus.PARTIALLY_PAID)
                .mapToDouble(Bill::getTotalAmount)
                .sum();

        List<AppointmentResponse> recentAppointments = all.stream()
                .sorted((a1, a2) -> a2.getAppointmentDate().compareTo(a1.getAppointmentDate()))
                .limit(5)
                .map(mapper::toAppointmentResponse)
                .collect(Collectors.toList());

        List<BillResponse> pendingBills = bills.stream()
                .filter(b -> b.getPaymentStatus() == PaymentStatus.PENDING || b.getPaymentStatus() == PaymentStatus.PARTIALLY_PAID)
                .map(mapper::toBillResponse)
                .collect(Collectors.toList());

        List<PaymentResponse> paymentHistory = paymentRepository.findByPatientId(patientId).stream()
                .map(mapper::toPaymentResponse)
                .collect(Collectors.toList());

        return new PatientDashboardResponse(
                upcoming, totalAppointments, totalDoctorsVisited, totalMedicalRecords, totalPrescriptions,
                pendingBillsAmount, recentAppointments, pendingBills, paymentHistory
        );
    }
}
