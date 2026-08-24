package com.healthcare.config;

import com.healthcare.entity.*;
import com.healthcare.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        // 1. Seed Admin
        Admin admin = new Admin();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setEmail("admin@healthcare.com");
        admin.setFirstName("System");
        admin.setLastName("Administrator");
        admin.setRole(Role.ROLE_ADMIN);
        admin.setPhone("1234567890");
        userRepository.save(admin);

        // 2. Seed Departments
        Department cardiology = new Department(null, "Cardiology", "Heart care and surgeries");
        Department neurology = new Department(null, "Neurology", "Brain and nervous system disorders");
        Department orthopedics = new Department(null, "Orthopedics", "Bones and joints treatment");
        Department pediatrics = new Department(null, "Pediatrics", "Child care and development");
        Department gynecology = new Department(null, "Gynecology", "Women healthcare and maternity");

        departmentRepository.saveAll(Arrays.asList(cardiology, neurology, orthopedics, pediatrics, gynecology));

        // 3. Seed Doctors
        Doctor d1 = new Doctor();
        d1.setUsername("drsmith");
        d1.setPassword(passwordEncoder.encode("doctor123"));
        d1.setEmail("smith@healthcare.com");
        d1.setFirstName("John");
        d1.setLastName("Smith");
        d1.setRole(Role.ROLE_DOCTOR);
        d1.setPhone("9876543210");
        d1.setSpecialization("Cardiologist");
        d1.setQualification("MD, DM in Cardiology");
        d1.setExperience(15);
        d1.setConsultationFee(500.0);
        d1.setAvailableDays("Monday,Wednesday,Friday");
        d1.setAvailableTime("09:00-13:00");
        d1.setLicenseNumber("LIC-12345");
        d1.setStatus("ACTIVE");
        d1.setDepartment(cardiology);
        doctorRepository.save(d1);

        Doctor d2 = new Doctor();
        d2.setUsername("drjones");
        d2.setPassword(passwordEncoder.encode("doctor123"));
        d2.setEmail("jones@healthcare.com");
        d2.setFirstName("Sarah");
        d2.setLastName("Jones");
        d2.setRole(Role.ROLE_DOCTOR);
        d2.setPhone("9876543211");
        d2.setSpecialization("Neurologist");
        d2.setQualification("MD, DM in Neurology");
        d2.setExperience(10);
        d2.setConsultationFee(600.0);
        d2.setAvailableDays("Tuesday,Thursday");
        d2.setAvailableTime("14:00-18:00");
        d2.setLicenseNumber("LIC-54321");
        d2.setStatus("ACTIVE");
        d2.setDepartment(neurology);
        doctorRepository.save(d2);

        // 4. Seed Patients
        Patient p1 = new Patient();
        p1.setUsername("patient");
        p1.setPassword(passwordEncoder.encode("patient123"));
        p1.setEmail("patient@example.com");
        p1.setFirstName("Alice");
        p1.setLastName("Cooper");
        p1.setRole(Role.ROLE_PATIENT);
        p1.setDateOfBirth(LocalDate.of(1995, 5, 20));
        p1.setGender("Female");
        p1.setBloodGroup("A+");
        p1.setPhone("8888888888");
        p1.setAddress("123 Main Street, Bangalore");
        p1.setEmergencyContact("Bob Cooper - 7777777777");
        p1.setMedicalHistory("Mild asthma during childhood");
        patientRepository.save(p1);

        // 5. Seed Appointments
        Appointment a1 = new Appointment();
        a1.setPatient(p1);
        a1.setDoctor(d1);
        a1.setAppointmentDate(LocalDate.now().plusDays(1));
        a1.setAppointmentTime(LocalTime.of(10, 0));
        a1.setReason("Regular cardiac checkup");
        a1.setStatus(AppointmentStatus.PENDING);
        appointmentRepository.save(a1);

        Appointment a2 = new Appointment();
        a2.setPatient(p1);
        a2.setDoctor(d2);
        a2.setAppointmentDate(LocalDate.now().minusDays(3));
        a2.setAppointmentTime(LocalTime.of(15, 0));
        a2.setReason("Frequent headaches");
        a2.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(a2);

        // 6. Seed Medical Records for completed appointment
        MedicalRecord mr1 = new MedicalRecord();
        mr1.setPatient(p1);
        mr1.setDoctor(d2);
        mr1.setAppointment(a2);
        mr1.setDiagnosis("Migraine");
        mr1.setSymptoms("Throbbing pain on one side of head, sensitivity to light");
        mr1.setTreatment("Rest in a dark room, Pain relievers");
        mr1.setNotes("Advised to reduce screen time and monitor stress triggers");
        mr1.setMedicalTestResults("Blood test normal, Head CT normal");
        mr1.setRecordDate(LocalDate.now().minusDays(3));
        medicalRecordRepository.save(mr1);

        // 7. Seed Prescriptions
        Prescription pr1 = new Prescription();
        pr1.setPatient(p1);
        pr1.setDoctor(d2);
        pr1.setAppointment(a2);
        pr1.setPrescriptionDate(LocalDate.now().minusDays(3));

        PrescriptionMedicine pm1 = new PrescriptionMedicine(null, pr1, "Sumatriptan", "50mg", "Once daily", "5 Days", "Take at the onset of headache");
        PrescriptionMedicine pm2 = new PrescriptionMedicine(null, pr1, "Magnesium Supplements", "400mg", "Once daily at night", "30 Days", "Take with food");
        pr1.setMedicines(Arrays.asList(pm1, pm2));
        prescriptionRepository.save(pr1);

        // 8. Seed Bills
        Bill bill1 = new Bill();
        bill1.setPatient(p1);
        bill1.setDoctor(d2);
        bill1.setAppointment(a2);
        bill1.setConsultationFee(600.0);
        bill1.setMedicineCharges(300.0);
        bill1.setTestCharges(1200.0);
        bill1.setOtherCharges(0.0);
        bill1.setDiscount(100.0);
        bill1.setTax(150.0);
        bill1.setTotalAmount(2150.0);
        bill1.setPaymentStatus(PaymentStatus.PAID);
        bill1.setBillDate(LocalDate.now().minusDays(3));
        billRepository.save(bill1);

        // 9. Seed Payments
        Payment pay1 = new Payment();
        pay1.setBill(bill1);
        pay1.setPatient(p1);
        pay1.setAmount(2150.0);
        pay1.setPaymentDate(LocalDate.now().minusDays(3).atTime(15, 30));
        pay1.setPaymentMethod("ONLINE");
        pay1.setTransactionId("TXN-MIGRAINEPAY");
        pay1.setPaymentStatus("SUCCESS");
        paymentRepository.save(pay1);
    }
}
